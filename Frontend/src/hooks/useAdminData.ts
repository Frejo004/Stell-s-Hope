import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';

export const useAdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current_page: 1, total: 0 });

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const data = await adminService.getProducts(page);
      setProducts(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Erreur produits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  return { products, loading, pagination, refetch: fetchProducts };
};

export const useAdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, vip: 0, totalOrders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await adminService.getCustomers();
        setCustomers(data.customers);
        setStats(data.stats);
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