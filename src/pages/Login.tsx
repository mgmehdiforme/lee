import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Lock, Mail } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });

    // Card entrance
    tl.fromTo(
      cardRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'cubic-bezier(0.16, 1, 0.3, 1)' }
    );

    // Logo
    tl.fromTo(
      logoRef.current,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
      '-=0.5'
    );

    // Headline
    tl.fromTo(
      headlineRef.current,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
      '-=0.3'
    );

    // Subtitle with typing cursor
    tl.fromTo(
      subtitleRef.current,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
      '-=0.2'
    );

    // Typing cursor animation
    if (cursorRef.current) {
      tl.set(cursorRef.current, { scaleY: 0, transformOrigin: 'center' });
      tl.to(cursorRef.current, { scaleY: 1, duration: 0.15, ease: 'power2.out' });
      tl.to(cursorRef.current, {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'steps(1)',
      });
    }

    // Form fields
    tl.fromTo(
      formRef.current,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
      '-=0.8'
    );

    return () => { tl.kill(); };
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: 'radial-gradient(circle at center, rgba(127, 176, 105, 0.06) 0%, #F5F5F0 70%)',
      }}
    >
      <div
        ref={cardRef}
        className="w-full max-w-[400px] bg-white rounded-lg border border-border-light p-10 shadow-card"
      >
        {/* Logo */}
        <div ref={logoRef} className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-mint flex items-center justify-center mb-3">
            <span className="text-white text-[15px] font-semibold">AI</span>
          </div>
          <span className="text-[16px] font-medium text-ink">AI Coordinator</span>
        </div>

        {/* Headline */}
        <h1
          ref={headlineRef}
          className="text-[24px] font-medium text-ink text-center tracking-[-0.02em] mb-2"
        >
          Welcome back, Jane
        </h1>

        {/* Subtitle with typing cursor */}
        <div ref={subtitleRef} className="text-center mb-8 relative">
          <span className="text-[14px] text-slate leading-relaxed">
            Property Manager at Oak Brook Properties
          </span>
          <span
            ref={cursorRef}
            className="inline-block w-0.5 h-[1.2em] ml-0.5 align-middle bg-ink"
          />
        </div>

        {/* Form */}
        <div ref={formRef}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-[11px] font-medium tracking-[0.05em] text-slate-muted uppercase mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-muted" />
              <input
                type="email"
                value="jane.doe@oakbrook.com"
                disabled
                className="w-full pl-10 pr-4 py-2.5 bg-[#F5F5F0] border border-border-light rounded-md text-[14px] text-ink cursor-not-allowed"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-[11px] font-medium tracking-[0.05em] text-slate-muted uppercase mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-muted" />
              <input
                type="password"
                value="password"
                disabled
                className="w-full pl-10 pr-4 py-2.5 bg-[#F5F5F0] border border-border-light rounded-md text-[14px] text-ink cursor-not-allowed"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-2.5 bg-primary text-white rounded-md text-[14px] font-medium hover:bg-primary/90 transition-colors duration-200"
          >
            Log In
          </button>

          {/* Demo badge */}
          <div className="mt-6 text-center">
            <span className="inline-block px-3 py-1 bg-[#F5F5F0] rounded-full text-[11px] text-slate-muted tracking-[0.03em]">
              Demo Environment
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
