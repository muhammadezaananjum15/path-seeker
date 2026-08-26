import { Notification } from '../types';
import { mockNotifications } from '../data/mockNotifications';

export const notificationService = {
  getNotifications(): Notification[] {
    const stored = localStorage.getItem('pathseeker_notifications');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // fallback
      }
    }
    return mockNotifications;
  },

  saveNotifications(notifs: Notification[]) {
    localStorage.setItem('pathseeker_notifications', JSON.stringify(notifs));
  },

  markAsRead(id: string): Notification[] {
    const all = this.getNotifications();
    const updated = all.map((n) => (n.id === id ? { ...n, read: true } : n));
    this.saveNotifications(updated);
    return updated;
  },

  markAllAsRead(): Notification[] {
    const all = this.getNotifications();
    const updated = all.map((n) => ({ ...n, read: true }));
    this.saveNotifications(updated);
    return updated;
  },

  deleteNotification(id: string): Notification[] {
    const all = this.getNotifications();
    const filtered = all.filter((n) => n.id !== id);
    this.saveNotifications(filtered);
    return filtered;
  }
};
