// src/components/notifications/NotificationList.tsx
import React from 'react';
import { useNotification } from './hooks/useNotification';
import { formatDistanceToNow } from 'date-fns';

export const NotificationList = () => {
  const { notifications } = useNotification();

  return (
    <div className="max-h-96 overflow-y-auto">
      {notifications.map((notification) => (
        <div 
          key={notification._id}
          className="p-4 border-b bg-white hover:bg-gray-50 transition-colors"
        >
          <h3 className="font-semibold">{notification.title}</h3>
          <p className="text-gray-600">{notification.message}</p>
          <div className="mt-2 text-sm text-gray-400">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </div>
        </div>
      ))}
      {notifications.length === 0 && (
        <div className="p-4 text-center text-gray-500">
          No notifications yet
        </div>
      )}
    </div>
  );
};