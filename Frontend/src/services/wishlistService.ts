import api from './api';

export const wishlistService = {
  async getWishlist() {
    const response = await api.get('/wishlist');
    return response.data;
  },

  async toggleWishlist(product_id: number) {
    const response = await api.post('/wishlist/toggle', { product_id });
    return response.data;
  }
};