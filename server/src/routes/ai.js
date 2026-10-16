import { Router } from 'express';
import { 
    getRoadmap, 
    gradeInterviewSession, 
    optimizeResumeBullets, 
    generateCoverLetter, 
    generateChatReply, 
    analyzeResumeATS,
    generateResumeSummary,
    analyzeSkillGapController,
    generateMentorSprintController
} from '../controllers/ai.js';
import { authenticateToken } from '../middlewares/auth.js';
const router = Router();
router.post('/roadmap', authenticateToken, getRoadmap);
router.post('/interview', authenticateToken, gradeInterviewSession);
router.post('/resume-optimize', authenticateToken, optimizeResumeBullets);
router.post('/cover-letter', authenticateToken, generateCoverLetter);
router.post('/chat', authenticateToken, generateChatReply);
router.post('/resume-analyze', authenticateToken, analyzeResumeATS);
router.post('/resume-summary', authenticateToken, generateResumeSummary);
router.post('/skill-gap', authenticateToken, analyzeSkillGapController);
router.post('/mentor-sprint', authenticateToken, generateMentorSprintController);
export default router;
