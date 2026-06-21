import { useEffect, useMemo, useState } from 'react';
import { CalendarClock, FileSearch, ShieldCheck, UserCheck } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import StatCard from '../components/shared/StatCard';
import StatusBadge from '../components/shared/StatusBadge';
import Timeline from '../components/shared/Timeline';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';
import Table from '../components/ui/Table';
import { useAuth } from '../contexts/AuthContext';
import { isAuditraAdmin } from '../config/permissions';
import { projects } from '../data/mockData';
import { getFriendlyErrorMessage, logTechnicalError } from '../lib/errorMessages';
import { listAuditEvents } from '../services/auditService';

const periods = ['Hoje', 'Últimos 7 dias', 'Últimos 30 dias', 'Todo o período'];

function toDate(value) {
  if (value?.toDate) return value.toDate();
  if (value instanceof Date) return value;
  return null;
}

function formatDate(value) {
  const date = toDate(value);

  if (!date || Number.isNaN(date.getTime())) {
    return 'Processando...';
  }

  return `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  })}`;
}

function normalizeAuditEvent(item) {
  const project = projects.find((projectItem) => projectItem.id === item.projectId);

  return {
    ...item,
    companyId: item.companyId || project?.companyId || '',
    companyName: item.companyName || project?.company || '',
    datetime: formatDate(item.createdAt),
    eventDate: toDate(item.createdAt),
    user: item.userName || item.userEmail || 'Usuário não informado',
    project: project?.name || item.projectId || 'Projeto não informado',
    type: item.eventType === 'EVIDENCE_UPLOADED' ? 'Evidência' : item.eventType,
    status: 'Registrado',
    details: item.description
  };
}

function matchesPeriod(eventDate, period) {
  if (period === 'Todo o período') return true;
  if (!eventDate) return false;

  const now = new Date();
  const diffInDays = Math.floor((now - eventDate) / (1000 * 60 * 60 * 24));

  if (period === 'Hoje') {
    return eventDate.toDateString() === now.toDateString();
  }

  if (period === 'Últimos 7 dias') {
    return diffInDays >= 0 && diffInDays <= 7;
  }

  if (period === 'Últimos 30 dias') {
    return diffInDays >= 0 && diffInDays <= 30;
  }

  return true;
}

function belongsToUserCompany(item, userProfile) {
  if (isAuditraAdmin(userProfile)) {
    return true;
  }

  if (!userProfile?.companyId) {
    return false;
  }

  return item.companyId === userProfile.companyId;
}

export default function Audit() {
  const { userProfile } = useAuth();

  const [items, setItems] = useState([]);
  const [projectFilter, setProjectFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [periodFilter, setPeriodFilter] = useState('Todo o período');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadEvents() {
      setIsLoading(true);
      setError('');

      try {
        const result = await listAuditEvents();
        setItems(result.map(normalizeAuditEvent));
      } catch (loadError) {
        logTechnicalError('Falha ao carregar eventos de auditoria.', loadError);
        setError(getFriendlyErrorMessage(loadError, 'Não foi possível carregar os eventos de auditoria.'));
      } finally {
        setIsLoading(false);
      }
    }

    loadEvents();
  }, []);

  const visibleProjects = useMemo(() => {
    if (isAuditraAdmin(userProfile)) {
      return projects;
    }

    return projects.filter((project) => project.companyId === userProfile?.companyId);
  }, [userProfile]);

  const scopedItems = useMemo(() => {
    return items.filter((item) => belongsToUserCompany(item, userProfile));
  }, [items, userProfile]);

  const eventTypes = useMemo(() => {
    return [...new Set(scopedItems.map((item) => item.type).filter(Boolean))];
  }, [scopedItems]);

  const eventUsers = useMemo(() => {
    return [...new Set(scopedItems.map((item) => item.user).filter(Boolean))];
  }, [scopedItems]);

  const filtered = useMemo(() => scopedItems.filter((event) => {
    const byProject = !projectFilter || event.projectId === projectFilter;
    const byUser = !userFilter || event.user === userFilter;
    const byType = !typeFilter || event.type === typeFilter;
    const byPeriod = matchesPeriod(event.eventDate, periodFilter);

    return byProject && byUser && byType && byPeriod;
  }), [scopedItems, projectFilter, userFilter, typeFilter, periodFilter]);

  const columns = [
    { key: 'datetime', label: 'Data e hora' },
    { key: 'user', label: 'Usuário' },
    {
      key: 'action',
      label: 'Ação',
      render: (row) => (
        <div className="table-title-cell">
          <strong>{row.action}</strong>
          <span>{row.details}</span>
        </div>
      )
    },
    { key: 'project', label: 'Projeto' },
    { key: 'companyName', label: 'Empresa', render: (row) => row.companyName || '-' },
    { key: 'type', label: 'Tipo' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> }
  ];

  return (
    <div className="page-stack">
      <PageHeader
        title="Trilha de Auditoria"
        description="Histórico rastreável de eventos críticos, alterações, validações e movimentações da plataforma."
      />

      <div className="stats-grid four-cards">
        <StatCard
          title="Eventos registrados"
          value={scopedItems.length}
          subtitle="Eventos visíveis para seu perfil"
          icon={ShieldCheck}
        />

        <StatCard
          title="Usuários envolvidos"
          value={eventUsers.length}
          subtitle="Com ações recentes"
          icon={UserCheck}
          tone="green"
        />

        <StatCard
          title="Tipos de evento"
          value={eventTypes.length}
          subtitle="Categorias auditáveis"
          icon={FileSearch}
          tone="blue"
        />

        <StatCard
          title="Período filtrado"
          value={periodFilter}
          subtitle="Filtro visual"
          icon={CalendarClock}
          tone="orange"
        />
      </div>

      <Card title="Filtros de auditoria" description="Refine a trilha por projeto, usuário, tipo de evento e período.">
        <div className="filters-row compact">
          <Select
            label="Projeto"
            options={visibleProjects.map((project) => ({ value: project.id, label: project.name }))}
            value={projectFilter}
            onChange={(event) => setProjectFilter(event.target.value)}
            placeholder="Todos"
          />

          <Select
            label="Usuário"
            options={eventUsers}
            value={userFilter}
            onChange={(event) => setUserFilter(event.target.value)}
            placeholder="Todos"
          />

          <Select
            label="Tipo de evento"
            options={eventTypes}
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            placeholder="Todos"
          />

          <Select
            label="Período"
            options={periods}
            value={periodFilter}
            onChange={(event) => setPeriodFilter(event.target.value)}
            placeholder="Todo o período"
          />
        </div>
      </Card>

      {error && <div className="form-feedback error">{error}</div>}

      {isLoading ? (
        <div className="content-loading">Carregando eventos de auditoria...</div>
      ) : (
        <div className="dashboard-grid two-columns audit-layout">
          <Card title="Linha do tempo auditável" description="Eventos exibidos em ordem recente">
            <Timeline items={filtered} />
          </Card>

          <Card title="Tabela de eventos" description="Visual detalhado para auditoria e conferência">
            <Table columns={columns} data={filtered} emptyTitle="Nenhum evento encontrado" />
          </Card>
        </div>
      )}
    </div>
  );
}