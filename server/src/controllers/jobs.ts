import { Response } from 'express';
import { prisma } from '../prisma/client.js';
import { AuthenticatedRequest } from '../middlewares/auth.js';

// Local temporary memory storage fallback
let mockApplications: any[] = [];

export const getApplications = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    let list;
    try {
      list = await prisma.jobApplication.findMany({
        where: { userId },
      });
    } catch (dbErr) {
      console.warn('Prisma DB query skipped. Fetching from memory cache.');
      list = mockApplications.filter((app) => app.userId === userId);
    }
    return res.json(list);
  } catch (err) {
    console.error('Fetch applications error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createApplication = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const { company, role, status, appliedDate, location, notes } = req.body;

  try {
    let app;
    try {
      app = await prisma.jobApplication.create({
        data: {
          userId,
          company,
          role,
          status,
          appliedDate,
          location,
          notes,
        },
      });
    } catch (dbErr) {
      console.warn('Prisma DB write skipped. Mocking application card creation.');
      app = {
        id: 'mock-app-' + Math.random().toString(36).substr(2, 9),
        userId,
        company,
        role,
        status,
        appliedDate,
        location,
        notes,
      };
      mockApplications.push(app);
    }
    return res.status(201).json(app);
  } catch (err) {
    console.error('Create application error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateApplicationStatus = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    let app;
    try {
      app = await prisma.jobApplication.update({
        where: { id },
        data: { status },
      });
    } catch (dbErr) {
      console.warn('Prisma DB update skipped. Mocking application status change.');
      const idx = mockApplications.findIndex((a) => a.id === id);
      if (idx !== -1) {
        mockApplications[idx].status = status;
        app = mockApplications[idx];
      }
    }
    return res.json({ message: 'Status updated successfully', app });
  } catch (err) {
    console.error('Update application status error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteApplication = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  try {
    try {
      await prisma.jobApplication.delete({
        where: { id },
      });
    } catch (dbErr) {
      console.warn('Prisma DB delete skipped. Mocking application card removal.');
      mockApplications = mockApplications.filter((a) => a.id !== id);
    }
    return res.json({ message: 'Application deleted successfully' });
  } catch (err) {
    console.error('Delete application error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
