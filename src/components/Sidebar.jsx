import './Sidebar.css';

const NAV = [
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'training', label: 'Entraînement' },
  { id: 'library', label: 'Bibliothèque' },
  { id: 'settings', label: 'Préférences' }
];

function Icon({ type }) {
  switch (type) {
    case 'nutrition':
      return (
        <svg className="nav-icon-svg" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="10" r="4" />
          <path d="M7.5 17.5a4.5 4.5 0 0 1 9 0" />
        </svg>
      );
    case 'training':
      return (
        <svg className="nav-icon-svg" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 11h2v2H3zM19 11h2v2h-2z" />
          <path d="M5 10.5l2-1.5 3 1.5 3-1.5 3 1.5 2-1.5" />
          <path d="M7 9v6M17 9v6" />
        </svg>
      );
    case 'library':
      return (
        <svg className="nav-icon-svg" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="5" width="5" height="14" rx="1.2" />
          <rect x="10" y="5" width="5" height="14" rx="1.2" />
          <rect x="16" y="5" width="4" height="14" rx="1.2" />
        </svg>
      );
    case 'settings':
      return (
        <svg className="nav-icon-svg" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="3.5" />
          <path d="M4.8 11h2.2M17 11h2.2M12 4.8v2.2M12 17v2.2M6.3 6.3l1.5 1.5M16.2 16.2l1.5 1.5M6.3 17.7l1.5-1.5M16.2 7.8l1.5-1.5" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Sidebar({ active, hidden, onSelect }) {
  return (
    <nav className={`bottom-nav${hidden ? ' bottom-nav--hidden' : ''}`} aria-hidden={hidden}>
      {NAV.map((item) => (
        <button
          key={item.id}
          className={`bottom-nav-button${active === item.id ? ' bottom-nav-button--active' : ''}`}
          type="button"
          onClick={() => onSelect(item.id)}
        >
          <Icon type={item.id} />
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
