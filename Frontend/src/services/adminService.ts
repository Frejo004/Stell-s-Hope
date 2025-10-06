import api from './api';

export const adminService = {
  // Dashboard
  async getDashboardStats() {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // Products
  async getProducts(page = 1) {
    const response = await api.get(`/admin/products?page=${page}`);
    return response.data;
  },

  async createProduct(data: any) {
    const response = await api.post('/admin/products', data);
    return response.data;
  },

  async updateProduct(id: number, data: any) {
    const response = await api.put(`/admin/products/${id}`, data);
    return response.data;
  },

  async deleteProduct(id: number) {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
  },

  // Orders
  async getOrders(page = 1) {
    const response = await api.get(`/admin/orders?page=${page}`);
    return response.data;
  },

  async updateOrderStatus(id: number, status: string) {
    const response = await api.put(`/admin/orders/${id}/status`, { status });
    return response.data;
  },

  // Customers
  async getCustomers(page = 1) {
    const response = await api.get(`/admin/customers?page=${page}`);
    return response.data;
  },

  // Categories
  async getCategories() {
    const response = await api.get('/admin/categories');
    return response.data;
  },

  async createCategory(data: any) {
    const response = await api.post('/admin/categories', data);
    return response.data;
  },

  // Sidebar Stats
  async getSidebarStats() {
    const response = await api.get('/admin/sidebar-stats');
    return response.data;
  },

  // Inventory
  async getInventory() {
    const response = await api.get('/admin/inventory');
    return response.data;
  },

  async updateStock(id: number, stock: number) {
    const response = await api.put(`/admin/inventory/${id}`, { stock });
    return response.data;
  },

  // Reviews
  async getReviews() {
    const response = await api.get('/admin/reviews');
    return response.data;
  },

  async updateReviewStatus(id: number, status: string) {
    const response = await api.put(`/admin/reviews/${id}/status`, { status });
    return response.data;
  },

  // Analytics
  async getAnalytics(period = '7d') {
    const response = await api.get(`/admin/analytics?period=${period}`);
    return response.data;
  },

  // Promotions
  async getPromotions() {
    const response = await api.get('/admin/promotions');
    return response.data;
  },

  // Support
  async getTickets() {
    const response = await api.get('/admin/tickets');
    return response.data;
  },

  async updateTicketStatus(id: string, status: string) {
    const response = await api.put(`/admin/tickets/${id}/status`, { status });
    return response.data;
  }
};