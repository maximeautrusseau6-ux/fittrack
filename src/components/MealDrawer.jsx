import { useEffect, useState } from 'react';

const mealDefaults = {
  name: '',
  calories: '',
  protein: '',
  carbs: '',
  fat: ''
};

export default function MealDrawer({ open, onClose, onAddMeal }) {
  const [meal, setMeal] = useState(mealDefaults);
  const [touchStartY, setTouchStartY] = useState(null);

  useEffect(() => {
    if (!open) {
      setMeal(mealDefaults);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setMeal((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedName = meal.name.trim();
    const calories = Number(meal.calories);
    const protein = Number(meal.protein);
    const carbs = Number(meal.carbs);
    const fat = Number(meal.fat);

    if (!trimmedName || calories <= 0 || protein < 0 || carbs < 0 || fat < 0) {
      return;
    }

    onAddMeal({
      name: trimmedName,
      calories,
      protein,
      carbs,
      fat,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    });
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleTouchStart = (event) => {
    setTouchStartY(event.touches[0].clientY);
  };

  const handleTouchMove = (event) => {
    if (touchStartY === null) {
      return;
    }

    const currentY = event.touches[0].clientY;
    if (currentY - touchStartY > 80) {
      onClose();
      setTouchStartY(null);
    }
  };

  return (
    <div className="drawer-overlay" onClick={handleOverlayClick}>
      <div
        className="drawer-panel"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <div className="drawer-header">
          <div>
            <p className="section-label">Ajouter un repas</p>
            <h2>Repas</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Fermer le panneau">
            ✕
          </button>
        </div>

        <form className="drawer-form" onSubmit={handleSubmit}>
          <label>
            Nom du repas
            <input
              type="text"
              name="name"
              value={meal.name}
              onChange={handleInputChange}
              placeholder="Petit déjeuner"
              required
            />
          </label>

          <div className="drawer-grid">
            <label>
              Calories
              <input
                type="number"
                name="calories"
                min="0"
                value={meal.calories}
                onChange={handleInputChange}
                placeholder="2500"
                required
              />
            </label>
            <label>
              Protéines (g)
              <input
                type="number"
                name="protein"
                min="0"
                value={meal.protein}
                onChange={handleInputChange}
                placeholder="80"
                required
              />
            </label>
            <label>
              Glucides (g)
              <input
                type="number"
                name="carbs"
                min="0"
                value={meal.carbs}
                onChange={handleInputChange}
                placeholder="120"
                required
              />
            </label>
            <label>
              Lipides (g)
              <input
                type="number"
                name="fat"
                min="0"
                value={meal.fat}
                onChange={handleInputChange}
                placeholder="40"
                required
              />
            </label>
          </div>

          <button type="submit" className="button button--primary drawer-action">
            Ajouter le repas
          </button>
        </form>
      </div>
    </div>
  );
}
