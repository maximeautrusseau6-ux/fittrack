export default function NutritionSummary({ current, goal, progress }) {
  const progressClass = progress >= 100 ? 'summary-pill summary-pill--green' : progress >= 60 ? 'summary-pill summary-pill--orange' : 'summary-pill summary-pill--red';

  return (
    <section className="nutrition-card summary-card">
      <div className="card-heading">
        <div>
          <span className="section-label">Objectif calories</span>
          <h2>Calories</h2>
        </div>
        <span className={progressClass}>{progress}%</span>
      </div>

      <div className="summary-body">
        <div className="summary-values">
          <strong>{current}</strong>
          <span>/ {goal} kcal</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </section>
  );
}
