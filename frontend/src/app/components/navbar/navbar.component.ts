import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  menuOpen = false;
  activeSection = 'about';

  navLinks = [
    { href: '#about',      icon: 'fas fa-home fs-5',        label: 'Home',          sectionId: 'about'      },
    { href: '#experience', icon: 'fas fa-briefcase fs-5',   label: 'Experience',    sectionId: 'experience' },
    { href: '#projects',   icon: 'fas fa-code fs-5',        label: 'Featured Work', sectionId: 'projects'   },
    { href: '#contact',    icon: 'fas fa-envelope fs-5',    label: 'Get in Touch',  sectionId: 'contact'    }
  ];

  private observer!: IntersectionObserver;

  ngOnInit(): void {
    this.observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) this.activeSection = e.target.getAttribute('id') ?? this.activeSection; }),
      { rootMargin: '-30% 0px -70% 0px' }
    );
    setTimeout(() => document.querySelectorAll('section[id]').forEach(s => this.observer.observe(s)), 0);
  }

  ngOnDestroy(): void { this.observer?.disconnect(); }

  toggleMenu(): void { this.menuOpen = !this.menuOpen; }
  closeMenu():  void { this.menuOpen = false; }

  @HostListener('document:keydown.escape')
  onEscape(): void { this.closeMenu(); }
}
