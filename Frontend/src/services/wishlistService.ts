import api from './api';

export const wishlistService = {
  getWishlist: async () => {
    const response = await api.get('/wishlist');
    return response.data;
  },

  toggleWishlist: async (productId: number) => {
    const response = await api.post('/wishlist/toggle', { product_id: productId });
    return response.data;
  }
};