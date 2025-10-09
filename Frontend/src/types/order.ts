export interface Order {
  id: number;
  user_id: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: Address;
  billing_address: Address;
  payment_method: string;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
  orderItems?: OrderItem[];
  user?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    images: string[];
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