'use client'
import React from 'react';
import { useNotification } from './hooks/useNotification';
import { formatDistanceToNow } from 'date-fns';
import { 
  Bell, 
  UserPlus, 
  ThumbsUp, 
  MessageCircle, 
  Briefcase,
  MoreHorizontal 
} from 'lucide-react';

// Notification type icons mapping
const notificationIcons: Record<string, React.ReactNode> = {
  CONNECTION: <UserPlus className="w-4 h-4" />,
  LIKE: <ThumbsUp className="w-4 h-4" />,
  COMMENT: <MessageCircle className="w-4 h-4" />,
  JOB: <Briefcase className="w-4 h-4" />,
  DEFAULT: <Bell className="w-4 h-4" />
};

const NotificationsPage = () => {
  const { noti } = useNotification();

  return (
    <div className="max-w-3xl mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="border-b sticky top-0 bg-white z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Notifications</h1>
            <button 
              className="text-gray-600 hover:bg-gray-100 p-2 rounded-full"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="divide-y">
        {noti.length > 0 ? (
          noti.map((notification) => {
            const notificationDate = new Date(notification.createdAt);

            return (
              <div 
                key={notification._id}
                className="p-4 transition-colors flex gap-3 bg-white hover:bg-gray-50"
              >
                {/* Icon Container */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    {notificationIcons[notification.type || 'DEFAULT']}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-gray-900">
                        <span className="font-medium">
                          {notification.title}
                        </span>
                      </p>
                      <p className="text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      {notification.link && (
                        <a 
                          href={notification.link}
                          className="mt-2 text-blue-600 hover:text-blue-700 hover:underline text-sm inline-block"
                        >
                          View details
                        </a>
                      )}
                      <p className="text-gray-400 text-sm mt-1">
                        {formatDistanceToNow(notificationDate, { 
                          addSuffix: true 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-16 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No notifications yet</p>
            <p className="text-sm text-gray-400 mt-1">
              We'll notify you when something new arrives
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;