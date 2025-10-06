import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';

export const useAdminAnalytics = (period = '7d') => {
  const [analytics, setAnalytics] = useState({
    metrics: { revenue: 0, orders: 0, customers: 0, conversion: 0 },
    salesChart: [],
    topProducts: [],
    trafficSources: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await adminService.getAnalytics(period);
        setAnalytics(data);
      } catch (error) {
        console.error('Erreur analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [period]);

  return { analytics, loading };
};

export const useAdminPromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, used: 0, usageRate: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const data = await adminService.getPromotions();
        setPromotions(data.promotions);
        setStats(data.stats);
      } catch (error) {
        console.error('Erreur promotions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  return { promotions, stats, loading };
};

export const useAdminSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ total: 0, open: 0, pending: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);

  const updateTicketStatus = async (id: string, status: string) => {
    try {
      await adminService.updateTicketStatus(id, status);
      setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    } catch (error) {
      console.error('Erreur mise à jour ticket:', error);
    }
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await adminService.getTickets();
        setTickets(data.tickets);
        setStats(data.stats);
      } catch (error) {
        console.error('Erreur tickets:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  return { tickets, stats, loading, updateTicketStatus };
};