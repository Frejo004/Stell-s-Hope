import { useState, useEffect, useCallback } from 'react';
import { User, AuthState } from '../types/auth';
import { authService, RegisterData } from '../services/authService';

// Utilitaire pour sanitiser les données utilisateur
const sanitizeUserData = (user: Partial<User>): User => {
  if (!user) {
    // Retourner un objet User vide mais valide si user est null/undefined
    return {
      id: 0,
      first_name: '',
      last_name: '',
      email: '',
      is_admin: false,
      is_active: false,
      created_at: '',
      updated_at: ''
    };
  }
  
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
    is_admin: user.is_admin || false,
    is_active: user.is_active || false,
    created_at: user.created_at || '',
    updated_at: user.updated_at || ''
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
      authService.getMe()
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
      const response = await authService.login({ email, password });
      
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

  const register = async (userData: RegisterData) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // S'assurer que tous les champs requis sont présents
      const registerData: RegisterData = {
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        email: userData.email || '',
        password: userData.password || '',
        password_confirmation: userData.password_confirmation || '',
        phone: userData.phone
      };
      
      const response = await authService.register(registerData);
      
      if (response && response.token && response.user) {
        // Stocker le token et les données utilisateur
        localStorage.setItem('auth_token', response.token);
        const sanitizedUser = sanitizeUserData(response.user);
        localStorage.setItem('user', JSON.stringify(sanitizedUser));
        
        setAuthState({
          user: sanitizedUser,
          isAuthenticated: true,
          isLoading: false
        });
        
        return sanitizedUser;
      } else {
        throw new Error('Réponse d\'inscription invalide');
      }
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      console.error('Erreur lors de l\'inscription:', error.message || error);
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