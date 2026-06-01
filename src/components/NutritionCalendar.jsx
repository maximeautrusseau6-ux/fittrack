import FlameStreak from './FlameStreak.jsx';

function formatInputDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(date) {
  const formatted = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Paris'
  }).format(date);

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export default function NutritionCalendar({ date, onPrev, onNext, onChange, completed }) {
  return (
    <div className="calendar-panel">
      <div className="calendar-title">
        <div className="flame-badge">
          <FlameStreak active={completed} />
        </div>
        <div>
          <span className="calendar-label">Calendrier journalier</span>
          <h2>{formatDisplayDate(date)}</h2>
        </div>
      </div>

      <div className="calendar-controls">
        <button type="button" className="calendar-button" onClick={onPrev}>
          ←
        </button>
        <input
          className="calendar-input"
          type="date"
          aria-label="Choisir une date"
          value={formatInputDate(date)}
          onChange={(event) => onChange(event.target.value)}
        />
        <button type="button" className="calendar-button" onClick={onNext}>
          →
        </button>
      </div>
    </div>
  );
}
