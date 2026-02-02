"use client";

import { useRef, useState, MouseEvent } from 'react';

interface DragScrollContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function DragScrollContainer({ children, className = '' }: DragScrollContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = (e: MouseEvent) => {
    if (!ref.current) return;
    setIsDragging(true);
    setStartX(e.pageX - ref.current.offsetLeft);
    setScrollLeft(ref.current.scrollLeft);
  };

  const onMouseLeave = () => {
    setIsDragging(false);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    ref.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      className={`overflow-x-auto cursor-grab active:cursor-grabbing no-scrollbar ${className}`}
    >
      {children}
    </div>
  );
}