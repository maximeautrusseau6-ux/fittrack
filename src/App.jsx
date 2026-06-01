import Sidebar from './components/Sidebar.jsx';
import NutritionPage from './components/NutritionPage.jsx';
import './App.css';

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <NutritionPage />
      </main>
    </div>
  );
}
