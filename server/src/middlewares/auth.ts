import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/token.js';

declare global {
  namespace Express {
    interface User {
      userId?: string;
      email?: string;
      id?: string;
    }
  }
}

export type AuthenticatedRequest = Request;

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required.' });
  }

  const decoded = verifyAccessToken(token);
  if (!decoded) {
    return res.status(403).json({ message: 'Invalid or expired access token.' });
  }

  req.user = decoded;
  next();
};
