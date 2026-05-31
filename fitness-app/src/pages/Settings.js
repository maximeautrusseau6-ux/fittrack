import React, { useState, useEffect } from 'react';
import './Settings.css';

const OBJECTIVES = [
  { value: 'Prise de masse', title: 'Prise de masse', desc: 'Surplus calorique, gain musculaire' },
  { value: 'Sèche', title: 'Sèche', desc: 'Déficit calorique, perte de gras' },
  { value: 'Maintien', title: 'Maintien', desc: 'Équilibre, entretien' },
];

const computeMacroRatio = (protein, carbs, fat) => {
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

export default function Settings({ settings, setSettings }) {
  const [local, setLocal] = useState(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const ratio = computeMacroRatio(local.protein, local.carbs, local.fat);
    if (local.macroRatio !== ratio) {
      setLocal(prev => ({ ...prev, macroRatio: ratio }));
    }
  }, [local.protein, local.carbs, local.fat, local.macroRatio]);

  const handleSave = () => {
    setSettings(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="settings">
      <h1 className="page-title">Réglages ⚙️</h1>
      <p className="settings-intro">Personnalise tes objectifs</p>

      <section className="settings-card">
        <h2>Objectif</h2>
        <div className="radio-grid">
          {OBJECTIVES.map(item => (
            <label
              key={item.value}
              className={`radio-card ${local.objective === item.value ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name="objective"
                value={item.value}
                checked={local.objective === item.value}
                onChange={() => setLocal({ ...local, objective: item.value })}
              />
              <span className="radio-title">{item.title}</span>
              <span className="radio-desc">{item.desc}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="settings-card">
        <h2>Poids</h2>
        <div className="field-row">
          <label className="field-label">
            Poids actuel
            <input
              type="number"
              value={local.currentWeight}
              onChange={e => setLocal({ ...local, currentWeight: e.target.value })}
              className="styled-input"
              placeholder="kg"
            />
          </label>
          <label className="field-label">
            Poids cible
            <input
              type="number"
              value={local.targetWeight}
              onChange={e => setLocal({ ...local, targetWeight: e.target.value })}
              className="styled-input"
              placeholder="kg"
            />
          </label>
        </div>
      </section>

      <section className="settings-card">
        <h2>Objectifs nutritionnels</h2>
        <div className="field-grid">
          <label className="field-label">
            Calories journalières
            <input
              type="number"
              value={local.calories}
              onChange={e => setLocal({ ...local, calories: e.target.value })}
              className="styled-input"
              placeholder="kcal"
            />
          </label>
          <label className="field-label">
            Protéines
            <input
              type="number"
              value={local.protein}
              onChange={e => setLocal({ ...local, protein: e.target.value })}
              className="styled-input"
              placeholder="g"
            />
          </label>
          <label className="field-label">
            Glucides
            <input
              type="number"
              value={local.carbs}
              onChange={e => setLocal({ ...local, carbs: e.target.value })}
              className="styled-input"
              placeholder="g"
            />
          </label>
          <label className="field-label">
            Lipides
            <input
              type="number"
              value={local.fat}
              onChange={e => setLocal({ ...local, fat: e.target.value })}
              className="styled-input"
              placeholder="g"
            />
          </label>
        </div>

        <label className="field-label macro-label">
          Répartition des macros
          <input
            type="text"
            value={local.macroRatio}
            readOnly
            className="styled-input"
            placeholder="P: 27% G: 45% L: 27%"
          />
        </label>
      </section>

      <button className="btn-primary btn-save" onClick={handleSave}>Sauvegarder</button>
      {saved && <p className="save-message">Paramètres enregistrés.</p>}
    </div>
  );
}
