import { useMemo, useState } from 'react';
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
import { companies, users } from '../data/mockData';

const profiles = ['Administrador', 'Gestor de P&D', 'Pesquisador', 'Financeiro/Compliance'];
const statuses = ['Ativo', 'Pendente', 'Inativo'];

export default function Users() {
  const [profileFilter, setProfileFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => users.filter((user) => {
    const byProfile = !profileFilter || user.profile === profileFilter;
    const byStatus = !statusFilter || user.status === statusFilter;
    const bySearch = `${user.name} ${user.email} ${user.company}`.toLowerCase().includes(search.toLowerCase());
    return byProfile && byStatus && bySearch;
  }), [profileFilter, statusFilter, search]);

  const admins = users.filter((user) => user.profile === 'Administrador').length;
  const activeUsers = users.filter((user) => user.status === 'Ativo').length;

  const columns = [
    {
      key: 'name',
      label: 'Usuário',
      render: (row) => (
        <div className="user-table-cell">
          <div className="avatar small">{row.avatar}</div>
          <div>
            <strong>{row.name}</strong>
            <span>{row.email}</span>
          </div>
        </div>
      )
    },
    { key: 'profile', label: 'Perfil' },
    { key: 'company', label: 'Empresa' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'lastAccess', label: 'Último acesso' },
    { key: 'actions', label: 'Ações', render: () => <Button size="sm" variant="ghost">Editar</Button> }
  ];

  return (
    <div className="page-stack">
      <PageHeader
        title="Usuários"
        description="Controle perfis de acesso, permissões e vínculo dos usuários com empresas e projetos."
        actions={<Button icon={Plus} onClick={() => setModalOpen(true)}>Novo Usuário</Button>}
      />

      <div className="stats-grid three-cards">
        <StatCard title="Usuários cadastrados" value={users.length} subtitle="Total na base" icon={UsersRound} />
        <StatCard title="Usuários ativos" value={activeUsers} subtitle="Com acesso liberado" icon={UserCog} tone="green" />
        <StatCard title="Administradores" value={admins} subtitle="Permissão total" icon={ShieldCheck} tone="orange" />
      </div>

      <Card title="Filtros de usuários">
        <div className="filters-row compact">
          <Input label="Buscar" placeholder="Nome, e-mail ou empresa" value={search} onChange={(event) => setSearch(event.target.value)} />
          <Select label="Perfil" options={profiles} value={profileFilter} onChange={(event) => setProfileFilter(event.target.value)} placeholder="Todos" />
          <Select label="Status" options={statuses} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} placeholder="Todos" />
        </div>
      </Card>

      <Card title="Lista de usuários" description={`${filtered.length} usuário(s) encontrado(s)`}>
        <Table columns={columns} data={filtered} emptyTitle="Nenhum usuário encontrado" />
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Novo usuário"
        description="Modal visual mockado. Convite real será enviado por Firebase Authentication futuramente."
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={() => setModalOpen(false)}>Criar visualmente</Button>
          </>
        }
      >
        <div className="form-grid">
          <Input label="Nome" placeholder="Nome completo" />
          <Input label="E-mail" type="email" placeholder="usuario@empresa.com.br" />
          <Select label="Perfil" options={profiles} />
          <Select label="Empresa" options={companies.map((company) => company.name)} />
        </div>
      </Modal>
    </div>
  );
}
