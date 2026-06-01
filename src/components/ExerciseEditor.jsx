import { useEffect, useState } from 'react';
import './Training.css';

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function createEmptySeries(index) {
  return {
    id: `series-${Date.now()}-${index}`,
    weight: 0,
    reps: 0,
    note: ''
  };
}

export default function ExerciseEditor({ open, initialExercise, onClose, onSave }) {
  const [name, setName] = useState(initialExercise?.name || '');
  const [sets, setSets] = useState(safeArray(initialExercise?.sets));

  useEffect(() => {
    if (!open) return;
    setName(initialExercise?.name || '');
    setSets(safeArray(initialExercise?.sets));
  }, [initialExercise, open]);

  if (!open) return null;

  const updateSeries = (index, field, value) => {
    setSets((current) =>
      current.map((serie, serieIndex) =>
        serieIndex === index
          ? {
              ...serie,
              [field]: field === 'note' ? String(value) : Math.max(0, Number(value) || 0)
            }
          : serie
      )
    );
  };

  const addSeries = () => {
    setSets((current) => [...current, createEmptySeries(current.length + 1)]);
  };

  const removeSeries = (index) => {
    setSets((current) => current.filter((_, serieIndex) => serieIndex !== index));
  };

  const handleSave = () => {
    if (!initialExercise) return;
    const payload = {
      ...initialExercise,
      name: String(name || 'Exercice').trim(),
      sets: safeArray(sets).map((serie, index) => ({
        id: String(serie.id || `series-${index}`),
        weight: Math.max(0, Number(serie.weight) || 0),
        reps: Math.max(0, Number(serie.reps) || 0),
        note: String(serie.note || '').trim(),
        completed: Boolean(serie.completed),
        createdAt: serie.createdAt || new Date().toISOString()
      }))
    };
    onSave?.(payload);
    onClose?.();
  };

  return (
    <div className="exercise-sheet-backdrop" role="dialog" aria-modal="true">
      <div className="exercise-sheet-panel">
        <div className="exercise-sheet-head">
          <div>
            <p className="drawer-label">Modifier l’exercice</p>
            <h2>{initialExercise?.name ? 'Édition de l’exercice' : 'Nouvel exercice'}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose}>
            Fermer
          </button>
        </div>

        <label className="drawer-field">
          Nom de l’exercice
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ex : Développé couché"
            inputMode="text"
            autoFocus
          />
        </label>

        <div className="exercise-sheet-table">
          <div className="exercise-sheet-row exercise-sheet-row--header">
            <span>Série</span>
            <span>Poids (kg)</span>
            <span>Rép.</span>
            <span></span>
          </div>

          {safeArray(sets).map((serie, index) => (
            <div key={serie.id} className="exercise-sheet-row">
              <span className="series-label">S{index + 1}</span>
              <input
                type="number"
                inputMode="numeric"
                value={serie.weight}
                min="0"
                onChange={(event) => updateSeries(index, 'weight', event.target.value)}
                placeholder="0"
              />
              <input
                type="number"
                inputMode="numeric"
                value={serie.reps}
                min="0"
                onChange={(event) => updateSeries(index, 'reps', event.target.value)}
                placeholder="0"
              />
              <button className="trash-button" type="button" onClick={() => removeSeries(index)} aria-label={`Supprimer série ${index + 1}`}>
                ×
              </button>
            </div>
          ))}
        </div>

        <button className="secondary-button exercise-sheet-add" type="button" onClick={addSeries}>
          Ajouter une série
        </button>

        <div className="drawer-actions exercise-sheet-actions">
          <button className="secondary-button" type="button" onClick={onClose}>
            Annuler
          </button>
          <button className="primary-button" type="button" onClick={handleSave}>
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
