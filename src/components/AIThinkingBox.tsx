import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Sparkles } from 'lucide-react';

interface ThinkingBoxItem {
  label: string;
  value: string;
}

interface AIThinkingBoxProps {
  title: string;
  items: ThinkingBoxItem[];
  variant?: 'default' | 'emergency';
}

export default function AIThinkingBox({ title, items, variant = 'default' }: AIThinkingBoxProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);

  const borderColor = variant === 'emergency' ? '#E85D4A' : '#7FB069';
  const titleColor = variant === 'emergency' ? '#E85D4A' : '#7FB069';

  useEffect(() => {
    if (!boxRef.current || !borderRef.current) return;

    gsap.fromTo(
      boxRef.current,
      { opacity: 0, x: -8 },
      { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
    );

    gsap.fromTo(
      borderRef.current,
      { backgroundPosition: '0% -100%' },
      { backgroundPosition: '0% 200%', duration: 0.8, ease: 'none' }
    );
  }, []);

  return (
    <div
      ref={boxRef}
      className="relative bg-[#F8F9FA] border border-border-light rounded-lg p-4 overflow-hidden my-3"
      style={{ borderLeftWidth: 3, borderLeftColor: borderColor }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-[3px] overflow-hidden pointer-events-none">
        <div
          ref={borderRef}
          className="absolute w-full h-full"
          style={{
            background: `linear-gradient(to bottom, transparent, ${borderColor}, transparent)`,
            backgroundSize: '100% 50%',
            backgroundRepeat: 'no-repeat',
          }}
        />
      </div>
      <div className="flex items-center gap-1.5 mb-2">
        <Sparkles size={12} style={{ color: titleColor }} />
        <span className="text-[11px] font-medium tracking-[0.05em] uppercase" style={{ color: titleColor }}>
          {title}
        </span>
      </div>
      <div className="space-y-1 font-mono text-[13px] leading-relaxed">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-slate-muted">{item.label}:</span>
            <span className="text-ink font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
