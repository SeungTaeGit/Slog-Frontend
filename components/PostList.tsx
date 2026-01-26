"use client";

import { useState } from 'react';
import { getPosts } from '@/lib/api';
import { PostResponseDto } from '@/types';
import PostCard from '@/components/PostCard';
import { ArrowRight, Loader2 } from 'lucide-react';

interface PostListProps {
  initialPosts: PostResponseDto[];
  totalElements: number;
  categoryName?: string;
  tagName?: string;
  seriesName?: string;
}

export default function PostList({ initialPosts, totalElements, categoryName, tagName, seriesName }: PostListProps) {
  const [posts, setPosts] = useState<PostResponseDto[]>(initialPosts);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const hasMore = posts.length < totalElements;

  const loadMore = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const newData = await getPosts({
        page: page,
        size: 10,
        categoryName,
        tagName,
        seriesName
      });

      if (newData.content.length > 0) {
        setPosts((prev) => [...prev, ...newData.content]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to load more posts", error);
      alert("글을 더 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 게시글 리스트 */}
      <div className="grid gap-8 animate-fadeIn">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="py-20 text-center text-gray-500 bg-white/50 rounded-3xl border border-dashed border-gray-300">
            게시글이 없습니다.
          </div>
        )}
      </div>

      {/* 더보기 버튼 */}
      {hasMore && (
        <div className="mt-24 text-center">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="group relative px-8 py-3 bg-white text-gray-600 rounded-full text-sm font-bold shadow-sm hover:shadow-xl hover:text-blue-600 transition-all duration-300 border border-gray-100 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center gap-2">
              {isLoading ? (
                <>Loading <Loader2 size={16} className="animate-spin"/></>
              ) : (
                <>Load more posts <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/></>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      )}
    </>
  );
}