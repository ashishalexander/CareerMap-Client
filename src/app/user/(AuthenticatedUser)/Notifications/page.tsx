'use client'
import React from 'react';
import { useNotification } from './hooks/useNotification';
import { formatDistanceToNow } from 'date-fns';
import { 
  Bell, 
  UserPlus, 
  ThumbsUp, 
  MessageCircle,
  MoreHorizontal,
  Loader2,
  User 
} from 'lucide-react';
import { CombinedNotification } from './Types/INotification';

const notificationIcons: Record<string, React.ReactNode> = {
  follow: <UserPlus className="w-4 h-4" />,
  like: <ThumbsUp className="w-4 h-4" />,
  comment: <MessageCircle className="w-4 h-4" />,
  general: <Bell className="w-4 h-4" />,
  DEFAULT: <Bell className="w-4 h-4" />
};

const NotificationsPage = () => {
  const { notifications, loading } = useNotification();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const renderNotificationMessage = (notification: CombinedNotification) => {
    if (notification.source === 'admin') {
      return (
        <>
          <p className="text-gray-900 font-medium">{notification.title}</p>
          <p className="text-gray-600 mt-1">{notification.message}</p>
        </>
      );
    }

    // For user notifications, use the senderName instead of raw user ID
    let message = '';
    switch (notification.type.toLowerCase()) {
      case 'like':
        message = 'liked your post';
        break;
      case 'comment':
        message = 'commented on your post';
        break;
      case 'connection_request':
        message = 'sent you a connection request';
        break;
      default:
        message = notification.message;
    }

    return (
      <p className="text-gray-600">
        <span className="font-medium text-gray-900">{notification.senderName}</span>
        {' '}
        {message}
      </p>
    );
  };

  return (
    <div className="max-w-3xl mx-auto bg-white min-h-screen">
      <div className="border-b sticky top-0 bg-white z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Notifications</h1>
            <button className="text-gray-600 hover:bg-gray-100 p-2 rounded-full">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="divide-y">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div 
              key={notification._id}
              className="p-4 transition-colors flex gap-3 bg-white hover:bg-gray-50"
            >
              <div className="flex-shrink-0">
                {notification.source === 'user' ? (
                  notification.senderAvatar ? (
                    <img 
                      src={notification.senderAvatar}
                      alt={notification.senderName || 'User avatar'}
                      className="w-12 h-12 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <User className="w-6 h-6" />
                    </div>
                  )
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    {notificationIcons[notification.type.toLowerCase()] || notificationIcons.DEFAULT}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    {renderNotificationMessage(notification)}
                    {notification.link && (
                      <a 
                        href={notification.link}
                        className="mt-2 text-blue-600 hover:text-blue-700 hover:underline text-sm inline-block"
                      >
                        View details
                      </a>
                    )}
                    <p className="text-gray-400 text-sm mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No notifications yet</p>
            <p className="text-sm text-gray-400 mt-1">
              We&apos;ll notify you when something new arrives
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;