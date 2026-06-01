import './Training.css';

export default function RestTimer({ running, seconds, onStop, message }) {
  if (!running && !message) return null;

  return (
    <div className="rest-timer-backdrop" role="alert">
      <div className="rest-timer-card">
        <p className="drawer-label">Repos</p>
        <h2>{running ? 'Temps de repos' : 'Repos terminé'}</h2>
        <p>{running ? `Temps restant : ${seconds}s` : message}</p>
        <button className="primary-button" type="button" onClick={onStop}>
          Arrêter
        </button>
      </div>
    </div>
  );
}
