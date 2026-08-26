import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'graduate' | 'professional' | 'admin';
  isVerified: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = signal<User | null>(this.getStoredUser());
  token = signal<string | null>(localStorage.getItem('pathseeker_access_token'));

  constructor(private http: HttpClient) {}

  private getStoredUser(): User | null {
    const userStr = localStorage.getItem('pathseeker_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  register(data: { name: string; email: string; password: string; role: string }): Observable<any> {
    return this.http.post<any>('/api/auth/register', data);
  }

  verifyOtp(data: { email: string; otp: string }): Observable<any> {
    return this.http.post<any>('/api/auth/verify-otp', data).pipe(
      tap((res) => {
        if (res.success && res.user && res.accessToken) {
          this.setSession(res.user, res.accessToken, res.refreshToken);
        }
      })
    );
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>('/api/auth/login', credentials).pipe(
      tap((res) => {
        if (res.success && res.user && res.accessToken) {
          this.setSession(res.user, res.accessToken, res.refreshToken);
        }
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post<any>('/api/auth/logout', {}).pipe(
      tap(() => {
        this.clearSession();
      })
    );
  }

  setSession(user: User, accessToken: string, refreshToken?: string): void {
    localStorage.setItem('pathseeker_user', JSON.stringify(user));
    localStorage.setItem('pathseeker_access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('pathseeker_refresh_token', refreshToken);
    }
    this.currentUser.set(user);
    this.token.set(accessToken);
  }

  clearSession(): void {
    localStorage.removeItem('pathseeker_user');
    localStorage.removeItem('pathseeker_access_token');
    localStorage.removeItem('pathseeker_refresh_token');
    this.currentUser.set(null);
    this.token.set(null);
  }

  isAuthenticated(): boolean {
    return Boolean(this.currentUser() && this.token());
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }
}
