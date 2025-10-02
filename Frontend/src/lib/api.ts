import axios from 'axios';

// URL de l'API Laravel
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Créer instance axios
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Pour cookies CSRF
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si 401, déconnecter l'utilisateur
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Si 403, accès refusé
    if (error.response?.status === 403) {
      console.error('Accès refusé');
    }
    
    return Promise.reject(error);
  }
);

export default api;
