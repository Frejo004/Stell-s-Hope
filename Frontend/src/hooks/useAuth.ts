import { useState, useEffect } from 'react';
import { User, AuthState } from '../types/auth';
import api from '../lib/api';

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
    
    try {
      // Appel API Laravel
      const { data } = await api.post('/login', { email, password });
      
      // Stocker token et user
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setAuthState({
        user: data.user,
        isAuthenticated: true,
        isLoading: false
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      
      setAuthState(prev => ({
        ...prev,
        isLoading: false
      }));
      
      const message = error.response?.data?.message || 'Erreur de connexion';
      return { success: false, error: message };
    }
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt' | 'addresses'> & { password: string; password_confirmation: string }) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Appel API Laravel
      const { data } = await api.post('/register', {
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        password: userData.password,
        password_confirmation: userData.password_confirmation,
        phone: userData.phone,
      });
      
      // Stocker token et user
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setAuthState({
        user: data.user,
        isAuthenticated: true,
        isLoading: false
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Register error:', error);
      
      setAuthState(prev => ({
        ...prev,
        isLoading: false
      }));
      
      const message = error.response?.data?.message || 'Erreur d\'inscription';
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      // Appel API Laravel
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Nettoyer le localStorage dans tous les cas
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