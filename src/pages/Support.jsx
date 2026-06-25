import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clock3,
  Inbox,
  MessageCircle,
  Plus,
  Send,
  ShieldCheck,
  XCircle
} from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import StatCard from '../components/shared/StatCard';
import StatusBadge from '../components/shared/StatusBadge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Select from '../components/ui/Select';
import Table from '../components/ui/Table';
import { canManageSupport, canReplySupport, isAuditraAdmin } from '../config/permissions';
import { useAuth } from '../contexts/AuthContext';
import { getFriendlyErrorMessage, logTechnicalError } from '../lib/errorMessages';
import {
  createSupportTicket,
  listSupportMessages,
  listSupportTickets,
  sendSupportMessage,
  SUPPORT_CATEGORIES,
  SUPPORT_PRIORITIES,
  SUPPORT_STATUSES,
  updateSupportTicketStatus
} from '../services/supportService';

function toDate(value) {
  if (value?.toDate) return value.toDate();
  if (value instanceof Date) return value;
  return null;
}

function formatDate(value) {
  const date = toDate(value);

  if (!date || Number.isNaN(date.getTime())) {
    return 'Agora';
  }

  return `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  })}`;
}

const initialTicketForm = {
  title: '',
  category: 'Outro',
  priority: 'Média',
  message: ''
};

