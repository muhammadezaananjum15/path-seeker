import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/auth/login.component';
import { VerifyOtpComponent } from './pages/auth/verify-otp.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AiConsoleComponent } from './pages/ai-console/ai-console.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'verify-otp', component: VerifyOtpComponent },
  { path: 'register', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'ai-console', component: AiConsoleComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: '**', redirectTo: '' },
];
