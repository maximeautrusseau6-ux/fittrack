import React from 'react';
import './Progression.css';

const getDayKey = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
};

const getLast30DaysKeys = () => {
  const keys = [];
  for (let i = 0; i < 30; i += 1) {
    keys.push(getDayKey(-i));
  }
  return keys;
};

export default function Progression({ sessions, nutrition, settings }) {
  const totalSessions = sessions.length;
  const last30Days = getLast30DaysKeys();
  const daysWithNutrition = last30Days.filter(key => nutrition[key] && nutrition[key].calories > 0).length;
  const avgCalories = Math.round(
    last30Days.reduce((sum, key) => sum + ((nutrition[key] && nutrition[key].calories) || 0), 0) / 30
  );

  const heatmapDays = last30Days.map(key => {
    const day = nutrition[key] || {};
    const hasNutrition = (day.calories || 0) > 0 || (day.meals || []).length > 0;
    const trainingDone = day.trainingDone || false;
    const goals = {
      caloriesGoal: Number(settings.calories) || 2500,
      proteinGoal: Number(settings.protein) || 150,
      carbsGoal: Number(settings.carbs) || 250,
      fatGoal: Number(settings.fat) || 70,
    };
    const achieved = (
      (day.calories || 0) >= goals.caloriesGoal &&
      (day.protein || 0) >= goals.proteinGoal &&
      (day.carbs || 0) >= goals.carbsGoal &&
      (day.fat || 0) >= goals.fatGoal
    );

    let status = 'idle';
    if (!hasNutrition && !trainingDone) status = 'idle';
    else if (trainingDone && achieved) status = 'training-goal';
    else if (trainingDone) status = 'training-only';
    else if (hasNutrition && achieved) status = 'nutrition-goal';
    else if (hasNutrition) status = 'nutrition-fail';

    return { label: key.slice(5), status };
  });

  const statusClasses = {
    idle: 'cell-idle',
    'training-only': 'cell-training',
    'nutrition-goal': 'cell-nutrition',
    'training-goal': 'cell-top',
    'nutrition-fail': 'cell-fail',
  };

  return (
    <div className="progression">
      <h1 className="page-title">Progression 📈</h1>
      <p className="progression-intro">Statistiques & analyses</p>

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Total séances</p>
          <p className="stat-value">{totalSessions}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">30 derniers j.</p>
          <p className="stat-value">{daysWithNutrition}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Moy. cal./j.</p>
          <p className="stat-value">{avgCalories}</p>
        </div>
      </div>

      <div className="regularity-card">
        <div className="regularity-header">
          <div>
            <p className="section-title">Régularité hebdomadaire</p>
          </div>
          <span className="regularity-badge">{totalSessions} séances</span>
        </div>

        <div className="heatmap-grid">
          {heatmapDays.map((day) => (
            <div key={day.label} className={`heatmap-cell ${statusClasses[day.status]}`}>
              <span className="heatmap-date">{day.label}</span>
            </div>
          ))}
        </div>
        <div className="heatmap-legend">
          <div className="legend-item">
            <span className="legend-color cell-idle" />
            <span>Rien</span>
          </div>
          <div className="legend-item">
            <span className="legend-color cell-nutrition" />
            <span>Nutrition atteinte</span>
          </div>
          <div className="legend-item">
            <span className="legend-color cell-training" />
            <span>Entraînement seul</span>
          </div>
          <div className="legend-item">
            <span className="legend-color cell-top" />
            <span>Nutrition + muscu</span>
          </div>
          <div className="legend-item">
            <span className="legend-color cell-fail" />
            <span>Nutrition non atteinte</span>
          </div>
        </div>
      </div>
    </div>
  );
}
