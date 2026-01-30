"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from './ThemeToggle';
import UserDropdown from './UserDropdown';
import { useScrollDirection } from '@/hooks/useScrollDirection';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();
  const scrollDirection = useScrollDirection();

  const [isHomeIntro, setIsHomeIntro] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (pathname === '/') {
        if (window.scrollY < window.innerHeight - 100) {
          setIsHomeIntro(true);
        } else {
          setIsHomeIntro(false);
        }
      } else {
        setIsHomeIntro(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  if (pathname === '/admin/write') return null;

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-white/20 dark:border-gray-800/50 transition-transform duration-500 ease-in-out ${
        isHomeIntro || scrollDirection === 'down' ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* 로고 */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-1 cursor-pointer group">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-transform">S</div>
            <span className="text-xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">log.</span>
          </Link>
        </div>

        {/* 검색창 */}
        <div className="relative w-full max-w-md hidden md:block group mx-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search posts..."
            className="w-full py-2.5 pl-10 pr-4 bg-white/50 dark:bg-gray-800/50 border border-transparent dark:border-gray-700 rounded-full text-sm focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-200 dark:text-gray-200 transition-all placeholder-gray-400 shadow-sm"
          />
          <Search className="absolute left-3.5 top-2.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
        </div>

        {/* 우측 메뉴 */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {isLoggedIn ? (
            <UserDropdown />
          ) : (
             <div className="w-1 h-1"></div>
          )}
        </div>
      </div>
    </header>
  );
}