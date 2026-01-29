"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDashboardStats, getSystemHealth } from '@/lib/api';
import { DashboardStatsDto } from '@/types';
import { BarChart3, Eye, FileText, Layers, List, Server } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStatsDto | null>(null);
  const [health, setHealth] = useState<string>('CHECKING');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      router.replace('/login');
      return;
    }

    getDashboardStats(token)
      .then(setStats)
      .catch(err => {
        console.error("Dashboard API Error (Using Fallback Data):", err);
        setStats({
          totalPosts: 0,
          totalViews: 0,
          todayPosts: 0,
          totalCategories: 0,
          totalSeries: 0
        });
      });

    getSystemHealth(token)
      .then(setHealth)
      .catch(() => setHealth('DOWN'));

  }, [router]);

  if (!stats) return (
    <div className="flex items-center justify-center h-96">
      <div className="text-gray-500 flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <span>Loading Dashboard...</span>
      </div>
    </div>
  );

  const cards = [
    { label: 'Total Posts', value: stats.totalPosts, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
    { label: 'Today Posts', value: stats.todayPosts, icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { label: 'Categories', value: stats.totalCategories, icon: Layers, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
    { label: 'Series', value: stats.totalSeries, icon: List, color: 'text-pink-600', bg: 'bg-pink-100 dark:bg-pink-900/30' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">블로그 현황을 한눈에 확인하세요.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-xl ${card.bg} ${card.color}`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.label}</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white">{card.value}</p>
            </div>
          </div>
        ))}

        {/* System Health Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-xl ${health === 'UP' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
              <Server size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Server Status</p>
              <p className={`text-2xl font-black ${health === 'UP' ? 'text-emerald-600' : 'text-red-600'}`}>
                {health}
              </p>
            </div>
        </div>
      </div>
    </div>
  );
}