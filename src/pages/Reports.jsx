import { useMemo, useState } from 'react';
import { Download, FileClock, FilePlus2, FileText, Send } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import StatCard from '../components/shared/StatCard';
import StatusBadge from '../components/shared/StatusBadge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';
import Table from '../components/ui/Table';
import { projects, reports } from '../data/mockData';

const statuses = ['Em geração', 'Pronto', 'Aguardando revisão', 'Aprovado'];

export default function Reports() {
  const [items, setItems] = useState(reports);
  const [projectFilter, setProjectFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [feedback, setFeedback] = useState('');

  const filtered = useMemo(() => items.filter((item) => {
    const byProject = !projectFilter || item.project === projectFilter;
    const byStatus = !statusFilter || item.status === statusFilter;
    return byProject && byStatus;
  }), [items, projectFilter, statusFilter]);

  function generateReport() {
    const firstProject = projects[0];
    const nextReport = {
      id: `r-local-${Date.now()}`,
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
    setItems((current) => current.map((item) => (item.id === id ? { ...item, status: 'Aguardando revisão' } : item)));
    setFeedback('Relatório enviado visualmente para revisão.');
    window.setTimeout(() => setFeedback(''), 3000);
  }

  const generated = items.length;
  const pending = items.filter((item) => item.status === 'Em geração' || item.status === 'Aguardando revisão').length;
  const approved = items.filter((item) => item.status === 'Aprovado').length;
  const projectsWithoutReport = Math.max(0, projects.length - new Set(items.map((item) => item.project)).size);

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
          <Button size="sm" variant="secondary" icon={Download}>Baixar PDF</Button>
          <Button size="sm" variant="ghost" icon={Send} onClick={() => sendToReview(row.id)}>Enviar para revisão</Button>
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
        <StatCard title="Gerados" value={generated} subtitle="Relatórios no sistema" icon={FileText} />
        <StatCard title="Pendentes" value={pending} subtitle="Em geração ou revisão" icon={FileClock} tone="orange" />
        <StatCard title="Aprovados" value={approved} subtitle="Liberados" icon={FileText} tone="green" />
        <StatCard title="Sem relatório" value={projectsWithoutReport} subtitle="Projetos sem relatório" icon={FileClock} tone="red" />
      </div>

      <Card title="Relatórios por projeto" description={`${filtered.length} relatório(s) encontrado(s)`}>
        {feedback && <div className="form-feedback success">{feedback}</div>}
        <div className="filters-row compact">
          <Select label="Projeto" options={projects.map((project) => project.name)} value={projectFilter} onChange={(event) => setProjectFilter(event.target.value)} placeholder="Todos" />
          <Select label="Status" options={statuses} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} placeholder="Todos" />
        </div>
        <Table columns={columns} data={filtered} emptyTitle="Nenhum relatório encontrado" />
      </Card>
    </div>
  );
}
