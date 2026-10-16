import { Router } from 'express';
import { login, register } from '../controllers/auth.js';
import { generateAccessToken } from '../utils/token.js';
import passport from 'passport';
const router = Router();
router.post('/register', register);
router.post('/login', login);
const DEMO_USER_ID = '6a3e37a32639894522d98aa8';
const DEMO_EMAIL = 'demo@studentos.app';
const DEMO_NAME = 'Alex Mercer';

// Demo login — returns a real JWT for the demo user with valid 24-hex ObjectId
router.post('/demo', async (req, res) => {
    try {
        const { prisma } = await import('../prisma/client.js');
        let user = await prisma.user.findUnique({ where: { id: DEMO_USER_ID } }).catch(() => null);
        if (!user) {
            await prisma.user.upsert({
                where: { email: DEMO_EMAIL },
                update: {},
                create: {
                    id: DEMO_USER_ID,
                    email: DEMO_EMAIL,
                    name: DEMO_NAME,
                    password: 'demo-password-hash',
                }
            }).catch(() => null);
        }
    } catch (e) {
        // Non-blocking fallback
    }
    const token = generateAccessToken({ userId: DEMO_USER_ID, email: DEMO_EMAIL });
    return res.json({
        token,
        user: { id: DEMO_USER_ID, name: DEMO_NAME, email: DEMO_EMAIL },
    });
});
// Token reissue — for existing users whose token expired. Takes userId + email, returns fresh token.
// Only for development. In production, use refresh token flow.
router.post('/reissue', async (req, res) => {
    const { userId, email } = req.body;
    if (!userId || !email)
        return res.status(400).json({ message: 'userId and email required' });
    try {
        const { prisma } = await import('../prisma/client.js');
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.email !== email)
            return res.status(404).json({ message: 'User not found' });
        const token = generateAccessToken({ userId: user.id, email: user.email });
        return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    }
    catch (err) {
        // DB not available — if userId and email look valid, still issue token
        const token = generateAccessToken({ userId, email });
        return res.json({ token, user: { id: userId, name: email.split('@')[0], email } });
    }
});
// Quick reset endpoint for dev — clears bad localStorage and returns demo token
router.get('/reset', (req, res) => {
    const token = generateAccessToken({ userId: DEMO_USER_ID, email: DEMO_EMAIL });
    return res.json({
        message: 'localStorage cleared. Use this fresh token.',
        token,
        user: { id: DEMO_USER_ID, name: DEMO_NAME, email: DEMO_EMAIL },
    });
});
// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', (req, res, next) => {
    const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/+$/, '');
    passport.authenticate('google', { failureRedirect: `${clientUrl}/auth?error=oauth_failed` })(req, res, () => {
        if (!req.user) {
            return res.redirect(`${clientUrl}/auth?error=oauth_failed`);
        }
        const token = generateAccessToken({ userId: req.user.id, email: req.user.email });
        const redirectUrl = `${clientUrl}/auth?token=${encodeURIComponent(token)}&id=${encodeURIComponent(req.user.id)}&name=${encodeURIComponent(req.user.name || '')}&email=${encodeURIComponent(req.user.email || '')}`;
        return res.redirect(redirectUrl);
    });
});
// GitHub OAuth
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: 'http://localhost:5173/auth?error=oauth_failed' }), (req, res) => {
    res.redirect('http://localhost:5173/dashboard');
});
// Get current session
router.get('/session', (req, res) => {
    if (req.isAuthenticated()) {
        return res.json({ user: req.user });
    }
    return res.status(401).json({ message: 'Not authenticated' });
});
// Logout
router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err)
            return next(err);
        res.json({ message: 'Logged out successfully' });
    });
});
export default router;
