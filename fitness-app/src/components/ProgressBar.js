import React from 'react';

export default function ProgressBar({ value, goal, color = 'var(--accent)' }) {
  const pct = Math.min(100, goal ? (value / goal) * 100 : 0);
  return (
    <div style={{ height: 8, background: 'rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden', marginTop: 10 }}>
      <div style={{
        height: '100%',
        width: `${pct}%`,
        background: color,
        borderRadius: 20,
        transition: 'width 0.4s ease'
      }} />
    </div>
  );
}
