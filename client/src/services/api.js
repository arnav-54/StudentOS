import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header from localStorage on every request
api.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem('studentos_user');
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      if (parsed.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    } catch (e) {
      // ignore
    }
  }
  return config;
});

export default api;
