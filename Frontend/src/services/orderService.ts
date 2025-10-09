import api from './api';
import { Order } from '../types/order';

export interface CreateOrderData {
  shipping_address: {
    first_name: string;
    last_name: string;
    street: string;
    city: string;
    postal_code: string;
    country: string;
  };
  billing_address: {
    first_name: string;
    last_name: string;
    street: string;
    city: string;
    postal_code: string;
    country: string;
  };
  payment_method: string;
}

export const orderService = {
  getOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  createOrder: async (data: CreateOrderData) => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  getOrder: async (id: number) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  trackOrder: async (id: number) => {
    const response = await api.get(`/orders/${id}/track`);
    return response.data;
  },

  cancelOrder: async (id: number) => {
    const response = await api.post(`/orders/${id}/cancel`);
    return response.data;
  }
};