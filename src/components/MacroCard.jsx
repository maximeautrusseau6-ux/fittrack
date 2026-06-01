export default function MacroCard({ label, current, goal, unit, progress }) {
  const progressClass = progress >= 100 ? 'macro-value macro-value--green' : progress >= 60 ? 'macro-value macro-value--orange' : 'macro-value macro-value--red';

  return (
    <article className="macro-card">
      <div className="macro-card-top">
        <p className="macro-title">{label}</p>
        <span className={progressClass}>{progress}%</span>
      </div>
      <div className="macro-stats">
        <strong>{current}</strong>
        <span>/ {goal} {unit}</span>
      </div>
      <div className="progress-track macro-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </article>
  );
}
