import { Directive, ElementRef, Input, AfterViewInit, OnDestroy } from '@angular/core';

@Directive({ selector: '[appReveal]', standalone: true })
export class RevealDirective implements AfterViewInit, OnDestroy {
  @Input('appReveal') direction: 'up' | 'left' | 'right' = 'up';
  private observer!: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.el.nativeElement.classList.add(`reveal-${this.direction}`);
    this.observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { this.el.nativeElement.classList.add('reveal-active'); this.observer.disconnect(); } },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void { this.observer?.disconnect(); }
}
