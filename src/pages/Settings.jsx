import { useMemo } from 'react';
import { Bell, Building2, Database, Lock, Palette, PlugZap, Save, ShieldCheck } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import StatusBadge from '../components/shared/StatusBadge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useAuth } from '../contexts/AuthContext';
import { isAuditraAdmin } from '../config/permissions';
import { companies } from '../data/mockData';

const integrations = [
  { name: 'Firebase Authentication', description: 'Login e controle de sessão das rotas internas.', status: 'Integrado' },
  { name: 'Cloud Firestore', description: 'Metadados de evidências e eventos de auditoria.', status: 'Integrado' },
  { name: 'Supabase Storage', description: 'Armazenamento dos arquivos de evidências técnicas.', status: 'Integrado' },
  { name: 'API Node.js', description: 'Web Service para regras de negócio e integração com banco.', status: 'Planejado' },
  { name: 'Render', description: 'Deploy do frontend como Static Site e API como Web Service.', status: 'Planejado' }
];

function getOrganizationData(userProfile) {
  if (isAuditraAdmin(userProfile)) {
    return {
      id: 'auditra',
      name: 'Auditra',
      cnpj: '00.000.000/0001-00',
      responsible: userProfile?.fullName || 'Administrador Auditra',
      email: userProfile?.email || 'contato@auditra.com.br',
      scopeLabel: 'Plataforma Auditra',
      scopeDescription: 'Este perfil pode administrar configurações globais da plataforma.'
    };
  }

  const company = companies.find((item) => item.companyId === userProfile?.companyId);

  return {
    id: userProfile?.companyId || 'sem-empresa',
    name: company?.name || userProfile?.companyName || 'Empresa não vinculada',
    cnpj: company?.cnpj || 'Não informado',
    responsible: company?.responsible || userProfile?.fullName || 'Responsável não informado',
    email: userProfile?.email || 'Não informado',
    scopeLabel: 'Empresa cliente',
    scopeDescription: 'Este perfil pode visualizar configurações apenas da própria empresa.'
  };
}

export default function Settings() {
  const { userProfile } = useAuth();

  const auditraAdmin = isAuditraAdmin(userProfile);

  const organization = useMemo(() => {
    return getOrganizationData(userProfile);
  }, [userProfile]);

  return (
    <div className="page-stack">
      <PageHeader
        title="Configurações"
        description="Ajustes de organização, segurança, notificações, aparência e integrações futuras."
        actions={<Button icon={Save}>Salvar visualmente</Button>}
      />

      <Card title="Escopo de acesso" description="Define quais configurações este usuário pode visualizar.">
        <div className="settings-feature">
          <ShieldCheck size={22} />
          <span>
            <strong>{organization.scopeLabel}</strong> — {organization.scopeDescription}
          </span>
          <StatusBadge status="Ativo" />
        </div>
      </Card>

      <div className="settings-grid">
        <Card
          title={auditraAdmin ? 'Dados da plataforma' : 'Dados da empresa'}
          description={auditraAdmin
            ? 'Informações gerais da Auditra exibidas em relatórios e configurações globais.'
            : 'Informações da empresa cliente vinculada ao usuário atual.'
          }
        >
          <div className="form-grid single-column" key={organization.id}>
            <Input label="Nome da organização" defaultValue={organization.name} />
            <Input label="ID da organização" defaultValue={organization.id} />
            <Input label="CNPJ" defaultValue={organization.cnpj} />
            <Input label="Responsável técnico" defaultValue={organization.responsible} />
            <Input label="E-mail de contato" defaultValue={organization.email} />
          </div>
        </Card>

        <Card title="Preferências de notificação" description="Alertas operacionais da plataforma.">
          <div className="settings-list">
            <label><input type="checkbox" defaultChecked /> Notificar evidências pendentes</label>
            <label><input type="checkbox" defaultChecked /> Avisar relatórios aguardando revisão</label>
            <label><input type="checkbox" defaultChecked /> Alertar riscos documentais altos</label>
            <label><input type="checkbox" /> Enviar resumo semanal por e-mail</label>
          </div>
        </Card>

        <Card title="Segurança" description="Configurações visuais para futura autenticação.">
          <div className="settings-feature">
            <Lock size={22} />
            <span>Autenticação em duas etapas</span>
            <StatusBadge status="Pendente" />
          </div>

          <div className="settings-feature">
            <Bell size={22} />
            <span>Alertas de acesso suspeito</span>
            <StatusBadge status="Pendente" />
          </div>

          <div className="settings-feature">
            <Database size={22} />
            <span>Logs de sessão e auditoria</span>
            <StatusBadge status="Ativo" />
          </div>
        </Card>

        <Card title="Aparência" description="Preferências visuais da interface.">
          <div className="form-grid single-column">
            <Select label="Tema" options={['Claro corporativo', 'Escuro', 'Automático']} defaultValue="Claro corporativo" />
            <Select label="Densidade" options={['Confortável', 'Compacta']} defaultValue="Confortável" />

            <div className="settings-feature">
              <Palette size={22} />
              <span>Identidade visual azul petróleo com status por cor.</span>
            </div>
          </div>
        </Card>
      </div>

      {auditraAdmin && (
        <Card title="Integrações da plataforma" description="Serviços integrados e componentes planejados para as próximas etapas.">
          <div className="integration-grid">
            {integrations.map((integration) => (
              <article className="integration-card" key={integration.name}>
                <PlugZap size={24} />
                <div>
                  <strong>{integration.name}</strong>
                  <p>{integration.description}</p>
                </div>
                <StatusBadge status={integration.status} />
              </article>
            ))}
          </div>
        </Card>
      )}

      {!auditraAdmin && (
        <Card title="Integrações disponíveis" description="Serviços utilizados pela Auditra para operação da empresa cliente.">
          <div className="integration-grid">
            {integrations.slice(0, 3).map((integration) => (
              <article className="integration-card" key={integration.name}>
                <PlugZap size={24} />
                <div>
                  <strong>{integration.name}</strong>
                  <p>{integration.description}</p>
                </div>
                <StatusBadge status={integration.status} />
              </article>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}