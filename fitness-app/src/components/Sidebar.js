import React from 'react';
import './Sidebar.css';

const NAV = [
  { id: 'dashboard', icon: '⚡', label: 'Tableau de bord' },
  { id: 'training',  icon: '🏋️', label: 'Entraînement' },
  { id: 'nutrition', icon: '🍽',  label: 'Nutrition' },
  { id: 'progression', icon: '📈', label: 'Progression' },
  { id: 'settings', icon: '⚙️', label: 'Réglage' },
];

export default function Sidebar({ page, setPage }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">💪</span>
        <span className="logo-text">FIT<strong>TRACK</strong></span>
      </div>

      <nav className="sidebar-nav">
        {NAV.map(item => (
          <button
            key={item.id}
            className={`nav-item ${page === item.id ? 'active' : ''}`}
            onClick={() => setPage(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {page === item.id && <span className="nav-dot" />}
          </button>
        ))}
      </nav>
    </aside>
  );
}
