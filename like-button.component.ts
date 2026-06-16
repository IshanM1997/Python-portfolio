import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-like-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './like-button.component.html',
  styleUrls: ['./like-button.component.scss']
})
export class LikeButtonComponent implements OnInit {
  likeCount = 0;
  hasLiked = false;
  thanksMessage = '';
  showThanks = false;
  private readonly KEY = 'ishan_portfolio_liked';

  constructor(private svc: PortfolioService) {}

  ngOnInit(): void {
    this.hasLiked = localStorage.getItem(this.KEY) === 'true';
    this.svc.getLikes().subscribe({ next: r => this.likeCount = r.count, error: () => {} });
  }

  onLike(): void {
    if (!this.hasLiked) {
      this.svc.postLike().subscribe({
        next: r => {
          this.likeCount = r.count;
          this.hasLiked = true;
          localStorage.setItem(this.KEY, 'true');
          this.flash('🎉 Thanks for the like!', 3000);
          window.location.href =
            `mailto:ishanmukherjee66@gmail.com?subject=New%20Portfolio%20Like%20%F0%9F%92%96&body=Hey%20Ishan!%0A%0ASomeone%20liked%20your%20portfolio.%20%F0%9F%8E%89%0ATotal%20likes%3A%20${this.likeCount}`;
        },
        error: () => this.flash('Could not reach server. Try again later.', 3000)
      });
    } else {
      this.flash('You already liked this 😊', 2500);
    }
  }

  private flash(msg: string, ms: number): void {
    this.thanksMessage = msg; this.showThanks = true;
    setTimeout(() => this.showThanks = false, ms);
  }
}
