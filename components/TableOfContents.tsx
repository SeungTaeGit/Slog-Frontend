"use client";

import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const lines = content.split('\n');
    const extractedHeadings: TocItem[] = [];
    const headingRegex = /^(#{1,3})\s+(.+)$/;

    lines.forEach((line) => {
      const match = line.match(headingRegex);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = text.toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-');
        extractedHeadings.push({ id, text, level });
      }
    });

    setHeadings(extractedHeadings);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -40% 0px' }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-32 max-h-[calc(100vh-200px)] overflow-y-auto hidden xl:block w-64 pl-4">
      <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-4 uppercase tracking-widest">
        On this page
      </h4>
      <ul className="space-y-2 border-l border-gray-200 dark:border-gray-800">
        {headings.map((heading, index) => (
          <li key={`${heading.id}-${index}`}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`block text-sm pl-4 border-l-2 -ml-[2px] transition-all duration-200 truncate ${
                activeId === heading.id
                  ? 'border-blue-600 text-blue-600 font-bold dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
              style={{
                paddingLeft: `${heading.level === 1 ? 16 : heading.level * 12 + 4}px`,
                fontSize: heading.level === 1 ? '0.9rem' : '0.85rem'
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}