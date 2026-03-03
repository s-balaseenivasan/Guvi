import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('user');
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await authAPI.getMe();
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [token]);

  const login = async (credentials) => {
    const response = await authAPI.login(credentials);
    const { token: nextToken, ...rest } = response.data;
    localStorage.setItem('token', nextToken);
    localStorage.setItem('user', JSON.stringify(rest));
    setToken(nextToken);
    setUser(rest);
    return response;
  };

  const register = async (payload) => {
    const response = await authAPI.register(payload);
    const { token: nextToken, ...rest } = response.data;
    localStorage.setItem('token', nextToken);
    localStorage.setItem('user', JSON.stringify(rest));
    setToken(nextToken);
    setUser(rest);
    return response;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: Boolean(token),
    isCustomer: user?.role === 'customer',
    isRestaurant: user?.role === 'restaurant',
    isAdmin: user?.role === 'admin',
  }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
