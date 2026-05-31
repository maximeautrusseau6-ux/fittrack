import { useState } from 'react';
import './App.css';
import { useLocalStorage } from './hooks/useLocalStorage';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Training from './pages/Training';
import Nutrition from './pages/Nutrition';
import Progression from './pages/Progression';
import Settings from './pages/Settings';

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [sessions, setSessions] = useLocalStorage('sessions', []);
  const [nutrition, setNutrition] = useLocalStorage('nutrition', {});
  const [settings, setSettings] = useLocalStorage('settings', {
    objective: 'Prise de masse',
    currentWeight: '',
    targetWeight: '',
    calories: '2500',
    protein: '150',
    carbs: '250',
    fat: '70',
    macroRatio: 'P: 27% G: 45% L: 27%',
  });

  const pages = {
    dashboard: <Dashboard sessions={sessions} nutrition={nutrition} settings={settings} />,
    training:  <Training sessions={sessions} setSessions={setSessions} nutrition={nutrition} setNutrition={setNutrition} />,
    nutrition: <Nutrition nutrition={nutrition} setNutrition={setNutrition} settings={settings} />,
    progression: <Progression sessions={sessions} nutrition={nutrition} settings={settings} />,
    settings: <Settings settings={settings} setSettings={setSettings} />,
  };

  return (
    <div className="app-layout">
      <Sidebar page={page} setPage={setPage} />
      <main className="app-main">
        {pages[page]}
      </main>
    </div>
  );
}
