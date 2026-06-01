export default function FlameStreak({ active }) {
  if (!active) {
    return null;
  }

  return (
    <div className="flame-streak">
      <span className="flame-ring" aria-hidden="true">
        🔥
      </span>
      <span className="flame-text">Série validée</span>
    </div>
  );
}
