'use client'
import React, { useEffect } from 'react';
import { useSocket } from '../providers';
import { useAppDispatch } from '../store/store';
import { toast } from 'sonner';
import { setNewNotification } from '../store/slices/notificationSlice';
import { INotification } from '../user/AuthenticatedUser/Notifications/Types/INotification';

const NotificationHandler = () => {
  const socket = useSocket();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notification: INotification) => {
      dispatch(setNewNotification());
      toast(notification.title, {
        description: notification.message,
      });
    };

    // Add event listener
    socket.on('notification:received', handleNotification);

    // Clean up
    return () => {
      if (socket) {
        socket.off('notification:received', handleNotification);
      }
    };
  }, [socket, dispatch]);

  return null;
};

export default NotificationHandler;