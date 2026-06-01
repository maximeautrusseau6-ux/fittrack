import { useState } from 'react';
import BottomNav from './components/Sidebar.jsx';
import NutritionPage from './components/NutritionPage.jsx';
import TrainingPage from './components/TrainingPage.jsx';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('nutrition');
  const [navHidden, setNavHidden] = useState(false);

  const renderPage = () => {
    switch (activeTab) {
      case 'training':
        return <TrainingPage setNavHidden={setNavHidden} />;
      case 'nutrition':
        return <NutritionPage setNavHidden={setNavHidden} />;
      case 'library':
        return (
          <div className="placeholder-page">
            <h1>Bibliothèque</h1>
            <p>Contenu en cours de développement.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="placeholder-page">
            <h1>Préférences</h1>
            <p>Paramètres à venir.</p>
          </div>
        );
      default:
        return <NutritionPage setNavHidden={setNavHidden} />;
    }
  };

  return (
    <div className="app-shell">
      <main className="app-main">{renderPage()}</main>
      <BottomNav active={activeTab} onSelect={setActiveTab} hidden={navHidden} />
    </div>
  );
}
