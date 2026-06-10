import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import {
  Inbox,
  Loader,
  Clock,
  CheckCircle,
  AlertTriangle,
  ShieldCheck,
  CircleCheck,
} from 'lucide-react';
import AppShell from '../components/AppShell';
import { kpiCards, activityItems } from '../data/demo';
import StatusBadge from '../components/StatusBadge';

const iconMap: Record<string, React.ElementType> = {
  inbox: Inbox,
  loader: Loader,
  clock: Clock,
  'check-circle': CheckCircle,
};

const activityIcons: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  NEW: { icon: Inbox, color: '#6B8FA8', bg: 'rgba(107, 143, 168, 0.1)' },
  EMERGENCY: { icon: AlertTriangle, color: '#E85D4A', bg: 'rgba(232, 77, 74, 0.1)' },
  APPROVAL: { icon: ShieldCheck, color: '#C98720', bg: 'rgba(232, 168, 56, 0.1)' },
  COMPLETE: { icon: CircleCheck, color: '#7FB069', bg: 'rgba(127, 176, 105, 0.1)' },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const kpiRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // KPI cards stagger animation
    kpiRefs.current.forEach((el, i) => {
      if (el) {
        gsap.fromTo(
          el,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: i * 0.08 }
        );
      }
    });

    // Activity card
    if (activityRef.current) {
      gsap.fromTo(
        activityRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.4 }
      );
    }
  }, []);

  return (
    <AppShell>
      <div className="p-8 pb-12">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[24px] font-medium text-ink tracking-[-0.02em]">
            Dashboard
          </h1>
          <p className="text-[14px] text-slate-muted mt-1">
            Overview of maintenance activity at Oak Brook Properties
          </p>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-4 gap-5 mb-6">
          {kpiCards.map((kpi, i) => {
            const Icon = iconMap[kpi.icon];
            return (
              <div
                key={kpi.title}
                ref={(el) => { kpiRefs.current[i] = el; }}
                className="bg-white border border-border-light rounded-lg p-6 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 cursor-default"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-medium tracking-[0.05em] text-slate-muted uppercase">
                    {kpi.title}
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-mint-light/50 flex items-center justify-center">
                    <Icon size={18} className="text-mint" />
                  </div>
                </div>
                <span className="text-[36px] font-semibold text-ink tracking-[-0.02em] leading-none">
                  {kpi.value}
                </span>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-[16px] font-medium text-ink tracking-[-0.01em] mb-4">
            Recent Activity
          </h2>
          <div
            ref={activityRef}
            className="bg-white border border-border-light rounded-lg shadow-card overflow-hidden"
          >
            {activityItems.map((item, i) => {
              const config = activityIcons[item.type];
              const Icon = config.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.workOrderId) {
                      navigate(`/work-order/${item.workOrderId}`);
                    }
                  }}
                  className={`flex items-start gap-4 px-6 py-5 ${
                    i < activityItems.length - 1 ? 'border-b border-border-light' : ''
                  } ${item.workOrderId ? 'cursor-pointer hover:bg-[#FAFAF8]' : 'cursor-default'} transition-colors duration-200`}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: config.bg }}
                  >
                    <Icon size={18} style={{ color: config.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={item.type} />
                    </div>
                    <p className="text-[14px] text-ink leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                  <span className="text-[12px] text-slate-muted flex-shrink-0">
                    {item.timestamp}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
