// src/hooks/useNotification.ts
'use client'
import { useEffect, useState } from 'react';
import { useSocket } from '../../../../providers';
import { toast } from 'sonner';
import { INotification } from '../Types/INotification';
import api from '@/app/lib/axios-config';

export const useNotification = () => {
  const socket = useSocket();
  const [notifications, setNotifications] = useState<INotification[]>([]);


  useEffect(() => {
    if (!socket) return;

    socket.on('notification:received', (notification: INotification) => {
     console.log("Notification received on client:", notification);

      setNotifications(prev => [notification, ...prev]);
      
      toast(notification.title, {
        description: notification.message,
      });
    });

    socket.on('notification:error', (error: { message: string }) => {
      toast.error(error.message);
    });

    return () => {
      socket.off('notification:received');
      socket.off('notification:error');
    };
  }, [socket]);

  return {
    notifications,
    
  };
};
