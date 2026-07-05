import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Automatically inject Authorization header if user token exists in localStorage
axios.interceptors.request.use((config) => {
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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('studentos_user');
      if (!storedUser) { setLoading(false); return; }
      try {
        const parsed = JSON.parse(storedUser);
        
        // Check for invalid mock IDs that break MongoDB
        if (parsed.id && (parsed.id.includes('mock-') || parsed.id === 'offline' || parsed.id.length !== 24)) {
          console.warn('Detected invalid userId format. Switching to demo mode...');
          localStorage.removeItem('studentos_user');
          // Auto-login with demo
          try {
            const resp = await axios.post(`${API_URL}/auth/demo`);
            if (resp.data?.token) {
              const demoUser = { ...resp.data.user, token: resp.data.token };
              setUser(demoUser);
              localStorage.setItem('studentos_user', JSON.stringify(demoUser));
            }
          } catch {}
          setLoading(false);
          return;
        }
        
        // Validate token by calling a protected endpoint
        if (parsed.token) {
          try {
            await axios.get(`${API_URL}/profile`, {
              headers: { Authorization: `Bearer ${parsed.token}` }
            });
            // Token valid
            setUser(parsed);
          } catch (e) {
            if (e.response?.status === 401 || e.response?.status === 403) {
              // Token invalid/expired — try to reissue
              try {
                const resp = await axios.post(`${API_URL}/auth/reissue`, {
                  userId: parsed.id,
                  email: parsed.email,
                });
                if (resp.data?.token) {
                  const refreshed = { ...parsed, token: resp.data.token };
                  setUser(refreshed);
                  localStorage.setItem('studentos_user', JSON.stringify(refreshed));
                } else {
                  localStorage.removeItem('studentos_user');
                }
              } catch {
                localStorage.removeItem('studentos_user');
              }
            } else {
              // Network error — still let user in with stored data
              setUser(parsed);
            }
          }
        } else {
          localStorage.removeItem('studentos_user');
        }
      } catch {
        localStorage.removeItem('studentos_user');
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (response.data && response.data.user) {
        const userData = {
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          token: response.data.token,
        };
        setUser(userData);
        localStorage.setItem('studentos_user', JSON.stringify(userData));
        return true;
      }
    } catch (error) {
      console.warn('Backend login failed', error);
    }
    return false;
  };

  const signup = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
      if (response.data && response.data.user) {
        const userData = {
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          token: response.data.token,
        };
        setUser(userData);
        localStorage.setItem('studentos_user', JSON.stringify(userData));
        return true;
      }
    } catch (error) {
      console.warn('Backend signup failed', error);
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('studentos_user');
  };

  const mockLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/demo`);
      if (response.data && response.data.token) {
        const userData = {
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          token: response.data.token,
        };
        setUser(userData);
        localStorage.setItem('studentos_user', JSON.stringify(userData));
        return;
      }
    } catch (e) {
      // server down — fallback with warning
    }
    // Offline fallback (buttons won't work without server)
    const fallback = { id: 'demo-user-id', name: 'Alex Mercer', email: 'demo@studentos.app', token: 'offline' };
    setUser(fallback);
    localStorage.setItem('studentos_user', JSON.stringify(fallback));
  };

  const updateUser = (name, email) => {
    if (user) {
      const updated = { ...user, name, email };
      setUser(updated);
      localStorage.setItem('studentos_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, mockLogin, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
