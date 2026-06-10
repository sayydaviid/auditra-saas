import { useMemo, useState } from 'react';
import { CheckCircle2, ClipboardList, FileUp } from 'lucide-react';
import EvidenceForm from '../components/forms/EvidenceForm';
import PageHeader from '../components/shared/PageHeader';
import StatCard from '../components/shared/StatCard';
import StatusBadge from '../components/shared/StatusBadge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Table from '../components/ui/Table';
import { createEvidence } from '../lib/api';
import { evidence, projects } from '../data/mockData';

const evidenceTypes = ['Documento técnico', 'Relatório', 'Código-fonte', 'Imagem', 'Planilha', 'Ata de reunião', 'Publicação', 'Outro'];
const statuses = ['Enviada', 'Em análise', 'Aprovada', 'Reprovada'];

export default function Evidence() {
  const [items, setItems] = useState(evidence);
  const [projectFilter, setProjectFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [feedback, setFeedback] = useState('');

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const byProject = !projectFilter || item.project === projectFilter;
      const byType = !typeFilter || item.type === typeFilter;
      const byStatus = !statusFilter || item.status === statusFilter;
      return byProject && byType && byStatus;
    });
  }, [items, projectFilter, typeFilter, statusFilter]);

  async function handleCreate(data) {
    const project = projects.find((item) => item.name === data.project);
    const created = await createEvidence({
      ...data,
      projectId: project?.id || '',
      id: `e-local-${Date.now()}`
    });

    setItems((current) => [created, ...current]);
    setFeedback('Evidência adicionada visualmente. Upload real ficará para Firebase Storage.');
    window.setTimeout(() => setFeedback(''), 3500);
  }

  const columns = [
    {
      key: 'title',
      label: 'Evidência',
      render: (row) => (
        <div className="table-title-cell">
          <strong>{row.title}</strong>
          <span>{row.fileName}</span>
        </div>
      )
    },
    { key: 'project', label: 'Projeto' },
    { key: 'type', label: 'Tipo' },
    { key: 'owner', label: 'Responsável' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'actions', label: 'Ações', render: () => <Button variant="ghost" size="sm">Visualizar</Button> }
  ];

  const approvedCount = items.filter((item) => item.status === 'Aprovada').length;
  const pendingCount = items.filter((item) => item.status === 'Enviada' || item.status === 'Em análise').length;

  return (
    <div className="page-stack">
      <PageHeader
        title="Evidências"
        description="Envie, organize e acompanhe evidências técnicas vinculadas aos projetos de P&D."
      />

      <div className="stats-grid three-cards">
        <StatCard title="Evidências enviadas" value={items.length} subtitle="Base atual" icon={FileUp} />
        <StatCard title="Aprovadas" value={approvedCount} subtitle="Validadas pelo gestor" icon={CheckCircle2} tone="green" />
        <StatCard title="Pendentes" value={pendingCount} subtitle="Aguardando análise" icon={ClipboardList} tone="orange" />
      </div>

      <Card title="Enviar nova evidência" description="Upload simulado, pronto para integração futura com Firebase Storage.">
        {feedback && <div className="form-feedback success">{feedback}</div>}
        <EvidenceForm projects={projects} onSubmit={handleCreate} />
      </Card>

      <Card title="Lista de evidências" description={`${filtered.length} evidência(s) encontrada(s)`}>
        <div className="filters-row compact">
          <Select label="Projeto" options={projects.map((project) => project.name)} value={projectFilter} onChange={(event) => setProjectFilter(event.target.value)} placeholder="Todos" />
          <Select label="Tipo" options={evidenceTypes} value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} placeholder="Todos" />
          <Select label="Status" options={statuses} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} placeholder="Todos" />
        </div>
        <Table columns={columns} data={filtered} emptyTitle="Nenhuma evidência encontrada" />
      </Card>
    </div>
  );
}
