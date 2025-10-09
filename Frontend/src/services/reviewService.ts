import api from './api';

export interface CreateReviewData {
  product_id: number;
  rating: number;
  comment: string;
}

export const reviewService = {
  getReviews: async () => {
    const response = await api.get('/reviews');
    return response.data;
  },

  createReview: async (data: CreateReviewData) => {
    const response = await api.post('/reviews', data);
    return response.data;
  }
};