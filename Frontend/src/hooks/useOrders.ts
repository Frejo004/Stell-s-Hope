import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { Order } from '../types/order';
import { orderService } from '../services/orderService';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchOrders = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const response = await orderService.getOrders();
      // Handle Laravel pagination if necessary
      const ordersData = Array.isArray(response) ? response : (response as any).data || [];
      setOrders(ordersData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: any) => {
    try {
      // Correction #8 : appel réel à l'API au lieu du mock hardcodé
      const newOrder = await orderService.createOrder(orderData);
      await fetchOrders();
      return newOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(order => order.id.toString() === orderId);
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  useEffect(() => {
    fetchOrders();
  }, [isAuthenticated]);

  return { orders, loading, error, createOrder, getOrderById, addOrder, refetch: fetchOrders };
};