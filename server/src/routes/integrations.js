import { Router } from 'express';
import { IntegrationsService } from '../services/integrations.js';
const router = Router();
// GET /api/integrations/github/:username
router.get('/github/:username', async (req, res) => {
    const { username } = req.params;
    if (!username)
        return res.status(400).json({ message: 'GitHub username is required.' });
    try {
        const stats = await IntegrationsService.fetchGithubStats(username);
        return res.json({ stats });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
});
// GET /api/integrations/leetcode/:username
router.get('/leetcode/:username', async (req, res) => {
    const { username } = req.params;
    if (!username)
        return res.status(400).json({ message: 'LeetCode username is required.' });
    try {
        const stats = await IntegrationsService.fetchLeetcodeStats(username);
        return res.json({ stats });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
});
export default router;
