import React from 'react';
import ProgressBar from '../components/ProgressBar';
import './Dashboard.css';

const getDayKey = () => new Date().toISOString().split('T')[0];

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
};

const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

export default function Dashboard({ sessions, nutrition, settings }) {
  const todayKey = getDayKey();
  const today = nutrition[todayKey] || {};
  const weight = settings.currentWeight || '—';
  const targetCalories = Number(settings.calories) || 3300;
  const targetProtein = Number(settings.protein) || 180;
  const targetCarbs = Number(settings.carbs) || 0;
  const targetFat = Number(settings.fat) || 0;

  const weekStart = getWeekStart(new Date());
  const weekSessions = sessions.filter(s => s.lastDone && new Date(s.lastDone) >= weekStart).length;

  const lastSession = [...sessions]
    .filter(s => s.lastDone)
    .sort((a, b) => new Date(b.lastDone) - new Date(a.lastDone))[0];

  return (
    <div className="dashboard">
      <p className="dashboard-date">{formatDate(todayKey)}</p>
      <h1 className="page-title">Tableau de bord</h1>

      <div className="dashboard-grid">
        <div className="dash-card dash-small">
          <p className="stat-label">Poids</p>
          <p className="stat-value">{weight} kg</p>
        </div>
        <div className="dash-card dash-small">
          <p className="stat-label">Calories</p>
          <p className="stat-value">{today.calories || 0} / {targetCalories}</p>
        </div>
        <div className="dash-card dash-small">
          <p className="stat-label">Protéines</p>
          <p className="stat-value">{today.protein || 0} / {targetProtein}g</p>
        </div>
        <div className="dash-card dash-small">
          <p className="stat-label">Séances</p>
          <p className="stat-value">{weekSessions} cette semaine</p>
        </div>
      </div>

      <div className="dash-card dash-objectives">
        <h2>Objectifs journaliers</h2>
        <div className="objective-row">
          <span>Calories</span>
          <span>{targetCalories} kcal</span>
        </div>
        <div className="objective-row">
          <span>Protéines</span>
          <span>{targetProtein} g</span>
        </div>
        <div className="objective-row">
          <span>Glucides</span>
          <span>{targetCarbs} g</span>
        </div>
        <div className="objective-row">
          <span>Lipides</span>
          <span>{targetFat} g</span>
        </div>
      </div>

      <div className="dash-card dash-last-session">
        <p className="section-title">Dernière séance</p>
        {lastSession ? (
          <>
            <p className="last-session-date">{formatDate(lastSession.lastDone)}</p>
            <p className="last-session-name">+ {lastSession.name}</p>
          </>
        ) : (
          <p className="last-session-empty">Aucune séance réalisée</p>
        )}
      </div>
    </div>
  );
}
