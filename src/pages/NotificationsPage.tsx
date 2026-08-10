import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Bell, Check, Sparkles, ShieldCheck } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    apiService.getNotifications().then(setNotifications);
  }, []);

  const handleMarkRead = async (id: string) => {
    await apiService.markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="border-b border-[#e6e2e2] pb-6 space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1b1c1c] flex items-center gap-3">
          <Bell className="w-7 h-7 text-[#b8860b]" />
          <span>Privé Concierge Notifications</span>
        </h1>
        <p className="text-xs text-[#6a6666]">Alerts regarding flight schedules, price-drop opportunities, and butler assignments.</p>
      </div>

      <div className="space-y-4">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
              n.read ? 'bg-white border-[#e8e4e4]' : 'bg-[#f5f2ed] border-[#e2dccf] shadow-sm'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-serif font-bold text-sm text-[#1b1c1c]">{n.title}</span>
                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-[#b8860b]" />
                )}
              </div>
              <p className="text-xs text-[#524e4e]">{n.message}</p>
              <span className="text-[10px] text-[#8c8888] block">{n.createdAt}</span>
            </div>

            {!n.read && (
              <button
                onClick={() => handleMarkRead(n.id)}
                className="px-3 py-1.5 bg-white border border-[#e2dede] text-xs font-semibold rounded-lg hover:bg-[#1b1c1c] hover:text-white transition-colors shrink-0"
              >
                Mark Read
              </button>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
