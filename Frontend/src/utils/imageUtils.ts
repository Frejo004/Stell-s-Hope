const API_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8000';
const BASE_URL = API_URL;

const decodeHtmlEntities = (str: string): string => {
  return str.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
};

export const getImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
  }

  // Décoder les entités HTML
  const cleanPath = decodeHtmlEntities(imagePath);
  console.log('getImageUrl - Input:', imagePath, 'Clean:', cleanPath, 'BASE_URL:', BASE_URL);

  // Si l'URL commence déjà par http, la retourner telle quelle
  if (cleanPath.startsWith('http')) {
    console.log('getImageUrl - Returning HTTP URL:', cleanPath);
    return cleanPath;
  }

  // Si l'URL commence par /storage, construire l'URL complète
  if (cleanPath.startsWith('/storage')) {
    const fullUrl = `${BASE_URL}${cleanPath}`;
    console.log('getImageUrl - Returning full URL:', fullUrl);
    return fullUrl;
  }

  // Sinon, ajouter /storage/ au début
  const storageUrl = `${BASE_URL}/storage/${cleanPath}`;
  console.log('getImageUrl - Returning storage URL:', storageUrl);
  return storageUrl;
};

export const getProductImageUrl = (product: any): string => {
  if (!product.images || !Array.isArray(product.images) || product.images.length === 0) {
    return getImageUrl(undefined);
  }

  return getImageUrl(product.images[0]);
};