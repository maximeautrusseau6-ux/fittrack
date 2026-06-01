import './Training.css';

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

export default function ExerciseCard({ exercise, history, onToggleComplete, onAddSet, onEdit }) {
  const sets = safeArray(exercise?.sets);

  return (
    <article className="exercise-card">
      <div className="exercise-card-header">
        <div>
          <h3>{exercise?.name || 'Exercice'}</h3>
          <p className="exercise-meta">
            {sets.length} séries · {history ? `Dernière séance ${new Date(history.date).toLocaleDateString('fr-FR')}` : 'Pas d’historique'}
          </p>
        </div>
        <div className="exercise-card-actions">
          <button className="secondary-button" type="button" onClick={(event) => { event.stopPropagation(); onEdit?.(); }}>
            Modifier
          </button>
          <button className="secondary-button" type="button" onClick={(event) => { event.stopPropagation(); onAddSet?.(); }}>
            + Série
          </button>
        </div>
      </div>

      {sets.length ? (
        sets.map((set) => (
          <div key={set.id} className="set-row">
            <div className="set-info">
              <strong>{set.weight} kg × {set.reps}</strong>
              {set.note ? <span className="set-badge">{set.note}</span> : null}
            </div>
            <div className="set-actions">
              <button
                className={`secondary-button${set.completed ? ' primary-button' : ''}`}
                type="button"
                onClick={() => onToggleComplete?.(set.id)}
              >
                {set.completed ? 'Fini' : 'Marquer'}
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="empty-state-panel">
          <p>Aucune série pour cet exercice.</p>
          <small>Ajoutez une série pour démarrer l’exercice.</small>
        </div>
      )}
    </article>
  );
}
