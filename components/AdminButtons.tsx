"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { deletePost } from '@/lib/api';
import { Edit, Trash2 } from 'lucide-react';

interface AdminButtonsProps {
  postId: number;
}

export default function AdminButtons({ postId }: AdminButtonsProps) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  if (!isLoggedIn) return null;

  const handleEdit = () => {
    router.push(`/admin/write?id=${postId}`);
  };

  const handleDelete = async () => {
    if (!confirm('정말 이 글을 삭제하시겠습니까? 복구할 수 없습니다.')) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인 세션이 만료되었습니다.');
      return;
    }

    try {
      await deletePost(postId, token);
      alert('삭제되었습니다.');
      router.replace('/');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleEdit}
        className="p-2 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        title="Edit Post"
      >
        <Edit size={20} />
      </button>
      <button
        onClick={handleDelete}
        className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        title="Delete Post"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
}