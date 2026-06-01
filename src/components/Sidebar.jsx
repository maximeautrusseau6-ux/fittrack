import './Sidebar.css';

const NAV = [
  { id: 'nutrition', label: 'Nutrition', icon: '🍎' },
  { id: 'explore', label: 'Explorer', icon: '🔎' },
  { id: 'library', label: 'Bibliothèque', icon: '📚' },
  { id: 'settings', label: 'Préférences', icon: '⚙️' }
];

export default function Sidebar() {
  return (
    <nav className="bottom-nav">
      {NAV.map((item) => (
        <button key={item.id} className="bottom-nav-button" type="button">
          <span className="nav-icon" aria-hidden="true">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
