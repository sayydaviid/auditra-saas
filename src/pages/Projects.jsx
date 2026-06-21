import { useMemo, useState } from 'react';
import { Edit3, Eye, FileText, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/shared/PageHeader';
import ProgressBar from '../components/shared/ProgressBar';
import RiskBadge from '../components/shared/RiskBadge';
import StatusBadge from '../components/shared/StatusBadge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Table from '../components/ui/Table';
import { useAuth } from '../contexts/AuthContext';
import { isAuditraAdmin } from '../config/permissions';
import { projects } from '../data/mockData';

const statuses = ['Ativo', 'Em revisão', 'Pendente', 'Finalizado'];
const risks = ['Baixo', 'Médio', 'Alto'];

function normalizeText(value = '') {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function belongsToUserCompany(project, userProfile) {
  if (isAuditraAdmin(userProfile)) {
    return true;
  }

  const userCompanyId = userProfile?.companyId;
  const userCompanyName = userProfile?.companyName;

  if (!userCompanyId && !userCompanyName) {
    return false;
  }

  if (project.companyId && userCompanyId) {
    return project.companyId === userCompanyId;
  }

  return normalizeText(project.company) === normalizeText(userCompanyName);
}

export default function Projects() {
  const { userProfile } = useAuth();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [risk, setRisk] = useState('');

  const scopedProjects = useMemo(() => {
    return projects.filter((project) => belongsToUserCompany(project, userProfile));
  }, [userProfile]);

  const filteredProjects = useMemo(() => {
    return scopedProjects.filter((project) => {
      const matchesSearch = `${project.name} ${project.company} ${project.responsible}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus = !status || project.status === status;
      const matchesRisk = !risk || project.risk === risk;

      return matchesSearch && matchesStatus && matchesRisk;
    });
  }, [scopedProjects, search, status, risk]);

  const columns = [
    {
      key: 'name',
      label: 'Projeto',
      render: (project) => (
        <div className="table-title-cell">
          <strong>{project.name}</strong>
          <span>{project.company}</span>
        </div>
      )
    },
    { key: 'responsible', label: 'Responsável' },
    { key: 'status', label: 'Status', render: (project) => <StatusBadge status={project.status} /> },
    { key: 'period', label: 'Período' },
    { key: 'completion', label: 'Completude', render: (project) => <ProgressBar value={project.completion} /> },
    { key: 'risk', label: 'Risco', render: (project) => <RiskBadge risk={project.risk} /> },
    {
      key: 'actions',
      label: 'Ações',
      render: (project) => (
        <div className="table-actions">
          <Link className="icon-action" to={`/projetos/${project.id}`} title="Ver detalhes">
            <Eye size={17} />
          </Link>
          <button className="icon-action" type="button" title="Editar">
            <Edit3 size={17} />
          </button>
          <button className="icon-action" type="button" title="Gerar relatório">
            <FileText size={17} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="page-stack">
      <PageHeader
        title="Projetos"
        description="Gerencie a carteira de projetos de P&D, status documental e riscos de auditoria."
        actions={<Button icon={Plus}>Novo Projeto</Button>}
      />

      <Card>
        <div className="filters-row">
          <Input
            label="Buscar"
            placeholder="Nome, empresa ou responsável"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <Select
            label="Status"
            options={statuses}
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            placeholder="Todos os status"
          />

          <Select
            label="Risco"
            options={risks}
            value={risk}
            onChange={(event) => setRisk(event.target.value)}
            placeholder="Todos os riscos"
          />
        </div>
      </Card>

      <Card title="Lista de projetos" description={`${filteredProjects.length} projeto(s) encontrado(s)`}>
        <Table
          columns={columns}
          data={filteredProjects}
          emptyTitle="Nenhum projeto encontrado"
          emptyDescription="Tente limpar a busca ou mudar os filtros de status e risco."
        />
      </Card>
    </div>
  );
}