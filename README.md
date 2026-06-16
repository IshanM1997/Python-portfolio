# Ishan's Portfolio — Angular + FastAPI

## EXACT FOLDER STRUCTURE

After downloading, your folder must look like this:

```
Portfolio_Python_Angular/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── requirements.txt
│   └── routers/
│       ├── __init__.py
│       └── likes.py
└── frontend/
    ├── angular.json
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── index.html
        ├── main.ts
        ├── styles.scss
        └── app/
            ├── app.component.ts
            ├── app.config.ts
            ├── app.routes.ts
            ├── models/
            │   └── portfolio.model.ts
            ├── services/
            │   └── portfolio.service.ts
            ├── directives/
            │   └── reveal.directive.ts
            └── components/
                ├── navbar/
                ├── about/
                ├── projects/
                ├── contact/
                └── like-button/
```

---

## STEP 1 — Add your images

Create this folder: frontend/src/assets/images/

Copy these 4 files into it:
- logo.png
- my-profile.png
- Firefly_Gemini_Flash.png
- bg_image.jpg

---

## STEP 2 — Run the Backend (Terminal 1)

Open VS Code → open the Portfolio_Python_Angular folder.
Open a terminal (Ctrl + `) and run these commands ONE BY ONE:

```
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

You should see: Uvicorn running on http://127.0.0.1:8000
Leave this terminal running.

---

## STEP 3 — Run the Frontend (Terminal 2)

Click the + icon in the terminal panel to open a SECOND terminal.

```
cd frontend
npm install
ng serve
```

If ng is not found, first run:  npm install -g @angular/cli
Then run ng serve again.

You should see: Local: http://localhost:4200/
Open http://localhost:4200 in your browser.

---

## QUICK REFERENCE

| What         | URL                        | Command                      |
|--------------|----------------------------|------------------------------|
| Backend API  | http://localhost:8000      | uvicorn main:app --reload    |
| API Swagger  | http://localhost:8000/docs | (auto-generated docs)        |
| Frontend app | http://localhost:4200      | ng serve                     |

Both terminals must be running at the same time.
