import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealDirective } from '../../directives/reveal.directive';
import { PortfolioService } from '../../services/portfolio.service';
import { Project, Certificate, WorkTab } from '../../models/portfolio.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements AfterViewInit {
  activeTab: WorkTab = 'projects';
  projects: Project[]     = [];
  certificates: Certificate[] = [];

  projLeftDis = true;  projRightDis = false;
  certLeftDis  = true;  certRightDis  = false;

  private touchStartX = 0;
  private touchStartScroll = 0;
  private activeTrack: HTMLElement | null = null;

  @ViewChild('projectsTrack') projTrackRef!: ElementRef<HTMLElement>;
  @ViewChild('certsTrack')    certTrackRef!: ElementRef<HTMLElement>;

  constructor(private svc: PortfolioService) {
    this.projects     = this.svc.getProjects();
    this.certificates = this.svc.getCertificates();
  }

  ngAfterViewInit(): void { this.updateArrows('projects'); this.updateArrows('certs'); }

  switchTab(tab: WorkTab): void { this.activeTab = tab; }

  private track(w: WorkTab): HTMLElement {
    return w === 'projects' ? this.projTrackRef.nativeElement : this.certTrackRef.nativeElement;
  }
  private cardAmt(t: HTMLElement): number {
    const c = t.querySelector<HTMLElement>('.project-card, .cert-card');
    return c ? c.offsetWidth + 24 : 300;
  }

  scrollLeft(w: WorkTab):  void { this.track(w).scrollBy({ left: -this.cardAmt(this.track(w)), behavior: 'smooth' }); setTimeout(() => this.updateArrows(w), 350); }
  scrollRight(w: WorkTab): void { this.track(w).scrollBy({ left:  this.cardAmt(this.track(w)), behavior: 'smooth' }); setTimeout(() => this.updateArrows(w), 350); }

  updateArrows(w: WorkTab): void {
    const t = this.track(w);
    const l = t.scrollLeft <= 4;
    const r = t.scrollLeft + t.clientWidth >= t.scrollWidth - 4;
    if (w === 'projects') { this.projLeftDis = l; this.projRightDis = r; }
    else                  { this.certLeftDis  = l; this.certRightDis  = r; }
  }

  onTouchStart(e: TouchEvent, w: WorkTab): void {
    this.activeTrack = this.track(w);
    this.touchStartX = e.touches[0].clientX;
    this.touchStartScroll = this.activeTrack.scrollLeft;
  }
  onTouchMove(e: TouchEvent): void {
    if (!this.activeTrack) return;
    this.activeTrack.scrollLeft = this.touchStartScroll + (this.touchStartX - e.touches[0].clientX);
  }
  onTouchEnd(e: TouchEvent, w: WorkTab): void {
    if (!this.activeTrack) return;
    const delta = this.touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) this.activeTrack.scrollBy({ left: delta > 0 ? this.cardAmt(this.activeTrack) : -this.cardAmt(this.activeTrack), behavior: 'smooth' });
    setTimeout(() => this.updateArrows(w), 350);
    this.activeTrack = null;
  }
}
