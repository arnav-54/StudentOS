import jwt from 'jsonwebtoken';
// Lazy getters ensure dotenv.config() has run before secrets are read
const getAccessSecret = () => process.env.ACCESS_TOKEN_SECRET || 'fallback-access-secret-key-1234';
const getRefreshSecret = () => process.env.REFRESH_TOKEN_SECRET || 'fallback-refresh-secret-key-5678';
export const generateAccessToken = (payload) => {
    return jwt.sign(payload, getAccessSecret(), { expiresIn: '7d' });
};
export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, getRefreshSecret(), { expiresIn: '30d' });
};
export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, getAccessSecret());
    }
    catch (error) {
        return null;
    }
};
export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, getRefreshSecret());
    }
    catch (error) {
        return null;
    }
};
