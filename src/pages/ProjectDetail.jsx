import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock3, Coins, FileCheck2 } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import ProgressBar from '../components/shared/ProgressBar';
import RiskBadge from '../components/shared/RiskBadge';
import StatCard from '../components/shared/StatCard';
import StatusBadge from '../components/shared/StatusBadge';
import Tabs from '../components/shared/Tabs';
import Timeline from '../components/shared/Timeline';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import { useAuth } from '../contexts/AuthContext';
import { isAuditraAdmin } from '../config/permissions';
import {
  auditEvents,
  costs,
  evidence,
  projectPendingItems,
  projects,
  timeEntries
} from '../data/mockData';

const tabs = [
  { id: 'overview', label: 'Visão Geral' },
  { id: 'hours', label: 'Horas' },
  { id: 'evidence', label: 'Evidências' },
  { id: 'costs', label: 'Custos' },
  { id: 'approvals', label: 'Aprovações' },
  { id: 'audit', label: 'Auditoria' }
];

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

function canAccessProject(project, userProfile) {
  if (!project) return false;

  if (isAuditraAdmin(userProfile)) {
    return true;
  }

  if (!userProfile?.companyId) {
    return false;
  }

  return project.companyId === userProfile.companyId;
}

export default function ProjectDetail() {
  const { id } = useParams();
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const project = projects.find((item) => item.id === id);
  const hasAccess = canAccessProject(project, userProfile);

  const projectEvidence = useMemo(() => {
    return evidence.filter((item) => item.projectId === id && item.companyId === project?.companyId);
  }, [id, project?.companyId]);

  const projectHours = useMemo(() => {
    return timeEntries.filter((item) => item.projectId === id && item.companyId === project?.companyId);
  }, [id, project?.companyId]);

  const projectCosts = useMemo(() => {
    return costs.filter((item) => item.projectId === id && item.companyId === project?.companyId);
  }, [id, project?.companyId]);

  const projectEvents = useMemo(() => {
    return auditEvents.filter((item) =>
      item.companyId === project?.companyId &&
      (item.project === project?.name || item.projectId === id)
    );
  }, [id, project?.companyId, project?.name]);

  const pendings = useMemo(() => {
    return projectPendingItems.filter((item) => item.projectId === id && item.companyId === project?.companyId);
  }, [id, project?.companyId]);

  if (!project) {
    return (
      <div className="page-stack">
        <PageHeader
          title="Projeto não encontrado"
          description="O projeto informado não existe nos dados mockados."
          actions={
            <Button as={Link} to="/projetos" variant="secondary" icon={ArrowLeft}>
              Voltar
            </Button>
          }
        />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="page-stack">
        <PageHeader
          title="Acesso restrito"
          description="Você não tem permissão para visualizar este projeto."
          actions={
            <Button as={Link} to="/projetos" variant="secondary" icon={ArrowLeft}>
              Voltar
            </Button>
          }
        />

        <Card title="Projeto fora do escopo da sua empresa">
          <p>
            Este projeto pertence a outra empresa. Apenas administradores da Auditra
            podem acessar projetos de todas as empresas.
          </p>
        </Card>
      </div>
    );
  }

  const evidenceColumns = [
    { key: 'title', label: 'Título' },
    { key: 'type', label: 'Tipo' },
    { key: 'owner', label: 'Responsável' },
    { key: 'date', label: 'Data' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> }
  ];

  const hoursColumns = [
    { key: 'date', label: 'Data' },
    { key: 'user', label: 'Usuário' },
    { key: 'activityType', label: 'Tipo' },
    { key: 'hours', label: 'Horas', render: (row) => `${row.hours}h` },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> }
  ];

  const costsColumns = [
    { key: 'category', label: 'Categoria' },
    { key: 'value', label: 'Valor', render: (row) => formatCurrency(row.value) },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> }
  ];

  const pendingColumns = [
    { key: 'title', label: 'Pendência' },
    { key: 'owner', label: 'Responsável' },
    { key: 'dueDate', label: 'Prazo' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> }
  ];

  return (
    <div className="page-stack">
      <PageHeader
        title={project.name}
        description={`${project.company} • ${project.period}`}
        actions={
          <Button as={Link} to="/projetos" variant="secondary" icon={ArrowLeft}>
            Voltar
          </Button>
        }
      />

      <Card className="project-detail-hero">
        <div>
          <span className="eyebrow">Resumo do projeto</span>
          <h2>{project.name}</h2>
          <p>{project.description}</p>

          <div className="badge-row">
            <StatusBadge status={project.status} />
            <RiskBadge risk={project.risk} />
          </div>
        </div>

        <div className="hero-progress">
          <ProgressBar value={project.completion} label="Completude documental" />
        </div>
      </Card>

      <div className="stats-grid four-cards">
        <StatCard
          title="Horas totais"
          value={`${project.totalHours}h`}
          subtitle="Registradas no projeto"
          icon={Clock3}
        />

        <StatCard
          title="Evidências"
          value={project.evidenceCount}
          subtitle="Anexadas"
          icon={FileCheck2}
          tone="green"
        />

        <StatCard
          title="Aprovações"
          value={project.approvalsDone}
          subtitle="Concluídas"
          icon={CheckCircle2}
          tone="blue"
        />

        <StatCard
          title="Custos vinculados"
          value={formatCurrency(project.linkedCosts)}
          subtitle="Valor consolidado"
          icon={Coins}
          tone="orange"
        />
      </div>

      <Card>
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </Card>

      {activeTab === 'overview' && (
        <div className="dashboard-grid two-columns">
          <Card title="Timeline de atividades recentes">
            <Timeline items={projectEvents} emptyTitle="Nenhum evento do projeto" />
          </Card>

          <Card title="Pendências do projeto">
            <Table
              columns={pendingColumns}
              data={pendings}
              emptyTitle="Sem pendências"
              emptyDescription="Não há pendências abertas para este projeto."
            />
          </Card>

          <Card title="Últimas evidências">
            <Table
              columns={evidenceColumns}
              data={projectEvidence}
              emptyTitle="Nenhuma evidência vinculada"
            />
          </Card>

          <Card title="Resumo de custos">
            <Table
              columns={costsColumns}
              data={projectCosts}
              emptyTitle="Nenhum custo vinculado"
            />
          </Card>
        </div>
      )}

      {activeTab === 'hours' && (
        <Card title="Registros de horas">
          <Table columns={hoursColumns} data={projectHours} emptyTitle="Nenhum registro de horas" />
        </Card>
      )}

      {activeTab === 'evidence' && (
        <Card title="Evidências técnicas">
          <Table columns={evidenceColumns} data={projectEvidence} emptyTitle="Nenhuma evidência vinculada" />
        </Card>
      )}

      {activeTab === 'costs' && (
        <Card title="Custos vinculados">
          <Table columns={costsColumns} data={projectCosts} emptyTitle="Nenhum custo vinculado" />
        </Card>
      )}

      {activeTab === 'approvals' && (
        <Card title="Aprovações">
          <Table columns={pendingColumns} data={pendings} emptyTitle="Nenhuma aprovação pendente" />
        </Card>
      )}

      {activeTab === 'audit' && (
        <Card title="Trilha de auditoria">
          <Timeline
            items={projectEvents}
            emptyTitle="Nenhum evento do projeto"
            emptyDescription="Este projeto ainda não tem eventos próprios na trilha de auditoria."
          />
        </Card>
      )}
    </div>
  );
}