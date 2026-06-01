import Sidebar from './components/Sidebar.jsx';
import './App.css';

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <section className="welcome-card">
          <span className="welcome-tag">Bienvenue</span>
          <h1>Application Génial de Maxime</h1>
          <p className="welcome-text">Une interface propre pour recommencer à coder depuis zéro.</p>
          <div className="status-pill">marche</div>
        </section>
      </main>
    </div>
  );
}
