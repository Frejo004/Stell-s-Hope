import api from './api';
import { CartItem } from '../types';

export interface AddToCartData {
  product_id?: number;
  productId?: number;
  quantity: number;
}

export interface UpdateCartData {
  cart_id?: number;
  productId?: number;
  quantity: number;
}

export interface RemoveFromCartData {
  cart_id?: number;
  productId?: number;
}

export const cartService = {
  getCart: async (): Promise<{ items: CartItem[]; total: number; count: number }> => {
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

  removeFromCart: async (data: RemoveFromCartData) => {
    const response = await api.delete('/cart/remove', { data });
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete('/cart/clear');
    return response.data;
  }
};