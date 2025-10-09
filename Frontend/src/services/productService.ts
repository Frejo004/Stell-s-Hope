import api from './api';
import { Product } from '../types';

export interface ProductFilters {
  category?: number;
  search?: string;
  min_price?: number;
  max_price?: number;
  per_page?: number;
  page?: number;
}

export interface ProductResponse {
  data: Product[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export const productService = {
  getProducts: async (filters?: ProductFilters): Promise<ProductResponse> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await api.get(`/products?${params.toString()}`);
    return response.data;
  },

  getProduct: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    const response = await api.get('/products/featured');
    return response.data;
  },

  getBestsellers: async (): Promise<Product[]> => {
    const response = await api.get('/products/bestsellers');
    return response.data;
  },
  
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  searchProducts: async (query: string, filters?: Omit<ProductFilters, 'search'>): Promise<Product[]> => {
    const params = new URLSearchParams({ q: query });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await api.get(`/products/search?${params.toString()}`);
    return response.data;
  }
};