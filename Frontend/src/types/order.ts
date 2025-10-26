export interface Order {
  id: number;
  user_id: number;
  total: number;
  total_amount?: number;
  subtotal?: number;
  shipping?: number;
  tax?: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: Address;
  billing_address: Address;
  payment_method: string;
  tracking_number?: string;
  order_number?: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
  orderItems?: OrderItem[];
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
    price: number;
  };
}

export interface Address {
  first_name: string;
  last_name: string;
  street: string;
  city: string;
  postal_code: string;
  country: string;
}