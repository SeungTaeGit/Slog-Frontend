"use client";

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="mb-8 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors group px-2"
    >
      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm group-hover:shadow-md transition-all">
         <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform text-gray-400 group-hover:text-blue-600"/>
      </div>
      Back to list
    </button>
  );
}