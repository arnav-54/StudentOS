import jwt from 'jsonwebtoken';

// Lazy getters ensure dotenv.config() has run before secrets are read
const getAccessSecret = () => process.env.ACCESS_TOKEN_SECRET || 'fallback-access-secret-key-1234';
const getRefreshSecret = () => process.env.REFRESH_TOKEN_SECRET || 'fallback-refresh-secret-key-5678';

export const generateAccessToken = (payload: { userId: string; email: string }) => {
  return jwt.sign(payload, getAccessSecret(), { expiresIn: '7d' });
};

export const generateRefreshToken = (payload: { userId: string }) => {
  return jwt.sign(payload, getRefreshSecret(), { expiresIn: '30d' });
};

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, getAccessSecret()) as { userId: string; email: string };
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, getRefreshSecret()) as { userId: string };
  } catch (error) {
    return null;
  }
};
