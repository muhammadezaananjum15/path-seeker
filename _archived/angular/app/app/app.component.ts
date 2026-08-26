import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
      <!-- NAVBAR -->
      <nav className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a routerLink="/" className="flex items-center gap-2 font-black text-xl tracking-tight text-slate-900">
            <span className="w-8 h-8 rounded-full bg-[#4F20C9] text-white flex items-center justify-center text-xs">P</span>
            <span>Path<span className="text-[#4F20C9]">Seeker</span></span>
          </a>

          <div className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-700">
            <a routerLink="/" className="hover:text-[#4F20C9] transition-colors">Home</a>
            <a routerLink="/careers" className="hover:text-[#4F20C9] transition-colors">Career Bank</a>
            <a routerLink="/ai-console" className="hover:text-[#4F20C9] transition-colors">AI Advisor</a>
            <a *ngIf="authService.isAuthenticated()" routerLink="/dashboard" className="hover:text-[#4F20C9] transition-colors">My Passport</a>
            <a *ngIf="authService.isAdmin()" routerLink="/admin" className="text-[#4F20C9] font-black hover:underline">Admin Panel</a>
          </div>

          <div className="flex items-center gap-3">
            <ng-container *ngIf="authService.isAuthenticated(); else guestButtons">
              <span className="text-xs font-bold text-slate-700 hidden sm:inline">{{ authService.currentUser()?.name }}</span>
              <button (click)="logout()" className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all">
                Sign Out
              </button>
            </ng-container>

            <ng-template #guestButtons>
              <a routerLink="/login" className="px-5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all">
                Sign In
              </a>
              <a routerLink="/login" className="px-5 py-2 rounded-full bg-[#4F20C9] hover:bg-purple-800 text-white text-xs font-bold shadow-md transition-all">
                Get Started
              </a>
            </ng-template>
          </div>
        </div>
      </nav>

      <!-- ROUTER OUTLET -->
      <main className="flex-1">
        <router-outlet></router-outlet>
      </main>

      <!-- FOOTER -->
      <footer className="border-t border-slate-200 bg-slate-50 py-10">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-3">
          <p className="text-xs font-bold text-slate-900">PathSeeker — MEAN Stack Career Passport Platform</p>
          <p className="text-[11px] text-slate-500">Built with MongoDB, Express, Angular 19, Node.js, TypeScript, and Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  `,
})
export class AppComponent {
  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout().subscribe();
  }
}
