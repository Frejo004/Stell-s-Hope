import api from './api';

export const fileService = {
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  deleteFile: async (path: string) => {
    const response = await api.delete('/files/delete', { data: { path } });
    return response.data;
  },

  getImageUrl: (path: string) => {
    return `${import.meta.env.VITE_API_BASE_URL}/images/${path}`;
  }
};