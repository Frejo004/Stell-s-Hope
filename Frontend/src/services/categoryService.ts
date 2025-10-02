import { apiService } from './api';

export class CategoryService {
  async getCategories() {
    try {
      return await apiService.getCategories();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async getCategory(id: number) {
    try {
      return await apiService.getCategory(id);
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  }
}

export const categoryService = new CategoryService();