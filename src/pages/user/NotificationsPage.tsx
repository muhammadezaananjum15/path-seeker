import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Info } from 'lucide-react';
import apiClient from '../../services/apiClient';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    apiClient.get('/notifications').then((res) => {
      if (res.data.success && Array.isArray(res.data.notifications)) {
        setNotifications(res.data.notifications);
      }
    });
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await apiClient.patch('/notifications/read-all');
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch (e) {}
  };

  return (
    <div className="bg-white min-h-screen py-8 text-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-[#07031A]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Notifications</h1>
            <p className="text-xs text-slate-500">System updates, story approval statuses, and announcements.</p>
          </div>

          {notifications.some((n) => !n.isRead) && (
            <button
              onClick={handleMarkAllRead}
              className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1.5"
            >
              <CheckCheck className="w-4 h-4 text-emerald-500" />
              Mark All Read
            </button>
          )}
        </div>

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center text-slate-500 text-xs shadow-sm">
              No notifications available right now.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`p-5 rounded-2xl border flex items-start gap-4 transition-all ${
                  !n.isRead
                    ? 'bg-purple-50/80 border-purple-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-[#4F20C9] text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-xs font-bold text-[#07031A]">{n.message}</p>
                  <p className="text-[10px] text-slate-400">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
