import { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface TypingIndicatorProps {
  text: string;
  speed?: number;
  delay?: number;
  cursorColor?: string;
  onComplete?: () => void;
  className?: string;
}

export default function TypingIndicator({
  text,
  speed = 0.02,
  delay = 0,
  cursorColor = '#2A2A2A',
  onComplete,
  className = '',
}: TypingIndicatorProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!textRef.current || !cursorRef.current) return;

    const chars = text.split('');
    const tl = gsap.timeline({ delay, onComplete });

    tl.set(cursorRef.current, { scaleY: 0, transformOrigin: 'center' });
    tl.to(cursorRef.current, { scaleY: 1, duration: 0.15, ease: 'power2.out' });

    chars.forEach((char) => {
      tl.add(() => {
        if (textRef.current) {
          textRef.current.textContent += char;
        }
      }, `+=${speed}`);
    });

    tl.to(cursorRef.current, {
      opacity: 0,
      duration: 0.5,
      repeat: 3,
      yoyo: true,
      ease: 'steps(1)',
    });

    tl.to(cursorRef.current, { scaleY: 0, duration: 0.15, ease: 'power2.in' });

    return () => {
      tl.kill();
    };
  }, [text, speed, delay, onComplete]);

  return (
    <span ref={containerRef} className={`inline-block relative ${className}`}>
      <span
        ref={textRef}
        className="whitespace-pre-wrap"
        style={{ minHeight: '1.2em', display: 'inline' }}
      />
      <span
        ref={cursorRef}
        className="inline-block w-0.5 h-[1.2em] ml-0 align-middle"
        style={{ backgroundColor: cursorColor }}
      />
    </span>
  );
}
