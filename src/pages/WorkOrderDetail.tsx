import { useRef, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import {
  ArrowLeft,
  Building2,
  Wrench,
  DollarSign,
  ShieldCheck,
  User,
  Bot,
  HardHat,
  MapPin,
} from 'lucide-react';
import AppShell from '../components/AppShell';
import { workOrders, conversationData, propertyImages } from '../data/demo';
import StatusBadge from '../components/StatusBadge';
import AIThinkingBox from '../components/AIThinkingBox';
import TypingIndicator from '../components/TypingIndicator';

const senderConfig = {
  tenant: { icon: User, label: 'Tenant', color: '#4A6B8A', bg: 'rgba(74, 107, 138, 0.08)' },
  ai: { icon: Bot, label: 'AI Coordinator', color: '#7FB069', bg: 'rgba(127, 176, 105, 0.1)' },
  vendor: { icon: HardHat, label: 'Vendor', color: '#E8A838', bg: 'rgba(232, 168, 56, 0.1)' },
};

export default function WorkOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  const workOrder = useMemo(() => {
    return workOrders.find((wo) => wo.id === Number(id));
  }, [id]);

  const conversation = useMemo(() => {
    return conversationData[Number(id)];
  }, [id]);

  const propertyImage = useMemo(() => {
    return workOrder ? propertyImages[workOrder.property] : null;
  }, [workOrder]);

  useEffect(() => {
    if (leftRef.current) {
      gsap.fromTo(
        leftRef.current,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
      );
    }
    if (rightRef.current) {
      gsap.fromTo(
        rightRef.current,
        { x: 20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.15 }
      );
    }
  }, [id]);

  if (!workOrder || !conversation) {
    return (
      <AppShell>
        <div className="p-8">
          <button
            onClick={() => navigate('/work-orders')}
            className="flex items-center gap-2 text-[14px] text-slate hover:text-ink transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Back to Work Orders
          </button>
          <p className="text-slate-muted">Work order not found.</p>
        </div>
      </AppShell>
    );
  }

  // Determine status display
  const statusDisplay = useMemo(() => {
    if (workOrder.severity === 'Emergency' && workOrder.status === 'Dispatched') {
      return 'EMERGENCY — Dispatched';
    }
    if (workOrder.status === 'New') {
      return 'New — AI Dispatching';
    }
    return workOrder.status;
  }, [workOrder]);

  // Build message list with thinking boxes interspersed
  const messageElements: { type: 'message'; index: number; message: typeof conversation.messages[0] }[] =
    conversation.messages.map((msg, i) => ({ type: 'message', index: i, message: msg }));

  const thinkingElements: { type: 'thinking'; afterIndex: number; box: typeof conversation.thinkingBoxes[0]['box'] }[] =
    conversation.thinkingBoxes.map((tb) => ({ type: 'thinking', afterIndex: tb.afterIndex, box: tb.box }));

  // Sort: message at index i, then any thinking boxes that come after index i
  const sortedElements: ((typeof messageElements)[0] | (typeof thinkingElements)[0])[] = [];
  conversation.messages.forEach((msg, i) => {
    sortedElements.push({ type: 'message', index: i, message: msg });
    const thinkingBoxes = conversation.thinkingBoxes.filter((tb) => tb.afterIndex === i);
    thinkingBoxes.forEach((tb) => {
      sortedElements.push({ type: 'thinking', afterIndex: tb.afterIndex, box: tb.box });
    });
  });

  // Calculate typing delays for each AI message
  const getTypingDelay = (elementIndex: number) => {
    let delay = 0.5; // initial delay
    for (let i = 0; i < elementIndex; i++) {
      const el = sortedElements[i];
      if (el.type === 'message') {
        if (el.message.sender === 'ai' || el.message.sender === 'vendor') {
          delay += el.message.text.length * 0.02 + 1.5; // typing + blink
        } else {
          delay += 0.3; // tenant messages appear faster
        }
      } else {
        delay += 0.6; // thinking box animation
      }
    }
    return delay;
  };

  const isEmergency = workOrder.severity === 'Emergency';

  return (
    <AppShell>
      <div className="p-8 pb-12">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate('/work-orders')}
          className="flex items-center gap-2 text-[14px] text-slate hover:text-ink transition-colors mb-2"
        >
          <ArrowLeft size={16} />
          Work Orders
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-[24px] font-medium text-ink tracking-[-0.02em]">
            Work Order #{workOrder.id}
          </h1>
          <StatusBadge
            status={statusDisplay}
            showDot={workOrder.status === 'New' || (workOrder.severity === 'Emergency' && workOrder.status === 'Dispatched')}
            size="md"
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* LEFT: AI Activity Log */}
          <div ref={leftRef}>
            <div className="bg-white border border-border-light rounded-lg shadow-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border-light flex items-center justify-between">
                <h2 className="text-[16px] font-medium text-ink tracking-[-0.01em]">
                  AI Activity Log
                </h2>
                <span className="text-[11px] text-slate-muted tracking-[0.03em]">
                  {workOrder.reported} ago
                </span>
              </div>

              <div className="p-6">
                {sortedElements.map((el, idx) => {
                  if (el.type === 'thinking') {
                    return (
                      <AIThinkingBox
                        key={`thinking-${idx}`}
                        title={el.box.title}
                        items={el.box.items}
                        variant={isEmergency ? 'emergency' : 'default'}
                      />
                    );
                  }

                  const { message, index } = el;
                  const config = senderConfig[message.sender];
                  const Icon = config.icon;
                  const isAI = message.sender === 'ai';
                  const typingDelay = getTypingDelay(idx);

                  return (
                    <div key={`msg-${idx}`} className="flex gap-3 mb-5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: config.bg }}
                      >
                        <Icon size={14} style={{ color: config.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="text-[11px] font-medium tracking-[0.05em] uppercase"
                            style={{ color: config.color }}
                          >
                            {config.label}
                          </span>
                          <span className="text-[11px] text-slate-muted">
                            {index === 0 ? 'just now' : `${(index + 1) * 2}m ago`}
                          </span>
                        </div>
                        <div className="text-[14px] text-ink leading-relaxed">
                          {isAI || message.sender === 'vendor' ? (
                            <TypingIndicator
                              text={message.text}
                              speed={isEmergency ? 0.015 : 0.02}
                              delay={typingDelay}
                              cursorColor={config.color}
                            />
                          ) : (
                            <span>{message.text}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: Details Panel */}
          <div ref={rightRef} className="space-y-5">
            {/* Status Card */}
            <div className="bg-white border border-border-light rounded-lg shadow-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck size={16} className="text-mint" />
                <h3 className="text-[11px] font-medium tracking-[0.05em] text-slate-muted uppercase">
                  Status
                </h3>
              </div>
              <StatusBadge
                status={statusDisplay}
                showDot={workOrder.status === 'New' || (workOrder.severity === 'Emergency' && workOrder.status === 'Dispatched')}
              />
            </div>

            {/* Property Card */}
            <div className="bg-white border border-border-light rounded-lg shadow-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Building2 size={16} className="text-mint" />
                <h3 className="text-[11px] font-medium tracking-[0.05em] text-slate-muted uppercase">
                  Property
                </h3>
              </div>
              {propertyImage && (
                <img
                  src={propertyImage}
                  alt={workOrder.property}
                  className="w-full h-32 object-cover rounded-md mb-3"
                />
              )}
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-slate-muted" />
                <span className="text-[14px] font-medium text-ink">{workOrder.property}</span>
              </div>
              <span className="text-[13px] text-slate-muted ml-6">{workOrder.unit}</span>
            </div>

            {/* Vendor Card */}
            {workOrder.vendor && (
              <div className="bg-white border border-border-light rounded-lg shadow-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Wrench size={16} className="text-mint" />
                  <h3 className="text-[11px] font-medium tracking-[0.05em] text-slate-muted uppercase">
                    Vendor
                  </h3>
                </div>
                <span className="text-[14px] font-medium text-ink">{workOrder.vendor}</span>
              </div>
            )}

            {/* Cost Card */}
            {workOrder.estCost !== undefined && (
              <div className="bg-white border border-border-light rounded-lg shadow-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign size={16} className="text-mint" />
                  <h3 className="text-[11px] font-medium tracking-[0.05em] text-slate-muted uppercase">
                    Est. Cost
                  </h3>
                </div>
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-[24px] font-semibold text-ink tracking-[-0.02em]"
                  >
                    ${workOrder.estCost.toLocaleString()}
                  </span>
                  {workOrder.nte && (
                    <span className="text-[13px] text-slate-muted">
                      (NTE: ${workOrder.nte.toLocaleString()})
                    </span>
                  )}
                </div>
                {workOrder.nte && workOrder.estCost > workOrder.nte && (
                  <div className="mt-2 px-3 py-2 bg-emergency-light rounded-md">
                    <span className="text-[12px] text-emergency font-medium">
                      Exceeds NTE by ${(workOrder.estCost - workOrder.nte).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Owner Approval Card */}
            <div className="bg-white border border-border-light rounded-lg shadow-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck size={16} className="text-mint" />
                <h3 className="text-[11px] font-medium tracking-[0.05em] text-slate-muted uppercase">
                  Owner Approval
                </h3>
              </div>
              <span
                className={`text-[14px] font-medium ${
                  workOrder.ownerApproval === 'Bypassed (Emergency)'
                    ? 'text-emergency'
                    : workOrder.ownerApproval === 'Pending'
                      ? 'text-status-progress'
                      : 'text-mint'
                }`}
              >
                {workOrder.ownerApproval}
              </span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
