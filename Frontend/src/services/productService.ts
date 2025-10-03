import { apiService } from './api';

export const productService = {
  getProducts: async () => {
    const response = await apiService.get('/products');
    return response.data;
  },

  getProduct: async (id: string) => {
    const response = await apiService.get(`/products/${id}`);
    return response.data;
  },

  getProductsByCategory: async (category: string) => {
    const response = await apiService.get(`/products?category=${category}`);
    return response.data;
  },

  getFeaturedProducts: async () => {
    const response = await apiService.get('/products/featured');
    return response.data;
  },

  getBestsellers: async () => {
    const response = await apiService.get('/products/bestsellers');
    return response.data;
  },

  getCategories: async () => {
    const response = await apiService.get('/categories');
    return response.data;
  }
};