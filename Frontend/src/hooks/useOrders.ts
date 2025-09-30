import { useState, useEffect } from 'react';
import { Order } from '../types/order';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error('Erreur parsing orders:', error);
        localStorage.removeItem('orders');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const getOrderById = (id: string) => {
    return orders.find(order => order.id === id);
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === id ? { ...order, status } : order
      )
    );
  };

  return {
    orders,
    addOrder,
    getOrderById,
    updateOrderStatus
  };
};