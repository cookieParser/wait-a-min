const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

// 1. Initialize Socket.io First
const allowedSocketOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL
].filter(Boolean);

const io = new Server(server, {
    cors: {
        origin: function(origin, callback) {
            // Allow same-origin and Render domains
            if (!origin || origin.includes('onrender.com')) {
                callback(null, true);
            } else if (allowedSocketOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(null, true); // Allow all for same-origin deployment
            }
        },
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ['websocket', 'polling'],
    allowUpgrades: true
});

// 2. Attach io to app immediately
app.set('socketio', io);

// 3. Global Middlewares - CORS FIRST
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL // Add your production frontend URL here
].filter(Boolean);

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, same-origin)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('onrender.com')) {
            callback(null, true);
        } else {
            callback(null, true); // Allow all for now since we're serving from same origin
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Disable helmet for now to debug
// app.use(helmet({
//     contentSecurityPolicy: false,
// }));

// Data sanitization against NoSQL query injection - disabled for Express 5 compatibility
// app.use(mongoSanitize());

// Limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// 4. Routes
const apiRoutes = require('./routes/api');
const errorHandler = require('./middleware/errorMiddleware');
const AppError = require('./utils/AppError');

app.use('/api', apiRoutes);

// Serve static files from React build
const path = require('path');
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API is running' });
});

// Handle undefined API routes
app.use('/api', (req, res, next) => {
    if (req.route) return next(); // Route was matched, continue
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Serve React app for all other routes (except socket.io)
app.use((req, res, next) => {
    if (req.originalUrl.startsWith('/socket.io') || req.originalUrl.startsWith('/api')) {
        return next();
    }
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Global Error Handler
app.use(errorHandler);

// 5. Socket Logic
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join a room for a specific place
    socket.on('joinPlace', (placeId) => {
        socket.join(placeId);
        console.log(`User ${socket.id} joined room for place: ${placeId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// 6. DB & Listen
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/wait-time-db';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
        console.warn('Server will continue running without database connection');
    });

// Test database connection
app.get('/api/db-test', async (req, res) => {
    try {
        const state = mongoose.connection.readyState;
        res.json({ 
            status: 'ok',
            dbConnected: state === 1,
            connectionState: ['disconnected', 'connected', 'connecting', 'disconnecting'][state]
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Socket.io listening for connections`);
});
