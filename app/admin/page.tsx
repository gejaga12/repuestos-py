'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/lib/types';
import { 
  BarChart3, 
  Users, 
  Package, 
  Clock,
  CheckCircle,
  XCircle 
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    pendingProducts: 0,
    publishedProducts: 0,
    rejectedProducts: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch products stats
        const productsRef = collection(db, 'products');
        const productsSnap = await getDocs(productsRef);
        const products = productsSnap.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })) as Product[];

        // Fetch users stats
        const usersRef = collection(db, 'users');
        const usersSnap = await getDocs(usersRef);

        setStats({
          totalProducts: products.length,
          pendingProducts: products.filter(p => p.status === 'pending').length,
          publishedProducts: products.filter(p => p.status === 'published').length,
          rejectedProducts: products.filter(p => p.status === 'rejected').length,
          totalUsers: usersSnap.size,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }: { 
    title: string; 
    value: number; 
    icon: any;
    color: string;
  }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Productos"
          value={stats.totalProducts}
          icon={Package}
          color="bg-blue-500"
        />
        <StatCard
          title="Usuarios Registrados"
          value={stats.totalUsers}
          icon={Users}
          color="bg-green-500"
        />
        <StatCard
          title="Productos Pendientes"
          value={stats.pendingProducts}
          icon={Clock}
          color="bg-yellow-500"
        />
        <StatCard
          title="Productos Publicados"
          value={stats.publishedProducts}
          icon={CheckCircle}
          color="bg-green-500"
        />
        <StatCard
          title="Productos Rechazados"
          value={stats.rejectedProducts}
          icon={XCircle}
          color="bg-red-500"
        />
      </div>

      {/* Add more dashboard components here */}
    </div>
  );
}