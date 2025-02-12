'use client'
      import React, { createContext, useContext, useEffect, ReactNode, useState } from 'react';
import { Socket } from 'socket.io-client';
import { initSocket, getSocket } from '../../lib/socket';
import { useAppSelector } from '@/app/store/store';

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const userId = useAppSelector((state) => state.auth.user?._id);
  const [isSocketReady, setSocketReady] = useState(false); // Track socket readiness

  useEffect(() => {
    if (!userId) {
      console.warn('No userId found. Socket will not be initialized.');
      setSocketReady(true); // Set socket as ready even if userId is missing
      return;
    }
    const socket = initSocket(userId);
    setSocketReady(true); // Mark socket as ready when initialized

    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [userId]);

  const socket = getSocket();

  if (!isSocketReady) {
    return null; // Optionally render a loading spinner here
  }

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return socket;
};
