"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LayoutDashboard, FileText, List, Settings, LogOut, PenTool, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('관리자 로그인이 필요합니다.');
      router.replace('/login');
    }
  }, [router]);

  if (pathname === '/admin/write') {
    return <>{children}</>;
  }

  if (!mounted) return null;

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Posts', href: '/admin/posts', icon: FileText },
    { name: 'Metadata', href: '/admin/metadata', icon: List },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FF] via-[#F1F5FF] to-[#FFFFFF] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">

      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-100/40 dark:bg-blue-900/20 rounded-full blur-[120px] opacity-60"></div>
          <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-purple-100/30 dark:bg-purple-900/20 rounded-full blur-[100px] opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">

          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-28 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl p-6 rounded-[2rem] border border-white/60 dark:border-gray-700/50 shadow-lg shadow-gray-200/50 dark:shadow-none transition-colors">

                {/* Admin Logo Area */}
                <div className="mb-8 px-2 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">S</div>
                        <span className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">eungTae</span>
                     </div>
                     <Link href="/" className="md:hidden p-2 text-gray-400 hover:text-blue-600">
                        <ArrowLeft size={20}/>
                     </Link>
                </div>

                {/* Navigation Menu */}
                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                            isActive
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 transform scale-105'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                        >
                            <item.icon size={18} />
                            {item.name}
                        </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50 space-y-3">
                    <Link
                        href="/admin/write"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-2xl text-sm font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:scale-105 transition-all"
                    >
                        <PenTool size={16}/> New Post
                    </Link>
                    <button
                        onClick={logout}
                        className="flex items-center justify-center gap-2 px-4 py-3 w-full rounded-2xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                    <Link href="/" className="flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 py-2">
                        <ArrowLeft size={12}/> Back to Blog
                    </Link>
                </div>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
             <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/60 dark:border-gray-700/50 shadow-sm min-h-[80vh]">
                {children}
             </div>
          </main>

        </div>
      </div>
    </div>
  );
}