import { CartItem } from './index';
import { Address } from './auth';

export interface Order {
  id: string;
  items: CartItem[];
  shippingAddress: Address;
  billingAddress: Address;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  paymentMethod: 'card' | 'paypal';
}

export interface CheckoutState {
  step: 'shipping' | 'payment' | 'review';
  shippingAddress: Partial<Address>;
  billingAddress: Partial<Address>;
  paymentMethod: 'card' | 'paypal' | null;
  sameAsShipping: boolean;
}