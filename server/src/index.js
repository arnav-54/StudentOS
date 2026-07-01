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
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(null, true); // Allow all in production for now
        }
    },
    credentials: true
}));
app.use(express.json());
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
app.get('/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});
// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/integrations', integrationsRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/documents', documentsRoutes);
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
