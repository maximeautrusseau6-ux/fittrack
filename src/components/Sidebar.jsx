import './Sidebar.css';

const NAV = [
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'explore', label: 'Explorer' },
  { id: 'library', label: 'Bibliothèque' },
  { id: 'settings', label: 'Préférences' }
];

function Icon({ type }) {
  switch (type) {
    case 'nutrition':
      return (
        <svg className="nav-icon-svg" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="6.2" />
          <rect x="4.4" y="6" width="2" height="12" rx="1" />
          <rect x="17.6" y="6" width="2" height="12" rx="1" />
        </svg>
      );
    case 'explore':
      return (
        <svg className="nav-icon-svg" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="5.2" />
          <line x1="15.5" y1="15.5" x2="20" y2="20" />
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

export default function Sidebar({ hidden }) {
  return (
    <nav className={`bottom-nav${hidden ? ' bottom-nav--hidden' : ''}`} aria-hidden={hidden}>
      {NAV.map((item) => (
        <button key={item.id} className="bottom-nav-button" type="button">
          <Icon type={item.id} />
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
