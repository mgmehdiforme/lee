import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />
      <main
        ref={contentRef}
        className="flex-1 ml-[220px] min-h-screen"
      >
        {children}
      </main>
    </div>
  );
}
