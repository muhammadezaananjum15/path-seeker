import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../services/ai.service';
import { AuthService } from '../../services/auth.service';

interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp?: string;
}

@Component({
  selector: 'app-ai-console',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-white min-h-screen">
      <!-- HEADER -->
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="px-3.5 py-1.5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider">
            PATHSEEKER CAREER INTELLIGENCE
          </span>
          <h1 className="text-3xl font-black text-slate-900 mt-2">Talk to PathSeeker AI</h1>
          <p className="text-xs text-slate-500 mt-1">A dedicated strategy console to evaluate major career decisions, pivots, and skill roadmaps.</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-full border border-slate-200 text-xs font-bold">
          <button
            (click)="setMode('fast')"
            [ngClass]="{ 'bg-[#4F20C9] text-white shadow': mode === 'fast', 'text-slate-600': mode !== 'fast' }"
            className="px-4 py-1.5 rounded-full transition-all"
          >
            Fast Advisor
          </button>
          <button
            (click)="setMode('deep')"
            [ngClass]="{ 'bg-purple-700 text-white shadow': mode === 'deep', 'text-slate-600': mode !== 'deep' }"
            className="px-4 py-1.5 rounded-full transition-all"
          >
            Deep Strategy
          </button>
        </div>
      </div>

      <!-- MESSAGES BOX -->
      <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 h-[500px] overflow-y-auto space-y-4 text-xs">
        <div *ngFor="let msg of messages" className="flex items-start gap-3" [ngClass]="{ 'flex-row-reverse': msg.role === 'user' }">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0"
            [ngClass]="{ 'bg-[#4F20C9] text-white': msg.role === 'user', 'bg-indigo-100 text-indigo-700': msg.role !== 'user' }"
          >
            {{ msg.role === 'user' ? 'U' : 'AI' }}
          </div>
          <div
            className="p-4 rounded-2xl max-w-[80%] leading-relaxed whitespace-pre-wrap font-medium"
            [ngClass]="{ 'bg-[#4F20C9] text-white rounded-tr-none': msg.role === 'user', 'bg-white border border-slate-200 text-slate-900 rounded-tl-none': msg.role !== 'user' }"
          >
            {{ msg.text }}
          </div>
        </div>

        <div *ngIf="loading" className="text-slate-400 text-xs py-2 flex items-center gap-2">
          <span>Analyzing career data...</span>
        </div>
      </div>

      <!-- INPUT FORM -->
      <form (ngSubmit)="send()" className="flex gap-3">
        <input
          type="text"
          [(ngModel)]="userInput"
          name="userInput"
          placeholder="Ask PathSeeker AI about careers, salaries, or degree paths..."
          className="flex-1 px-5 py-3.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4F20C9]"
        />
        <button
          type="submit"
          [disabled]="loading || !userInput.trim()"
          className="px-8 py-3.5 rounded-2xl bg-[#4F20C9] hover:bg-purple-800 text-white font-bold text-xs uppercase tracking-wider disabled:opacity-40 transition-all shadow-md"
        >
          Send →
        </button>
      </form>
    </div>
  `,
})
export class AiConsoleComponent {
  mode: 'fast' | 'deep' = 'fast';
  messages: Message[] = [
    {
      role: 'model',
      text: 'Welcome to the PathSeeker AI Strategy Console! I analyze global hiring data, required skills, and salary bands to help you make confident career decisions.\n\nWhat career transition or degree pathway would you like to explore today?',
      timestamp: new Date().toISOString(),
    },
  ];
  userInput = '';
  loading = false;

  constructor(private aiService: AiService, private authService: AuthService) {}

  setMode(m: 'fast' | 'deep'): void {
    this.mode = m;
  }

  send(): void {
    const query = this.userInput.trim();
    if (!query || this.loading) return;

    this.messages.push({ role: 'user', text: query, timestamp: new Date().toISOString() });
    this.userInput = '';
    this.loading = true;

    const userRole = this.authService.currentUser()?.role || 'student';
    this.aiService.askAdvisor(query, userRole, this.mode).subscribe({
      next: (res) => {
        const replyText = res.response || res.result || 'Here is your career strategy recommendation based on global hiring trends.';
        this.messages.push({ role: 'model', text: replyText, timestamp: new Date().toISOString() });
      },
      error: () => {
        this.messages.push({ role: 'model', text: 'Recommend exploring our Career Bank and taking the Interest Quiz for personalized insights!' });
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
