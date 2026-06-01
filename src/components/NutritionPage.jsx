import { useEffect, useState } from 'react';
import NutritionCalendar from './NutritionCalendar.jsx';
import NutritionSummary from './NutritionSummary.jsx';
import MacroCard from './MacroCard.jsx';
import MealDrawer from './MealDrawer.jsx';
import CreatineTracker from './CreatineTracker.jsx';
import GoalsModal from './GoalsModal.jsx';

const STORAGE_KEY_DATA = 'fittrack_nutrition_data';
const STORAGE_KEY_GOALS = 'fittrack_nutrition_goals';

const defaultGoals = {
  calories: 2500,
  protein: 180,
  carbs: 250,
  fat: 70,
  creatine: 5
};

const createEmptyDay = () => ({
  meals: [],
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  creatineTaken: false
});

function getParisDate(date = new Date()) {
  const parisString = date.toLocaleString('en-US', { timeZone: 'Europe/Paris' });
  const parisDate = new Date(parisString);
  return new Date(parisDate.getFullYear(), parisDate.getMonth(), parisDate.getDate());
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(date) {
  const formatter = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Paris'
  });
  const formatted = formatter.format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function formatInputDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function clampPercent(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export default function NutritionPage() {
  const [selectedDate, setSelectedDate] = useState(getParisDate());
  const [nutritionData, setNutritionData] = useState({});
  const [goals, setGoals] = useState(defaultGoals);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [goalsOpen, setGoalsOpen] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY_DATA);
    const storedGoals = localStorage.getItem(STORAGE_KEY_GOALS);

    if (storedData) {
      try {
        setNutritionData(JSON.parse(storedData));
      } catch (error) {
        console.warn('Impossible de lire nutritionData', error);
      }
    }

    if (storedGoals) {
      try {
        setGoals(JSON.parse(storedGoals));
      } catch (error) {
        console.warn('Impossible de lire goals', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(nutritionData));
  }, [nutritionData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_GOALS, JSON.stringify(goals));
  }, [goals]);

  const dateKey = formatDateKey(selectedDate);
  const dayData = nutritionData[dateKey] || createEmptyDay();

  const completedDay =
    dayData.calories >= goals.calories &&
    dayData.protein >= goals.protein &&
    dayData.carbs >= goals.carbs &&
    dayData.fat >= goals.fat &&
    dayData.creatineTaken;

  const totalFlames = Object.values(nutritionData).filter(
    (entry) =>
      entry.calories >= goals.calories &&
      entry.protein >= goals.protein &&
      entry.carbs >= goals.carbs &&
      entry.fat >= goals.fat &&
      entry.creatineTaken
  ).length;

  const caloriesProgress = clampPercent((dayData.calories / goals.calories) * 100);
  const proteinProgress = clampPercent((dayData.protein / goals.protein) * 100);
  const carbsProgress = clampPercent((dayData.carbs / goals.carbs) * 100);
  const fatProgress = clampPercent((dayData.fat / goals.fat) * 100);

  const updateCurrentDay = (callback) => {
    setNutritionData((previous) => {
      const current = previous[dateKey] || createEmptyDay();
      return {
        ...previous,
        [dateKey]: callback(current)
      };
    });
  };

  const handleAddMeal = (meal) => {
    updateCurrentDay((current) => ({
      ...current,
      meals: [...current.meals, meal],
      calories: current.calories + meal.calories,
      protein: current.protein + meal.protein,
      carbs: current.carbs + meal.carbs,
      fat: current.fat + meal.fat
    }));
    setDrawerOpen(false);
  };

  const handleToggleCreatine = () => {
    updateCurrentDay((current) => ({
      ...current,
      creatineTaken: !current.creatineTaken
    }));
  };

  const handleDateChange = (value) => {
    const next = new Date(`${value}T00:00:00`);
    setSelectedDate(getParisDate(next));
  };

  const handlePreviousDay = () => {
    const previous = new Date(selectedDate);
    previous.setDate(previous.getDate() - 1);
    setSelectedDate(getParisDate(previous));
  };

  const handleNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(getParisDate(next));
  };

  const saveGoals = (newGoals) => {
    setGoals(newGoals);
    setGoalsOpen(false);
  };

  return (
    <div className="nutrition-page">
      <div className="nutrition-header">
        <div>
          <p className="section-label">Nutrition</p>
          <h1>Suivi journalier</h1>
          <p className="flame-counter">🔥 {totalFlames} flamme{totalFlames > 1 ? 's' : ''} accumulée{totalFlames > 1 ? 's' : ''}</p>
        </div>
        <button className="button button--primary" onClick={() => setDrawerOpen(true)}>
          Ajouter un repas
        </button>
      </div>

      <section className="nutrition-card nutrition-calendar-card">
        <NutritionCalendar
          date={selectedDate}
          onPrev={handlePreviousDay}
          onNext={handleNextDay}
          onChange={handleDateChange}
          completed={completedDay}
        />
      </section>

      <NutritionSummary
        current={dayData.calories}
        goal={goals.calories}
        progress={caloriesProgress}
      />

      <div className="macro-grid">
        <MacroCard
          label="Protéines"
          current={dayData.protein}
          goal={goals.protein}
          unit="g"
          progress={proteinProgress}
        />
        <MacroCard
          label="Glucides"
          current={dayData.carbs}
          goal={goals.carbs}
          unit="g"
          progress={carbsProgress}
        />
        <MacroCard
          label="Lipides"
          current={dayData.fat}
          goal={goals.fat}
          unit="g"
          progress={fatProgress}
        />
      </div>

      <div className="nutrition-bottom-row">
        <CreatineTracker taken={dayData.creatineTaken} onToggle={handleToggleCreatine} />
        <button className="button button--secondary" onClick={() => setGoalsOpen(true)}>
          Modifier mes objectifs
        </button>
      </div>

      <section className="nutrition-card meal-history-card">
        <div className="card-heading">
          <div>
            <h2>Repas du jour</h2>
            <p className="muted-text">Historique de la journée sélectionnée</p>
          </div>
          <span className="meal-count">{dayData.meals.length} repas</span>
        </div>

        {dayData.meals.length > 0 ? (
          <ul className="meal-list">
            {dayData.meals.map((meal, index) => (
              <li key={`${meal.name}-${index}`} className="meal-item">
                <div>
                  <strong>{meal.name}</strong>
                  <p>{meal.calories} kcal · {meal.protein}g prot · {meal.carbs}g gluc · {meal.fat}g lip</p>
                </div>
                <span className="meal-time">{meal.time}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-state">Aucun repas enregistré pour cette date. Appuie sur “Ajouter un repas” pour commencer.</p>
        )}
      </section>

      <MealDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onAddMeal={handleAddMeal}
      />

      <GoalsModal open={goalsOpen} goals={goals} onSave={saveGoals} onClose={() => setGoalsOpen(false)} />
    </div>
  );
}
