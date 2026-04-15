// Correction #16 & #17 : fichier de types unifié — suppression des doublons

export interface Address {
  id?: number;
  first_name: string;
  last_name: string;
  street: string;
  city: string;
  postal_code: string;
  country: string;
  type?: 'billing' | 'shipping';
  is_default?: boolean;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  is_admin: boolean;
  is_active: boolean;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
  is_active: boolean;
  products_count?: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock_quantity: number;
  category_id: number;
  images: string[];
  sku: string;
  weight?: number;
  dimensions?: string;
  is_active: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  rating?: number;
  reviewCount?: number;
  colors?: string[];
  sizes?: string[];
  composition?: string;
  care?: string;
  type?: string;
  created_at: string;
  updated_at: string;
  category: Category;
  reviews?: Review[];
}

export interface Review {
  id: number;
  product_id: number;
  product?: { name: string };
  user_id: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
  };
  customer?: string;
  customerName?: string;
  customerSize?: string;
  customerHeight?: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
  date?: string;
  updated_at: string;
  status?: 'approved' | 'pending' | 'rejected';
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  size: string;
  color: string;
  subtotal: number;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
  product: {
    id: number;
    name: string;
    images: string[];
    price?: number;
  };
}

export interface Order {
  id: number;
  user_id: number;
  order_number?: string;
  /** Champ DB actuel après migration rename */
  total: number;
  subtotal?: number;
  shipping?: number;
  tax?: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: Address;
  billing_address: Address;
  payment_method: string;
  payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
  tracking_number?: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
  items?: OrderItem[];
  user?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    address?: string;
    city?: string;
    postal_code?: string;
    country?: string;
  };
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}
