import { Router, Response } from 'express';
import { authenticateToken } from '../middlewares/auth.js';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// In-memory fallback store
let mockNotes: any[] = [];

const mkId = () => 'mock-note-' + Math.random().toString(36).substr(2, 9);
const now = () => new Date().toISOString();

// GET all notes
router.get('/', authenticateToken as any, async (req: any, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const notes = await prisma.note.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' } });
    return res.json({ notes });
  } catch {
    const notes = mockNotes.filter((n) => n.userId === userId).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    return res.json({ notes });
  }
});

// POST create note
router.post('/', authenticateToken as any, async (req: any, res: Response) => {
  const userId = req.user?.userId;
  const { title, content, category, linkedTo } = req.body;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  if (!title) return res.status(400).json({ message: 'Title is required.' });

  try {
    const note = await prisma.note.create({
      data: { userId, title, content: content || '', category: category || 'general', linkedTo: linkedTo || null },
    });
    return res.json({ note });
  } catch {
    const note = { id: mkId(), userId, title, content: content || '', category: category || 'general', linkedTo: linkedTo || null, createdAt: now(), updatedAt: now() };
    mockNotes.push(note);
    return res.json({ note });
  }
});

// PUT update note
router.put('/:id', authenticateToken as any, async (req: any, res: Response) => {
  const userId = req.user?.userId;
  const { id } = req.params;
  const { title, content, category, linkedTo } = req.body;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const existing = await prisma.note.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) return res.status(404).json({ message: 'Note not found.' });
    const note = await prisma.note.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existing.title,
        content: content !== undefined ? content : existing.content,
        category: category !== undefined ? category : existing.category,
        linkedTo: linkedTo !== undefined ? linkedTo : existing.linkedTo,
      },
    });
    return res.json({ note });
  } catch {
    const idx = mockNotes.findIndex((n) => n.id === id && n.userId === userId);
    if (idx === -1) return res.status(404).json({ message: 'Note not found.' });
    mockNotes[idx] = { ...mockNotes[idx], ...(title !== undefined && { title }), ...(content !== undefined && { content }), ...(category !== undefined && { category }), updatedAt: now() };
    return res.json({ note: mockNotes[idx] });
  }
});

// DELETE note
router.delete('/:id', authenticateToken as any, async (req: any, res: Response) => {
  const userId = req.user?.userId;
  const { id } = req.params;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const existing = await prisma.note.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) return res.status(404).json({ message: 'Note not found.' });
    await prisma.note.delete({ where: { id } });
    return res.json({ message: 'Note deleted successfully.' });
  } catch {
    const idx = mockNotes.findIndex((n) => n.id === id && n.userId === userId);
    if (idx === -1) return res.status(404).json({ message: 'Note not found.' });
    mockNotes.splice(idx, 1);
    return res.json({ message: 'Note deleted successfully.' });
  }
});

export default router;
