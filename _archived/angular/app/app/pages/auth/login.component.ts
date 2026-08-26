import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl space-y-7">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#4F20C9] text-white font-black flex items-center justify-center text-lg shadow-md">P</div>
          <h1 className="text-3xl font-black text-slate-900">Welcome Back 👋</h1>
          <p className="text-xs text-slate-500">Sign in to access your MEAN Stack Career Passport</p>
        </div>

        <div *ngIf="error" className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600">
          ⚠️ {{ error }}
        </div>

        <form (ngSubmit)="onSubmit()" className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
            <input
              type="email"
              required
              [(ngModel)]="email"
              name="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-[#4F20C9] focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">Password</label>
              <a routerLink="/forgot-password" className="text-xs font-semibold text-[#4F20C9] hover:underline">Forgot?</a>
            </div>
            <input
              type="password"
              required
              [(ngModel)]="password"
              name="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-[#4F20C9] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            [disabled]="loading"
            className="w-full py-4 rounded-full bg-[#181818] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-xl transition-all disabled:opacity-50"
          >
            {{ loading ? 'Signing In...' : 'Sign In →' }}
          </button>
        </form>

        <div className="space-y-3 pt-2">
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider"><span className="bg-white px-3 text-slate-400">Quick Role Access</span></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button (click)="fillAcc('student@pathseeker.com', 'Student@123456')" className="py-2 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:border-[#4F20C9] truncate">
              🎓 Student
            </button>
            <button (click)="fillAcc('graduate@pathseeker.com', 'Graduate@123456')" className="py-2 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:border-[#4F20C9] truncate">
              🎓 Graduate
            </button>
            <button (click)="fillAcc('pro@pathseeker.com', 'Pro@123456')" className="py-2 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:border-[#4F20C9] truncate">
              💼 Professional
            </button>
            <button (click)="fillAcc('admin@pathseeker.com', 'Admin@123456')" className="py-2 px-3 rounded-2xl bg-purple-50 border border-purple-200 text-xs font-bold text-[#4F20C9] truncate">
              🛡️ Admin
            </button>
          </div>
        </div>

        <p className="text-xs text-center text-slate-500">
          Don't have an account? <a routerLink="/register" className="font-bold text-[#4F20C9] hover:underline">Register →</a>
        </p>
      </div>
    </div>
  `,
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  fillAcc(e: string, p: string): void {
    this.email = e;
    this.password = p;
  }

  onSubmit(): void {
    this.error = '';
    this.loading = true;
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate([res.user.role === 'admin' ? '/admin' : '/dashboard']);
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Login failed. Check credentials.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
