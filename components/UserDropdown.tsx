"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { User, PenTool, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react';

export default function UserDropdown() {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pr-3 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-all"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white">
          <User size={16} />
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden md:block">Dev_Junior</span>
        <ChevronDown size={14} className="text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden py-1 z-50 animate-fadeIn">
          <Link
            href="/admin"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <LayoutDashboard size={16} className="text-blue-500" /> Dashboard
          </Link>
          <Link
            href="/admin/write"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <PenTool size={16} className="text-purple-500" /> Write Post
          </Link>
          <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </div>
  );
}