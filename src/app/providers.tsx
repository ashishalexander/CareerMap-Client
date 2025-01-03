'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { Socket } from 'socket.io-client';
import { initSocket, getSocket } from './lib/socket';

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const socket = initSocket();

    return () => {
      // Only disconnect if we have a connected socket
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, []);

  const socket = getSocket();
  
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