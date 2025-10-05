import api from './api';
import { CartItem } from '../types';

export interface CartResponse {
  items: CartItem[];
  total: number;
  count: number;
}

export interface AddToCartData {
  product_id: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface UpdateCartData {
  product_id: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface RemoveFromCartData {
  product_id: number;
  size?: string;
  color?: string;
}

export const cartService = {
  async getCart(): Promise<CartResponse> {
    const response = await api.get('/cart');
    return response.data;
  },

  async addToCart(data: AddToCartData) {
    const response = await api.post('/cart/add', data);
    return response.data;
  },

  async updateCart(data: UpdateCartData) {
    const response = await api.put('/cart/update', data);
    return response.data;
  },

  async removeFromCart(data: RemoveFromCartData) {
    const response = await api.delete('/cart/remove', { data });
    return response.data;
  },

  async clearCart() {
    const response = await api.delete('/cart/clear');
    return response.data;
  }
};