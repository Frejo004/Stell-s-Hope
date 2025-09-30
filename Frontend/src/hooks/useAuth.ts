import { useState, useEffect } from 'react';
import { User, AuthState } from '../types/auth';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
      } catch (error) {
        console.error('Erreur parsing user:', error);
        localStorage.removeItem('user');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulation API call
    const mockUser: User = {
      id: '1',
      email,
      firstName: 'John',
      lastName: 'Doe',
      addresses: [],
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('user', JSON.stringify(mockUser));
    setAuthState({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false
    });
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt' | 'addresses'>) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      addresses: [],
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('user', JSON.stringify(newUser));
    setAuthState({
      user: newUser,
      isAuthenticated: true,
      isLoading: false
    });
  };

  const logout = () => {
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  return {
    ...authState,
    login,
    register,
    logout
  };
};