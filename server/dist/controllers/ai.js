import { AIService } from '../services/ai.js';
export const getRoadmap = async (req, res) => {
    const { role } = req.body;
    if (!role)
        return res.status(400).json({ message: 'Role is required.' });
    try {
        const roadmap = await AIService.generateRoadmap(role);
        return res.json({ roadmap });
    }
    catch (err) {
        console.error('Roadmap compile error:', err);
        return res.status(500).json({ message: 'Failed to compile learning roadmap.' });
    }
};
export const gradeInterviewSession = async (req, res) => {
    const { role, description, answers } = req.body;
    if (!role || !answers || !Array.isArray(answers)) {
        return res.status(400).json({ message: 'Role and answer array are required.' });
    }
    try {
        const report = await AIService.gradeInterview(role, description || '', answers);
        return res.json({ report });
    }
    catch (err) {
        console.error('Interview grading error:', err);
        return res.status(500).json({ message: 'Failed to process interview results.' });
    }
};
export const optimizeResumeBullets = async (req, res) => {
    const { projectBullets } = req.body;
    if (!projectBullets)
        return res.status(400).json({ message: 'Project description bullets are required.' });
    try {
        const optimized = await AIService.optimizeResume(projectBullets);
        return res.json({ optimized });
    }
    catch (err) {
        console.error('Resume optimization error:', err);
        return res.status(500).json({ message: 'Failed to optimize resume.' });
    }
};
export const generateCoverLetter = async (req, res) => {
    const { company, role, jobDescription, tone } = req.body;
    if (!company || !role) {
        return res.status(400).json({ message: 'Company and role are required.' });
    }
    try {
        const coverLetter = await AIService.generateCoverLetter(company, role, jobDescription || '', tone || 'professional');
        if (!coverLetter) {
            // Force controller error to trigger high-fidelity frontend fallback if Gemini fails/key is missing
            return res.status(502).json({ message: 'Gemini service unavailable. Using mock.' });
        }
        return res.json({ coverLetter });
    }
    catch (err) {
        console.error('Cover letter generate error:', err);
        return res.status(500).json({ message: 'Failed to generate cover letter.' });
    }
};
export const generateChatReply = async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ message: 'Message is required.' });
    }
    try {
        const reply = await AIService.generateChatReply(message);
        if (!reply) {
            return res.status(502).json({ message: 'Gemini service unavailable. Using mock.' });
        }
        return res.json({ reply });
    }
    catch (err) {
        console.error('Chat assistant error:', err);
        return res.status(500).json({ message: 'Failed to generate chat reply.' });
    }
};
