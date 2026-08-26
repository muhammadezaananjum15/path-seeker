import { create } from 'zustand';
import { adminService, AdminAnalytics } from '../services/adminService';
import { authService } from '../services/authService';
import { User } from '../types';

interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
}

interface AdminState {
  analytics: AdminAnalytics;
  metrics: AdminAnalytics;
  users: User[];
  auditLogs: AuditLog[];
  refreshAnalytics: () => void;
  logAction: (action: string, target?: string, user?: string) => void;
  toggleUserStatus: (userId: string) => void;
  deleteUser: (userId: string) => void;
}

const initialAnalytics = adminService.getAnalytics();

export const useAdminStore = create<AdminState>((set, get) => ({
  analytics: initialAnalytics,
  metrics: initialAnalytics,
  users: authService.getUsers(),
  auditLogs: initialAnalytics.recentAuditLogs,

  refreshAnalytics: () => {
    const updated = adminService.getAnalytics();
    set({ analytics: updated, metrics: updated, auditLogs: updated.recentAuditLogs });
  },

  logAction: (action: string, target = '', user = 'Admin Lead') => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action: target ? `${action}: ${target}` : action,
      user,
      timestamp: 'Just now'
    };
    set({ auditLogs: [newLog, ...get().auditLogs] });
  },

  toggleUserStatus: (userId: string) => {
    const currentUsers = get().users;
    const updated = currentUsers.map((u) =>
      u.id === userId ? { ...u, status: u.status === 'Active' ? ('Suspended' as const) : ('Active' as const) } : u
    );
    set({ users: updated });
  },

  deleteUser: (userId: string) => {
    const updated = get().users.filter((u) => u.id !== userId);
    set({ users: updated });
  }
}));
