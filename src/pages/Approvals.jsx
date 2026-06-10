import { useMemo, useState } from 'react';
import { CheckCheck, Clock, RotateCcw, XCircle } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import StatCard from '../components/shared/StatCard';
import StatusBadge from '../components/shared/StatusBadge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';
import Table from '../components/ui/Table';
import { approvals, projects } from '../data/mockData';
import { updateApprovalStatus } from '../lib/api';

const types = ['Horas', 'Evidência', 'Relatório'];
const statuses = ['Pendente', 'Aprovado', 'Correção solicitada', 'Reprovado'];

export default function Approvals() {
  const [items, setItems] = useState(approvals);
  const [projectFilter, setProjectFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [feedback, setFeedback] = useState('');

  const filtered = useMemo(() => items.filter((item) => {
    const byProject = !projectFilter || item.project === projectFilter;
    const byType = !typeFilter || item.type === typeFilter;
    const byStatus = !statusFilter || item.status === statusFilter;
    return byProject && byType && byStatus;
  }), [items, projectFilter, typeFilter, statusFilter]);

  async function changeStatus(id, status) {
    await updateApprovalStatus(id, status);
    setItems((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
    setFeedback(`Status atualizado para: ${status}.`);
    window.setTimeout(() => setFeedback(''), 3000);
  }

  const pendingCount = items.filter((item) => item.status === 'Pendente').length;
  const approvedCount = items.filter((item) => item.status === 'Aprovado').length;
  const rejectedCount = items.filter((item) => item.status === 'Reprovado').length;

  const columns = [
    {
      key: 'description',
      label: 'Item',
      render: (row) => (
        <div className="table-title-cell">
          <strong>{row.description}</strong>
          <span>{row.project}</span>
        </div>
      )
    },
    { key: 'type', label: 'Tipo' },
    { key: 'requester', label: 'Solicitante' },
    { key: 'createdAt', label: 'Criado em' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      label: 'Ações',
      render: (row) => (
        <div className="approval-actions">
          <Button size="sm" variant="success" onClick={() => changeStatus(row.id, 'Aprovado')}>Aprovar</Button>
          <Button size="sm" variant="warning" onClick={() => changeStatus(row.id, 'Correção solicitada')}>Solicitar correção</Button>
          <Button size="sm" variant="danger" onClick={() => changeStatus(row.id, 'Reprovado')}>Reprovar</Button>
        </div>
      )
    }
  ];

  return (
    <div className="page-stack">
      <PageHeader title="Aprovações" description="Valide horas, evidências e relatórios mantendo rastreabilidade das decisões." />

      <div className="stats-grid four-cards">
        <StatCard title="Pendentes" value={pendingCount} subtitle="Na fila de validação" icon={Clock} tone="orange" />
        <StatCard title="Aprovadas no mês" value={approvedCount} subtitle="Validações concluídas" icon={CheckCheck} tone="green" />
        <StatCard title="Reprovadas" value={rejectedCount} subtitle="Itens rejeitados" icon={XCircle} tone="red" />
        <StatCard title="Tempo médio" value="2,8 dias" subtitle="Média de validação" icon={RotateCcw} />
      </div>

      <Card title="Itens para validação" description={`${filtered.length} item(ns) na lista`}>
        {feedback && <div className="form-feedback success">{feedback}</div>}
        <div className="filters-row compact">
          <Select label="Projeto" options={projects.map((project) => project.name)} value={projectFilter} onChange={(event) => setProjectFilter(event.target.value)} placeholder="Todos" />
          <Select label="Tipo" options={types} value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} placeholder="Todos" />
          <Select label="Status" options={statuses} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} placeholder="Todos" />
        </div>
        <Table columns={columns} data={filtered} emptyTitle="Nenhuma aprovação encontrada" />
      </Card>
    </div>
  );
}
