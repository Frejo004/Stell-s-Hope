import api from './api';
import { CartItem } from '../types';

export interface AddToCartData {
  product_id: number;
  quantity: number;
}

export interface UpdateCartData {
  cart_id: number;
  quantity: number;
}

export const cartService = {
  getCart: async (): Promise<CartItem[]> => {
    const response = await api.get('/cart');
    return response.data;
  },

  addToCart: async (data: AddToCartData) => {
    const response = await api.post('/cart/add', data);
    return response.data;
  },

  updateCart: async (data: UpdateCartData) => {
    const response = await api.put('/cart/update', data);
    return response.data;
  },

  removeFromCart: async (cartId: number) => {
    const response = await api.delete('/cart/remove', { data: { cart_id: cartId } });
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete('/cart/clear');
    return response.data;
  }
};