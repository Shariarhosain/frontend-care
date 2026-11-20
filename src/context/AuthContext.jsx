import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('token')));

  // On page load, restore the session from the saved token.
  useEffect(() => {
    if (!localStorage.getItem('token')) return;
    api
      .get('/auth/me')
      .then((res) => setUser(res.data.data))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const saveSession = ({ token, data }) => {
    localStorage.setItem('token', token);
    setUser(data);
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    saveSession(res.data);
  };

  const register = async (payload) => {
    const res = await api.post('/auth/register', payload);
    saveSession(res.data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
