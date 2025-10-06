import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';

interface SidebarStats {
  notifications: number;
  messages: number;
  pendingOrders: number;
  lowStock: number;
  pendingReviews: number;
  supportTickets: number;
}

export const useSidebarData = () => {
  const [stats, setStats] = useState<SidebarStats>({
    notifications: 0,
    messages: 0,
    pendingOrders: 0,
    lowStock: 0,
    pendingReviews: 0,
    supportTickets: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSidebarStats = async () => {
      try {
        const data = await adminService.getSidebarStats();
        setStats(data);
      } catch (error) {
        console.error('Erreur chargement sidebar:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSidebarStats();
    
    // Mise à jour toutes les 30 secondes
    const interval = setInterval(fetchSidebarStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return { stats, loading };
};