import { io } from 'socket.io-client';

// Socket initialization - use relative path for same-origin deployment
const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin;

export const socket = io(socketUrl, {
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    transports: ['websocket', 'polling'],
    upgrade: true
});

socket.on('connect', () => {
    console.log('✓ Real-time updates connected:', socket.id);
});

socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
});

socket.on('disconnect', (reason) => {
    console.warn('Socket disconnected:', reason);
});
