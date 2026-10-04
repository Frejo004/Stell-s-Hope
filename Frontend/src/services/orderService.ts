import api from './api';
import { Order } from '../types';

interface OrderTracking {
  order_id: number;
  status: Order['status'];
  created_at: string;
  tracking_number: string | null;
}

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
  promotion_code?: string;
  items?: {
    product_id: number;
    quantity: number;
  }[];
}

export const orderService = {
  getOrders: async (): Promise<Order[]> => {
    const response = await api.get('/orders');
    return response.data;
  },

  createOrder: async (data: CreateOrderData, idempotencyKey?: string): Promise<Order> => {
    const config = idempotencyKey ? { headers: { 'Idempotency-Key': idempotencyKey } } : {};
    const response = await api.post('/orders', data, config);
    return response.data.order;
  },

  getOrder: async (id: number | string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  trackOrder: async (id: number | string): Promise<OrderTracking> => {
    const response = await api.get(`/orders/${id}/track`);
    return response.data;
  },

  cancelOrder: async (id: number | string): Promise<Order> => {
    const response = await api.post(`/orders/${id}/cancel`);
    return response.data;
  },

  // Suivi public par numéro de commande + email (sans authentification)
  trackOrderPublic: async (orderNumber: string, email: string): Promise<Order> => {
    const response = await api.get('/orders/track-public', {
      params: { order_number: orderNumber, email }
    });
    return response.data;
  }
};
