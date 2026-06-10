import StatusBadge from './StatusBadge';
import EmptyState from './EmptyState';

export default function Timeline({
  items = [],
  emptyTitle = 'Nenhum evento encontrado',
  emptyDescription = 'Ajuste os filtros para visualizar a linha do tempo.'
}) {
  if (!items.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="timeline">
      {items.map((item) => (
        <article className="timeline-item" key={item.id}>
          <div className="timeline-marker" />
          <div className="timeline-content">
            <div className="timeline-top">
              <strong>{item.action || item.title}</strong>
              {item.status && <StatusBadge status={item.status} />}
            </div>
            <p>{item.details || item.description}</p>
            <small>{item.datetime || item.time} - {item.user || item.type}</small>
          </div>
        </article>
      ))}
    </div>
  );
}
