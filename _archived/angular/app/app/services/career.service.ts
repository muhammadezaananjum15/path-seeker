import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Career {
  _id: string;
  title: string;
  domain: string;
  description: string;
  requiredSkills: string[];
  educationPath: string;
  expectedSalaryRange: { min: number; max: number; currency?: string };
  demandLevel: 'high' | 'medium' | 'low';
  growthRate?: string;
  tags?: string[];
  roadmap?: { step: number; title: string; detail: string }[];
}

@Injectable({
  providedIn: 'root',
})
export class CareerService {
  constructor(private http: HttpClient) {}

  getCareers(options?: { domain?: string; demand?: string; search?: string; limit?: number }): Observable<any> {
    let params = new HttpParams();
    if (options?.domain) params = params.set('domain', options.domain);
    if (options?.demand) params = params.set('demand', options.demand);
    if (options?.search) params = params.set('search', options.search);
    if (options?.limit) params = params.set('limit', options.limit.toString());
    return this.http.get<any>('/api/careers', { params });
  }

  getCareerById(id: string): Observable<any> {
    return this.http.get<any>(`/api/careers/${id}`);
  }

  getTrendingCareers(): Observable<any> {
    return this.http.get<any>('/api/careers/trending');
  }
}
