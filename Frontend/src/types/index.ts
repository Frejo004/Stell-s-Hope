export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: {
    id: number;
    name: string;
  };
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
  stock_quantity: number;
  sku: string;
  weight?: number;
  dimensions?: string;
  is_active: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
}

export interface Review {
  id: number;
  productId: number;
  userId: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
  };
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  size: string;
  color: string;
  subtotal: number;
}

export interface FilterState {
  category: string[];
  type: string[];
  size: string[];
  color: string[];
  priceRange: [number, number];
  sort: 'newest' | 'price-low' | 'price-high' | 'rating';
}