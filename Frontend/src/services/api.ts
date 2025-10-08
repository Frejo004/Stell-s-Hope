import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 secondes
});

// Intercepteur pour ajouter le token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Gestion des erreurs d'authentification
    if (error.response?.status === 401 && error.config && !error.config.__isRetryRequest) {
      try {
        // Tenter de rafraîchir le token
        const response = await api.post('/refresh-token');
        const newToken = response.data.token;
        localStorage.setItem('auth_token', newToken);
        
        // Réessayer la requête originale
        error.config.headers.Authorization = `Bearer ${newToken}`;
        error.config.__isRetryRequest = true;
        return api(error.config);
      } catch (refreshError) {
        // Si le rafraîchissement échoue, déconnecter l'utilisateur
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    // Gestion des autres erreurs
    if (error.response?.status === 422) {
      // Erreurs de validation
      console.error('Erreur de validation:', error.response.data);
    } else if (error.response?.status === 500) {
      // Erreurs serveur
      console.error('Erreur serveur:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

export const apiService = {
  ...api,
  getMe: () => api.get('/user'),
  login: (email: string, password: string) => api.post('/login', { email, password }),
  register: (userData: any) => api.post('/register', userData),
  logout: () => api.post('/logout')
};

export default api;