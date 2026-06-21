import { useMemo, useState } from 'react';
import { Building2, Plus, UsersRound } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import StatCard from '../components/shared/StatCard';
import StatusBadge from '../components/shared/StatusBadge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Table from '../components/ui/Table';
import { useAuth } from '../contexts/AuthContext';
import { isAuditraAdmin } from '../config/permissions';
import { companies } from '../data/mockData';

export default function Companies() {
  const { userProfile } = useAuth();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const auditraAdmin = isAuditraAdmin(userProfile);

  const filtered = useMemo(() => companies.filter((company) => {
    const searchable = `${company.name} ${company.cnpj} ${company.segment} ${company.responsible}`.toLowerCase();

    return searchable.includes(search.toLowerCase());
  }), [search]);

  const activeCompanies = companies.filter((company) => company.status === 'Ativa').length;

  const totalProjects = companies.reduce((sum, company) => {
    return sum + Number(company.projectsCount || 0);
  }, 0);

  const columns = [
    {
      key: 'name',
      label: 'Empresa',
      render: (row) => (
        <div className="table-title-cell">
          <strong>{row.name}</strong>
          <span>{row.cnpj}</span>
        </div>
      )
    },
    { key: 'companyId', label: 'ID da empresa' },
    { key: 'segment', label: 'Segmento' },
    { key: 'projectsCount', label: 'Projetos' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'responsible', label: 'Responsável' },
    {
      key: 'actions',
      label: 'Ações',
      render: () => <Button size="sm" variant="ghost">Editar</Button>
    }
  ];

  if (!auditraAdmin) {
    return (
      <div className="page-stack">
        <PageHeader
          title="Acesso restrito"
          description="A gestão de empresas clientes é exclusiva para administradores da Auditra."
        />

        <Card title="Permissão insuficiente">
          <p>
            Seu perfil pode acessar recursos da sua própria empresa, mas não pode visualizar
            ou gerenciar a base geral de empresas da plataforma Auditra.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <PageHeader
        title="Empresas"
        description="Gerencie empresas clientes, segmentos, responsáveis e vínculo com projetos de P&D."
        actions={<Button icon={Plus} onClick={() => setModalOpen(true)}>Nova Empresa</Button>}
      />

      <div className="stats-grid three-cards">
        <StatCard
          title="Empresas cadastradas"
          value={companies.length}
          subtitle="Clientes e instituições"
          icon={Building2}
        />

        <StatCard
          title="Empresas ativas"
          value={activeCompanies}
          subtitle="Com acesso liberado"
          icon={UsersRound}
          tone="green"
        />

        <StatCard
          title="Projetos vinculados"
          value={totalProjects}
          subtitle="Total na base"
          icon={Building2}
          tone="blue"
        />
      </div>

      <Card title="Consulta de empresas">
        <div className="filters-row single-filter">
          <Input
            label="Buscar"
            placeholder="Nome, CNPJ, segmento ou responsável"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </Card>

      <Card title="Empresas clientes" description={`${filtered.length} empresa(s) encontrada(s)`}>
        <Table
          columns={columns}
          data={filtered}
          emptyTitle="Nenhuma empresa encontrada"
        />
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nova empresa"
        description="Modal visual mockado. O cadastro real será conectado à API futuramente."
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>

            <Button onClick={() => setModalOpen(false)}>
              Salvar visualmente
            </Button>
          </>
        }
      >
        <div className="form-grid">
          <Input label="Nome da empresa" placeholder="Ex: Instituto Norte de Inovação" />
          <Input label="ID da empresa" placeholder="ex: instituto-norte-inovacao" />
          <Input label="CNPJ" placeholder="00.000.000/0001-00" />
          <Input label="Segmento" placeholder="Ex: Tecnologia" />
          <Input label="Responsável" placeholder="Nome do responsável" />
        </div>
      </Modal>
    </div>
  );
}