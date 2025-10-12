import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';

export const useAdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current_page: 1, total: 0, last_page: 1, per_page: 20 });

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
    } catch (error) {
      console.error('Erreur produits:', error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  return { products, loading, pagination, refetch: fetchProducts };
};



export const useAdminInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [stats, setStats] = useState({ total: 0, inStock: 0, lowStock: 0, outOfStock: 0, totalUnits: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const data = await adminService.getInventory();
        setInventory(data.inventory);
        setStats(data.stats);
      } catch (error) {
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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current_page: 1, total: 0, last_page: 1, per_page: 20 });

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
    } catch (error) {
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
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, averageRating: 0 });
  const [loading, setLoading] = useState(true);

  const updateReviewStatus = async (id: number, status: string) => {
    try {
      await adminService.updateReviewStatus(id, status);
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    } catch (error) {
      console.error('Erreur mise à jour avis:', error);
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await adminService.getReviews();
        setReviews(data.reviews);
        setStats(data.stats);
      } catch (error) {
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
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, vip: 0, totalOrders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await adminService.getCustomers();
        setCustomers(data.data || data);
        const total = data.data?.length || 0;
        const active = data.data?.filter(c => c.is_active)?.length || 0;
        setStats({ total, active, vip: 0, totalOrders: 0 });
      } catch (error) {
        console.error('Erreur clients:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  return { customers, stats, loading };
};