import { useEffect, useState } from 'react';
import './Training.css';

export default function ExerciseDrawer({ open, onClose, onSave }) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (open) {
      setName('');
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="drawer-backdrop" role="dialog" aria-modal="true">
      <div className="drawer-panel">
        <div className="drawer-header">
          <div>
            <p className="drawer-label">Exercice</p>
            <h2>Ajouter un exercice</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose}>
            Fermer
          </button>
        </div>

        <form
          className="drawer-form"
          onSubmit={(event) => {
            event.preventDefault();
            onSave(name);
          }}
        >
          <label className="drawer-field">
            Nom de l'exercice
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex : Développé couché"
              autoFocus
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
