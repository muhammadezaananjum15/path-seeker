import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-white min-h-screen">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Admin Control Panel</h1>
        <p className="text-xs text-slate-500 mt-1">Live PathSeeker platform metrics and user control.</p>
      </div>

      <!-- KPI CARDS -->
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
          <p className="text-3xl font-black text-[#4F20C9]">{{ analytics?.totalUsers || 0 }}</p>
          <p className="text-xs font-bold text-slate-500">Total Registered Users</p>
        </div>
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
          <p className="text-3xl font-black text-emerald-600">{{ analytics?.totalCareers || 0 }}</p>
          <p className="text-xs font-bold text-slate-500">Careers in Bank</p>
        </div>
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
          <p className="text-3xl font-black text-amber-500">{{ analytics?.quizAttempts || 0 }}</p>
          <p className="text-xs font-bold text-slate-500">Quiz Attempts</p>
        </div>
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
          <p className="text-3xl font-black text-rose-500">{{ analytics?.pendingStories || 0 }}</p>
          <p className="text-xs font-bold text-slate-500">Pending Reviews</p>
        </div>
      </div>

      <!-- USER MANAGEMENT TABLE -->
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-black text-slate-900">User Accounts Management</h2>
          <div className="flex gap-2">
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (keyup.enter)="loadUsers()"
              placeholder="Search user name or email..."
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none"
            />
            <button (click)="loadUsers()" className="px-4 py-2 rounded-xl bg-[#4F20C9] text-white font-bold text-xs">Search</button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 font-black uppercase text-[10px] text-slate-500">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr *ngFor="let u of users" className="hover:bg-slate-50">
                <td className="p-4 font-bold text-slate-900">{{ u.name }}</td>
                <td className="p-4 text-slate-500">{{ u.email }}</td>
                <td className="p-4 font-bold uppercase text-[#4F20C9]">{{ u.role }}</td>
                <td className="p-4 font-bold" [ngClass]="{ 'text-emerald-600': u.isVerified, 'text-rose-500': !u.isVerified }">
                  {{ u.isVerified ? 'Active' : 'Suspended' }}
                </td>
                <td className="p-4 text-right space-x-2">
                  <button (click)="toggleBan(u._id)" className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 font-bold hover:bg-amber-100">
                    {{ u.isVerified ? 'Suspend' : 'Restore' }}
                  </button>
                  <button (click)="deleteUser(u._id, u.name)" className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-bold hover:bg-rose-100">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class AdminDashboardComponent implements OnInit {
  analytics: any = null;
  users: any[] = [];
  searchTerm = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getAnalytics().subscribe({
      next: (res) => {
        if (res.success) this.analytics = res.analytics;
      },
    });
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminService.getUsers(this.searchTerm).subscribe({
      next: (res) => {
        if (res.success) this.users = res.users;
      },
    });
  }

  toggleBan(id: string): void {
    this.adminService.toggleBanUser(id).subscribe({
      next: () => this.loadUsers(),
    });
  }

  deleteUser(id: string, name: string): void {
    if (confirm(`Delete user "${name}"?`)) {
      this.adminService.deleteUser(id).subscribe({
        next: () => this.loadUsers(),
      });
    }
  }
}
