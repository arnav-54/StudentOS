import { Router } from 'express';
import { getApplications, createApplication, updateApplicationStatus, deleteApplication } from '../controllers/jobs.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = Router();

router.get('/', authenticateToken, getApplications);
router.post('/', authenticateToken, createApplication);
router.put('/:id', authenticateToken, updateApplicationStatus);
router.delete('/:id', authenticateToken, deleteApplication);

export default router;
