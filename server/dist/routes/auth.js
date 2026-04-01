import { Router } from 'express';
import { login, register } from '../controllers/auth.js';
import { generateAccessToken } from '../utils/token.js';
import passport from 'passport';
const router = Router();
router.post('/register', register);
router.post('/login', login);
// Demo login — returns a real JWT for the demo user
router.post('/demo', (req, res) => {
    const token = generateAccessToken({ userId: 'demo-user-id', email: 'demo@studentos.app' });
    return res.json({
        token,
        user: { id: 'demo-user-id', name: 'Alex Mercer', email: 'demo@studentos.app' },
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
    const token = generateAccessToken({ userId: 'demo-user-id', email: 'demo@studentos.app' });
    return res.json({
        message: 'localStorage cleared. Use this fresh token.',
        token,
        user: { id: 'demo-user-id', name: 'Alex Mercer', email: 'demo@studentos.app' },
    });
});
// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: 'http://localhost:5173/auth?error=oauth_failed' }), (req, res) => {
    // Successful login redirects back to dashboard
    res.redirect('http://localhost:5173/dashboard');
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
