import api from './api';

export interface ReviewData {
  product_id: number;
  rating: number;
  comment?: string;
}

export const reviewService = {
  async getMyReviews() {
    const response = await api.get('/reviews');
    return response.data;
  },

  async createReview(data: ReviewData) {
    const response = await api.post('/reviews', data);
    return response.data;
  }
};