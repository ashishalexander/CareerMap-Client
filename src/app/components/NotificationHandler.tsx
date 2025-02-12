'use client'
import  { useEffect } from 'react';
import { useSocket } from '../user/(AuthenticatedUser)/providers';
import { useAppDispatch } from '../store/store';
import { usePathname } from 'next/navigation';
import { setNewNotification } from '../store/slices/notificationSlice';
import { INotification } from '../user/(AuthenticatedUser)/Notifications/Types/INotification';

const NotificationHandler = () => {
  const socket = useSocket();
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notification: INotification) => {
      // Only set new notification indicator if we're not on the notifications page
      if (pathname !== '/user/Notifications') {
        dispatch(setNewNotification());
      }
      
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