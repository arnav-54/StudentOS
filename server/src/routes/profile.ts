import { Router } from 'express';
import { getProfile, updateProfile, generateBio } from '../controllers/profile.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = Router();

router.get('/', authenticateToken as any, getProfile as any);
router.put('/', authenticateToken as any, updateProfile as any);
router.post('/bio', authenticateToken as any, generateBio as any);

export default router;