export default function Support() {
  const { currentUser, userProfile } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState('');
  const [ticketForm, setTicketForm] = useState(initialTicketForm);
  const [replyMessage, setReplyMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoadingTickets, setIsLoadingTickets] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const auditraAdmin = isAuditraAdmin(userProfile);
  const supportAgent = canReplySupport(userProfile);
  const supportManager = canManageSupport(userProfile);

  const selectedTicket = useMemo(() => {
    return tickets.find((ticket) => ticket.id === selectedTicketId) || tickets[0] || null;
  }, [tickets, selectedTicketId]);

  const selectedTicketClosed = selectedTicket?.status === 'Fechado';
  const selectedTicketResolved = selectedTicket?.status === 'Resolvido';

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const byStatus = !statusFilter || ticket.status === statusFilter;
      const byPriority = !priorityFilter || ticket.priority === priorityFilter;
      const byCategory = !categoryFilter || ticket.category === categoryFilter;

      return byStatus && byPriority && byCategory;
    });
  }, [tickets, statusFilter, priorityFilter, categoryFilter]);

  const openCount = useMemo(() => {
    return tickets.filter((ticket) =>
      ticket.status === 'Aberto' || ticket.status === 'Em atendimento'
    ).length;
  }, [tickets]);

  const waitingCount = useMemo(() => {
    return tickets.filter((ticket) => ticket.status === 'Aguardando cliente').length;
  }, [tickets]);

  const resolvedCount = useMemo(() => {
    return tickets.filter((ticket) =>
      ticket.status === 'Resolvido' || ticket.status === 'Fechado'
    ).length;
  }, [tickets]);

  async function loadTickets() {
    if (!userProfile) return;

    setIsLoadingTickets(true);
    setError('');

    try {
      const result = await listSupportTickets(userProfile);
      setTickets(result);

      if (!selectedTicketId && result[0]) {
        setSelectedTicketId(result[0].id);
      }
    } catch (loadError) {
      logTechnicalError('Falha ao carregar chamados de atendimento.', loadError);
      setError(getFriendlyErrorMessage(loadError, 'Não foi possível carregar os chamados.'));
    } finally {
      setIsLoadingTickets(false);
    }
  }

  async function loadMessages(ticketId) {
    if (!ticketId) {
      setMessages([]);
      return;
    }

    setIsLoadingMessages(true);

    try {
      const result = await listSupportMessages(ticketId);
      setMessages(result);
    } catch (loadError) {
      logTechnicalError('Falha ao carregar mensagens do chamado.', loadError);
      setError(getFriendlyErrorMessage(loadError, 'Não foi possível carregar as mensagens do chamado.'));
    } finally {
      setIsLoadingMessages(false);
    }
  }

  useEffect(() => {
    loadTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  useEffect(() => {
    loadMessages(selectedTicket?.id);
  }, [selectedTicket?.id]);

  function updateTicketForm(field, value) {
    setTicketForm((current) => ({
      ...current,
      [field]: value
    }));
  }

  async function handleCreateTicket() {
    setFeedback('');
    setError('');

    try {
      const created = await createSupportTicket({
        ...ticketForm,
        currentUser,
        userProfile
      });

      setTickets((current) => [created, ...current]);
      setSelectedTicketId(created.id);
      setTicketForm(initialTicketForm);
      setModalOpen(false);
      setFeedback('Chamado aberto com sucesso.');
      window.setTimeout(() => setFeedback(''), 3000);

      await loadMessages(created.id);
    } catch (createError) {
      logTechnicalError('Falha ao abrir chamado.', createError);
      setError(getFriendlyErrorMessage(createError, 'Não foi possível abrir o chamado.'));
    }
  }

  async function handleSendMessage() {
    if (!selectedTicket) return;

    setFeedback('');
    setError('');

    if (selectedTicket.status === 'Fechado') {
      setError('Este chamado está fechado. Não é possível enviar novas mensagens.');
      window.setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      await sendSupportMessage({
        ticketId: selectedTicket.id,
        message: replyMessage,
        currentUser,
        userProfile
      });

      setTickets((current) =>
        current.map((ticket) =>
          ticket.id === selectedTicket.id
            ? {
                ...ticket,
                lastMessage: replyMessage,
                lastMessageAt: new Date(),
                updatedAt: new Date(),
                unreadForAdmin: !supportAgent,
                unreadForCompany: supportAgent
              }
            : ticket
        )
      );

      setReplyMessage('');
      setFeedback(supportAgent ? 'Resposta enviada ao cliente.' : 'Mensagem enviada ao suporte.');
      window.setTimeout(() => setFeedback(''), 3000);

      await loadMessages(selectedTicket.id);
    } catch (sendError) {
      logTechnicalError('Falha ao enviar mensagem.', sendError);
      setError(getFriendlyErrorMessage(sendError, 'Não foi possível enviar a mensagem.'));
    }
  }

  async function handleStatusChange(status) {
    if (!selectedTicket || !supportManager) return;

    setFeedback('');
    setError('');

    try {
      await updateSupportTicketStatus(selectedTicket.id, status);

      setTickets((current) =>
        current.map((ticket) =>
          ticket.id === selectedTicket.id ? { ...ticket, status } : ticket
        )
      );

      setFeedback(`Status atualizado para: ${status}.`);
      window.setTimeout(() => setFeedback(''), 3000);
    } catch (statusError) {
      logTechnicalError('Falha ao atualizar status do chamado.', statusError);
      setError(getFriendlyErrorMessage(statusError, 'Não foi possível atualizar o status.'));
    }
  }

  async function handleCloseTicket() {
    if (!selectedTicket || !supportManager) return;

    setFeedback('');
    setError('');

    try {
      await updateSupportTicketStatus(selectedTicket.id, 'Fechado');

      setTickets((current) =>
        current.map((ticket) =>
          ticket.id === selectedTicket.id ? { ...ticket, status: 'Fechado' } : ticket
        )
      );

      setFeedback('Chamado fechado com sucesso.');
      window.setTimeout(() => setFeedback(''), 3000);
    } catch (closeError) {
      logTechnicalError('Falha ao fechar chamado.', closeError);
      setError(getFriendlyErrorMessage(closeError, 'Não foi possível fechar o chamado.'));
    }
  }

  const columns = [
    {
      key: 'title',
      label: 'Chamado',
      render: (row) => (
        <div className="table-title-cell">
          <strong>{row.title}</strong>
          <span>{row.companyName || 'Empresa não informada'}</span>
        </div>
      )
    },
    { key: 'category', label: 'Categoria' },
    { key: 'priority', label: 'Prioridade' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'createdByName', label: 'Solicitante' },
    {
      key: 'lastMessageAt',
      label: 'Última atualização',
      render: (row) => formatDate(row.lastMessageAt || row.updatedAt || row.createdAt)
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (row) => (
        <Button size="sm" variant="ghost" onClick={() => setSelectedTicketId(row.id)}>
          Abrir
        </Button>
      )
    }
  ];

  return (
    <div className="page-stack">
      <PageHeader
        title="Atendimento"
        description={
          auditraAdmin
            ? 'Acompanhe e responda chamados abertos pelas empresas clientes.'
            : 'Abra chamados e acompanhe as respostas do suporte da Auditra.'
        }
        actions={<Button icon={Plus} onClick={() => setModalOpen(true)}>Novo chamado</Button>}
      />

      <div className="stats-grid four-cards">
        <StatCard
          title="Chamados"
          value={tickets.length}
          subtitle={auditraAdmin ? 'Todas as empresas' : 'Sua empresa'}
          icon={Inbox}
        />

        <StatCard
          title="Em aberto"
          value={openCount}
          subtitle="Aberto ou em atendimento"
          icon={Clock3}
          tone="orange"
        />

        <StatCard
          title="Aguardando cliente"
          value={waitingCount}
          subtitle="Pendentes de retorno"
          icon={MessageCircle}
          tone="blue"
        />

        <StatCard
          title="Resolvidos"
          value={resolvedCount}
          subtitle="Resolvidos ou fechados"
          icon={CheckCircle2}
          tone="green"
        />
      </div>

      {feedback && <div className="form-feedback success">{feedback}</div>}
      {error && <div className="form-feedback error">{error}</div>}

      <Card title="Filtros de atendimento" description="Refine a lista por status, prioridade e categoria.">
        <div className="filters-row compact">
          <Select
            label="Status"
            options={SUPPORT_STATUSES}
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            placeholder="Todos"
          />

          <Select
            label="Prioridade"
            options={SUPPORT_PRIORITIES}
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
            placeholder="Todas"
          />

          <Select
            label="Categoria"
            options={SUPPORT_CATEGORIES}
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            placeholder="Todas"
          />
        </div>
      </Card>

      <div className="dashboard-grid two-columns audit-layout">
        <Card title="Chamados" description={`${filteredTickets.length} chamado(s) encontrado(s)`}>
          {isLoadingTickets ? (
            <div className="content-loading">Carregando chamados...</div>
          ) : (
            <Table
              columns={columns}
              data={filteredTickets}
              emptyTitle="Nenhum chamado encontrado"
              emptyDescription="Abra um novo chamado para solicitar atendimento."
            />
          )}
        </Card>

        <Card
          title={selectedTicket ? selectedTicket.title : 'Conversa'}
          description={
            selectedTicket
              ? `${selectedTicket.companyName || 'Empresa não informada'} • ${selectedTicket.category}`
              : 'Selecione um chamado para visualizar a conversa.'
          }
        >
          {!selectedTicket && (
            <div className="empty-state">
              <MessageCircle size={32} />
              <strong>Nenhum chamado selecionado</strong>
              <p>Selecione um chamado na tabela ou abra uma nova solicitação.</p>
            </div>
          )}

          {selectedTicket && (
            <div className="page-stack">
              <div className="settings-feature">
                <ShieldCheck size={22} />
                <span>
                  <strong>Status atual:</strong> {selectedTicket.status}
                </span>
                <StatusBadge status={selectedTicket.status} />
              </div>

              {supportManager && selectedTicketResolved && (
                <Button variant="danger" icon={XCircle} onClick={handleCloseTicket}>
                  Fechar chamado
                </Button>
              )}

              {selectedTicketClosed && (
                <div className="form-feedback success">
                  Este chamado foi fechado. Novas mensagens estão bloqueadas.
                </div>
              )}

              {supportManager && !selectedTicketClosed && (
                <Select
                  label="Alterar status do chamado"
                  options={SUPPORT_STATUSES.filter((status) => status !== 'Fechado')}
                  value={selectedTicket.status}
                  onChange={(event) => handleStatusChange(event.target.value)}
                />
              )}

              {isLoadingMessages ? (
                <div className="content-loading">Carregando conversa...</div>
              ) : (
                <div className="support-thread">
                  {messages.length === 0 && (
                    <div className="empty-state">
                      <MessageCircle size={28} />
                      <strong>Nenhuma mensagem</strong>
                      <p>Este chamado ainda não possui mensagens.</p>
                    </div>
                  )}

                  {messages.map((message) => (
                    <article
                      key={message.id}
                      className={`support-message ${message.senderType === 'admin' ? 'admin' : 'company'}`}
                    >
                      <div className="table-title-cell">
                        <strong>{message.senderName}</strong>
                        <span>
                          {message.senderType === 'admin' ? 'Suporte Auditra' : 'Empresa'} • {formatDate(message.createdAt)}
                        </span>
                      </div>

                      <p>{message.message}</p>
                    </article>
                  ))}
                </div>
              )}

              <div className="form-grid single-column">
                <label className="input-label" htmlFor="support-reply">
                  {supportAgent ? 'Responder como suporte Auditra' : 'Enviar mensagem ao suporte'}
                </label>

                <textarea
                  id="support-reply"
                  className="input-field"
                  rows={4}
                  value={replyMessage}
                  onChange={(event) => setReplyMessage(event.target.value)}
                  disabled={selectedTicketClosed}
                  placeholder={
                    selectedTicketClosed
                      ? 'Chamado fechado. Não é possível enviar novas mensagens.'
                      : supportAgent
                        ? 'Digite a resposta para a empresa cliente...'
                        : 'Digite uma mensagem para o suporte da Auditra...'
                  }
                />

                <Button icon={Send} onClick={handleSendMessage} disabled={selectedTicketClosed}>
                  {selectedTicketClosed
                    ? 'Chamado fechado'
                    : supportAgent
                      ? 'Enviar resposta'
                      : 'Enviar mensagem'}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Novo chamado"
        description="Descreva a solicitação para o atendimento da Auditra."
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>

            <Button onClick={handleCreateTicket}>
              Abrir chamado
            </Button>
          </>
        }
      >
        <div className="form-grid single-column">
          <Input
            label="Título"
            placeholder="Ex: Dúvida sobre envio de evidências"
            value={ticketForm.title}
            onChange={(event) => updateTicketForm('title', event.target.value)}
          />

          <Select
            label="Categoria"
            options={SUPPORT_CATEGORIES}
            value={ticketForm.category}
            onChange={(event) => updateTicketForm('category', event.target.value)}
          />

          <Select
            label="Prioridade"
            options={SUPPORT_PRIORITIES}
            value={ticketForm.priority}
            onChange={(event) => updateTicketForm('priority', event.target.value)}
          />

          <label className="input-label" htmlFor="support-message">
            Mensagem inicial
          </label>

          <textarea
            id="support-message"
            className="input-field"
            rows={5}
            value={ticketForm.message}
            onChange={(event) => updateTicketForm('message', event.target.value)}
            placeholder="Explique o problema, dúvida ou solicitação com detalhes."
          />
        </div>
      </Modal>
    </div>
  );
}