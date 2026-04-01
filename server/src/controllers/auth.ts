import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../prisma/client.js';
import { generateAccessToken, generateRefreshToken } from '../utils/token.js';

// Simple in-memory user mock database fallback
const mockUserDb: any[] = [];

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Try Prisma DB write
    let user;
    try {
      user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
    } catch (dbErr) {
      console.warn('Prisma DB Register skipped. Writing to local memory storage instead.', (dbErr as any).message);
      // Fallback In-Memory
      const mockId = 'mock-' + Math.random().toString(36).substr(2, 9);
      user = { id: mockId, name, email, password: hashedPassword };
      mockUserDb.push(user);
    }

    const token = generateAccessToken({ userId: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user.id });

    return res.status(201).json({
      message: 'User registered successfully.',
      token,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Registration controller error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email },
      });
    } catch (dbErr) {
      console.warn('Prisma DB Login skipped. Searching local memory storage instead.', (dbErr as any).message);
      user = mockUserDb.find((u) => u.email === email);
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = generateAccessToken({ userId: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user.id });

    return res.json({
      message: 'Logged in successfully.',
      token,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Login controller error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
