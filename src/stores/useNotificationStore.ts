import { create } from 'zustand';
import { Notification } from '../types';
import { notificationService } from '../services/notificationService';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;

  // Actions
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  addNotification: (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => {
  const initial = notificationService.getNotifications();
  const unread = initial.filter((n) => !n.read).length;

  return {
    notifications: initial,
    unreadCount: unread,

    markAsRead: (id: string) => {
      const updated = notificationService.markAsRead(id);
      set({
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length
      });
    },

    markAllAsRead: () => {
      const updated = notificationService.markAllAsRead();
      set({
        notifications: updated,
        unreadCount: 0
      });
    },

    deleteNotification: (id: string) => {
      const updated = notificationService.deleteNotification(id);
      set({
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length
      });
    },

    addNotification: (notif) => {
      const all = get().notifications;
      const newNotif: Notification = {
        ...notif,
        id: `notif-${Date.now()}`,
        timestamp: new Date().toISOString(),
        read: false
      };
      const updated = [newNotif, ...all];
      notificationService.saveNotifications(updated);
      set({
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length
      });
    }
  };
});
