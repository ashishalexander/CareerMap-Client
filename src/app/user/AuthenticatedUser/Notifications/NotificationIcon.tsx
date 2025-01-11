import React from 'react';
import { Bell } from 'lucide-react';
import { useAppSelector } from '../../../store/store';

export const NotificationIcon = () => {
  const { hasNewNotifications } = useAppSelector(state => state.notificat);

  return (
    <div className="relative">
      <Bell className="h-6 w-6" />
      {hasNewNotifications && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
      )}
    </div>
  );
};