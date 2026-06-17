import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealDirective } from '../../directives/reveal.directive';

export type ExperienceTab = 'cognizant' | 'ey';

export interface ExperienceCard {
  projectName: string;
  role: string;
  tech: string[];
  description: string;
}

export interface ExperienceEntry {
  id: ExperienceTab;
  company: string;
  logoText: string;        // text fallback shown in tab
  logoUrl?: string;        // optional image logo
  date: string;
  location: string;
  cards: ExperienceCard[];
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent {
  activeTab: ExperienceTab = 'cognizant';

  experiences: ExperienceEntry[] = [
    {
      id: 'cognizant',
      company: 'Cognizant',
      logoText: 'Cognizant',
      date: 'October 2022 – Present',
      location: 'Kolkata, India',
      cards: [
        {
          projectName: 'TD Insurance',
          role: 'Java FSE Developer',
          tech: ['Angular', 'Java', 'Spring Boot', 'SQL', 'Datadog', 'Splunk'],
          description: 'Led architecture and development of Angular 17+/Spring Boot platforms, boosting operational efficiency by 50% and driving major gains in team productivity, security compliance, and observability.'
        },
        {
          projectName: 'RBC Insurance',
          role: 'Java Developer',
          tech: ['Java', 'Spring Boot', 'SQL', 'REST Microservices'],
          description: 'Worked as a Software Engineer to develop and maintain insurance-related applications using Java and Spring Boot.'
        }
      ]
    },
    {
      id: 'ey',
      company: 'EY GDS',
      logoText: 'EY GDS',
      date: 'September – November 2021',
      location: 'Kolkata, India',
      cards: [
        {
          projectName: 'Cambridge Institute',
          role: 'Data Engineer Intern',
          tech: ['Oracle SQL', 'Data Modeling', 'Alteryx', 'Python'],
          description: 'Designed star-schema data models and optimised Oracle SQL stored procedures, cutting report generation time by ~40%. Performed exploratory analysis on 1M+ row datasets, surfacing revenue-trend insights for senior stakeholders.'
        }
      ]
    }
  ];

  get activeExperience(): ExperienceEntry {
    return this.experiences.find(e => e.id === this.activeTab)!;
  }

  switchTab(tab: ExperienceTab): void { this.activeTab = tab; }
}
