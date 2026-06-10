export default function ProgressBar({ value = 0, label, tone = 'default' }) {
  const safeValue = Math.min(100, Math.max(0, Number(value)));

  return (
    <div className={`progress-group progress-${tone}`}>
      {(label || value !== undefined) && (
        <div className="progress-label">
          <span>{label}</span>
          <strong>{safeValue}%</strong>
        </div>
      )}
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}
