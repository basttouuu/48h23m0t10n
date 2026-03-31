import './TimerBar.css';

export default function TimerBar({ timeLeft, total }) {
  const pct = (timeLeft / total) * 100;
  const color =
    timeLeft <= 8
      ? 'var(--neon-red)'
      : timeLeft <= 15
      ? 'var(--neon-yellow)'
      : 'var(--neon-green)';

  return (
    <div className="timer-wrap">
      <div className="timer-icon" style={{ color }}>⏱</div>
      <div className="timer-track">
        <div
          className="timer-fill"
          style={{ width: `${pct}%`, background: color, boxShadow: `0 0 10px ${color}` }}
        />
      </div>
      <div className="timer-count" style={{ color }}>{timeLeft}s</div>
    </div>
  );
}
