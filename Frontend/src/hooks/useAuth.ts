import { useState, useEffect, useCallback } from 'react';
import { User, AuthState } from '../types/auth';
import { apiService } from '../services/api';

// Utilitaire pour sanitiser les données utilisateur
const sanitizeUserData = (user: any): User => {
  if (!user) return user;
  return {
    ...user,
    firstName: user.firstName?.toString().trim() || '',
    lastName: user.lastName?.toString().trim() || '',
    email: user.email?.toString().trim() || ''
  };
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Vérifier le token avec l'API
      apiService.getMe()
        .then((user) => {
          const sanitizedUser = sanitizeUserData(user);
          setAuthState({
            user: sanitizedUser,
            isAuthenticated: true,
            isLoading: false
          });
        })
        .catch(() => {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
        });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await apiService.login(email, password);
      
      if (response.token && response.user) {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user', JSON.stringify(sanitizeUserData(response.user)));
        
        setAuthState({
          user: sanitizeUserData(response.user),
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        throw new Error('Réponse d\'authentification invalide');
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (userData: any) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await apiService.register(userData);
      
      if (response.token && response.user) {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user', JSON.stringify(sanitizeUserData(response.user)));
        
        setAuthState({
          user: sanitizeUserData(response.user),
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        throw new Error('Réponse d\'inscription invalide');
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  };

  return {
    ...authState,
    login,
    register,
    logout
  };
};