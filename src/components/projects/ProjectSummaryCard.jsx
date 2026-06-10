import { Link } from 'react-router-dom';
import ProgressBar from '../shared/ProgressBar';
import RiskBadge from '../shared/RiskBadge';
import StatusBadge from '../shared/StatusBadge';

export default function ProjectSummaryCard({ project }) {
  return (
    <article className="project-summary-card">
      <div className="project-summary-top">
        <div>
          <h3>{project.name}</h3>
          <p>{project.company}</p>
        </div>
        <RiskBadge risk={project.risk} />
      </div>
      <StatusBadge status={project.status} />
      <ProgressBar value={project.completion} label="Completude documental" />
      <Link to={`/projetos/${project.id}`} className="text-link">Ver detalhes</Link>
    </article>
  );
}
