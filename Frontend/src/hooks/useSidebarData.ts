import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';

interface SidebarStats {
  orders: number;
  low_stock: number;
  pending_reviews: number;
  support_tickets: number;
}

export const useSidebarData = () => {
  const [stats, setStats] = useState<SidebarStats>({
    orders: 0,
    low_stock: 0,
    pending_reviews: 0,
    support_tickets: 0
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