import './Sidebar.css';

const NAV = [
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'explore', label: 'Explorer' },
  { id: 'library', label: 'Bibliothèque' },
  { id: 'settings', label: 'Préférences' }
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-card">
        <div className="app-chip">FitTrack Nutrition</div>
      </div>

      <nav className="sidebar-nav">
        {NAV.map((item) => (
          <button key={item.id} className="nav-button" type="button">
            <span className="nav-dot" />
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
