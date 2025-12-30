import api from './api';
import { Order } from '../types';

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
  items?: {
    product_id: number;
    quantity: number;
    price: number;
  }[];
}

export const orderService = {
  getOrders: async (): Promise<Order[]> => {
    const response = await api.get('/orders');
    return response.data;
  },

  createOrder: async (data: CreateOrderData): Promise<Order> => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  getOrder: async (id: number | string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  trackOrder: async (id: number | string): Promise<any> => {
    const response = await api.get(`/orders/${id}/track`);
    return response.data;
  },

  cancelOrder: async (id: number | string): Promise<Order> => {
    const response = await api.post(`/orders/${id}/cancel`);
    return response.data;
  }
};