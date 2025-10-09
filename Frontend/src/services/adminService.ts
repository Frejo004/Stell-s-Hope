import api from './api';

export const adminService = {
  // Dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // Analytics
  getRevenueAnalytics: async () => {
    const response = await api.get('/admin/analytics/revenue');
    return response.data;
  },

  getProductAnalytics: async () => {
    const response = await api.get('/admin/analytics/products');
    return response.data;
  },

  getCustomerAnalytics: async () => {
    const response = await api.get('/admin/analytics/customers');
    return response.data;
  },

  // Products management
  getProducts: async (page = 1) => {
    const response = await api.get(`/admin/products?page=${page}`);
    return response.data;
  },

  createProduct: async (productData: any) => {
    const response = await api.post('/admin/products', productData);
    return response.data;
  },

  updateProduct: async (id: number, productData: any) => {
    const response = await api.put(`/admin/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id: number) => {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
  },

  updateProductStatus: async (id: number, status: boolean) => {
    const response = await api.put(`/admin/products/${id}/status`, { is_active: status });
    return response.data;
  },

  // Orders management
  getOrders: async (page = 1) => {
    const response = await api.get(`/admin/orders?page=${page}`);
    return response.data;
  },

  getOrderStats: async () => {
    const response = await api.get('/admin/orders/stats');
    return response.data;
  },

  updateOrderStatus: async (id: number, status: string) => {
    const response = await api.put(`/admin/orders/${id}/status`, { status });
    return response.data;
  },

  // Customers management
  getCustomers: async (page = 1) => {
    const response = await api.get(`/admin/customers/detailed?page=${page}`);
    return response.data;
  },

  getCustomerStats: async () => {
    const response = await api.get('/admin/customers/stats');
    return response.data;
  },

  updateCustomerStatus: async (id: number, status: boolean) => {
    const response = await api.put(`/admin/customers/${id}/status`, { is_active: status });
    return response.data;
  },

  // Categories
  getCategories: async () => {
    const response = await api.get('/admin/categories');
    return response.data;
  },

  createCategory: async (categoryData: any) => {
    const response = await api.post('/admin/categories', categoryData);
    return response.data;
  },

  updateCategory: async (id: number, categoryData: any) => {
    const response = await api.put(`/admin/categories/${id}`, categoryData);
    return response.data;
  },

  deleteCategory: async (id: number) => {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
  },

  // Inventory
  getInventory: async () => {
    const response = await api.get('/admin/inventory');
    return response.data;
  },

  updateStock: async (productId: number, stock: number) => {
    const response = await api.put(`/admin/inventory/${productId}`, { stock_quantity: stock });
    return response.data;
  },

  // Reviews
  getReviews: async () => {
    const response = await api.get('/admin/reviews');
    return response.data;
  },

  updateReviewStatus: async (id: number, status: string) => {
    const response = await api.put(`/admin/reviews/${id}/status`, { status });
    return response.data;
  },

  // Support tickets
  getTickets: async () => {
    const response = await api.get('/admin/tickets/list');
    return response.data;
  },

  getTicketStats: async () => {
    const response = await api.get('/admin/tickets/stats');
    return response.data;
  },

  updateTicketStatus: async (id: number, status: string) => {
    const response = await api.put(`/admin/tickets/${id}/status`, { status });
    return response.data;
  },

  // Promotions
  getPromotions: async () => {
    const response = await api.get('/admin/promotions');
    return response.data;
  },

  createPromotion: async (promotionData: any) => {
    const response = await api.post('/admin/promotions', promotionData);
    return response.data;
  },

  updatePromotion: async (id: number, promotionData: any) => {
    const response = await api.put(`/admin/promotions/${id}`, promotionData);
    return response.data;
  },

  deletePromotion: async (id: number) => {
    const response = await api.delete(`/admin/promotions/${id}`);
    return response.data;
  },

  // Sidebar stats
  getSidebarStats: async () => {
    const response = await api.get('/admin/sidebar-stats');
    return response.data;
  }
};