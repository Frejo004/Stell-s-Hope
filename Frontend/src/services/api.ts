import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
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
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class ApiService {

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await api.post('/login', { email, password });
    return response.data;
  }

  async register(userData: any) {
    const response = await api.post('/register', userData);
    return response.data;
  }

  async logout() {
    const response = await api.post('/logout');
    return response.data;
  }

  async getMe() {
    const response = await api.get('/me');
    return response.data;
  }

  // Products endpoints
  async getProducts(params?: any) {
    const response = await api.get('/products', { params });
    return response.data;
  }

  async getProduct(id: number) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  }

  async getFeaturedProducts() {
    const response = await api.get('/products/featured');
    return response.data;
  }

  async getBestsellers() {
    const response = await api.get('/products/bestsellers');
    return response.data;
  }

  // Categories endpoints
  async getCategories() {
    const response = await api.get('/categories');
    return response.data;
  }

  async getCategory(id: number) {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;