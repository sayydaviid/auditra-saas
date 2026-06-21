import { useMemo, useState } from 'react';
import { Download, FileClock, FilePlus2, FileText, Send } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import StatCard from '../components/shared/StatCard';
import StatusBadge from '../components/shared/StatusBadge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';
import Table from '../components/ui/Table';
import { useAuth } from '../contexts/AuthContext';
import { isAuditraAdmin } from '../config/permissions';
import { projects, reports } from '../data/mockData';

const statuses = ['Em geração', 'Pronto', 'Aguardando revisão', 'Aprovado'];

function belongsToUserCompany(item, userProfile) {
  if (isAuditraAdmin(userProfile)) {
    return true;
  }

  if (!userProfile?.companyId) {
    return false;
  }

  return item.companyId === userProfile.companyId;
}

export default function Reports() {
  const { userProfile } = useAuth();

  const [items, setItems] = useState(reports);
  const [projectFilter, setProjectFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [feedback, setFeedback] = useState('');

  const visibleProjects = useMemo(() => {
    if (isAuditraAdmin(userProfile)) {
      return projects;
    }

    return projects.filter((project) => project.companyId === userProfile?.companyId);
  }, [userProfile]);

  const scopedItems = useMemo(() => {
    return items.filter((item) => belongsToUserCompany(item, userProfile));
  }, [items, userProfile]);

  const filtered = useMemo(() => scopedItems.filter((item) => {
    const byProject = !projectFilter || item.project === projectFilter;
    const byStatus = !statusFilter || item.status === statusFilter;

    return byProject && byStatus;
  }), [scopedItems, projectFilter, statusFilter]);

  function generateReport() {
    const firstProject = visibleProjects[0];

    if (!firstProject) {
      setFeedback('Nenhum projeto disponível para gerar relatório.');
      window.setTimeout(() => setFeedback(''), 3000);
      return;
    }

    const nextReport = {
      id: `r-local-${Date.now()}`,
      companyId: firstProject.companyId,
      companyName: firstProject.company,
      project: firstProject.name,
      period: 'Junho/2026',
      status: 'Em geração',
      generatedAt: 'Agora',
      responsible: firstProject.responsible
    };

    setItems((current) => [nextReport, ...current]);
    setFeedback('Relatório criado visualmente com status Em geração.');
    window.setTimeout(() => setFeedback(''), 3000);
  }

  function sendToReview(id) {
    const target = scopedItems.find((item) => item.id === id);

    if (!target) {
      setFeedback('Você não tem permissão para alterar este relatório.');
      window.setTimeout(() => setFeedback(''), 3000);
      return;
    }

    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, status: 'Aguardando revisão' } : item))
    );

    setFeedback('Relatório enviado visualmente para revisão.');
    window.setTimeout(() => setFeedback(''), 3000);
  }

  const generated = scopedItems.length;

  const pending = scopedItems.filter((item) =>
    item.status === 'Em geração' || item.status === 'Aguardando revisão'
  ).length;

  const approved = scopedItems.filter((item) => item.status === 'Aprovado').length;

  const projectsWithoutReport = Math.max(
    0,
    visibleProjects.length - new Set(scopedItems.map((item) => item.project)).size
  );

  const columns = [
    {
      key: 'project',
      label: 'Projeto',
      render: (row) => (
        <div className="table-title-cell">
          <strong>{row.project}</strong>
          <span>{row.period}</span>
        </div>
      )
    },
    { key: 'responsible', label: 'Responsável' },
    { key: 'generatedAt', label: 'Gerado em' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      label: 'Ações',
      render: (row) => (
        <div className="table-actions report-actions">
          <Button size="sm" variant="secondary" icon={Download}>
            Baixar PDF
          </Button>

          <Button size="sm" variant="ghost" icon={Send} onClick={() => sendToReview(row.id)}>
            Enviar para revisão
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="page-stack">
      <PageHeader
        title="Relatórios"
        description="Acompanhe relatórios técnicos e fiscais por projeto, período e status de revisão."
        actions={<Button icon={FilePlus2} onClick={generateReport}>Gerar relatório</Button>}
      />

      <div className="stats-grid four-cards">
        <StatCard
          title="Gerados"
          value={generated}
          subtitle="Relatórios visíveis para seu perfil"
          icon={FileText}
        />

        <StatCard
          title="Pendentes"
          value={pending}
          subtitle="Em geração ou revisão"
          icon={FileClock}
          tone="orange"
        />

        <StatCard
          title="Aprovados"
          value={approved}
          subtitle="Liberados"
          icon={FileText}
          tone="green"
        />

        <StatCard
          title="Sem relatório"
          value={projectsWithoutReport}
          subtitle="Projetos sem relatório"
          icon={FileClock}
          tone="red"
        />
      </div>

      <Card title="Relatórios por projeto" description={`${filtered.length} relatório(s) encontrado(s)`}>
        {feedback && <div className="form-feedback success">{feedback}</div>}

        <div className="filters-row compact">
          <Select
            label="Projeto"
            options={visibleProjects.map((project) => project.name)}
            value={projectFilter}
            onChange={(event) => setProjectFilter(event.target.value)}
            placeholder="Todos"
          />

          <Select
            label="Status"
            options={statuses}
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            placeholder="Todos"
          />
        </div>

        <Table
          columns={columns}
          data={filtered}
          emptyTitle="Nenhum relatório encontrado"
        />
      </Card>
    </div>
  );
}