import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LikeResponse, Project, Certificate } from '../models/portfolio.model';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private readonly api = 'http://localhost:8000/api';

  // Fallback hard-coded projects used when projects-data.json doesn't exist yet
  private readonly fallbackProjects: Project[] = [
    {
      title: 'Forecaster',
      description: 'A real-time weather forecasting app that provides 5 days of future forecast.',
      tags: ['Angular', 'HTML', 'TypeScript', 'CSS'],
      githubUrl: 'https://github.com/IshanM1997/Weather-forecast-app'
    },
    {
      title: 'ShopSphere',
      description: 'A production-ready e-commerce application with Angular 17 frontend, Spring Boot 3 backend, and MySQL.',
      tags: ['Angular', 'Spring Boot', 'Java', 'JWT', 'MySQL 8'],
      githubUrl: 'https://github.com/IshanM1997/E-commerce-website.git'
    },
    {
      title: 'Dashboard Creator',
      description: 'A dynamic, auto-refreshing dashboard that reads multiple Excel files and visualises them as interactive charts.',
      tags: ['Angular', 'Python', 'pandas', 'Excel'],
      githubUrl: 'https://github.com/IshanM1997/Dashboard-Creator.git'
    },
    {
      title: 'FileForge — File Converter & Merger',
      description: 'A full-stack file conversion and merging tool. Python Flask backend · Angular 17 frontend.',
      tags: ['Angular 17', 'Python', 'Flask', 'Bootstrap'],
      githubUrl: 'https://github.com/IshanM1997/File-Converter.git'
    }
  ];

  constructor(private http: HttpClient) {}

  getLikes(): Observable<LikeResponse> {
    return this.http.get<LikeResponse>(`${this.api}/likes`);
  }

  postLike(): Observable<LikeResponse> {
    return this.http.post<LikeResponse>(`${this.api}/likes`, {});
  }

  /**
   * Loads projects from the auto-generated projects-data.json (produced by
   * backend/github_sync.py).  Falls back to the hard-coded list if the file
   * doesn't exist yet — so the site always shows something.
   */
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>('assets/projects-data.json').pipe(
      catchError(() => of(this.fallbackProjects))
    );
  }

  getCertificates(): Certificate[] {
    return [
      {
        title: 'Up & Running with ServiceNow',
        issuer: 'Udemy', issuedDate: 'June 2024',
        credentialId: '05c23448-0d06-48fd-8afa-46e160275be0',
        viewUrl: 'https://www.udemy.com/certificate/UC-05c23448-0d06-48fd-8afa-46e160275be0/'
      },
      {
        title: 'ChatGPT: Complete ChatGPT Course For Work 2026 (Ethically)!',
        issuer: 'Udemy', issuedDate: 'January 2024',
        credentialId: 'UC-0357680a-d5bf-4c6a-88b6-6254f47fb432',
        viewUrl: 'https://udemy.com/certificate/UC-0357680a-d5bf-4c6a-88b6-6254f47fb432/'
      },
      {
        title: 'Java Design Patterns & SOLID Design Principles',
        issuer: 'Udemy', issuedDate: 'June 2026',
        credentialId: 'UC-a1e29c09-8ea2-4271-b5a2-556bfd7158fd',
        viewUrl: 'https://udemy.com/certificate/UC-a1e29c09-8ea2-4271-b5a2-556bfd7158fd/'
      },
      {
        title: 'Microsoft Azure DevOps: Automate App Deployment From Scratch',
        issuer: 'Udemy', issuedDate: 'July 2025',
        credentialId: 'UC-8f1dc129-e2e6-4d29-a30d-3c40255a38d1',
        viewUrl: 'https://cognizant.udemy.com/certificate/UC-8f1dc129-e2e6-4d29-a30d-3c40255a38d1/'
      },
      {
        title: 'Azure DevOps Fundamentals for Beginners',
        issuer: 'Udemy', issuedDate: 'July 2025',
        credentialId: 'UC-28280004-d888-450b-ab87-c2d10fadacbc',
        viewUrl: 'https://udemy.com/certificate/UC-28280004-d888-450b-ab87-c2d10fadacbc/'
      }
    ];
  }
}
