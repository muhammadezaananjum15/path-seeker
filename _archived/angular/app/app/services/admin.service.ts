import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}

  getAnalytics(): Observable<any> {
    return this.http.get<any>('/api/admin/analytics');
  }

  getUsers(search: string = '', role: string = ''): Observable<any> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (role && role !== 'all') params = params.set('role', role);
    return this.http.get<any>('/api/admin/users', { params });
  }

  updateUserRole(id: string, role: string): Observable<any> {
    return this.http.patch<any>(`/api/admin/users/${id}/role`, { role });
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`/api/admin/users/${id}`);
  }

  toggleBanUser(id: string): Observable<any> {
    return this.http.patch<any>(`/api/admin/users/${id}/toggle-ban`, {});
  }
}
