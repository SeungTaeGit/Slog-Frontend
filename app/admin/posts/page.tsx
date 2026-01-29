"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminPosts, updatePostStatus, softDeletePost, restorePost, hardDeletePost } from '@/lib/api';
import { PostResponseDto } from '@/types';
import { Edit, Trash2, Eye, EyeOff, RefreshCcw, XCircle, Search, Filter } from 'lucide-react';

export default function AdminPostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<PostResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(0);

  const fetchPosts = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.replace('/login');
      return;
    }

    setLoading(true);
    try {
      const data = await getAdminPosts(token, page, statusFilter || undefined);
      setPosts(data.content);
    } catch (error) {
      console.error("Failed to fetch admin posts", error);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, router]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleStatusChange = async (id: number, newStatus: 'PUBLIC' | 'PRIVATE') => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    if (!confirm(`글 상태를 ${newStatus}로 변경하시겠습니까?`)) return;

    try {
      await updatePostStatus(id, newStatus, token);
      fetchPosts();
    } catch (e) {
      alert('상태 변경 실패');
    }
  };

  const handleSoftDelete = async (id: number) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    if (!confirm('휴지통으로 이동하시겠습니까?')) return;

    try {
      await softDeletePost(id, token);
      fetchPosts();
    } catch (e) {
      alert('삭제 실패');
    }
  };

  const handleRestore = async (id: number) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    if (!confirm('글을 복구하시겠습니까? (PUBLIC 상태로 전환됩니다)')) return;

    try {
      await restorePost(id, token);
      fetchPosts();
    } catch (e) {
      alert('복구 실패');
    }
  };

  const handleHardDelete = async (id: number) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    if (!confirm('🔥 정말로 영구 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다!')) return;

    try {
      await hardDeletePost(id, token);
      fetchPosts();
    } catch (e) {
      alert('영구 삭제 실패');
    }
  };

  const tabs = [
    { label: 'All Posts', value: '' },
    { label: 'Public', value: 'PUBLIC' },
    { label: 'Private', value: 'PRIVATE' },
    { label: 'Trash', value: 'DELETED' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 헤더 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Posts Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">게시글 상태를 관리하고 정리합니다.</p>
        </div>
        <button
          onClick={() => router.push('/admin/write')}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-500/30"
        >
          + Write New Post
        </button>
      </div>

      {/* 필터 탭 */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 pb-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => { setStatusFilter(tab.value); setPage(0); }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              statusFilter === tab.value
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 테이블 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center text-gray-500">글이 없습니다.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                  <th className="px-6 py-4 font-semibold">Title</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 dark:text-gray-100 line-clamp-1">{post.title}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">{post.categoryName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        post.status === 'PUBLIC' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        post.status === 'PRIVATE' ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {post.createdAt}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {post.status === 'DELETED' ? (
                          <>
                            <button onClick={() => handleRestore(post.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Restore">
                              <RefreshCcw size={18} />
                            </button>
                            <button onClick={() => handleHardDelete(post.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Hard Delete">
                              <XCircle size={18} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => router.push(`/admin/write?id=${post.id}`)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit">
                              <Edit size={18} />
                            </button>
                            {post.status === 'PUBLIC' ? (
                              <button onClick={() => handleStatusChange(post.id, 'PRIVATE')} className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg" title="Make Private">
                                <EyeOff size={18} />
                              </button>
                            ) : (
                              <button onClick={() => handleStatusChange(post.id, 'PUBLIC')} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg" title="Make Public">
                                <Eye size={18} />
                              </button>
                            )}
                            <button onClick={() => handleSoftDelete(post.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Move to Trash">
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}