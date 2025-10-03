import api from './api';

export const cartService = {
  async getCart() {
    const response = await api.get('/cart');
    return response.data;
  },

  async addToCart(product_id: number, quantity: number) {
    const response = await api.post('/cart/add', { product_id, quantity });
    return response.data;
  },

  async updateCart(product_id: number, quantity: number) {
    const response = await api.put('/cart/update', { product_id, quantity });
    return response.data;
  },

  async removeFromCart(product_id: number) {
    const response = await api.delete('/cart/remove', { data: { product_id } });
    return response.data;
  },

  async clearCart() {
    const response = await api.delete('/cart/clear');
    return response.data;
  }
};