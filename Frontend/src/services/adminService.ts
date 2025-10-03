import api from './api';

export const adminService = {
  // Dashboard
  async getDashboard() {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // Products
  async getAdminProducts(params?: any) {
    const response = await api.get('/admin/products', { params });
    return response.data;
  },

  async createProduct(data: FormData) {
    const response = await api.post('/admin/products', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async updateProduct(id: number, data: FormData) {
    const response = await api.put(`/admin/products/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async deleteProduct(id: number) {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
  },

  // Orders
  async getAdminOrders(params?: any) {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },

  async updateOrderStatus(id: number, status: string) {
    const response = await api.put(`/admin/orders/${id}/status`, { status });
    return response.data;
  },

  async getOrderStats() {
    const response = await api.get('/admin/orders/stats');
    return response.data;
  },

  // Customers
  async getCustomers(params?: any) {
    const response = await api.get('/admin/customers', { params });
    return response.data;
  },

  async getCustomer(id: number) {
    const response = await api.get(`/admin/customers/${id}`);
    return response.data;
  },

  async getCustomerStats() {
    const response = await api.get('/admin/customers/stats');
    return response.data;
  },

  // Promotions
  async getPromotions() {
    const response = await api.get('/admin/promotions');
    return response.data;
  },

  async createPromotion(data: any) {
    const response = await api.post('/admin/promotions', data);
    return response.data;
  },

  async updatePromotion(id: number, data: any) {
    const response = await api.put(`/admin/promotions/${id}`, data);
    return response.data;
  },

  async deletePromotion(id: number) {
    const response = await api.delete(`/admin/promotions/${id}`);
    return response.data;
  },

  // Tickets
  async getAdminTickets(params?: any) {
    const response = await api.get('/admin/tickets', { params });
    return response.data;
  },

  async updateTicket(id: number, data: any) {
    const response = await api.put(`/admin/tickets/${id}`, data);
    return response.data;
  },

  async getTicketStats() {
    const response = await api.get('/admin/tickets/stats');
    return response.data;
  }
};