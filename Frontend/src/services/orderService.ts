import api from './api';

export interface OrderData {
  items: Array<{
    product_id: number;
    quantity: number;
  }>;
  shipping_address: string;
  billing_address: string;
  payment_method: string;
}

export const orderService = {
  async getOrders(page = 1) {
    const response = await api.get('/orders', { params: { page } });
    return response.data;
  },

  async getOrder(id: number) {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  async createOrder(data: OrderData) {
    const response = await api.post('/orders', data);
    return response.data;
  },

  async trackOrder(id: number) {
    const response = await api.get(`/orders/${id}/track`);
    return response.data;
  },

  async cancelOrder(id: number) {
    const response = await api.post(`/orders/${id}/cancel`);
    return response.data;
  }
};