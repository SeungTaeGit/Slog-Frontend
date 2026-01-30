"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSidebarData, updateCategory, deleteCategory, updateSeries, deleteSeries } from '@/lib/api';
import { CategoryResponseDto, SeriesResponseDto } from '@/types';
import { Edit, Trash2, Layers, List, Loader2, AlertCircle } from 'lucide-react';

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
    if (!id) return alert("ID가 없어 수정할 수 없습니다.");
    const token = localStorage.getItem('accessToken');
    if (!token) return router.replace('/login');

    const newName = prompt(`새로운 이름을 입력하세요:`, currentName);
    if (!newName || newName === currentName) return;

    try {
      if (type === 'category') await updateCategory(id, newName, token);
      else await updateSeries(id, newName, token);
      alert('수정되었습니다.');
      fetchData();
    } catch (error) {
      alert('오류가 발생했습니다.');
    }
  };

  const handleDelete = async (id: number, count: number, type: 'category' | 'series') => {
    if (!id) return alert("ID가 없어 삭제할 수 없습니다.");
    const token = localStorage.getItem('accessToken');
    if (!token) return router.replace('/login');

    if (count > 0) return alert(`게시글이 있는 항목은 삭제할 수 없습니다.`);
    if (!confirm(`정말 삭제하시겠습니까?`)) return;

    try {
      if (type === 'category') await deleteCategory(id, token);
      else await deleteSeries(id, token);
      alert('삭제되었습니다.');
      fetchData();
    } catch (error: any) {
      alert(`삭제 실패: ${error.message}`);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Metadata</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">카테고리와 시리즈를 정리합니다.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200/50 dark:border-gray-700/50 pb-1">
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'categories'
              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300'
              : 'text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50'
          }`}
        >
          <Layers size={18} /> Categories
        </button>
        <button
          onClick={() => setActiveTab('series')}
          className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'series'
              ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300'
              : 'text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50'
          }`}
        >
          <List size={18} /> Series
        </button>
      </div>

      {/* Content */}
      <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-[2rem] border border-white/50 dark:border-gray-700/50 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex h-full items-center justify-center gap-2 text-gray-400 p-20">
            <Loader2 size={24} className="animate-spin" /> Loading...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100/50 dark:border-gray-700/50 text-xs font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider">
                  <th className="px-8 py-5 w-20">ID</th>
                  <th className="px-8 py-5">Name</th>
                  <th className="px-8 py-5 w-32 text-center">Count</th>
                  <th className="px-8 py-5 text-right w-40">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(activeTab === 'categories' ? categories : series).map((item, index) => (
                  <tr key={item.id || `fallback-${index}`} className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors border-b border-gray-100/50 dark:border-gray-800/50 last:border-none">
                    <td className="px-8 py-5 text-gray-300 font-mono text-xs">
                        {item.id ?? <AlertCircle size={14} className="text-red-300"/>}
                    </td>
                    <td className="px-8 py-5 font-bold text-gray-700 dark:text-gray-200 text-base">{item.name}</td>
                    <td className="px-8 py-5 text-center">
                      <span className="bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 px-3 py-1 rounded-lg text-xs font-bold text-gray-500 dark:text-gray-300 shadow-sm">
                        {item.count}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(item.id, item.name, activeTab === 'categories' ? 'category' : 'series')}
                          className="p-2 text-gray-400 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 rounded-xl transition-all shadow-sm"
                          title="Rename"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.count, activeTab === 'categories' ? 'category' : 'series')}
                          className={`p-2 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all shadow-sm ${
                            item.count > 0
                              ? 'text-gray-200 cursor-not-allowed'
                              : 'text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50'
                          }`}
                          disabled={item.count > 0}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(activeTab === 'categories' ? categories : series).length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center text-gray-400">
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