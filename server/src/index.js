import dotenv from 'dotenv';
dotenv.config(); // MUST be first — loads env vars before any module reads them
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import session from 'express-session';
import passport from './utils/passport.js';
// Import routes
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import aiRoutes from './routes/ai.js';
import jobsRoutes from './routes/jobs.js';
import integrationsRoutes from './routes/integrations.js';
import notesRoutes from './routes/notes.js';
import publicRoutes from './routes/public.js';
import timelineRoutes from './routes/timeline.js';
import documentsRoutes from './routes/documents.js';
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
});
const PORT = process.env.PORT || 5001;
// Middlewares
const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://studentos-arnav54.vercel.app', // Replace with your actual Vercel URL
];
app.use(cors({
    origin: (origin, callback) => {
        // Allow all web origins (Vercel deployments, localhost, custom domains)
        callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
}));
app.options('*', cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
// Session middleware for passport
app.use(session({
    secret: process.env.SESSION_SECRET || 'studentos-secret-session-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
}));
app.use(passport.initialize());
app.use(passport.session());
// Base healthcheck route
app.get(['/health', '/api/health'], (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});
// Mount Routes with dual aliases (supports both /api/auth and /auth)
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/profile', '/profile'], profileRoutes);
app.use(['/api/ai', '/ai'], aiRoutes);
app.use(['/api/jobs', '/jobs'], jobsRoutes);
app.use(['/api/integrations', '/integrations'], integrationsRoutes);
app.use(['/api/notes', '/notes'], notesRoutes);
app.use(['/api/public', '/public'], publicRoutes);
app.use(['/api/timeline', '/timeline'], timelineRoutes);
app.use(['/api/documents', '/documents'], documentsRoutes);
// Socket.io Handlers
io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    // Simulating real-time notification push events
    socket.on('join', (room) => {
        socket.join(room);
    });
    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
});
// Listen on HTTP server
httpServer.listen(PORT, () => {
    console.log(`🚀 StudentOS Server running on http://localhost:${PORT}`);
});
