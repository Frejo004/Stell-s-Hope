export interface CheckoutState {
  step: 'shipping' | 'payment' | 'review';
  shippingAddress: Partial<{
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    email?: string;
  }>;
  billingAddress: Partial<{
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    email?: string;
  }>;
  paymentMethod: string | null;
  sameAsShipping: boolean;
}
