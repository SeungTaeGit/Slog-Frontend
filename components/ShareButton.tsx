"use client";

import { Share2 } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  description?: string;
}

export default function ShareButton({ title, description }: ShareButtonProps) {
  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: url,
        });
        return;
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      alert('링크가 클립보드에 복사되었습니다!');
    } catch (err) {
      alert('링크 복사에 실패했습니다.');
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
      title="Share this post"
    >
      <Share2 size={20}/>
    </button>
  );
}