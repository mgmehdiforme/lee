import { useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import {
  LayoutDashboard,
  ClipboardList,
  Wrench,
  Building2,
  BarChart3,
  LogOut,
} from 'lucide-react';
import LiveDot from './LiveDot';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  disabled?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Work Orders', icon: ClipboardList, path: '/work-orders' },
  { label: 'Vendors', icon: Wrench, path: '#', disabled: true },
  { label: 'Properties', icon: Building2, path: '#', disabled: true },
  { label: 'Reports', icon: BarChart3, path: '#', disabled: true },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (sidebarRef.current) {
      gsap.fromTo(
        sidebarRef.current,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
      );
    }
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      ref={sidebarRef}
      className="fixed left-0 top-0 h-full w-[220px] bg-white border-r border-border-light flex flex-col z-50"
    >
      {/* Logo */}
      <div className="px-6 pt-6 pb-2 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-mint flex items-center justify-center">
          <span className="text-white text-[13px] font-semibold">AI</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-medium text-ink">AI Coordinator</span>
          <div className="flex items-center gap-1">
            <LiveDot color="#7FB069" active={true} size="sm" />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex-1 px-3">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              onClick={() => !item.disabled && navigate(item.path)}
              disabled={item.disabled}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-[14px] mb-0.5 transition-all duration-150
                ${active
                  ? 'bg-mint/5 text-ink font-medium border-l-[3px] border-mint'
                  : item.disabled
                    ? 'text-ink/30 cursor-not-allowed'
                    : 'text-slate hover:bg-[#FAFAF8]'
                }
              `}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {active && (
                <div className="ml-auto">
                  <LiveDot color="#7FB069" active={true} size="sm" />
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="px-4 py-4 border-t border-border-light">
        <div className="flex items-center gap-3">
          <img
            src="/images/avatar-jane.jpg"
            alt="Jane Doe"
            className="w-9 h-9 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-ink truncate">Jane Doe</p>
            <p className="text-[11px] text-slate-muted">Property Manager</p>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="p-1.5 rounded-md hover:bg-[#FAFAF8] text-slate-muted hover:text-ink transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
