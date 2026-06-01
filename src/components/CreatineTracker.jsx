export default function CreatineTracker({ taken, onToggle }) {
  return (
    <section className="nutrition-card creatine-card">
      <div className="card-heading">
        <div>
          <span className="section-label">Créatine</span>
          <h2>Créatine prise aujourd'hui</h2>
        </div>
        <label className="switch">
          <input type="checkbox" checked={taken} onChange={onToggle} />
          <span className="slider" />
        </label>
      </div>
      <p className="creatine-text">
        Coche la case lorsque tu as pris ta créatine. Cela permet de valider la série du jour.
      </p>
    </section>
  );
}
