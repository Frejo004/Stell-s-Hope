import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/auth'; // Using the centralized User type
import { authService, RegisterData } from '../services/authService';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Utility to sanitize user data (keeping logic from previous useAuth.ts)
const sanitizeUserData = (user: any): User => {
  return {
    id: user.id || 0,
    first_name: user.first_name?.toString().trim() || '',
    last_name: user.last_name?.toString().trim() || '',
    email: user.email?.toString().trim() || '',
    phone: user.phone?.toString().trim(),
    address: user.address?.toString().trim(),
    city: user.city?.toString().trim(),
    postal_code: user.postal_code?.toString().trim(),
    country: user.country?.toString().trim(),
    is_admin: !!user.is_admin,
    is_active: !!user.is_active,
    created_at: user.created_at || '',
    updated_at: user.updated_at || ''
  };
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
          // Verify token by calling /me (ensures token is still valid)
          try {
            const userData = await authService.getMe();
            const sanitized = sanitizeUserData(userData);
            setUser(sanitized);
            localStorage.setItem('user', JSON.stringify(sanitized));
          } catch (error) {
            console.error('Token verification failed, clearing auth');
            authService.logout();
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { user: userData, token } = await authService.login({ email, password });
      const sanitized = sanitizeUserData(userData);
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(sanitized));
      setUser(sanitized);
      return sanitized;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const { user: userData, token } = await authService.register(data);
      const sanitized = sanitizeUserData(userData);
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(sanitized));
      setUser(sanitized);
      return sanitized;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.is_admin || false,
    loading,
    setUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};