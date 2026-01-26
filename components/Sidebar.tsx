import Link from 'next/link';
import { getSidebarData } from '@/lib/api';
import { Layers, Tag, List, ArrowRight } from 'lucide-react';

interface SidebarProps {
  activeCategory?: string;
  activeTag?: string;
  activeSeries?: string;
}

export default async function Sidebar({ activeCategory, activeTag, activeSeries }: SidebarProps) {
  const { categories, tags, series } = await getSidebarData();
  const totalPosts = categories.reduce((sum, cat) => sum + cat.count, 0);
  const isAllActive = activeCategory === 'All';

  return (
    <div className="flex flex-col h-full animate-fadeIn">
      <nav className="space-y-10">

        {/* 1. 카테고리 */}
        <div>
          <div className="flex items-center gap-2 mb-4 px-2">
            <Layers size={14} className="text-blue-600/70 dark:text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Categories</span>
          </div>
          <ul className="space-y-2">
            <li>
              <Link
                href="/category/All"
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm transition-all duration-300 group ${
                  isAllActive
                    ? 'bg-white dark:bg-gray-700 shadow-md text-blue-600 dark:text-blue-300 font-semibold shadow-blue-100/50 dark:shadow-none scale-105'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 hover:shadow-sm'
                }`}
              >
                <span className="relative z-10">All</span>
                <span className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
                    isAllActive ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' : 'bg-gray-100/50 dark:bg-gray-700 text-gray-400 dark:text-gray-500 group-hover:bg-gray-100 dark:group-hover:bg-gray-600'
                }`}>
                  {totalPosts}
                </span>
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.name}>
                <Link
                  href={`/category/${encodeURIComponent(cat.name)}`}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm transition-all duration-300 group ${
                    activeCategory === cat.name
                      ? 'bg-white dark:bg-gray-700 shadow-md text-blue-600 dark:text-blue-300 font-semibold shadow-blue-100/50 dark:shadow-none scale-105'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 hover:shadow-sm'
                  }`}
                >
                  <span className="relative z-10">{cat.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
                      activeCategory === cat.name ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' : 'bg-gray-100/50 dark:bg-gray-700 text-gray-400 dark:text-gray-500 group-hover:bg-gray-100 dark:group-hover:bg-gray-600'
                  }`}>
                    {cat.count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 2. 시리즈 */}
        {series.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4 px-2">
              <List size={14} className="text-purple-600/70 dark:text-purple-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Series</span>
            </div>
            <ul className="space-y-2">
              {series.map((s) => (
                <li key={s.name}>
                  <Link
                    href={`/series/${encodeURIComponent(s.name)}`}
                    className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all duration-300 flex items-center justify-between group ${
                        activeSeries === s.name
                        ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-gray-800 hover:text-purple-600 dark:hover:text-purple-300 hover:pl-5'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span>{s.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                          activeSeries === s.name
                            ? 'bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200'
                            : 'bg-purple-50 dark:bg-purple-900/20 text-purple-400 dark:text-purple-400'
                      }`}>{s.count}</span>
                    </div>
                    {activeSeries === s.name ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-purple-400"></div>
                    ) : (
                        <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"/>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 3. 태그 */}
        <div>
          <div className="flex items-center gap-2 mb-4 px-2">
            <Tag size={14} className="text-blue-600/70 dark:text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Tags</span>
          </div>
          <div className="flex flex-wrap gap-2 px-1">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/tag/${encodeURIComponent(tag)}`}
                className={`text-xs px-3 py-1.5 rounded-full transition-all duration-300 border ${
                    activeTag === tag
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105'
                    : 'bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-300 hover:shadow-md border-transparent hover:border-blue-100 dark:hover:border-blue-800'
                }`}
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