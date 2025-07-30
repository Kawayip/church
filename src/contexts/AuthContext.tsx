import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, type User } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; user?: User }>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const response = await authAPI.getProfile();
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          localStorage.removeItem('authToken');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string; user?: User }> => {
    try {
      console.log('AuthContext: Starting login for:', email);
      const response = await authAPI.login({ username: email, password });
      
      console.log('AuthContext: API response:', response);
      console.log('AuthContext: Response success:', response.success);
      console.log('AuthContext: Response token:', response.token);
      console.log('AuthContext: Response user:', response.user);
      
      if (response.success && response.token && response.user) {
        const { token, user } = response;
        console.log('AuthContext: Storing token and user');
        localStorage.setItem('authToken', token);
        setUser(user);
        return { success: true, message: 'Login successful', user };
      } else {
        console.log('AuthContext: Login failed, response:', response);
        return { success: false, message: response.message || 'Login failed' };
      }
    } catch (error: any) {
      console.error('AuthContext: Login error:', error);
      return { 
        success: false, 
        message: error.message || 'Login failed. Please try again.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 