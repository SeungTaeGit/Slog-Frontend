"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminPosts, updatePostStatus, softDeletePost, restorePost, hardDeletePost } from '@/lib/api';
import { PostResponseDto } from '@/types';
import { Edit, Trash2, RefreshCcw, XCircle, Filter, CheckCircle2, Globe, LockKeyhole, FileQuestion, ChevronDown, FileText } from 'lucide-react';

const PostRow = ({
  post,
  onStatusChange,
  onSoftDelete,
  onRestore,
  onHardDelete,
  onEdit
}: {
  post: PostResponseDto;
  onStatusChange: (id: number, status: string) => void;
  onSoftDelete: (id: number) => void;
  onRestore: (id: number) => void;
  onHardDelete: (id: number) => void;
  onEdit: (id: number) => void;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const statusConfig: Record<string, { icon: any, color: string, bg: string, label: string }> = {
    PUBLIC: { icon: Globe, color: 'text-green-600', bg: 'bg-green-100/80 dark:bg-green-900/30', label: 'Public' },
    PRIVATE: { icon: LockKeyhole, color: 'text-gray-500', bg: 'bg-gray-100/80 dark:bg-gray-700/50', label: 'Private' },
    DELETED: { icon: Trash2, color: 'text-red-600', bg: 'bg-red-100/80 dark:bg-red-900/30', label: 'Trash' },
    DRAFT: { icon: FileText, color: 'text-yellow-600', bg: 'bg-yellow-100/80 dark:bg-yellow-900/30', label: 'Draft' },
  };

  const safeStatus = post.status || 'DRAFT';
  const currentStatus = statusConfig[safeStatus] || {
    icon: FileQuestion, color: 'text-gray-500', bg: 'bg-gray-100', label: safeStatus
  };
  const StatusIcon = currentStatus.icon;

  return (
    <tr className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors border-b border-gray-100/50 dark:border-gray-800 last:border-none">
      <td className="px-6 py-5">
        <div className="font-bold text-gray-800 dark:text-gray-100 line-clamp-1 cursor-pointer hover:text-blue-600 transition-colors text-base" onClick={() => window.open(`/posts/${post.id}`, '_blank')}>
          {post.title}
        </div>
        <div className="text-xs text-gray-400 mt-1.5 flex gap-2 font-medium">
            <span>{post.createdAt}</span>
            <span className="text-gray-300">•</span>
            <span>{post.views} views</span>
        </div>
      </td>
      <td className="px-6 py-5 text-sm text-gray-500 dark:text-gray-400">
        <span className="bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 px-2.5 py-1 rounded-lg text-xs font-medium shadow-sm">
          {post.categoryName}
        </span>
      </td>
      <td className="px-6 py-5">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${currentStatus.bg} ${currentStatus.color}`}>
          <StatusIcon size={12} /> {currentStatus.label}
        </span>
      </td>
      <td className="px-6 py-5 text-right">
        <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
          {post.status === 'DELETED' ? (
            <>
              <button onClick={() => onRestore(post.id)} className="p-2 text-green-600 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-green-200 hover:bg-green-50 rounded-xl transition-all shadow-sm" title="Restore">
                <RefreshCcw size={16} />
              </button>
              <button onClick={() => onHardDelete(post.id)} className="p-2 text-red-600 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-red-200 hover:bg-red-50 rounded-xl transition-all shadow-sm" title="Permanently Delete">
                <XCircle size={16} />
              </button>
            </>
          ) : (
            <>
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm bg-white dark:bg-gray-800 ${
                    isMenuOpen
                      ? 'border-blue-500 ring-2 ring-blue-100 dark:ring-blue-900/30'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                  }`}
                >
                  <StatusIcon size={14} className={currentStatus.color} />
                  <span className="text-gray-700 dark:text-gray-300">{currentStatus.label}</span>
                  <ChevronDown size={12} className="text-gray-400" />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl z-20 overflow-hidden animate-fadeIn">
                    <button
                      onClick={() => { onStatusChange(post.id, 'PUBLIC'); setIsMenuOpen(false); }}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-xs font-medium hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-600 hover:text-green-700 transition-colors"
                    >
                      <Globe size={14} /> Public
                    </button>
                    <button
                      onClick={() => { onStatusChange(post.id, 'PRIVATE'); setIsMenuOpen(false); }}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                    >
                      <LockKeyhole size={14} /> Private
                    </button>
                  </div>
                )}
              </div>

              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2"></div>

              <button onClick={() => onEdit(post.id)} className="p-2 text-gray-500 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 rounded-xl transition-all shadow-sm" title="Edit">
                <Edit size={16} />
              </button>

              <button onClick={() => onSoftDelete(post.id)} className="p-2 text-gray-500 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-xl transition-all shadow-sm" title="Trash">
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

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

  const handleStatusChange = async (id: number, newStatus: string) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    try {
      setPosts(prev => prev.map(p => p.id === id ? { ...p, status: newStatus as any } : p));
      await updatePostStatus(id, newStatus as 'PUBLIC' | 'PRIVATE', token);
    } catch (e) {
      alert('상태 변경 실패');
      fetchPosts();
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
    if (!confirm('🔥 정말로 영구 삭제하시겠습니까? 복구 불가!')) return;
    try {
      await hardDeletePost(id, token);
      fetchPosts();
    } catch (e) {
      alert('영구 삭제 실패');
    }
  };

  const tabs = [
    { label: 'All Posts', value: '' },
    { label: 'Published', value: 'PUBLIC' },
    { label: 'Private', value: 'PRIVATE' },
    { label: 'Trash', value: 'DELETED' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Posts</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">콘텐츠를 관리하고 발행합니다.</p>
        </div>
        <button
          onClick={() => router.push('/admin/write')}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 flex items-center gap-2 transform hover:-translate-y-0.5"
        >
          <Edit size={18} /> Write New
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200/50 dark:border-gray-700/50 pb-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => { setStatusFilter(tab.value); setPage(0); }}
            className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
              statusFilter === tab.value
                ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-[2rem] border border-white/50 dark:border-gray-700/50 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-32 text-center text-gray-400 font-medium">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="p-32 text-center text-gray-400 flex flex-col items-center gap-4">
             <div className="w-16 h-16 bg-white/50 dark:bg-gray-700/50 rounded-full flex items-center justify-center shadow-sm">
                <FileQuestion size={32} className="opacity-50"/>
             </div>
             <p className="font-medium">작성된 글이 없습니다.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100/50 dark:border-gray-700/50 text-xs font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider">
                  <th className="px-6 py-5 w-1/2">Title</th>
                  <th className="px-6 py-5">Category</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <PostRow
                    key={post.id}
                    post={post}
                    onStatusChange={handleStatusChange}
                    onSoftDelete={handleSoftDelete}
                    onRestore={handleRestore}
                    onHardDelete={handleHardDelete}
                    onEdit={(id) => router.push(`/admin/write?id=${id}`)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}