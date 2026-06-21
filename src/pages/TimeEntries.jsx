import { useMemo, useState } from 'react';
import { Clock3, PlusCircle, TimerReset } from 'lucide-react';
import TimeEntryForm from '../components/forms/TimeEntryForm';
import PageHeader from '../components/shared/PageHeader';
import StatCard from '../components/shared/StatCard';
import StatusBadge from '../components/shared/StatusBadge';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import { useAuth } from '../contexts/AuthContext';
import { isAuditraAdmin } from '../config/permissions';
import { createTimeEntry } from '../lib/api';
import { projects, timeEntries } from '../data/mockData';

function belongsToUserCompany(item, userProfile) {
  if (isAuditraAdmin(userProfile)) {
    return true;
  }

  if (!userProfile?.companyId) {
    return false;
  }

  return item.companyId === userProfile.companyId;
}

export default function TimeEntries() {
  const { currentUser, userProfile } = useAuth();

  const [entries, setEntries] = useState(timeEntries);
  const [feedback, setFeedback] = useState('');

  const visibleProjects = useMemo(() => {
    if (isAuditraAdmin(userProfile)) {
      return projects;
    }

    return projects.filter((project) => project.companyId === userProfile?.companyId);
  }, [userProfile]);

  const scopedEntries = useMemo(() => {
    return entries.filter((entry) => belongsToUserCompany(entry, userProfile));
  }, [entries, userProfile]);

  const totalHours = useMemo(() => {
    return scopedEntries.reduce((sum, entry) => sum + Number(entry.hours || 0), 0);
  }, [scopedEntries]);

  const pending = useMemo(() => {
    return scopedEntries.filter((entry) =>
      entry.status === 'Pendente' || entry.status === 'Em análise'
    ).length;
  }, [scopedEntries]);

  async function handleCreate(data) {
    const project = projects.find((item) =>
      item.name === data.project || item.id === data.project
    );

    if (!project) {
      setFeedback('Selecione um projeto válido.');
      window.setTimeout(() => setFeedback(''), 3500);
      return;
    }

    if (!isAuditraAdmin(userProfile) && project.companyId !== userProfile?.companyId) {
      setFeedback('Você só pode registrar horas em projetos da sua empresa.');
      window.setTimeout(() => setFeedback(''), 3500);
      return;
    }

    const created = await createTimeEntry({
      ...data,
      id: `h-local-${Date.now()}`,
      projectId: project.id,
      project: project.name,
      companyId: project.companyId,
      companyName: project.company,
      userId: currentUser?.uid || '',
      user: userProfile?.fullName || currentUser?.displayName || currentUser?.email || 'Usuário',
      status: data.status || 'Pendente'
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
        <StatCard
          title="Horas registradas"
          value={`${totalHours}h`}
          subtitle="Total visível para seu perfil"
          icon={Clock3}
        />

        <StatCard
          title="Registros recentes"
          value={scopedEntries.length}
          subtitle="Incluindo lançamentos locais"
          icon={PlusCircle}
          tone="green"
        />

        <StatCard
          title="Em validação"
          value={pending}
          subtitle="Pendentes ou em análise"
          icon={TimerReset}
          tone="orange"
        />
      </div>

      <Card title="Novo registro" description="Validação feita com React Hook Form e Zod.">
        {feedback && <div className="form-feedback success">{feedback}</div>}
        <TimeEntryForm projects={visibleProjects} onSubmit={handleCreate} />
      </Card>

      <Card title="Registros recentes" description="Últimos lançamentos visíveis para seu perfil">
        <Table
          columns={columns}
          data={scopedEntries}
          emptyTitle="Nenhum registro de horas"
          emptyDescription="Adicione um novo registro usando o formulário acima."
        />
      </Card>
    </div>
  );
}