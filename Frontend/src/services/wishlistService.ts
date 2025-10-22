import api from './api';

export const getWishlist = async () => {
  const response = await api.get('/wishlist');
  return response.data;
};

export const addToWishlist = async (productId: number) => {
  const response = await api.post('/wishlist', { product_id: productId });
  return response.data;
};

export const removeFromWishlist = async (productId: number) => {
  const response = await api.delete(`/wishlist/${productId}`);
  return response.data;
};

export const toggleWishlist = async (productId: number) => {
  const response = await api.post('/wishlist/toggle', { product_id: productId });
  return response.data;
};

export const wishlistService = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist
};