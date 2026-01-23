import Link from 'next/link';
import { getSidebarData } from '@/lib/api';
import { Layers, Tag, List, ArrowRight } from 'lucide-react';

interface SidebarProps {
  activeCategory?: string;
}

export default async function Sidebar({ activeCategory = 'All' }: SidebarProps) {
  const { categories, tags, series } = await getSidebarData();

  const totalPosts = categories.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <div className="flex flex-col h-full animate-fadeIn">
      <nav className="space-y-10">

        {/* 1. 카테고리 목록 */}
        <div>
          <div className="flex items-center gap-2 mb-4 px-2">
            <Layers size={14} className="text-blue-600/70" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Categories</span>
          </div>
          <ul className="space-y-2">
            {/* 전체보기 (All) */}
            <li>
              <Link
                href="/"
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm transition-all duration-300 group ${
                  activeCategory === 'All'
                    ? 'bg-white shadow-md text-blue-600 font-semibold shadow-blue-100/50 scale-105'
                    : 'text-gray-500 hover:bg-white/60 hover:text-gray-900 hover:shadow-sm'
                }`}
              >
                <span className="relative z-10">All</span>
                <span className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
                    activeCategory === 'All' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100/50 text-gray-400 group-hover:bg-gray-100'
                }`}>
                  {totalPosts}
                </span>
              </Link>
            </li>

            {/* 개별 카테고리 */}
            {categories.map((cat) => (
              <li key={cat.name}>
                <Link
                  href={`/category/${encodeURIComponent(cat.name)}`}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm transition-all duration-300 group ${
                    activeCategory === cat.name
                      ? 'bg-white shadow-md text-blue-600 font-semibold shadow-blue-100/50 scale-105'
                      : 'text-gray-500 hover:bg-white/60 hover:text-gray-900 hover:shadow-sm'
                  }`}
                >
                  <span className="relative z-10">{cat.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
                      activeCategory === cat.name ? 'bg-blue-50 text-blue-600' : 'bg-gray-100/50 text-gray-400 group-hover:bg-gray-100'
                  }`}>
                    {cat.count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 2. 시리즈 목록 */}
        {series.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4 px-2">
              <List size={14} className="text-purple-600/70" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Series</span>
            </div>
            <ul className="space-y-2">
              {series.map((s) => (
                <li key={s.name}>
                  <Link
                    href={`/series/${encodeURIComponent(s.name)}`}
                    className="w-full text-left px-4 py-2 rounded-xl text-sm text-gray-500 hover:bg-white/60 hover:text-purple-600 hover:pl-5 transition-all duration-300 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span>{s.name}</span>
                      <span className="text-[10px] bg-purple-50 text-purple-400 px-1.5 py-0.5 rounded-md">{s.count}</span>
                    </div>
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"/>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 3. 태그 클라우드 */}
        <div>
          <div className="flex items-center gap-2 mb-4 px-2">
            <Tag size={14} className="text-blue-600/70" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Tags</span>
          </div>
          <div className="flex flex-wrap gap-2 px-1">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/tag/${encodeURIComponent(tag)}`}
                className="text-xs px-3 py-1.5 bg-white/50 backdrop-blur-sm text-gray-500 rounded-full hover:bg-white hover:text-blue-600 hover:shadow-md transition-all duration-300 border border-transparent hover:border-blue-100"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}