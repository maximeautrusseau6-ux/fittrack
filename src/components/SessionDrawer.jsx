import { useEffect, useState } from 'react';
import './Training.css';

export default function SessionDrawer({ open, onClose, onSave, initialName }) {
  const [name, setName] = useState(initialName || '');

  useEffect(() => {
    setName(initialName || '');
  }, [initialName, open]);

  if (!open) return null;

  return (
    <div className="drawer-backdrop" role="dialog" aria-modal="true">
      <div className="drawer-panel">
        <div className="drawer-header">
          <div>
            <p className="drawer-label">Séance</p>
            <h2>{initialName ? 'Renommer la séance' : 'Nouvelle séance'}</h2>
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
            Nom de la séance
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex : Full body du mardi"
              autoFocus
            />
          </label>
          <div className="drawer-actions">
            <button className="secondary-button" type="button" onClick={onClose}>
              Annuler
            </button>
            <button className="primary-button" type="submit">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
