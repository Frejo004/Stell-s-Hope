const API_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8000';
const BASE_URL = API_URL;

const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjY2NjIiLz48dGV4dCB4PSI1MCUiIHk9IjI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';

const decodeHtmlEntities = (str: string): string => {
  return str.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
};

const urlCache = new Map<string, string>();

export const getImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) {
    return PLACEHOLDER_IMAGE;
  }

  const cached = urlCache.get(imagePath);
  if (cached) {
    return cached;
  }

  // Décoder les entités HTML
  const cleanPath = decodeHtmlEntities(imagePath);
  let url: string;

  // Si l'URL commence déjà par http, la retourner telle quelle
  if (cleanPath.startsWith('http')) {
    url = cleanPath;
  } else if (cleanPath.startsWith('/storage')) {
    url = `${BASE_URL}${cleanPath}`;
  } else {
    url = `${BASE_URL}/storage/${cleanPath}`;
  }

  urlCache.set(imagePath, url);
  return url;
};

export const getProductImageUrl = (product: { images?: string[] }): string => {
  if (!product.images || !Array.isArray(product.images) || product.images.length === 0) {
    return PLACEHOLDER_IMAGE;
  }

  return getImageUrl(product.images[0]);
};