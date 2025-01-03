'use client'
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useNotification } from './hooks/useNotification';
import { useExistingNotifications } from './ExistingNotifications';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Loader2 } from 'lucide-react';

const NotificationsPage = () => {
  const { notifications: realtimeNotifications } = useNotification();
  const { notifications: existingNotifications, loading, error } = useExistingNotifications();

  // Combine and sort notifications by date
  const allNotifications = [...realtimeNotifications, ...existingNotifications]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-600" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {!loading && allNotifications.length === 0 
                ? 'No notifications yet' 
                : `You have ${allNotifications.length} notification${allNotifications.length === 1 ? '' : 's'}`
              }
            </p>
            {loading && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading notifications...
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-red-600 bg-red-50 p-4 rounded-md mb-4">
              {error}
            </div>
          )}
          
          <div className="divide-y">
            {loading ? (
              <div className="py-12 text-center">
                <Loader2 className="w-12 h-12 text-gray-300 mx-auto mb-4 animate-spin" />
                <p className="text-gray-500">Loading your notifications...</p>
              </div>
            ) : allNotifications.length > 0 ? (
              allNotifications.map((notification) => (
                <div 
                  key={notification._id}
                  className="py-4 hover:bg-gray-50 transition-colors rounded-md px-4 -mx-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {notification.title}
                      </h3>
                      <p className="text-gray-600">
                        {notification.message}
                      </p>
                      {notification.link && (
                        <a 
                          href={notification.link}
                          className="text-blue-600 hover:text-blue-700 text-sm inline-block mt-2"
                        >
                          View details
                        </a>
                      )}
                    </div>
                    <span className="text-sm text-gray-400 whitespace-nowrap">
                      {formatDistanceToNow(new Date(notification.createdAt), { 
                        addSuffix: true 
                      })}
                    </span>
                  </div>
                  {notification.status === 'FAILED' && (
                    <div className="mt-2">
                      <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                        Failed to send
                      </span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">You don't have any notifications yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  When you receive notifications, they'll appear here
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPage;