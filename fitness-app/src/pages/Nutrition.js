import React, { useState } from 'react';
import ProgressBar from '../components/ProgressBar';
import './Nutrition.css';

const getDayKey = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
};

const formatDate = (offset) =>
  new Date(getDayKey(offset)).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

const DEFAULT_DAY = {
  calories: 0, caloriesGoal: 2500,
  protein: 0, proteinGoal: 150,
  carbs: 0, carbsGoal: 250,
  fat: 0, fatGoal: 70,
  meals: [],
  creatine: false,
  trainingDone: false,
};

const computeMacroRatio = ({ protein, carbs, fat }) => {
  const p = Number(protein) || 0;
  const c = Number(carbs) || 0;
  const f = Number(fat) || 0;
  const totalCalories = p * 4 + c * 4 + f * 9;
  if (totalCalories === 0) return 'P: 0% G: 0% L: 0%';
  const pPerc = Math.round((p * 4) / totalCalories * 100);
  const cPerc = Math.round((c * 4) / totalCalories * 100);
  const fPerc = 100 - pPerc - cPerc;
  return `P: ${pPerc}% G: ${cPerc}% L: ${fPerc}%`;
};

const isGoalReached = (dayData, goals) => {
  const calories = Number(dayData.calories) || 0;
  const protein = Number(dayData.protein) || 0;
  const carbs = Number(dayData.carbs) || 0;
  const fat = Number(dayData.fat) || 0;

  return (
    calories >= goals.caloriesGoal &&
    protein >= goals.proteinGoal &&
    carbs >= goals.carbsGoal &&
    fat >= goals.fatGoal
  );
};

