"use client";

import { ArrowDown } from 'lucide-react';

export default function ClientScrollButton() {
  const handleScroll = () => {
    const element = document.getElementById('content');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      onClick={handleScroll}
      className="absolute bottom-10 animate-bounce cursor-pointer opacity-50 hover:opacity-100 transition-opacity z-20"
    >
      <span className="text-sm font-bold text-gray-400 mb-2 block text-center">Scroll Down</span>
      <ArrowDown size={32} className="text-blue-500 mx-auto" />
    </div>
  );
}