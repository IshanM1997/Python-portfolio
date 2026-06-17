"""
github_sync.py  —  Auto-generates project cards from your GitHub repos.

HOW IT WORKS:
  1. Fetches all public repos from your GitHub account via the GitHub API.
  2. For each repo, reads its README.md and extracts:
       - Project name  (repo name, humanised)
       - Description   (repo description OR first paragraph of README)
       - Tech tags     (parsed from README badges / "Tech Stack" / "Built With" sections)
       - GitHub URL    (the repo HTML url)
  3. Writes the result to  frontend/src/app/services/projects-data.json
     which portfolio.service.ts reads instead of its hard-coded array.

USAGE:
  python github_sync.py

  Or to run automatically whenever you push to GitHub, add this as a
  GitHub Actions workflow (see the comment at the bottom of this file).
"""

import json
import re
import base64
import urllib.request
import urllib.error
from pathlib import Path

# ── CONFIG ────────────────────────────────────────────────────────────────────
GITHUB_USERNAME = "IshanM1997"
OUTPUT_PATH     = Path(__file__).parent.parent / "frontend" / "src" / "app" / "services" / "projects-data.json"

# Repos to skip (private, forks, or not portfolio-worthy)
SKIP_REPOS = {"IshanM1997"}  # add repo names here to exclude them

# If you hit rate limits, add a personal access token (read-only, public repos)
# Generate at: https://github.com/settings/tokens
GITHUB_TOKEN = ""   # optional — leave empty for public repos
# ─────────────────────────────────────────────────────────────────────────────


def gh_get(url: str) -> dict | list:
    """Make a GitHub API GET request, returns parsed JSON."""
    req = urllib.request.Request(url)
    req.add_header("Accept", "application/vnd.github+json")
    req.add_header("User-Agent", "portfolio-sync")
    if GITHUB_TOKEN:
        req.add_header("Authorization", f"Bearer {GITHUB_TOKEN}")
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read().decode())


def fetch_readme(owner: str, repo: str) -> str:
    """Fetch and decode the README for a repo. Returns empty string if none."""
    try:
        data = gh_get(f"https://api.github.com/repos/{owner}/{repo}/readme")
        return base64.b64decode(data["content"]).decode("utf-8", errors="replace")
    except (urllib.error.HTTPError, KeyError):
        return ""


def extract_description(readme: str, fallback: str) -> str:
    """
    Pull the first meaningful paragraph from a README.
    Falls back to the repo description field if README is empty.
    """
    if not readme:
        return fallback or ""

    lines = readme.splitlines()
    capture = False
    para_lines = []

    for line in lines:
        stripped = line.strip()
        # Skip headings, badges, blank lines at top, and HTML tags
        if stripped.startswith("#"):
            if para_lines:          # stop at next heading
                break
            continue
        if re.match(r"^\[!\[", stripped):   # badge line
            continue
        if stripped == "":
            if para_lines:
                break               # blank line ends the paragraph
            continue
        para_lines.append(stripped)

    result = " ".join(para_lines).strip()
    # Trim to ~200 chars for card display
    if len(result) > 200:
        result = result[:197] + "…"
    return result or fallback or ""


# Common tech keywords to scan for in READMEs
TECH_PATTERNS = [
    "Angular", "React", "Vue", "TypeScript", "JavaScript", "HTML", "CSS", "SCSS",
    "Java", "Spring Boot", "Spring", "Python", "Flask", "FastAPI", "Django",
    "Node.js", "Express", "Next.js",
    "MySQL", "PostgreSQL", "MongoDB", "SQLite", "Oracle SQL", "SQL",
    "Docker", "Kubernetes", "AWS", "Azure", "GCP",
    "JWT", "REST", "GraphQL", "Microservices",
    "pandas", "NumPy", "scikit-learn", "TensorFlow", "PyTorch",
    "Bootstrap", "Tailwind", "Material",
    "Datadog", "Splunk", "Kafka", "Redis", "Elasticsearch",
    "Excel", "Alteryx", "Power BI",
]


