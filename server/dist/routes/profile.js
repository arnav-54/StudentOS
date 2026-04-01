import { Router } from 'express';
import { getProfile, updateProfile, generateBio } from '../controllers/profile.js';
import { authenticateToken } from '../middlewares/auth.js';
const router = Router();
router.get('/', authenticateToken, getProfile);
router.put('/', authenticateToken, updateProfile);
router.post('/bio', authenticateToken, generateBio);
export default router;
