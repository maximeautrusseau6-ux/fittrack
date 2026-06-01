import './Sidebar.css';

const NAV = [
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'explore', label: 'Explorer' },
  { id: 'library', label: 'Bibliothèque' },
  { id: 'settings', label: 'Préférences' }
];

export default function Sidebar({ hidden }) {
  return (
    <nav className={`bottom-nav${hidden ? ' bottom-nav--hidden' : ''}`} aria-hidden={hidden}>
      {NAV.map((item) => (
        <button key={item.id} className="bottom-nav-button" type="button">
          <span className="nav-icon" aria-hidden="true" />
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
