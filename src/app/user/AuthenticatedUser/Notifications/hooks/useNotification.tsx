// src/hooks/useNotification.tsx
import { useEffect, useState } from 'react';
import { useSocket } from '../../../../providers';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import { toast } from 'sonner';
import { setNewNotification, clearNewNotificationIndicator } from '../../../../store/slices/notificationSlice';
import api from '@/app/lib/axios-config';
import { INotification } from '../Types/INotification';
import { usePathname } from 'next/navigation';

export const useNotification = () => {
  const socket = useSocket();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [noti, setNoti] = useState<INotification[]>([]);

  const notificationState = useAppSelector((state) => state.notificat);

  
  // Clear notification indicator when visiting notifications page
  useEffect(() => {
    if (pathname === '/user/AuthenticatedUser/Notifications') {
      dispatch(clearNewNotificationIndicator());
    }
  }, [pathname, dispatch]);

  // Fetch existing notifications
  useEffect(() => {
    const fetchExistingNotifications = async () => {
      try {
        const response = await api.get('/api/users/fetch/existingNotifications');
        console.log(notificationState)
        setNoti(response.data);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchExistingNotifications();
  }, []);

  // Listen for new notifications
  // useEffect(() => {
  //   if (!socket) return;

  //   socket.on('notification:received', (notification: INotification) => {
  //     setNoti(prev => [notification, ...prev]);
  //     dispatch(setNewNotification());
      
  //     toast(notification.title, {
  //       description: notification.message,
  //     });
  //   });

  //   return () => {
  //     socket.off('notification:received');
  //   };
  // }, [socket, dispatch]);

  return { noti };
};
