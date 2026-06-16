import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealDirective } from '../../directives/reveal.directive';
import { LikeButtonComponent } from '../like-button/like-button.component';
import { AboutTab, Skill } from '../../models/portfolio.model';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RevealDirective, LikeButtonComponent],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  activeTab: AboutTab = 'technical';
  get roleBadge(): string { return this.activeTab === 'technical' ? 'Software Engineer' : 'Photographer & Explorer'; }
  switchTab(tab: AboutTab): void { this.activeTab = tab; }

  technicalSkills: Skill[] = [
    { name: 'Python',      iconClass: 'devicon-python-plain',           color: '#3776ab' },
    { name: 'SQL',         iconClass: 'devicon-sqldeveloper-plain',      color: '#336791' },
    { name: 'Anaconda',    iconClass: 'devicon-anaconda-original',       color: '#2496ed' },
    { name: 'DataDog',     iconClass: 'devicon-datadog-original colored',color: '#2496ed' },
    { name: 'Java',        iconClass: 'devicon-java-plain',              color: '#f89820' },
    { name: 'Spring Boot', iconClass: 'devicon-spring-plain',            color: '#6db33f' },
    { name: 'Angular JS',  iconClass: 'devicon-angularjs-plain',         color: '#dd0031' },
    { name: 'TypeScript',  iconClass: 'devicon-typescript-plain',        color: '#3178c6' },
    { name: 'HTML5',       iconClass: 'devicon-html5-plain',             color: '#e34f26' }
  ];

  creativeSkills: Skill[] = [
    { name: 'Street Photo',  iconClass: 'fas fa-camera',        color: '#ffd60a' },
    { name: 'Documentation', iconClass: 'fas fa-camera-retro',  color: '#ff8c00' },
    { name: 'Photoshop',  svgContent: 'Ps', svgBg: '#001e36', color: '#31a8ff' },
    { name: 'Lightroom',  svgContent: 'Lr', svgBg: '#001a29', color: '#aad6f8' }
  ];
}
