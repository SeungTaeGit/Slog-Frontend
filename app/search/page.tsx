import Link from 'next/link';
import { getPosts } from '@/lib/api';
import PostCard from '@/components/PostCard';
import { Search, ArrowLeft } from 'lucide-react';

interface SearchPageProps {
  searchParams: Promise<{ q: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || '';

  const postData = await getPosts({ keyword: query, page: 0, size: 20 });

  const posts = postData?.content || [];
  const totalElements = postData?.totalElements || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FF] via-[#F1F5FF] to-[#FFFFFF] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pb-20 transition-colors duration-300">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
         <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-100/40 dark:bg-blue-900/20 rounded-full blur-[120px] opacity-60"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        <Link
          href="/"
          className="mb-8 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors inline-block"
        >
          <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center border border-gray-100 dark:border-gray-700 shadow-sm">
            <ArrowLeft size={16}/>
          </div>
          Back to list
        </Link>

        <div className="bg-blue-50/50 dark:bg-blue-900/20 rounded-3xl p-8 mb-8 border border-blue-100 dark:border-blue-800/50 animate-fadeIn transition-colors">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
             <Search className="text-blue-600 dark:text-blue-400" />
             Search Results for "<span className="text-blue-600 dark:text-blue-400">{query}</span>"
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            총 <span className="font-bold text-gray-800 dark:text-gray-200">{totalElements}</span>개의 글을 찾았습니다.
          </p>
        </div>

        <div className="grid gap-8 animate-fadeIn">
          {posts.length > 0 ? (
             posts.map(post => (
                <PostCard key={post.id} post={post} />
             ))
          ) : (
             <div className="text-center py-20 bg-white/50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">No results found</h3>
                <p className="text-gray-500 dark:text-gray-400">검색어와 일치하는 글이 없습니다.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}