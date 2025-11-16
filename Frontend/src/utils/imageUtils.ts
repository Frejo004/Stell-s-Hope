const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const BASE_URL = API_BASE_URL.replace('/api', '');

export const getImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
  }

  // Si l'URL commence déjà par http, la retourner telle quelle
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // Si l'URL commence par /storage, construire l'URL complète
  if (imagePath.startsWith('/storage')) {
    return `${BASE_URL}${imagePath}`;
  }

  // Sinon, ajouter /storage/ au début
  return `${BASE_URL}/storage/${imagePath}`;
};

export const getProductImageUrl = (product: any): string => {
  if (!product.images || !Array.isArray(product.images) || product.images.length === 0) {
    return getImageUrl(undefined);
  }

  return getImageUrl(product.images[0]);
};