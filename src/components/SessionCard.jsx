import './Training.css';

export default function SessionCard({ session, selected, onSelect, onEdit, onDelete }) {
  const totalSets = session.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0);
  const completedSets = session.exercises.reduce(
    (sum, exercise) => sum + exercise.sets.filter((set) => set.completed).length,
    0
  );
  const progress = totalSets ? Math.round((completedSets / totalSets) * 100) : 0;

  return (
    <article className={`session-card${selected ? ' session-card--selected' : ''}`} onClick={onSelect}>
      <div className="session-card-header">
        <div>
          <p className="session-card-label">Séance</p>
          <h3>{session.name}</h3>
          <p>{session.exercises.length} exercices · {totalSets} séries</p>
        </div>
        <div className="session-card-actions">
          <button className="icon-button" type="button" aria-label="Modifier" onClick={(event) => { event.stopPropagation(); onEdit(); }}>
            Modifier
          </button>
          <button className="icon-button" type="button" aria-label="Supprimer" onClick={(event) => { event.stopPropagation(); onDelete(); }}>
            Supprimer
          </button>
        </div>
      </div>
      <div className="session-card-meter">
        <span style={{ width: `${progress}%` }} />
      </div>
      <p className="session-card-progress">{progress}% terminé</p>
    </article>
  );
}
