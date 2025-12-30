import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { Product, Order, Review, User } from '../types';

interface PaginationData {
  current_page: number;
  total: number;
  last_page: number;
  per_page: number;
}

export const useAdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData>({ current_page: 1, total: 0, last_page: 1, per_page: 20 });

  const fetchProducts = async (page = 1, search = '', category = 'all', price = 'all', stock = 'all', status = 'all', showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const data = await adminService.getProducts(page, search, category, price, stock, status);
      setProducts(data.data || data);
      setPagination({
        current_page: data.current_page || 1,
        total: data.total || 0,
        last_page: data.last_page || 1,
        per_page: data.per_page || 20
      });
    } catch (error: any) {
      console.error('Erreur produits:', error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  return { products, loading, pagination, refetch: fetchProducts };
};



export const useAdminInventory = () => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, inStock: 0, lowStock: 0, outOfStock: 0, totalUnits: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const data = await adminService.getInventory();
        setInventory(data.inventory);
        setStats(data.stats);
      } catch (error: any) {
        console.error('Erreur inventaire:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  return { inventory, stats, loading };
};

export const useAdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData>({ current_page: 1, total: 0, last_page: 1, per_page: 20 });

  const fetchOrders = async (page = 1, search = '', status = 'all', showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const data = await adminService.getOrders(page, search, status);
      console.log('Données commandes reçues:', data);
      console.log('Premier ordre:', data.data?.[0]);
      setOrders(data.data || data);
      setPagination({
        current_page: data.current_page || 1,
        total: data.total || 0,
        last_page: data.last_page || 1,
        per_page: data.per_page || 20
      });
    } catch (error: any) {
      console.error('Erreur commandes:', error);
      console.error('Détails erreur:', error.response?.data);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  return { orders, loading, pagination, refetch: fetchOrders };
};

export const useAdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, averageRating: 0 });
  const [loading, setLoading] = useState(true);

  const updateReviewStatus = async (id: number, status: string) => {
    try {
      await adminService.updateReviewStatus(id, status);
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status: status as any } : r));
    } catch (error: any) {
      console.error('Erreur mise à jour avis:', error);
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await adminService.getReviews();
        setReviews(data.reviews);
        setStats(data.stats);
      } catch (error: any) {
        console.error('Erreur avis:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return { reviews, stats, loading, updateReviewStatus };
};

export const useAdminCustomers = () => {
  const [customers, setCustomers] = useState<(User & { orders_count?: number, total_spent?: number })[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, vip: 0, totalOrders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await adminService.getCustomers();
        const customersData = data.data || data;
        setCustomers(customersData);
        const total = data.total || customersData?.length || 0;
        const active = customersData?.filter((c: any) => c.is_active)?.length || 0;
        const totalOrders = customersData?.reduce((sum: number, c: any) => sum + (c.orders_count || 0), 0) || 0;
        setStats({ total, active, vip: 0, totalOrders });
      } catch (error: any) {
        console.error('Erreur clients:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  return { customers, stats, loading };
};