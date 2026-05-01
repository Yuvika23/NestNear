// src/components/SemesterBadge.jsx
import { SEMESTER_CONFIG, isAvailableNow } from '../utils/semester';

export default function SemesterBadge({ value, showAvailability = false, size = 'normal' }) {
  const s = value || 'yearround';
  const config = SEMESTER_CONFIG[s];
  const availableNow = isAvailableNow(s);
  const isSmall = size === 'small';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
      <span style={{
        background: config.bg,
        color: config.color,
        border: `1.5px solid ${config.border}`,
        padding: isSmall ? '2px 8px' : '4px 12px',
        borderRadius: '40px',
        fontSize: isSmall ? '0.7rem' : '0.75rem',
        fontWeight: 700,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
      }}>
        📅 {config.label}
        <span style={{ fontWeight: 400, opacity: 0.8 }}>({config.months})</span>
      </span>
      {showAvailability && (
        <span style={{
          fontSize: '0.72rem', fontWeight: 700,
          color: availableNow ? '#2D6A4F' : '#C84B31',
        }}>
          {availableNow ? '✓ Available now' : '✗ Not this sem'}
        </span>
      )}
    </div>
  );
}
