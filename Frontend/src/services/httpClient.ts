import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Configuration de base
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const REQUEST_TIMEOUT = 10000; // 10 secondes

// Interface pour les erreurs API
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

// Classe pour gérer les erreurs HTTP
export class HttpError extends Error {
  public status: number;
  public code?: string;
  public details?: any;

  constructor(message: string, status: number, code?: string, details?: any) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// Configuration de l'instance Axios
const createHttpClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: REQUEST_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  // Intercepteur pour les requêtes
  client.interceptors.request.use(
    (config) => {
      // Ajouter le token d'authentification
      const token = localStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Log des requêtes en développement
      if (import.meta.env.DEV) {
        console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.data);
      }

      return config;
    },
    (error) => {
      console.error('Erreur de requête:', error);
      return Promise.reject(error);
    }
  );

  // Intercepteur pour les réponses
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log des réponses en développement
      if (import.meta.env.DEV) {
        console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
      }
      return response;
    },
    (error) => {
      // Gestion centralisée des erreurs
      if (error.response) {
        const { status, data } = error.response;
        
        // Gestion spécifique des erreurs d'authentification
        if (status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          
          // Rediriger vers la page de connexion si pas déjà dessus
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }

        // Créer une erreur HTTP structurée
        const errorMessage = data?.message || `Erreur HTTP ${status}`;
        const httpError = new HttpError(
          errorMessage,
          status,
          data?.code,
          data?.details
        );

        console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`, httpError);
        return Promise.reject(httpError);
      }

      // Erreurs réseau ou autres
      if (error.code === 'ECONNABORTED') {
        const timeoutError = new HttpError('Délai d\'attente dépassé', 408);
        return Promise.reject(timeoutError);
      }

      if (!error.response) {
        const networkError = new HttpError('Erreur de connexion réseau', 0);
        return Promise.reject(networkError);
      }

      return Promise.reject(error);
    }
  );

  return client;
};

// Instance HTTP client
export const httpClient = createHttpClient();

// Méthodes utilitaires
export const httpService = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    httpClient.get(url, config).then(response => response.data),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    httpClient.post(url, data, config).then(response => response.data),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    httpClient.put(url, data, config).then(response => response.data),

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    httpClient.patch(url, data, config).then(response => response.data),

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    httpClient.delete(url, config).then(response => response.data),
};

export default httpService;