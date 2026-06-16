import { Component, AfterViewInit } from '@angular/core';
import { NavbarComponent }  from './components/navbar/navbar.component';
import { AboutComponent }   from './components/about/about.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ContactComponent } from './components/contact/contact.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, AboutComponent, ProjectsComponent, ContactComponent],
  template: `
    <app-navbar></app-navbar>
    <main>
      <app-about></app-about>
      <app-projects></app-projects>
      <app-contact></app-contact>
    </main>
    <footer>
      <p>© 2026 Ishan's Portfolio. All rights reserved.</p>
    </footer>
  `
})
export class AppComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    const img = new Image();
    img.src = 'assets/images/my-profile.png';
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const size = 128;
      const canvas = document.createElement('canvas');
      canvas.width = size; canvas.height = size;
      const ctx = canvas.getContext('2d')!;
      ctx.beginPath();
      ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
      ctx.closePath(); ctx.clip();
      let srcX = 0, srcY = 0, srcW = img.width, srcH = img.height;
      if (img.width > img.height) { srcW = img.height; srcX = (img.width - img.height) / 2; }
      else if (img.height > img.width) { srcH = img.width; srcY = (img.height - img.width) / 2; }
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, size, size);
      const fav = document.querySelector<HTMLLinkElement>('link#favicon');
      if (fav) fav.href = canvas.toDataURL('image/png');
    };
  }
}
