import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, ClipboardList, FileUp } from 'lucide-react';
import EvidenceForm from '../components/forms/EvidenceForm';
import PageHeader from '../components/shared/PageHeader';
import StatCard from '../components/shared/StatCard';
import StatusBadge from '../components/shared/StatusBadge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';
import Table from '../components/ui/Table';
import { useAuth } from '../contexts/AuthContext';
import { projects } from '../data/mockData';
import { getFriendlyErrorMessage, logTechnicalError } from '../lib/errorMessages';
import { listEvidences, uploadEvidence } from '../services/evidenceService';

const evidenceTypes = ['Documento técnico', 'Relatório', 'Código-fonte', 'Imagem', 'Planilha', 'Ata de reunião', 'Publicação', 'Outro'];
const statuses = ['Enviada', 'Em análise', 'Aprovada', 'Reprovada'];

function formatTimestamp(value) {
  const date = value?.toDate ? value.toDate() : value instanceof Date ? value : null;

  if (!date || Number.isNaN(date.getTime())) {
    return 'Processando...';
  }

  return `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
}

function normalizeEvidence(item) {
  const project = projects.find((projectItem) => projectItem.id === item.projectId);

  return {
    ...item,
    project: project?.name || item.projectId || 'Projeto não informado',
    type: item.evidenceType || 'Não informado',
    owner: item.userName || item.userEmail || 'Usuário não informado',
    date: formatTimestamp(item.createdAt)
  };
}

export default function Evidence() {
  const { currentUser, userProfile } = useAuth();
  const [items, setItems] = useState([]);
  const [projectFilter, setProjectFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [listError, setListError] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [savingMetadataLoading, setSavingMetadataLoading] = useState(false);

  async function loadEvidenceList() {
    setIsLoading(true);
    setListError('');

    try {
      const result = await listEvidences();
      setItems(result.map(normalizeEvidence));
    } catch (error) {
      logTechnicalError('Falha ao carregar lista de evidências.', error);
      setItems([]);
      setListError(getFriendlyErrorMessage(error, 'Não foi possível carregar as evidências.'));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadEvidenceList();
  }, []);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const byProject = !projectFilter || item.projectId === projectFilter;
      const byType = !typeFilter || item.type === typeFilter;
      const byStatus = !statusFilter || item.status === statusFilter;
      return byProject && byType && byStatus;
    });
  }, [items, projectFilter, typeFilter, statusFilter]);

  async function handleCreate(data) {
    setFeedback(null);

    try {
      const result = await uploadEvidence({
        file: data.file,
        projectId: data.project,
        title: data.title,
        description: data.description,
        evidenceType: data.type,
        activityRelated: data.activityRelated,
        user: {
          uid: currentUser?.uid,
          email: currentUser?.email,
          displayName: userProfile?.fullName || currentUser?.displayName || currentUser?.email
        },
        onUploadStart: () => setUploadLoading(true),
        onUploadEnd: () => setUploadLoading(false),
        onMetadataSaveStart: () => setSavingMetadataLoading(true),
        onMetadataSaveEnd: () => setSavingMetadataLoading(false)
      });
      await loadEvidenceList();

      if (result.auditEventStatus === 'failed') {
        setFeedback({
          type: 'error',
          message: getFriendlyErrorMessage(result.auditEventError, 'A evidência foi enviada, mas o evento de auditoria não foi registrado.')
        });
        return;
      }

      setFeedback({ type: 'success', message: 'Evidência enviada com sucesso.' });
    } catch (error) {
      logTechnicalError('Falha ao enviar evidência.', error);
      setFeedback({
        type: 'error',
        message: getFriendlyErrorMessage(error, 'Não foi possível enviar a evidência.')
      });
      throw error;
    } finally {
      setUploadLoading(false);
      setSavingMetadataLoading(false);
    }
  }

  const columns = [
    {
      key: 'title',
      label: 'Evidência',
      render: (row) => (
        <div className="table-title-cell">
          <strong>{row.title}</strong>
          <span>{row.description}</span>
        </div>
      )
    },
    { key: 'project', label: 'Projeto' },
    { key: 'type', label: 'Tipo' },
    { key: 'fileName', label: 'Arquivo' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'date', label: 'Data de envio' },
    { key: 'owner', label: 'Usuário' },
    {
      key: 'actions',
      label: 'Ações',
      render: (row) => row.fileUrl
        ? <Button as="a" href={row.fileUrl} target="_blank" rel="noreferrer" variant="ghost" size="sm">Ver arquivo</Button>
        : '-'
    }
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

      <Card title="Enviar nova evidência" description="Arquivo no Supabase Storage e metadados no Cloud Firestore.">
        {feedback && <div className={`form-feedback ${feedback.type}`}>{feedback.message}</div>}
        <EvidenceForm
          projects={projects}
          onSubmit={handleCreate}
          uploadLoading={uploadLoading}
          savingMetadataLoading={savingMetadataLoading}
        />
      </Card>

      <Card title="Lista de evidências" description={`${filtered.length} evidência(s) encontrada(s)`}>
        <div className="filters-row compact">
          <Select
            label="Projeto"
            options={projects.map((project) => ({ value: project.id, label: project.name }))}
            value={projectFilter}
            onChange={(event) => setProjectFilter(event.target.value)}
            placeholder="Todos"
          />
          <Select label="Tipo" options={evidenceTypes} value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} placeholder="Todos" />
          <Select label="Status" options={statuses} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} placeholder="Todos" />
        </div>
        {listError && <div className="form-feedback error">{listError}</div>}
        {isLoading
          ? <div className="content-loading">Carregando evidências...</div>
          : <Table columns={columns} data={filtered} emptyTitle="Nenhuma evidência enviada ainda." />}
      </Card>
    </div>
  );
}
