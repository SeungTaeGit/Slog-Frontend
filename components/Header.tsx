"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Search, PenTool, LogOut, LogIn } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, logout } = useAuth();

  if (pathname === '/admin/write') return null;

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-white/20 dark:border-gray-800/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-1 cursor-pointer group">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-transform">S</div>
            <span className="text-xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">log.</span>
          </Link>
        </div>

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

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {isLoggedIn ? (
            <>
              <Link href="/admin/write" className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">
                <PenTool size={16} /> Write
              </Link>
              <button onClick={logout} className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition" title="Logout">
                <LogOut size={20} />
              </button>
            </>
          ) : (
             <div className="w-1 h-1"></div>
          )}
        </div>
      </div>
    </header>
  );
}