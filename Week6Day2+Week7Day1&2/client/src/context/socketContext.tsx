'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'react-hot-toast';

const SOCKET_URL = 'http://localhost:3000';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io(SOCKET_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      transports: ['websocket'], // Preferred for performance on Render
    });

    socketInstance.on('connect', () => {
      console.log('🚀 Connected to Terminal Real-time Bridge');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ Connection Severed');
      setIsConnected(false);
    });

    // Handle connection errors (common with cold starts on Render)
    socketInstance.on('connect_error', (err) => {
      console.error('Socket Connection Error:', err.message);
    });

    // Example: Global listener for inventory changes
    socketInstance.on('inventory-alert', (data) => {
      toast(data.message, {
        icon: '📦',
        style: { 
          borderRadius: '16px', 
          background: '#0F172A', 
          color: '#fff',
          fontSize: '12px',
          fontWeight: '900',
          textTransform: 'uppercase'
        },
      });
    });

    setSocket(socketInstance);

    // Standard cleanup on unmount
    return () => {
      if (socketInstance) {
        socketInstance.off('connect');
        socketInstance.off('disconnect');
        socketInstance.off('inventory-alert');
        socketInstance.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);