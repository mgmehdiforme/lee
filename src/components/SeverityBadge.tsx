interface SeverityBadgeProps {
  severity: string;
}

const severityStyles: Record<string, { bg: string; text: string; border?: string }> = {
  'Emergency': { bg: '#FDEDEA', text: '#E85D4A', border: '#E85D4A' },
  'High': { bg: 'rgba(232, 168, 56, 0.1)', text: '#C98720' },
  'Medium': { bg: 'rgba(107, 143, 168, 0.1)', text: '#4A6B8A' },
  'Low': { bg: 'rgba(107, 143, 168, 0.06)', text: '#6B8FA8' },
};

export default function SeverityBadge({ severity }: SeverityBadgeProps) {
  const style = severityStyles[severity] || severityStyles['Low'];

  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-medium"
      style={{
        backgroundColor: style.bg,
        color: style.text,
        border: style.border ? `1px solid ${style.border}` : 'none',
      }}
    >
      {severity}
    </span>
  );
}
