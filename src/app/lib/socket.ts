import { io, Socket } from 'socket.io-client';
import { useAppSelector } from '../store/store';
let socket: Socket;

export const initSocket = (userId:string) => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
      query: { userId }, 
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket', 'polling'], // Add this
      withCredentials: true, // Add this    
    });

     // Add more detailed logging
     socket.on('connect', () => {
      console.log('Socket connected with ID:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected because:', reason);
    });

    socket.on('connect_error', (err) => {
      console.error('Connection error:', err.message);
    });

    socket.onAny((eventName, ...args) => {
      console.log('Received event:', eventName, args);
    });
    // Add this to debug connection status
    socket.on('reconnect_attempt', (attempt) => {
      console.log('Reconnection attempt:', attempt);
    });

    socket.on('reconnect_failed', () => {
      console.log('Failed to reconnect');
    });
  }
  return socket;  
};

export const getSocket = (userId?: string) => {
  if (!socket && userId) {
    return initSocket(userId);
  }
  return socket;
};

// Hook to initialize the socket with userId from Redux
export const useSocket = () => {
  const userId = useAppSelector((state) => state.auth.user?._id);

  if (!userId) {
    console.warn('No userId found in Redux store. Socket will not be initialized.');
    return null;
  }

  return getSocket(userId);
};