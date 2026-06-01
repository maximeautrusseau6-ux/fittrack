import { useEffect, useState } from 'react';
import './Training.css';

export default function SetDrawer({ open, onClose, onSave }) {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (open) {
      setWeight('');
      setReps('');
      setNote('');
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="drawer-backdrop" role="dialog" aria-modal="true">
      <div className="drawer-panel">
        <div className="drawer-header">
          <div>
            <p className="drawer-label">Série</p>
            <h2>Ajouter une série</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose}>
            Fermer
          </button>
        </div>

        <form
          className="drawer-form"
          onSubmit={(event) => {
            event.preventDefault();
            onSave({
              weight: Number(weight) || 0,
              reps: Number(reps) || 0,
              note: note.trim()
            });
          }}
        >
          <label className="drawer-field">
            Poids (kg)
            <input
              type="number"
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
              placeholder="Ex : 60"
            />
          </label>
          <label className="drawer-field">
            Répétitions
            <input
              type="number"
              value={reps}
              onChange={(event) => setReps(event.target.value)}
              placeholder="Ex : 10"
            />
          </label>
          <label className="drawer-field">
            Note (facultatif)
            <input
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Petit détail ou sensation"
            />
          </label>
          <div className="drawer-actions">
            <button className="secondary-button" type="button" onClick={onClose}>
              Annuler
            </button>
            <button className="primary-button" type="submit">
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
