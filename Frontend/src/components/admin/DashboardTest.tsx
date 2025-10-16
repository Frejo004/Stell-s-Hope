import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';

export default function DashboardTest() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await adminService.getDashboardStats();
        setData(result);
        console.log('Dashboard data:', result);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Test des données dynamiques</h2>
      
      <div className="space-y-4">
        <div className="bg-white p-4 rounded border">
          <h3 className="font-semibold">Stats principales:</h3>
          <pre className="text-sm">{JSON.stringify(data?.stats, null, 2)}</pre>
        </div>
        
        <div className="bg-white p-4 rounded border">
          <h3 className="font-semibold">Stats rapides:</h3>
          <pre className="text-sm">{JSON.stringify(data?.quick_stats, null, 2)}</pre>
        </div>
        
        <div className="bg-white p-4 rounded border">
          <h3 className="font-semibold">Métriques temps réel:</h3>
          <pre className="text-sm">{JSON.stringify(data?.live_metrics, null, 2)}</pre>
        </div>
        
        <div className="bg-white p-4 rounded border">
          <h3 className="font-semibold">Revenus mensuels:</h3>
          <pre className="text-sm">{JSON.stringify(data?.monthly_revenue, null, 2)}</pre>
        </div>
        
        <div className="bg-white p-4 rounded border">
          <h3 className="font-semibold">Activité récente:</h3>
          <pre className="text-sm">{JSON.stringify(data?.recent_activity, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}