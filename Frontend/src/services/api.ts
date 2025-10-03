import { httpService, HttpError } from './httpClient';
import { User } from '../types/auth';
import { Product } from '../types';

// Interfaces pour les réponses API
interface LoginResponse {
  token: string;
  user: User;
}

interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  per_page: number;
}

class ApiService {
  // Auth endpoints
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      if (!email || !password) {
        throw new HttpError('Email et mot de passe requis', 400);
      }
      return await httpService.post<LoginResponse>('/login', { email, password });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  }

  async register(userData: any): Promise<LoginResponse> {
    try {
      if (!userData.email || !userData.password) {
        throw new HttpError('Données d\'inscription incomplètes', 400);
      }
      return await httpService.post<LoginResponse>('/register', userData);
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await httpService.post('/logout');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Ne pas propager l'erreur pour permettre la déconnexion locale
    }
  }

  async getMe(): Promise<User> {
    try {
      return await httpService.get<User>('/me');
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      throw error;
    }
  }

  // Products endpoints
  async getProducts(params?: any): Promise<ProductsResponse> {
    try {
      return await httpService.get<ProductsResponse>('/products', { params });
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      throw error;
    }
  }

  async getProduct(id: string | number): Promise<Product> {
    try {
      if (!id) {
        throw new HttpError('ID du produit requis', 400);
      }
      return await httpService.get<Product>(`/products/${id}`);
    } catch (error) {
      console.error(`Erreur lors de la récupération du produit ${id}:`, error);
      throw error;
    }
  }

  async getFeaturedProducts(): Promise<Product[]> {
    try {
      return await httpService.get<Product[]>('/products/featured');
    } catch (error) {
      console.error('Erreur lors de la récupération des produits mis en avant:', error);
      throw error;
    }
  }

  async getBestsellers(): Promise<Product[]> {
    try {
      return await httpService.get<Product[]>('/products/bestsellers');
    } catch (error) {
      console.error('Erreur lors de la récupération des meilleures ventes:', error);
      throw error;
    }
  }

  // Categories endpoints
  async getCategories(): Promise<any[]> {
    try {
      return await httpService.get<any[]>('/categories');
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      throw error;
    }
  }

  async getCategory(id: string | number): Promise<any> {
    try {
      if (!id) {
        throw new HttpError('ID de la catégorie requis', 400);
      }
      return await httpService.get<any>(`/categories/${id}`);
    } catch (error) {
      console.error(`Erreur lors de la récupération de la catégorie ${id}:`, error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
export default apiService;