export default function Nutrition({ nutrition, setNutrition, settings }) {
  const [offset, setOffset] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [meal, setMeal] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' });

  const key = getDayKey(offset);
  const dayGoals = {
    caloriesGoal: Number(settings.calories) || DEFAULT_DAY.caloriesGoal,
    proteinGoal: Number(settings.protein) || DEFAULT_DAY.proteinGoal,
    carbsGoal: Number(settings.carbs) || DEFAULT_DAY.carbsGoal,
    fatGoal: Number(settings.fat) || DEFAULT_DAY.fatGoal,
  };

  const storedDay = nutrition[key] || {};
  const day = {
    ...DEFAULT_DAY,
    ...storedDay,
    ...dayGoals,
    meals: storedDay.meals || [],
    creatine: storedDay.creatine || false,
    trainingDone: storedDay.trainingDone || false,
  };

  const macroRatio = computeMacroRatio(settings);
  const dailyGoalReached = isGoalReached(day, dayGoals);

  const currentStreak = (() => {
    let streak = 0;
    for (let i = 0; i < 30; i += 1) {
      const streakKey = getDayKey(-i);
      const streakDay = nutrition[streakKey] || {};
      const merged = {
        ...DEFAULT_DAY,
        ...streakDay,
        ...dayGoals,
      };
      if (isGoalReached(merged, dayGoals)) {
        streak += 1;
      } else {
        break;
      }
    }
    return streak;
  })();

  const updateDay = (data) => {
    setNutrition(prev => ({ ...prev, [key]: data }));
  };

  const addMeal = () => {
    const m = {
      name: meal.name || 'Repas',
      calories: Number(meal.calories) || 0,
      protein: Number(meal.protein) || 0,
      carbs: Number(meal.carbs) || 0,
      fat: Number(meal.fat) || 0,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };
    updateDay({
      ...day,
      calories: day.calories + m.calories,
      protein: day.protein + m.protein,
      carbs: day.carbs + m.carbs,
      fat: day.fat + m.fat,
      meals: [...(day.meals || []), m],
    });
    setMeal({ name: '', calories: '', protein: '', carbs: '', fat: '' });
    setDrawerOpen(false);
  };

  const deleteMeal = (idx) => {
    const m = day.meals[idx];
    updateDay({
      ...day,
      calories: day.calories - m.calories,
      protein: day.protein - m.protein,
      carbs: day.carbs - m.carbs,
      fat: day.fat - m.fat,
      meals: day.meals.filter((_, i) => i !== idx),
    });
  };

  const macros = [
    { key: 'protein', label: 'Protéines', unit: 'g', color: 'var(--green)' },
    { key: 'carbs', label: 'Glucides', unit: 'g', color: 'var(--purple)' },
    { key: 'fat', label: 'Lipides', unit: 'g', color: 'var(--amber)' },
  ];

  return (
    <div className="nutrition">
      <div className="nutrition-header">
        <h1 className="page-title">Nutrition 🍽</h1>
        <button className="btn-primary" onClick={() => setDrawerOpen(true)}>+ Repas</button>
      </div>

      <div className="day-nav">
        <button className="nav-arrow" onClick={() => setOffset(offset - 1)}>◀</button>
        <h2 className="day-label">{formatDate(offset)}</h2>
        <button className="nav-arrow" onClick={() => setOffset(offset + 1)}>▶</button>
      </div>

      <div className="streak-row">
        {dailyGoalReached ? (
          <span className="goal-badge">🔥 Objectifs atteints{currentStreak > 1 ? ` · ${currentStreak} jours` : ''}</span>
        ) : (
          <span className="goal-hint">Remplis tous tes objectifs pour allumer ta flamme.</span>
        )}
      </div>

      {/* Calories */}
      <div className="nut-card calories-card">
        <div className="nut-top">
          <span className="nut-label">Calories</span>
          <span className="nut-value">{day.calories} <span className="nut-goal">/ {day.caloriesGoal} kcal</span></span>
        </div>
        <ProgressBar value={day.calories} goal={day.caloriesGoal} color="var(--amber)" />

        <label className="creatine-toggle">
          <input
            type="checkbox"
            checked={day.creatine}
            onChange={e => updateDay({ ...day, creatine: e.target.checked })}
          />
          Créatine prise
        </label>
      </div>

      {/* Macros */}
      <div className="macros-grid">
        {macros.map(m => (
          <div key={m.key} className="nut-card">
            <p className="nut-label">{m.label}</p>
            <p className="nut-num" style={{ color: m.color }}>{day[m.key]}<span className="nut-unit">g</span></p>
            <p className="nut-goal-small">/ {day[m.key + 'Goal']}g</p>
            <ProgressBar value={day[m.key]} goal={day[m.key + 'Goal']} color={m.color} />
          </div>
        ))}
      </div>

      <div className="macro-ratio-row">
        <span className="macro-ratio-label">Répartition des macros</span>
        <strong>{macroRatio}</strong>
      </div>

      {/* Meals list */}
      <div className="meals-section">
        <h3 className="section-title">Repas du jour</h3>
        {(day.meals || []).length === 0 ? (
          <p className="empty-text">Aucun repas enregistré</p>
        ) : (
          day.meals.map((m, i) => (
            <div key={i} className="meal-row">
              <div className="meal-info">
                <span className="meal-name">{m.name}</span>
                <span className="meal-time">{m.time}</span>
              </div>
              <div className="meal-stats">
                <span>{m.calories} kcal</span>
                <span style={{ color: 'var(--green)' }}>{m.protein}g P</span>
                <span style={{ color: 'var(--purple)' }}>{m.carbs}g G</span>
                <span style={{ color: 'var(--amber)' }}>{m.fat}g L</span>
              </div>
              <button className="btn-danger-sm" onClick={() => deleteMeal(i)}>✕</button>
            </div>
          ))
        )}
      </div>

      {/* Drawer */}
      {drawerOpen && (
        <div className="overlay" onClick={() => setDrawerOpen(false)}>
          <div className="drawer" onClick={e => e.stopPropagation()}>
            <div className="drawer-handle" />
            <h2 className="drawer-title">Ajouter un repas</h2>

            <input
              placeholder="Nom du repas (optionnel)"
              value={meal.name}
              onChange={e => setMeal({ ...meal, name: e.target.value })}
              className="styled-input"
              style={{ width: '100%', marginBottom: 16 }}
            />

            <div className="drawer-grid">
              {[
                { key: 'calories', label: 'Calories (kcal)' },
                { key: 'protein', label: 'Protéines (g)' },
                { key: 'carbs', label: 'Glucides (g)' },
                { key: 'fat', label: 'Lipides (g)' },
              ].map(f => (
                <div key={f.key}>
                  <label className="field-label">{f.label}</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={meal[f.key]}
                    onChange={e => setMeal({ ...meal, [f.key]: e.target.value })}
                    className="styled-input"
                    style={{ width: '100%' }}
                  />
                </div>
              ))}
            </div>

            <button className="btn-primary" style={{ width: '100%', marginTop: 20, padding: 14 }} onClick={addMeal}>
              Ajouter ce repas
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
