import { Router, Response } from 'express';
import { authenticateToken } from '../middlewares/auth.js';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

let mockDocs: any[] = [];
const mkId = () => 'mock-doc-' + Math.random().toString(36).substr(2, 9);
const now = () => new Date().toISOString();

router.get('/', authenticateToken as any, async (req: any, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const documents = await prisma.document.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    return res.json({ documents });
  } catch {
    return res.json({ documents: mockDocs.filter((d) => d.userId === userId) });
  }
});

router.post('/', authenticateToken as any, async (req: any, res: Response) => {
  const userId = req.user?.userId;
  const { name, type, url } = req.body;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  if (!name || !type) return res.status(400).json({ message: 'Name and type are required.' });
  try {
    const document = await prisma.document.create({ data: { userId, name, type, url: url || '#' } });
    return res.json({ document });
  } catch {
    const document = { id: mkId(), userId, name, type, url: url || '#', createdAt: now() };
    mockDocs.push(document);
    return res.json({ document });
  }
});

router.delete('/:id', authenticateToken as any, async (req: any, res: Response) => {
  const userId = req.user?.userId;
  const { id } = req.params;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const existing = await prisma.document.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) return res.status(404).json({ message: 'Document not found.' });
    await prisma.document.delete({ where: { id } });
    return res.json({ message: 'Deleted.' });
  } catch {
    const idx = mockDocs.findIndex((d) => d.id === id && d.userId === userId);
    if (idx === -1) return res.status(404).json({ message: 'Document not found.' });
    mockDocs.splice(idx, 1);
    return res.json({ message: 'Deleted.' });
  }
});

export default router;
