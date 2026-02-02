import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { PostResponseDto } from '@/types';

interface PostCardProps {
  post: PostResponseDto;
  onClick?: () => void;
}

export default function PostCard({ post, onClick }: PostCardProps) {
  const formattedDate = post.createdAt ? post.createdAt.split('T')[0] : '';

  return (
    <Link href={`/posts/${post.id}`} className="block group" onClick={onClick}>
      <article className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] dark:shadow-none dark:hover:bg-gray-800 transition-all duration-300 border border-white/50 dark:border-gray-700/50 cursor-pointer hover:-translate-y-1">
        <div className="flex flex-col md:flex-row gap-8 items-start">

          <div className="w-full md:w-48 h-48 md:h-40 rounded-2xl flex-shrink-0 bg-gradient-to-tr from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center shadow-inner relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
             {post.thumbnailUrl ? (
                <img src={post.thumbnailUrl} alt={post.title} className="w-full h-full object-cover" />
             ) : (
                <span className="text-blue-900/10 dark:text-white/10 text-4xl font-black tracking-tighter relative z-10">Slog</span>
             )}
          </div>

          <div className="flex-1 w-full min-w-0 py-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-300 bg-blue-50/80 dark:bg-blue-900/30 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800/50">
                {post.categoryName}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5 font-medium">
                <Calendar size={12} /> {formattedDate}
              </span>
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
              {post.title}
            </h3>

            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2">
              {post.excerpt || post.content.substring(0, 100)}
            </p>

            <div className="flex items-center justify-end pt-2 border-t border-gray-50/50 dark:border-gray-700/50">
               <span className="text-sm text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                 Read post <ArrowRight size={16} />
               </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}