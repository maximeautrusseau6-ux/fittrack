import { useEffect, useState } from 'react';

export default function GoalsModal({ open, goals, onSave, onClose }) {
  const [values, setValues] = useState(goals);

  useEffect(() => {
    setValues(goals);
  }, [goals]);

  if (!open) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: Number(value) }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      calories: Number(values.calories) || 0,
      protein: Number(values.protein) || 0,
      carbs: Number(values.carbs) || 0,
      fat: Number(values.fat) || 0,
      creatine: Number(values.creatine) || 0
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(event) => event.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <p className="section-label">Objectifs personnalisés</p>
            <h2>Modifier mes objectifs</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Fermer le modal">
            ✕
          </button>
        </div>

        <form className="drawer-form" onSubmit={handleSubmit}>
          <label>
            Calories
            <input
              type="number"
              name="calories"
              min="0"
              value={values.calories}
              onChange={handleChange}
            />
          </label>

          <label>
            Protéines
            <input
              type="number"
              name="protein"
              min="0"
              value={values.protein}
              onChange={handleChange}
            />
          </label>

          <label>
            Glucides
            <input
              type="number"
              name="carbs"
              min="0"
              value={values.carbs}
              onChange={handleChange}
            />
          </label>

          <label>
            Lipides
            <input
              type="number"
              name="fat"
              min="0"
              value={values.fat}
              onChange={handleChange}
            />
          </label>

          <label>
            Créatine (g)
            <input
              type="number"
              name="creatine"
              min="0"
              value={values.creatine}
              onChange={handleChange}
            />
          </label>

          <button type="submit" className="button button--primary drawer-action">
            Enregistrer
          </button>
        </form>
      </div>
    </div>
  );
}
