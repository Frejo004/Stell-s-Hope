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

export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
}

export interface UpdatePasswordData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
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
  },

  async updateProfile(data: UpdateProfileData) {
    const response = await api.put('/profile', data);
    const user = response.data;
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  async updatePassword(data: UpdatePasswordData) {
    const response = await api.put('/password', data);
    return response.data;
  },

  async forgotPassword(data: ForgotPasswordData) {
    const response = await api.post('/forgot-password', data);
    return response.data;
  },

  async resetPassword(data: ResetPasswordData) {
    const response = await api.post('/reset-password', data);
    return response.data;
  }
};