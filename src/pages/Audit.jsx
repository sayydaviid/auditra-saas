import { useMemo, useState } from 'react';
import { CalendarClock, FileSearch, ShieldCheck, UserCheck } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import StatCard from '../components/shared/StatCard';
import StatusBadge from '../components/shared/StatusBadge';
import Timeline from '../components/shared/Timeline';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Table from '../components/ui/Table';
import { auditEvents, projects, users } from '../data/mockData';

const eventTypes = ['Registro de horas', 'Evidência', 'Relatório', 'Custos', 'Projeto', 'Aprovação'];
const periods = ['Hoje', 'Últimos 7 dias', 'Últimos 30 dias', 'Todo o período'];

function parseAuditDate(value) {
  const [datePart, timePart = '00:00'] = value.split(' ');
  const [day, month, year] = datePart.split('/').map(Number);
  const [hours, minutes] = timePart.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes);
}

const auditReferenceDate = auditEvents.reduce((latest, event) => {
  const eventDate = parseAuditDate(event.datetime);
  return eventDate > latest ? eventDate : latest;
}, new Date(0));

function matchesPeriod(datetime, period) {
  if (period === 'Todo o período') return true;

  const eventDate = parseAuditDate(datetime);
  const diffInDays = Math.floor((auditReferenceDate - eventDate) / (1000 * 60 * 60 * 24));

  if (period === 'Hoje') {
    return eventDate.toDateString() === auditReferenceDate.toDateString();
  }

  if (period === 'Últimos 7 dias') {
    return diffInDays >= 0 && diffInDays <= 7;
  }

  if (period === 'Últimos 30 dias') {
    return diffInDays >= 0 && diffInDays <= 30;
  }

  return true;
}

export default function Audit() {
  const [projectFilter, setProjectFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [periodFilter, setPeriodFilter] = useState('Todo o período');

  const filtered = useMemo(() => auditEvents.filter((event) => {
    const byProject = !projectFilter || event.project === projectFilter;
    const byUser = !userFilter || event.user === userFilter;
    const byType = !typeFilter || event.type === typeFilter;
    const byPeriod = matchesPeriod(event.datetime, periodFilter);
    return byProject && byUser && byType && byPeriod;
  }), [projectFilter, userFilter, typeFilter, periodFilter]);

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
        <StatCard title="Eventos registrados" value={auditEvents.length} subtitle="Na trilha atual" icon={ShieldCheck} />
        <StatCard title="Usuários envolvidos" value={new Set(auditEvents.map((event) => event.user)).size} subtitle="Com ações recentes" icon={UserCheck} tone="green" />
        <StatCard title="Tipos de evento" value={new Set(auditEvents.map((event) => event.type)).size} subtitle="Categorias auditáveis" icon={FileSearch} tone="blue" />
        <StatCard title="Período filtrado" value={periodFilter} subtitle="Filtro visual" icon={CalendarClock} tone="orange" />
      </div>

      <Card title="Filtros de auditoria" description="Refine a trilha por projeto, usuário, tipo de evento e período.">
        <div className="filters-row compact">
          <Select label="Projeto" options={projects.map((project) => project.name)} value={projectFilter} onChange={(event) => setProjectFilter(event.target.value)} placeholder="Todos" />
          <Select label="Usuário" options={users.map((user) => user.name)} value={userFilter} onChange={(event) => setUserFilter(event.target.value)} placeholder="Todos" />
          <Select label="Tipo de evento" options={eventTypes} value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} placeholder="Todos" />
          <Select label="Período" options={periods} value={periodFilter} onChange={(event) => setPeriodFilter(event.target.value)} placeholder="Todo o período" />
        </div>
      </Card>

      <div className="dashboard-grid two-columns audit-layout">
        <Card title="Linha do tempo auditável" description="Eventos exibidos em ordem recente">
          <Timeline items={filtered} />
        </Card>
        <Card title="Tabela de eventos" description="Visual detalhado para auditoria e conferência">
          <Table columns={columns} data={filtered} emptyTitle="Nenhum evento encontrado" />
        </Card>
      </div>
    </div>
  );
}
