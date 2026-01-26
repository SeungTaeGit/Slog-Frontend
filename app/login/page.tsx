"use client";

import { useState } from 'react';
import { ArrowLeft, Lock } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const GOOGLE_LOGIN_URL = process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL.replace('/api/v1', '')}/oauth2/authorization/google`
    : 'http://localhost:8080/oauth2/authorization/google';

  const handleLogin = () => {
    setIsLoading(true);
    window.location.href = GOOGLE_LOGIN_URL;
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF] flex flex-col items-center justify-center p-4">
      {/* 홈으로 돌아가기 */}
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
        <ArrowLeft size={20} />
        <span className="font-medium">Back to Blog</span>
      </Link>

      <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-white/60 w-full max-w-md text-center relative overflow-hidden">
        {/* 배경 장식 */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg mb-6">
            <Lock size={32} />
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-500 mb-10 leading-relaxed">
            블로그 주인장만 접근할 수 있는 공간입니다.<br/>
            허가되지 않은 접근은 기록됩니다.
          </p>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            {/* 구글 로고 SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {isLoading ? 'Connecting...' : 'Sign in with Google'}
          </button>
        </div>
      </div>
    </div>
  );
}