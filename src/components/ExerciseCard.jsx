import './Training.css';

export default function ExerciseCard({ exercise, sessionId, history, onToggleComplete, onAddSet }) {
  return (
    <article className="exercise-card">
      <div className="exercise-card-header">
        <div>
          <h3>{exercise.name}</h3>
          <p className="exercise-meta">{exercise.sets.length} séries · {history ? `Dernière séance ${new Date(history.date).toLocaleDateString('fr-FR')}` : 'Pas d’historique'}</p>
        </div>
        <button className="secondary-button" type="button" onClick={onAddSet}>
          + Série
        </button>
      </div>

      {exercise.sets.length ? (
        exercise.sets.map((set) => (
          <div key={set.id} className="set-row">
            <div className="set-info">
              <strong>{set.weight} kg × {set.reps}</strong>
              {set.note ? <span className="set-badge">{set.note}</span> : null}
            </div>
            <div className="set-actions">
              <button
                className={`secondary-button${set.completed ? ' primary-button' : ''}`}
                type="button"
                onClick={() => onToggleComplete(set.id)}
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
