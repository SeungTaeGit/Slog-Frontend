"use client";

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function AuthCallbackContent() {
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      console.log("Login Success! Token:", token.substring(0, 10) + "...");
      login(token);
    } else {
      alert('로그인에 실패했습니다. 토큰이 없습니다.');
      window.location.href = '/login';
    }
  }, [searchParams, login]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FF]">
      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
      <h2 className="text-xl font-bold text-gray-800">로그인 처리 중...</h2>
      <p className="text-gray-500 mt-2">잠시만 기다려주세요.</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthCallbackContent />
    </Suspense>
  );
}