import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CareerService, Career } from '../../services/career.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-white min-h-screen">
      <!-- HEADER -->
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-50 border border-slate-200">
        <div>
          <span className="px-3 py-1 rounded-full bg-purple-100 text-[#4F20C9] text-xs font-bold uppercase">
            {{ user()?.role | uppercase }} PASSPORT ACTIVE
          </span>
          <h1 className="text-3xl font-black text-slate-900 mt-2">Welcome back, {{ user()?.name }}!</h1>
          <p className="text-xs text-slate-500 mt-1">Manage your personalized career roadmaps and skill milestones.</p>
        </div>

        <div className="flex gap-3">
          <a routerLink="/quiz" className="px-5 py-2.5 rounded-full bg-[#4F20C9] text-white text-xs font-bold hover:bg-purple-800 transition-colors">
            Retake Career Quiz
          </a>
          <a routerLink="/ai-console" className="px-5 py-2.5 rounded-full bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors">
            Ask AI Advisor
          </a>
        </div>
      </div>

      <!-- METRIC CARDS -->
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
          <span className="text-2xl font-black text-[#4F20C9]">87%</span>
          <p className="text-xs font-bold text-slate-700">Quiz Match Score</p>
        </div>
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
          <span className="text-2xl font-black text-emerald-600">8 Roles</span>
          <p className="text-xs font-bold text-slate-700">High Match Careers</p>
        </div>
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
          <span className="text-2xl font-black text-amber-500">12</span>
          <p className="text-xs font-bold text-slate-700">Bookmarked Items</p>
        </div>
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
          <span className="text-2xl font-black text-indigo-600">18</span>
          <p className="text-xs font-bold text-slate-700">Learning Resources</p>
        </div>
      </div>

      <!-- CAREER MATCHES -->
      <div className="space-y-4">
        <h2 className="text-xl font-black text-slate-900">Top Recommended Careers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let career of recommendations" className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[#4F20C9] bg-purple-50 px-3 py-1 rounded-full uppercase">{{ career.domain }}</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">95% Match</span>
            </div>
            <h3 className="font-bold text-lg text-slate-900">{{ career.title }}</h3>
            <p className="text-xs text-slate-600 line-clamp-2">{{ career.description }}</p>
            <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs font-bold">
              <span className="text-slate-900">\${{ career.expectedSalaryRange.min | number }}/yr</span>
              <a [routerLink]="['/careers', career._id]" className="text-[#4F20C9] hover:underline">View Roadmap →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  user = this.authService.currentUser;
  recommendations: Career[] = [];

  constructor(private authService: AuthService, private careerService: CareerService) {}

  ngOnInit(): void {
    this.careerService.getCareers({ limit: 6 }).subscribe({
      next: (res) => {
        if (res.success) this.recommendations = res.careers;
      },
    });
  }
}
