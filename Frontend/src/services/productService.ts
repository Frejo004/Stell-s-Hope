import { apiService } from './api';
import { Product } from '../types';

export class ProductService {
  async getProducts(filters?: any) {
    try {
      const response = await apiService.getProducts(filters);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProduct(id: number) {
    try {
      return await apiService.getProduct(id);
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  async getFeaturedProducts() {
    try {
      return await apiService.getFeaturedProducts();
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  }

  async getBestsellers() {
    try {
      return await apiService.getBestsellers();
    } catch (error) {
      console.error('Error fetching bestsellers:', error);
      throw error;
    }
  }

  async searchProducts(query: string, filters?: any) {
    try {
      const params = { search: query, ...filters };
      return await this.getProducts(params);
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }
}

export const productService = new ProductService();