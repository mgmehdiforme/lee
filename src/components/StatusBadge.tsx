import LiveDot from './LiveDot';

interface StatusBadgeProps {
  status: string;
  showDot?: boolean;
  size?: 'sm' | 'md';
}

const statusStyles: Record<string, { bg: string; text: string; border: string; dotColor?: string }> = {
  'New': { bg: 'rgba(107, 143, 168, 0.12)', text: '#6B8FA8', border: '#6B8FA8' },
  'Dispatched': { bg: 'rgba(127, 176, 105, 0.15)', text: '#7FB069', border: '#7FB069', dotColor: '#7FB069' },
  'Awaiting Approval': { bg: 'rgba(232, 168, 56, 0.12)', text: '#C98720', border: '#E8A838' },
  'In Progress': { bg: 'rgba(232, 168, 56, 0.12)', text: '#C98720', border: '#E8A838' },
  'Completed': { bg: 'rgba(127, 176, 105, 0.12)', text: '#7FB069', border: '#7FB069' },
  'New — AI Dispatching': { bg: 'rgba(127, 176, 105, 0.15)', text: '#7FB069', border: '#7FB069', dotColor: '#7FB069' },
  'EMERGENCY — Dispatched': { bg: 'rgba(232, 77, 74, 0.12)', text: '#E85D4A', border: '#E85D4A', dotColor: '#E85D4A' },
};

export default function StatusBadge({ status, showDot = false, size = 'sm' }: StatusBadgeProps) {
  const style = statusStyles[status] || statusStyles['New'];
  const fontSize = size === 'md' ? 'text-[13px]' : 'text-[12px]';
  const padding = size === 'md' ? 'px-3 py-1.5' : 'px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-medium ${fontSize} ${padding}`}
      style={{
        backgroundColor: style.bg,
        color: style.text,
        borderLeft: `3px solid ${style.border}`,
      }}
    >
      {showDot && style.dotColor && (
        <LiveDot color={style.dotColor} active={true} size="sm" />
      )}
      {status}
    </span>
  );
}
