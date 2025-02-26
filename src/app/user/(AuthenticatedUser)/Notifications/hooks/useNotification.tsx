import { useEffect, useState } from 'react';
import { useSocket } from '../../providers';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import { usePathname } from 'next/navigation';
import api from '@/app/lib/axios-config';
import { CombinedNotification, INotification, IUserNotification, SenderData } from '../Types/INotification';
import { clearNewNotificationIndicator } from '@/app/store/slices/notificationSlice';

interface PopulatedSenderId {
  _id: string;
  firstName: string;
  lastName: string;
  profile: {
    profilePicture: string;
  };
}

interface PopulatedUserNotification extends Omit<IUserNotification, 'senderId'> {
  senderId: PopulatedSenderId;
  message?: string;
}




export const useNotification = () => {
  const socket = useSocket();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<CombinedNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const user = useAppSelector((state) => state.auth.user);

  // Transform admin notification to combined format
  const transformAdminNotification = (notification: INotification): CombinedNotification => ({
    _id: notification._id,
    type: 'general',
    title: notification.title,
    message: notification.message,
    link: notification.link,
    createdAt: new Date(notification.createdAt),
    source: 'admin'
  });

  // Transform user notification to combined format
  const transformUserNotification = (notification: PopulatedUserNotification): CombinedNotification => ({
    _id: notification._id,
    type: notification.type,
    message: notification.message || '',
    createdAt: new Date(notification.createdAt),
    senderId: notification.senderId._id,
    senderName: `${notification.senderId.firstName} ${notification.senderId.lastName}`,
    senderAvatar: notification.senderId.profile?.profilePicture,
    receiverId: notification.receiverId,
    postId: notification.postId,
    source: 'user',
  });

  // Handle real-time notifications
  useEffect(() => {
    if (!socket || !user?._id) return;

    const handleNewAdminNotification = (notification: INotification) => {
      const transformedNotification = transformAdminNotification(notification);
      setNotifications(prev => [transformedNotification, ...prev]);
    };

    const handleNewUserNotification = async (notification: IUserNotification) => {
      try {
        // Fetch the sender's details since the socket notification might not include full user data
        const response = await api.get<SenderData>(`/api/users/FetchUserData/${notification.senderId}`);
        const senderData = response.data;
        console.log(senderData)
        
        const populatedNotification: PopulatedUserNotification = {
          ...notification,
          createdAt: notification.createdAt || new Date().toISOString(),
          senderId: {
            _id: senderData._id,
            firstName: senderData.firstName,
            lastName: senderData.lastName,
            profile: {
              profilePicture: senderData.profile?.profilePicture
            }
          }
        };

        const transformedNotification = transformUserNotification(populatedNotification);
        setNotifications(prev => [transformedNotification, ...prev]);
      } catch (error) {
        console.error('Failed to fetch sender details:', error);
      }
    };

    socket.on('admin:notification', handleNewAdminNotification);
    socket.on('user:notification', handleNewUserNotification);

    return () => {
      socket.off('admin:notification', handleNewAdminNotification);
      socket.off('user:notification', handleNewUserNotification);
    };
  }, [socket, user?._id]);

  // Clear notification indicator when on notifications page
  useEffect(() => {
    if (pathname === '/user/Notifications') {
      dispatch(clearNewNotificationIndicator());
    }
  }, [pathname, dispatch]);

  // Fetch initial notifications
  useEffect(() => {
    const fetchAllNotifications = async () => {
      try {
        setLoading(true);
        
        const [adminResponse, userResponse] = await Promise.all([
          api.get<INotification[]>('/api/users/fetch/existingNotifications'),
          api.get<any[]>(`/api/users/fetch/userNotifications/${user?._id}`)
        ]);

        const adminNotifications = adminResponse.data.map(transformAdminNotification);
        const userNotifications = userResponse.data.map(transformUserNotification);

        const combinedNotifications = [...adminNotifications, ...userNotifications]
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        setNotifications(combinedNotifications);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchAllNotifications();
    }
  }, [user?._id]);

  return { notifications, loading };
};