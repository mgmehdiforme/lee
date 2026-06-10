import { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface LiveDotProps {
  color?: string;
  active?: boolean;
  size?: 'sm' | 'md';
}

export default function LiveDot({ color = '#2A2A2A', active = true, size = 'md' }: LiveDotProps) {
  const dotRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ringRef.current) return;

    const tween = gsap.fromTo(
      ringRef.current,
      { scale: 1, opacity: 0.6 },
      {
        scale: 1.8,
        opacity: 0,
        duration: 1.5,
        ease: 'power1.out',
        repeat: -1,
        repeatDelay: 0.5,
        paused: !active,
      }
    );

    return () => {
      tween.kill();
    };
  }, [active]);

  const sizeClasses = size === 'sm'
    ? { container: 'w-2 h-2', dot: 'w-1 h-1', inset: 'inset-[-1.5px]' }
    : { container: 'w-2.5 h-2.5', dot: 'w-1 h-1', inset: 'inset-[-2px]' };

  return (
    <span className={`relative inline-flex items-center justify-center ${sizeClasses.container}`}>
      <span
        ref={dotRef}
        className={`absolute rounded-full ${sizeClasses.dot}`}
        style={{ backgroundColor: color }}
      />
      <span
        ref={ringRef}
        className={`absolute ${sizeClasses.inset} rounded-full border-[1.5px]`}
        style={{ borderColor: color, opacity: 0.6 }}
      />
    </span>
  );
}
