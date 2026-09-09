import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuthToken, removeAuthToken, apiFetch } from '../utils/api';

interface User {
  id: string;
  email: string;
  nickname: string;
  blockcoin_balance: number;
  email_verified?: boolean;
  is_admin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = getAuthToken();
      const savedUserStr = localStorage.getItem('erex_user');
      
      if (!token || !savedUserStr) {
        removeAuthToken();
        localStorage.removeItem('erex_user');
        setLoading(false);
        return;
      }
      
      try {
        const savedUser = JSON.parse(savedUserStr);
        setUser(savedUser);
      } catch (err) {
        console.error('Failed to parse saved user', err);
        removeAuthToken();
        localStorage.removeItem('erex_user');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = (token: string, userData: User) => {
    setUser(userData);
    localStorage.setItem('erex_user', JSON.stringify(userData));
  };

  const logout = () => {
    removeAuthToken();
    localStorage.removeItem('erex_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
