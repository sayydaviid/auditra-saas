import { useMemo, useState } from 'react';
import { Clock3, PlusCircle, TimerReset } from 'lucide-react';
import TimeEntryForm from '../components/forms/TimeEntryForm';
import PageHeader from '../components/shared/PageHeader';
import StatCard from '../components/shared/StatCard';
import StatusBadge from '../components/shared/StatusBadge';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import { createTimeEntry } from '../lib/api';
import { projects, timeEntries } from '../data/mockData';

export default function TimeEntries() {
  const [entries, setEntries] = useState(timeEntries);
  const [feedback, setFeedback] = useState('');

  const totalHours = useMemo(() => entries.reduce((sum, entry) => sum + Number(entry.hours || 0), 0), [entries]);
  const pending = useMemo(() => entries.filter((entry) => entry.status === 'Pendente' || entry.status === 'Em análise').length, [entries]);

  async function handleCreate(data) {
    const project = projects.find((item) => item.name === data.project);
    const created = await createTimeEntry({
      ...data,
      projectId: project?.id || '',
      id: `h-local-${Date.now()}`
    });

    setEntries((current) => [created, ...current]);
    setFeedback('Registro de horas adicionado com sucesso. Status inicial: Pendente.');
    window.setTimeout(() => setFeedback(''), 3500);
  }

  const columns = [
    { key: 'date', label: 'Data' },
    {
      key: 'project',
      label: 'Projeto',
      render: (row) => (
        <div className="table-title-cell">
          <strong>{row.project}</strong>
          <span>{row.deliverable || 'Sem entregável vinculado'}</span>
        </div>
      )
    },
    { key: 'activityType', label: 'Tipo' },
    { key: 'hours', label: 'Horas', render: (row) => `${row.hours}h` },
    { key: 'user', label: 'Usuário' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> }
  ];

  return (
    <div className="page-stack">
      <PageHeader
        title="Registro de Horas"
        description="Registre atividades técnicas, vincule entregáveis e acompanhe o status de validação."
      />

      <div className="stats-grid three-cards">
        <StatCard title="Horas registradas" value={`${totalHours}h`} subtitle="Total nos dados atuais" icon={Clock3} />
        <StatCard title="Registros recentes" value={entries.length} subtitle="Incluindo lançamentos locais" icon={PlusCircle} tone="green" />
        <StatCard title="Em validação" value={pending} subtitle="Pendentes ou em análise" icon={TimerReset} tone="orange" />
      </div>

      <Card title="Novo registro" description="Validação feita com React Hook Form e Zod.">
        {feedback && <div className="form-feedback success">{feedback}</div>}
        <TimeEntryForm projects={projects} onSubmit={handleCreate} />
      </Card>

      <Card title="Registros recentes" description="Últimos lançamentos enviados pelos pesquisadores">
        <Table columns={columns} data={entries} emptyTitle="Nenhum registro de horas" emptyDescription="Adicione um novo registro usando o formulário acima." />
      </Card>
    </div>
  );
}
