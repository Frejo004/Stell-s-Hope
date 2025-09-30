export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: 'homme' | 'femme' | 'unisexe';
  type: 'hauts' | 'bas' | 'accessoires';
  sizes: string[];
  colors: string[];
  description: string;
  composition: string;
  care: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isOnSale?: boolean;
  isBestSeller?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  hasPhoto: boolean;
  photoUrl?: string;
  customerSize: string;
  customerHeight: string;
}

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export interface FilterState {
  category: string[];
  type: string[];
  size: string[];
  color: string[];
  priceRange: [number, number];
  sort: 'newest' | 'price-low' | 'price-high' | 'rating';
}