import './Sidebar.css';

const NAV = [
  { id: 'home', label: 'Accueil' },
  { id: 'explore', label: 'Explorer' },
  { id: 'library', label: 'Bibliothèque' },
  { id: 'settings', label: 'Préférences' }
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-card">
        <div className="app-chip">Application Génial de Maxime</div>
      </div>

      <nav className="sidebar-nav">
        {NAV.map(item => (
          <button key={item.id} className="nav-button">
            <span className="nav-dot" />
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