def extract_tech(readme: str, topics: list[str]) -> list[str]:
    """
    Detect technologies from:
      1. GitHub topics (tags set on the repo)
      2. Badge lines  (e.g. ![Angular](https://img.shields.io/...))
      3. "Tech Stack" / "Built With" / "Technologies" sections in README
      4. Plain keyword scan of the full README
    Returns a deduplicated ordered list of up to 8 techs.
    """
    found: list[str] = []
    seen: set[str] = set()

    def add(tech: str):
        key = tech.lower()
        if key not in seen:
            seen.add(key)
            found.append(tech)

    # 1. GitHub topics
    topic_map = {t.lower(): t.title() for t in topics}
    for raw in topics:
        # Map common topic slugs → display names
        display = {
            "angular": "Angular", "react": "React", "vue": "Vue",
            "spring-boot": "Spring Boot", "springboot": "Spring Boot",
            "typescript": "TypeScript", "javascript": "JavaScript",
            "python": "Python", "java": "Java", "flask": "Flask",
            "fastapi": "FastAPI", "mysql": "MySQL", "postgresql": "PostgreSQL",
            "mongodb": "MongoDB", "docker": "Docker", "aws": "AWS",
            "bootstrap": "Bootstrap", "tailwind": "Tailwind",
            "jwt": "JWT", "rest": "REST", "microservices": "Microservices",
        }.get(raw.lower(), raw.title())
        add(display)

    # 2 & 3. README scan
    if readme:
        # Look for badge alt-text: ![Angular](...)
        badge_techs = re.findall(r'!\[([^\]]+)\]\(https?://img\.shields\.io[^\)]+\)', readme)
        for bt in badge_techs:
            add(bt.strip())

        # Find "Tech Stack" / "Built With" section and grab list items
        section_match = re.search(
            r'(?:tech\s*stack|built\s*with|technologies|tools\s*used)[^\n]*\n((?:[-*]\s*.+\n?)+)',
            readme, re.IGNORECASE
        )
        if section_match:
            for item in re.findall(r'[-*]\s*\**([^\*\n]+)', section_match.group(1)):
                add(item.strip())

        # 4. Keyword scan
        for tech in TECH_PATTERNS:
            if re.search(rf'\b{re.escape(tech)}\b', readme, re.IGNORECASE):
                add(tech)

    return found[:8]   # cap at 8 tags per card


def humanise(repo_name: str) -> str:
    """'my-cool-app' → 'My Cool App'"""
    return repo_name.replace("-", " ").replace("_", " ").title()


def sync_repos():
    print(f"Fetching repos for @{GITHUB_USERNAME} …")
    try:
        repos = gh_get(f"https://api.github.com/users/{GITHUB_USERNAME}/repos?per_page=100&sort=updated")
    except Exception as e:
        print(f"ERROR: Could not reach GitHub API — {e}")
        return

    projects = []

    for repo in repos:
        name      = repo["name"]
        html_url  = repo["html_url"]
        desc      = repo.get("description") or ""
        topics    = repo.get("topics") or []
        is_fork   = repo.get("fork", False)

        if name in SKIP_REPOS or is_fork:
            print(f"  skip  {name}")
            continue

        print(f"  sync  {name}")
        readme = fetch_readme(GITHUB_USERNAME, name)

        projects.append({
            "title":       humanise(name),
            "description": extract_description(readme, desc),
            "tags":        extract_tech(readme, topics),
            "githubUrl":   html_url
        })

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(projects, indent=2, ensure_ascii=False))
    print(f"\n✅  Wrote {len(projects)} projects → {OUTPUT_PATH}")


if __name__ == "__main__":
    sync_repos()


# ══════════════════════════════════════════════════════════════════════════════
# GITHUB ACTIONS — auto-run this script on every push to main
# Save as  .github/workflows/sync-projects.yml  in your repo:
#
# name: Sync GitHub Projects
# on:
#   push:
#     branches: [main]
#   schedule:
#     - cron: '0 6 * * *'   # also runs daily at 6am UTC
#
# jobs:
#   sync:
#     runs-on: ubuntu-latest
#     steps:
#       - uses: actions/checkout@v4
#       - uses: actions/setup-python@v5
#         with: { python-version: '3.11' }
#       - run: python backend/github_sync.py
#       - uses: stefanzweifel/git-auto-commit-action@v5
#         with:
#           commit_message: "chore: auto-sync projects from GitHub"
# ══════════════════════════════════════════════════════════════════════════════
