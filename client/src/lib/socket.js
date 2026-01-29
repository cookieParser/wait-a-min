import { io } from 'socket.io-client';

// Socket initialization pointing to backend server
const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const socket = io(socketUrl, {
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5
});

socket.on('connect', () => {
    console.log('CONNECTED to socket server:', socket.id);
});

socket.on('connect_error', (error) => {
    console.error('SOCKET connection error:', error);
});

socket.on('disconnect', (reason) => {
    console.warn('SOCKET disconnected:', reason);
});
