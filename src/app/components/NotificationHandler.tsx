'use client'
import React, { useEffect } from 'react';
import { useSocket } from '../user/AuthenticatedUser/providers';
import { useAppDispatch } from '../store/store';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { setNewNotification, clearNewNotificationIndicator } from '../store/slices/notificationSlice';
import { INotification } from '../user/AuthenticatedUser/Notifications/Types/INotification';

const NotificationHandler = () => {
  const socket = useSocket();
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notification: INotification) => {
      console.log(pathname)
      // Only set new notification indicator if we're not on the notifications page
      if (pathname !== '/user/AuthenticatedUser/Notifications') {
        dispatch(setNewNotification());
      }
      
      // toast(notification.title, {
      //   description: notification.message,
      // });
    };

    // Add event listeners
    socket.on('admin:notification', handleNotification);
    socket.on('user:notification', handleNotification);

    // Clean up
    return () => {
      if (socket) {
        socket.off('admin:notification', handleNotification);
        socket.off('user:notification', handleNotification);
      }
    };
  }, [socket, dispatch, pathname]);

  return null;
};

export default NotificationHandler;