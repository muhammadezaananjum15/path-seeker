import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl space-y-6 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">🛡️</div>

        <div>
          <h1 className="text-2xl font-black text-slate-900">Verify Account</h1>
          <p className="text-xs text-slate-500 mt-1">Enter the 6-digit code sent to {{ email }}</p>
        </div>

        <div *ngIf="otpCode" className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-center">
          <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Verification OTP</p>
          <p className="text-2xl font-black tracking-widest text-indigo-700 font-mono mt-1">{{ otpCode }}</p>
        </div>

        <div *ngIf="error" className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600">
          ⚠️ {{ error }}
        </div>

        <div *ngIf="success" className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-600">
          ✓ {{ success }}
        </div>

        <div>
          <input
            type="text"
            maxLength="6"
            [(ngModel)]="otpInput"
            placeholder="123456"
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-center font-mono text-2xl tracking-[0.5em] text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          (click)="verify()"
          [disabled]="loading || otpInput.length < 6"
          className="w-full py-3.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg disabled:opacity-50 transition-all"
        >
          {{ loading ? 'Verifying...' : 'Verify & Open Passport →' }}
        </button>

        <p className="text-xs text-slate-500">
          Didn't receive code? <a routerLink="/register" className="font-bold text-indigo-600 hover:underline">Register again</a>
        </p>
      </div>
    </div>
  `,
})
export class VerifyOtpComponent implements OnInit {
  email = '';
  otpCode = '';
  otpInput = '';
  loading = false;
  error = '';
  success = '';

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'] || '';
      this.otpCode = params['otp'] || '';
      if (this.otpCode) {
        this.otpInput = this.otpCode;
      }
    });
  }

  verify(): void {
    if (this.otpInput.length < 6) return;
    this.loading = true;
    this.error = '';
    this.authService.verifyOtp({ email: this.email, otp: this.otpInput }).subscribe({
      next: (res) => {
        if (res.success) {
          this.success = 'Account verified! Redirecting to dashboard...';
          setTimeout(() => this.router.navigate(['/dashboard']), 1000);
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Invalid OTP code.';
        this.loading = false;
      },
    });
  }
}
