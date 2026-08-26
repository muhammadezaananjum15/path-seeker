import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  constructor(private http: HttpClient) {}

  askAdvisor(prompt: string, userRole: string = 'student', mode: 'fast' | 'deep' = 'fast'): Observable<any> {
    if (mode === 'deep') {
      return this.http.post<any>('/api/claude/career-guidance', { prompt, userRole });
    }
    return this.http.post<any>('/api/chatbot/message', { message: prompt });
  }

  generateArticle(topic: string, userRole: string = 'student'): Observable<any> {
    return this.http.post<any>('/api/articles/generate-ai', { topic, userRole });
  }

  getCareerTip(): Observable<any> {
    return this.http.get<any>('/api/gemini/career-tip');
  }
}
