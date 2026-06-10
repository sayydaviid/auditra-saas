export default function Card({ children, className = '', title, description, action }) {
  return (
    <section className={`card ${className}`}>
      {(title || description || action) && (
        <div className="card-header">
          <div>
            {title && <h3>{title}</h3>}
            {description && <p>{description}</p>}
          </div>
          {action && <div className="card-action">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
