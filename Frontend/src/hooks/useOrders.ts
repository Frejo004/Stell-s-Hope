import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { Order } from '../types/order';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchOrders = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      // Mock data for now
      setOrders([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: any) => {
    try {
      // Mock implementation
      const newOrder = { id: 'CMD123', ...orderData } as Order;
      await fetchOrders();
      return newOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId);
  };

  useEffect(() => {
    fetchOrders();
  }, [isAuthenticated]);

  return { orders, loading, error, createOrder, getOrderById, refetch: fetchOrders };
};