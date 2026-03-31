import { io } from 'socket.io-client';

const URL = 'http://localhost:3001'; 

export const socket = io(URL, {
  autoConnect: false, // Better to connect manually after checking for token
  transports: ['websocket'],
  auth: (cb) => {
    // This runs every time the socket tries to connect
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    cb({ token });
  }
});