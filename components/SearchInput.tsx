"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function SearchInput() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (!query.trim()) return;
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="relative w-full max-w-xs hidden md:block group">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleSearch}
        placeholder="Search posts..."
        className="w-full py-2.5 pl-10 pr-4 bg-white/50 border border-transparent rounded-full text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-200 transition-all placeholder-gray-400 shadow-sm"
      />
      <Search className="absolute left-3.5 top-2.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
    </div>
  );
}