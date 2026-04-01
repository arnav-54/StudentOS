import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.js';
import { PrismaClient } from '@prisma/client';
const router = Router();
const prisma = new PrismaClient();
let mockTimeline = [];
const mkId = () => 'mock-tl-' + Math.random().toString(36).substr(2, 9);
router.get('/', authenticateToken, async (req, res) => {
    const userId = req.user?.userId;
    if (!userId)
        return res.status(401).json({ message: 'Unauthorized' });
    try {
        const items = await prisma.timelineItem.findMany({ where: { userId } });
        return res.json({ items });
    }
    catch {
        return res.json({ items: mockTimeline.filter((i) => i.userId === userId) });
    }
});
router.post('/', authenticateToken, async (req, res) => {
    const userId = req.user?.userId;
    const { type, title, subtitle, description, date, link } = req.body;
    if (!userId)
        return res.status(401).json({ message: 'Unauthorized' });
    if (!type || !title || !date)
        return res.status(400).json({ message: 'Type, title, and date are required.' });
    try {
        const item = await prisma.timelineItem.create({
            data: { userId, type, title, subtitle: subtitle || null, description: description || null, date, link: link || null },
        });
        return res.json({ item });
    }
    catch {
        const item = { id: mkId(), userId, type, title, subtitle: subtitle || null, description: description || null, date, link: link || null };
        mockTimeline.push(item);
        return res.json({ item });
    }
});
router.delete('/:id', authenticateToken, async (req, res) => {
    const userId = req.user?.userId;
    const { id } = req.params;
    if (!userId)
        return res.status(401).json({ message: 'Unauthorized' });
    try {
        const existing = await prisma.timelineItem.findUnique({ where: { id } });
        if (!existing || existing.userId !== userId)
            return res.status(404).json({ message: 'Item not found.' });
        await prisma.timelineItem.delete({ where: { id } });
        return res.json({ message: 'Deleted.' });
    }
    catch {
        const idx = mockTimeline.findIndex((i) => i.id === id && i.userId === userId);
        if (idx === -1)
            return res.status(404).json({ message: 'Item not found.' });
        mockTimeline.splice(idx, 1);
        return res.json({ message: 'Deleted.' });
    }
});
export default router;
