import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CareerService, Career } from '../../services/career.service';
import { AiService } from '../../services/ai.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div className="bg-white text-slate-900 min-h-screen pt-8 pb-16">
      <!-- HERO SECTION -->
      <section className="max-w-7xl mx-auto px-6 text-center mt-6 md:mt-12 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-200 text-[#4F20C9] text-xs font-bold uppercase tracking-wider">
          <span>✨</span> MEAN Stack Career Intelligence Platform
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Your Career,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#290C86] via-[#5D4DBB] to-[#7C3AED]">
            Elevated.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Navigate high-demand career pathways, receive AI recommendations, and build your personalized Career Passport.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a routerLink="/quiz" className="px-8 py-4 rounded-full bg-[#181818] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-xl transition-all">
            Take AI Career Assessment →
          </a>
          <a routerLink="/careers" className="px-8 py-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider transition-all">
            Explore Career Bank
          </a>
        </div>
      </section>

      <!-- FEATURED CAREERS GRID -->
      <section className="max-w-7xl mx-auto px-6 mt-20 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-[#4F20C9] uppercase tracking-widest">CAREER BANK PREVIEW</span>
          <h2 className="text-3xl font-black text-slate-900">Featured High-Demand Pathways</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div *ngFor="let career of careers" className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-purple-50 text-[#4F20C9] text-xs font-bold uppercase">{{ career.domain }}</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase">{{ career.demandLevel }} Demand</span>
            </div>
            <h3 className="text-xl font-black text-slate-900">{{ career.title }}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{{ career.description }}</p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
              <span>\${{ career.expectedSalaryRange.min | number }}/yr</span>
              <a [routerLink]="['/careers', career._id]" className="text-[#4F20C9] hover:underline">View Roadmap →</a>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ SECTION -->
      <section className="max-w-4xl mx-auto px-6 mt-24 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-slate-900">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500">Everything you need to know about PathSeeker MEAN Stack application.</p>
        </div>

        <div className="space-y-4">
          <div *ngFor="let faq of faqs" className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <h4 className="font-bold text-base text-slate-900">{{ faq.q }}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{{ faq.a }}</p>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class LandingComponent implements OnInit {
  careers: Career[] = [];
  faqs = [
    { q: 'Is PathSeeker free to explore?', a: 'Yes! PathSeeker offers free career matching, skill roadmaps, and downloadable guides.' },
    { q: 'How does the AI Assessment work?', a: 'Our Career Intelligence engine matches your skills and academic stage with global hiring data.' },
    { q: 'What roles are supported?', a: 'PathSeeker caters specifically to Students, Graduates, Working Professionals, and Administrators.' },
  ];

  constructor(private careerService: CareerService) {}

  ngOnInit(): void {
    this.careerService.getCareers({ limit: 6 }).subscribe({
      next: (res) => {
        if (res.success) this.careers = res.careers;
      },
    });
  }
}
