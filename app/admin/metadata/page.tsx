"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSidebarData, updateCategory, deleteCategory, updateSeries, deleteSeries } from '@/lib/api';
import { CategoryResponseDto, SeriesResponseDto } from '@/types';
import { Edit, Trash2, Layers, List, Loader2 } from 'lucide-react';

export default function MetadataPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'categories' | 'series'>('categories');
  const [categories, setCategories] = useState<CategoryResponseDto[]>([]);
  const [series, setSeries] = useState<SeriesResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getSidebarData();
      setCategories(data.categories);
      setSeries(data.series);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = async (id: number, currentName: string, type: 'category' | 'series') => {
    const token = localStorage.getItem('accessToken');
    if (!token) return router.replace('/login');

    const newName = prompt(`새로운 ${type === 'category' ? '카테고리' : '시리즈'} 이름을 입력하세요:`, currentName);
    if (!newName || newName === currentName) return;

    try {
      if (type === 'category') {
        await updateCategory(id, newName, token);
      } else {
        await updateSeries(id, newName, token);
      }
      alert('수정되었습니다.');
      fetchData();
    } catch (error) {
      alert('수정 실패: 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (id: number, count: number, type: 'category' | 'series') => {
    const token = localStorage.getItem('accessToken');
    if (!token) return router.replace('/login');

    if (count > 0) {
      alert(`게시글이 포함된 ${type === 'category' ? '카테고리' : '시리즈'}는 삭제할 수 없습니다.`);
      return;
    }

    if (!confirm(`정말 이 ${type === 'category' ? '카테고리' : '시리즈'}를 삭제하시겠습니까?`)) return;

    try {
      if (type === 'category') {
        await deleteCategory(id, token);
      } else {
        await deleteSeries(id, token);
      }
      alert('삭제되었습니다.');
      fetchData();
    } catch (error: any) {
      alert(`삭제 실패: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Metadata Management</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">카테고리와 시리즈의 이름을 수정하거나 삭제합니다.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 pb-1">
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'categories'
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
              : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          <Layers size={16} /> Categories
        </button>
        <button
          onClick={() => setActiveTab('series')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'series'
              ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
              : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          <List size={16} /> Series
        </button>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 flex items-center justify-center gap-2">
            <Loader2 size={20} className="animate-spin" /> Loading...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                  <th className="px-6 py-4 font-semibold w-20">ID</th>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold w-32 text-center">Count</th>
                  <th className="px-6 py-4 font-semibold text-right w-40">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {(activeTab === 'categories' ? categories : series).map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 text-gray-400 font-mono text-sm">{item.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{item.name}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-full text-xs font-bold text-gray-600 dark:text-gray-300">
                        {item.count} posts
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(item.id, item.name, activeTab === 'categories' ? 'category' : 'series')}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          title="Rename"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.count, activeTab === 'categories' ? 'category' : 'series')}
                          className={`p-2 rounded-lg transition-colors ${
                            item.count > 0
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30'
                          }`}
                          title={item.count > 0 ? "Cannot delete (Has posts)" : "Delete"}
                          disabled={item.count > 0}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(activeTab === 'categories' ? categories : series).length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      데이터가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}