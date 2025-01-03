// src/components/notifications/NotificationBell.tsx
import React from 'react';
import { useNotification } from './hooks/useNotification';
import { Bell } from 'lucide-react';

export const NotificationIcon = () => {
  const { notifications } = useNotification();

  return (
    <div className="relative">
      <Bell className="w-6 h-6" />
      {notifications.length > 0 && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {notifications.length}
        </div>
      )}
    </div>
  );
};