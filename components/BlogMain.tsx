"use client";

import React, { useState } from 'react';
import { Search, Menu, X, Github, Mail, User, BookOpen, ArrowLeft, Calendar, TrendingUp, Layers } from 'lucide-react';
import PostCard from './PostCard';
import Sidebar from './Sidebar';
import { PostResponseDto } from '@/types';

interface BlogMainProps {
  initialPosts: PostResponseDto[];
}

export default function BlogMain({ initialPosts }: BlogMainProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<PostResponseDto | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories = [
    { name: 'All', count: initialPosts.length },
    { name: 'Java / Spring', count: initialPosts.filter(p => p.categoryName.includes('Spring')).length },
    { name: 'Architecture', count: 0 },
  ];
  const tags = ['Spring Boot', 'JPA', 'Docker', 'Redis'];

  const filteredPosts = initialPosts.filter(post => {
    const matchCategory = activeCategory === 'All' || post.categoryName === activeCategory;
    const matchSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (selectedPost) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn">
        <button
          onClick={() => setSelectedPost(null)}
          className="mb-8 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm"><ArrowLeft size={16}/></div>
          Back to list
        </button>
        <article className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white/60 relative overflow-hidden">
           {/* 배경 장식 */}
           <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

           <header className="relative z-10 mb-10 border-b border-gray-100 pb-10">
             <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-bold">{selectedPost.categoryName}</span>
             </div>
             <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">{selectedPost.title}</h1>
             <div className="flex items-center gap-6 text-sm text-gray-500">
               <span className="flex items-center gap-1.5"><Calendar size={15}/> {selectedPost.createdAt}</span>
               <span className="flex items-center gap-1.5"><TrendingUp size={15}/> {selectedPost.views} views</span>
             </div>
           </header>
           <div className="prose max-w-none text-gray-600 leading-relaxed whitespace-pre-line relative z-10">
             {selectedPost.content}
           </div>
        </article>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FF] via-[#F1F5FF] to-[#FFFFFF]">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-gray-600"><Menu size={24}/></button>
             <div onClick={() => {setSelectedPost(null); setSearchQuery('');}} className="flex items-center gap-1 cursor-pointer group">
                <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">S</div>
                <span className="text-xl font-bold text-gray-800 tracking-tight">log.</span>
             </div>
          </div>
          {/* 검색창 */}
          <div className="relative w-full max-w-md hidden md:block group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts..."
              className="w-full py-2.5 pl-10 pr-4 bg-white/50 border border-transparent rounded-full text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
            />
            <Search className="absolute left-3.5 top-2.5 text-gray-400" size={18} />
          </div>
          <div className="hidden md:flex gap-4"><Github className="text-gray-400 hover:text-gray-900 cursor-pointer"/></div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
         <div className="flex flex-col md:flex-row gap-12 lg:gap-16">
            {/* 사이드바 */}
            <aside className="hidden md:block w-64 flex-shrink-0 h-fit sticky top-28">
               <Sidebar
                  categories={categories}
                  tags={tags}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
               />
            </aside>

            {/* 글 목록 영역 */}
            <main className="flex-1 min-w-0">
               {/* Hero Section (검색 중이 아닐 때만 표시) */}
               {!searchQuery && activeCategory === 'All' && (
                 <section className="mb-16 flex flex-col md:flex-row items-center gap-8 bg-white/40 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white/50">
                    <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-lg overflow-hidden">
                       <img src="/api/placeholder/100/100" alt="Profile" className="w-full h-full object-cover"/>
                    </div>
                    <div className="text-center md:text-left">
                       <h1 className="text-2xl font-black text-gray-900 mb-2">Dev_Junior</h1>
                       <p className="text-gray-600">Java & Spring 백엔드 개발자입니다.<br/>배운 것을 기록합니다.</p>
                    </div>
                 </section>
               )}

               {/* 리스트 헤더 */}
               <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                     {searchQuery ? <Search className="text-blue-600"/> : <BookOpen className="text-blue-600"/>}
                     {searchQuery ? `Search: "${searchQuery}"` : 'Latest Posts'}
                  </h2>
               </div>

               {/* 리스트 그리드 */}
               <div className="grid gap-8">
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map(post => (
                      <PostCard key={post.id} post={post} onClick={() => setSelectedPost(post)} />
                    ))
                  ) : (
                    <div className="py-20 text-center bg-white/50 rounded-3xl border border-dashed border-gray-300 text-gray-500">
                       No posts found.
                    </div>
                  )}
               </div>
            </main>
         </div>
      </div>

      {/* 모바일 메뉴 */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900/20 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
           <div className="absolute left-0 top-0 h-full w-3/4 max-w-xs bg-white p-6 shadow-2xl">
              <div className="flex justify-between mb-8">
                 <span className="font-bold text-xl">Slog.</span>
                 <X size={24} onClick={() => setIsMobileMenuOpen(false)}/>
              </div>
              <Sidebar categories={categories} tags={tags} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
           </div>
        </div>
      )}
    </div>
  );
}