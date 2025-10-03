import api from './api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}

export const authService = {
  async login(data: LoginData) {
    const response = await api.post('/login', data);
    const { user, token } = response.data;
    
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { user, token };
  },

  async register(data: RegisterData) {
    const response = await api.post('/register', data);
    const { user, token } = response.data;
    
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { user, token };
  },

  async logout() {
    try {
      await api.post('/logout');
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  },

  async getMe() {
    const response = await api.get('/me');
    return response.data;
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem('auth_token');
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  isAdmin() {
    const user = this.getUser();
    return user?.is_admin || false;
  }
};