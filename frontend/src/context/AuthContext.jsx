import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('lf_token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await client.get('/auth/me');
        setUser(response.data.user);
      } catch {
        localStorage.removeItem('lf_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login: (token, userData) => {
        localStorage.setItem('lf_token', token);
        setUser(userData);
      },
      logout: () => {
        localStorage.removeItem('lf_token');
        setUser(null);
      },
      setUser,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
