import axios from 'axios';
import { eventBus } from '../utils/eventBus';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  // Uniquement des en-têtes "simples" : sans X-Requested-With ni Content-Type par défaut,
  // les GET ne déclenchent pas de preflight CORS (sinon 2 requêtes HTTP par appel API).
  // `Accept` suffit à garder les réponses JSON (et donc $request->expectsJson() côté Laravel).
  headers: {
    'Accept': 'application/json'
  },
  timeout: 15000
});

// Interceptor for adding token and logging
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (import.meta.env.DEV) {
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
  }

  return config;
});

// Interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    return response;
  },
  async (error) => {
    // Requête annulée (changement de filtre / démontage) : rien à signaler
    if (axios.isCancel(error) || error?.code === 'ERR_CANCELED') {
      return Promise.reject(error);
    }

    const { response } = error;
    const message = response?.data?.message || 'Une erreur est survenue';

    if (import.meta.env.DEV) {
      console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`, response?.data || error.message);
    }

    // Afficher un toast pour les erreurs (sauf si redirection 401)
    if (response?.status !== 401) {
      eventBus.emit('show-toast', {
        message,
        type: 'error',
        duration: 5000
      });
    }

    if (response?.status === 401 && !error.config?._retry) {
      error.config._retry = true;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');

      // Only redirect if not on login/register pages
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;