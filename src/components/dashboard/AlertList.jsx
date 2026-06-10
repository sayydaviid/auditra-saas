import { AlertTriangle, Info } from 'lucide-react';
import EmptyState from '../shared/EmptyState';

export default function AlertList({ alerts = [] }) {
  if (!alerts.length) {
    return <EmptyState title="Nenhum alerta operacional" description="Não há riscos ou pendências relevantes no momento." />;
  }

  return (
    <div className="alert-list">
      {alerts.map((alert) => {
        const Icon = alert.severity === 'danger' ? AlertTriangle : Info;
        return (
          <article className={`alert-item alert-${alert.severity}`} key={alert.id}>
            <Icon size={20} />
            <div>
              <strong>{alert.title}</strong>
              <p>{alert.description}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
