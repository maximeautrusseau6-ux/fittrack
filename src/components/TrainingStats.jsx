import './Training.css';

function formatNumber(value) {
  return value.toLocaleString('fr-FR');
}

export default function TrainingStats({ stats }) {
  return (
    <section className="training-stats">
      <div className="stat-card">
        <span>Sessions</span>
        <strong>{formatNumber(stats.completedSessions)}</strong>
      </div>
      <div className="stat-card">
        <span>Exercices</span>
        <strong>{formatNumber(stats.totalExercises)}</strong>
      </div>
      <div className="stat-card">
        <span>Volume total</span>
        <strong>{formatNumber(stats.totalVolume)} kg</strong>
      </div>
      <div className="stat-card">
        <span>Exercice favori</span>
        <strong>{stats.favoriteName}</strong>
      </div>
    </section>
  );
}
