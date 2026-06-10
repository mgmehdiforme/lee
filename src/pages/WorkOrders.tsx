import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Plus } from 'lucide-react';
import AppShell from '../components/AppShell';
import { workOrders } from '../data/demo';
import StatusBadge from '../components/StatusBadge';
import SeverityBadge from '../components/SeverityBadge';

export default function WorkOrders() {
  const navigate = useNavigate();
  const tableRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (tableRef.current) {
      gsap.fromTo(
        tableRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }

    rowRefs.current.forEach((el, i) => {
      if (el) {
        gsap.fromTo(
          el,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: 'power2.out', delay: 0.1 + i * 0.06 }
        );
      }
    });
  }, []);

  return (
    <AppShell>
      <div className="p-8 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[24px] font-medium text-ink tracking-[-0.02em]">
              Work Orders
            </h1>
            <p className="text-[14px] text-slate-muted mt-1">
              Manage and track all maintenance requests
            </p>
          </div>
          <button
            disabled
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-md text-[14px] font-medium opacity-50 cursor-not-allowed"
          >
            <Plus size={16} />
            New Work Order
          </button>
        </div>

        {/* Table */}
        <div
          ref={tableRef}
          className="bg-white border border-border-light rounded-lg shadow-card overflow-hidden"
        >
          {/* Table Header */}
          <div className="grid grid-cols-[80px_120px_120px_1fr_150px_100px] px-5 py-3 bg-[#FAFAF8] border-b border-border-light">
            <span className="text-[11px] font-medium tracking-[0.05em] text-slate-muted uppercase">ID</span>
            <span className="text-[11px] font-medium tracking-[0.05em] text-slate-muted uppercase">Status</span>
            <span className="text-[11px] font-medium tracking-[0.05em] text-slate-muted uppercase">Severity</span>
            <span className="text-[11px] font-medium tracking-[0.05em] text-slate-muted uppercase">Description</span>
            <span className="text-[11px] font-medium tracking-[0.05em] text-slate-muted uppercase">Property</span>
            <span className="text-[11px] font-medium tracking-[0.05em] text-slate-muted uppercase text-right">Reported</span>
          </div>

          {/* Table Rows */}
          {workOrders.map((wo, i) => (
            <div
              key={wo.id}
              ref={(el) => { rowRefs.current[i] = el; }}
              onClick={() => navigate(`/work-order/${wo.id}`)}
              className={`grid grid-cols-[80px_120px_120px_1fr_150px_100px] px-5 py-4 border-b border-border-light cursor-pointer hover:bg-[#FAFAF8] hover:border-l-[3px] hover:border-l-primary transition-all duration-150 ${
                i === workOrders.length - 1 ? 'border-b-0' : ''
              }`}
            >
              <span className="text-[14px] font-medium text-primary">#{wo.id}</span>
              <div>
                <StatusBadge status={wo.status} />
              </div>
              <div>
                <SeverityBadge severity={wo.severity} />
              </div>
              <span className="text-[14px] text-ink truncate">{wo.description}</span>
              <span className="text-[14px] text-slate">{wo.property}</span>
              <span className="text-[13px] text-slate-muted text-right">{wo.reported}</span>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
