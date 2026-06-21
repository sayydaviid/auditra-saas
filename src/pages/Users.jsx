import { useEffect, useMemo, useState } from 'react';
import { collection, doc, onSnapshot, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { Plus, ShieldCheck, UserCog, UsersRound } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import StatCard from '../components/shared/StatCard';
import StatusBadge from '../components/shared/StatusBadge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Select from '../components/ui/Select';
import Table from '../components/ui/Table';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { getFriendlyErrorMessage, logTechnicalError } from '../lib/errorMessages';
import { isAuditraAdmin, ROLES } from '../config/permissions';

const profiles = [
  ROLES.AUDITRA_ADMIN,
  ROLES.COMPANY_ADMIN,
  ROLES.R_AND_D_MANAGER,
  ROLES.RESEARCHER,
  ROLES.FINANCE_COMPLIANCE
];

const statuses = ['Ativo', 'Pendente', 'Inativo'];

function getInitials(name = '', email = '') {
  const source = name || email || 'Usuário';
  const parts = source.trim().split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

function normalizeUser(docSnapshot) {
  const data = docSnapshot.data();

  return {
    id: docSnapshot.id,
    uid: data.uid || docSnapshot.id,
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    fullName: data.fullName || data.email || 'Usuário',
    email: data.email || '',
    role: data.role || ROLES.RESEARCHER,
    status: data.status || 'Pendente',
    companyId: data.companyId || '',
    companyName: data.companyName || '',
    lastAccess: data.lastAccess || '-',
    createdAt: data.createdAt || null,
    updatedAt: data.updatedAt || null
  };
}

export default function Users() {
  const { userProfile } = useAuth();

  const [userRows, setUserRows] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState('');

  const [profileFilter, setProfileFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    role: ROLES.RESEARCHER,
    status: 'Pendente',
    companyId: '',
    companyName: ''
  });
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState('');

  const auditraAdmin = isAuditraAdmin(userProfile);

  const availableProfiles = useMemo(() => {
    if (auditraAdmin) return profiles;

    return profiles.filter((profile) => profile !== ROLES.AUDITRA_ADMIN);
  }, [auditraAdmin]);

  useEffect(() => {
    if (!db || !userProfile) {
      setUsersLoading(false);
      return undefined;
    }

    setUsersLoading(true);
    setUsersError('');

    const usersRef = collection(db, 'users');

    const usersQuery = auditraAdmin
      ? usersRef
      : query(usersRef, where('companyId', '==', userProfile.companyId || '__sem_empresa__'));

    const unsubscribe = onSnapshot(
      usersQuery,
      (snapshot) => {
        const rows = snapshot.docs.map(normalizeUser);

        setUserRows(rows);
        setUsersLoading(false);
      },
      (error) => {
        logTechnicalError('Falha ao carregar usuários.', error);
        setUsersError(getFriendlyErrorMessage(error, 'Não foi possível carregar os usuários.'));
        setUsersLoading(false);
      }
    );

    return () => unsubscribe();
  }, [auditraAdmin, userProfile]);

  const filtered = useMemo(() => userRows.filter((user) => {
    const byProfile = !profileFilter || user.role === profileFilter;
    const byStatus = !statusFilter || user.status === statusFilter;

    const searchable = `${user.fullName} ${user.email} ${user.companyName} ${user.companyId}`.toLowerCase();
    const bySearch = searchable.includes(search.toLowerCase());

    return byProfile && byStatus && bySearch;
  }), [userRows, profileFilter, statusFilter, search]);

  const admins = userRows.filter((user) =>
    user.role === ROLES.AUDITRA_ADMIN || user.role === ROLES.COMPANY_ADMIN
  ).length;

  const activeUsers = userRows.filter((user) => user.status === 'Ativo').length;

  function openEditModal(user) {
    setEditingUser(user);
    setSaveError('');
    setEditForm({
      role: user.role || ROLES.RESEARCHER,
      status: user.status || 'Pendente',
      companyId: user.companyId || '',
      companyName: user.companyName || ''
    });
    setEditModalOpen(true);
  }

  function closeEditModal() {
    if (saveLoading) return;

    setEditModalOpen(false);
    setEditingUser(null);
    setSaveError('');
  }

  function updateEditForm(field, value) {
    setEditForm((current) => ({
      ...current,
      [field]: value
    }));
  }

  async function handleSaveUser() {
    if (!editingUser) return;

    setSaveError('');

    if (!db) {
      setSaveError('Firebase não configurado.');
      return;
    }

    if (!editForm.role || !editForm.status) {
      setSaveError('Informe perfil e status do usuário.');
      return;
    }

    if (!auditraAdmin && editForm.role === ROLES.AUDITRA_ADMIN) {
      setSaveError('Administrador de empresa não pode criar Administrador Auditra.');
      return;
    }

    let nextCompanyId = auditraAdmin ? editForm.companyId.trim() : userProfile?.companyId || '';
    let nextCompanyName = auditraAdmin ? editForm.companyName.trim() : userProfile?.companyName || '';

    if (editForm.role === ROLES.AUDITRA_ADMIN) {
      nextCompanyId = 'auditra';
      nextCompanyName = 'Auditra';
    }

    const needsCompany = editForm.status === 'Ativo' && editForm.role !== ROLES.AUDITRA_ADMIN;

    if (needsCompany && (!nextCompanyId || !nextCompanyName)) {
      setSaveError('Usuário ativo precisa estar vinculado a uma empresa.');
      return;
    }

    setSaveLoading(true);

    try {
      await updateDoc(doc(db, 'users', editingUser.id), {
        role: editForm.role,
        status: editForm.status,
        companyId: nextCompanyId,
        companyName: nextCompanyName,
        updatedAt: serverTimestamp()
      });

      closeEditModal();
    } catch (error) {
      logTechnicalError('Falha ao atualizar usuário.', error);
      setSaveError(getFriendlyErrorMessage(error, 'Não foi possível atualizar o usuário.'));
    } finally {
      setSaveLoading(false);
    }
  }

  const columns = [
    {
      key: 'fullName',
      label: 'Usuário',
      render: (row) => (
        <div className="user-table-cell">
          <div className="avatar small">{getInitials(row.fullName, row.email)}</div>
          <div>
            <strong>{row.fullName}</strong>
            <span>{row.email}</span>
          </div>
        </div>
      )
    },
    { key: 'role', label: 'Perfil' },
    {
      key: 'companyName',
      label: 'Empresa',
      render: (row) => row.companyName || 'Sem empresa'
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      key: 'lastAccess',
      label: 'Último acesso',
      render: (row) => row.lastAccess || '-'
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (row) => (
        <Button size="sm" variant="ghost" onClick={() => openEditModal(row)}>
          Editar
        </Button>
      )
    }
  ];

  return (
    <div className="page-stack">
      <PageHeader
        title="Usuários"
        description="Controle perfis de acesso, permissões e vínculo dos usuários com empresas e projetos."
        actions={<Button icon={Plus} onClick={() => setCreateModalOpen(true)}>Novo Usuário</Button>}
      />

      <div className="stats-grid three-cards">
        <StatCard title="Usuários cadastrados" value={userRows.length} subtitle="Total visível para seu perfil" icon={UsersRound} />
        <StatCard title="Usuários ativos" value={activeUsers} subtitle="Com acesso liberado" icon={UserCog} tone="green" />
        <StatCard title="Administradores" value={admins} subtitle="Auditra ou empresa" icon={ShieldCheck} tone="orange" />
      </div>

      {usersError && (
        <div className="form-feedback error" role="alert">
          {usersError}
        </div>
      )}

      <Card title="Filtros de usuários">
        <div className="filters-row compact">
          <Input
            label="Buscar"
            placeholder="Nome, e-mail ou empresa"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <Select
            label="Perfil"
            options={availableProfiles}
            value={profileFilter}
            onChange={(event) => setProfileFilter(event.target.value)}
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
      </Card>

      <Card
        title="Lista de usuários"
        description={usersLoading ? 'Carregando usuários...' : `${filtered.length} usuário(s) encontrado(s)`}
      >
        <Table
          columns={columns}
          data={usersLoading ? [] : filtered}
          emptyTitle={usersLoading ? 'Carregando usuários...' : 'Nenhum usuário encontrado'}
        />
      </Card>

      <Modal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Novo usuário"
        description="Neste MVP, o usuário deve se cadastrar pela tela de cadastro. Depois, um administrador aprova, define o perfil e vincula a empresa nesta tela."
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreateModalOpen(false)}>Fechar</Button>
          </>
        }
      >
        <p>
          Fluxo recomendado: o usuário cria a conta, nasce como Pendente e sem empresa.
          Depois, um Administrador Auditra vincula esse usuário à empresa correta.
        </p>
      </Modal>

      <Modal
        open={editModalOpen}
        onClose={closeEditModal}
        title="Editar usuário"
        description={editingUser ? `Atualize o acesso de ${editingUser.fullName}.` : 'Atualize o acesso do usuário.'}
        footer={
          <>
            <Button variant="secondary" onClick={closeEditModal} disabled={saveLoading}>Cancelar</Button>
            <Button onClick={handleSaveUser} disabled={saveLoading}>
              {saveLoading ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </>
        }
      >
        <div className="form-grid">
          {saveError && (
            <div className="form-feedback error" role="alert">
              {saveError}
            </div>
          )}

          <Input
            label="Nome"
            value={editingUser?.fullName || ''}
            disabled
          />

          <Input
            label="E-mail"
            value={editingUser?.email || ''}
            disabled
          />

          <Select
            label="Perfil"
            options={availableProfiles}
            value={editForm.role}
            onChange={(event) => updateEditForm('role', event.target.value)}
          />

          <Select
            label="Status"
            options={statuses}
            value={editForm.status}
            onChange={(event) => updateEditForm('status', event.target.value)}
          />

          <Input
            label="ID da empresa"
            placeholder="ex: materia-de-oem"
            value={editForm.companyId}
            onChange={(event) => updateEditForm('companyId', event.target.value)}
            disabled={!auditraAdmin || editForm.role === ROLES.AUDITRA_ADMIN}
          />

          <Input
            label="Nome da empresa"
            placeholder="ex: Matéria de OEM"
            value={editForm.companyName}
            onChange={(event) => updateEditForm('companyName', event.target.value)}
            disabled={!auditraAdmin || editForm.role === ROLES.AUDITRA_ADMIN}
          />
        </div>
      </Modal>
    </div>
  );
}