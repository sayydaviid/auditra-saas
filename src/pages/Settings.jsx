import { Bell, Database, Lock, Palette, PlugZap, Save } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import StatusBadge from '../components/shared/StatusBadge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

const integrations = [
  { name: 'Firebase Authentication', description: 'Login, recuperação de senha e controle de sessão.', status: 'Planejado' },
  { name: 'Firebase Storage', description: 'Armazenamento de evidências técnicas e documentos.', status: 'Planejado' },
  { name: 'Neon PostgreSQL', description: 'Banco principal para dados transacionais da plataforma.', status: 'Planejado' },
  { name: 'API Node.js', description: 'Web Service para regras de negócio e integração com banco.', status: 'Planejado' },
  { name: 'Render', description: 'Deploy do frontend como Static Site e API como Web Service.', status: 'Planejado' }
];

export default function Settings() {
  return (
    <div className="page-stack">
      <PageHeader
        title="Configurações"
        description="Ajustes de organização, segurança, notificações, aparência e integrações futuras."
        actions={<Button icon={Save}>Salvar visualmente</Button>}
      />

      <div className="settings-grid">
        <Card title="Dados da organização" description="Informações gerais exibidas nos relatórios.">
          <div className="form-grid single-column">
            <Input label="Nome da organização" defaultValue="Auditra Demo" />
            <Input label="CNPJ" defaultValue="00.000.000/0001-00" />
            <Input label="Responsável técnico" defaultValue="Marina Azevedo" />
            <Input label="E-mail de contato" defaultValue="contato@auditra.com.br" />
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
          <div className="settings-feature"><Lock size={22} /><span>Autenticação em duas etapas</span><StatusBadge status="Pendente" /></div>
          <div className="settings-feature"><Bell size={22} /><span>Alertas de acesso suspeito</span><StatusBadge status="Pendente" /></div>
          <div className="settings-feature"><Database size={22} /><span>Logs de sessão e auditoria</span><StatusBadge status="Ativo" /></div>
        </Card>

        <Card title="Aparência" description="Preferências visuais da interface.">
          <div className="form-grid single-column">
            <Select label="Tema" options={['Claro corporativo', 'Escuro', 'Automático']} defaultValue="Claro corporativo" />
            <Select label="Densidade" options={['Confortável', 'Compacta']} defaultValue="Confortável" />
            <div className="settings-feature"><Palette size={22} /><span>Identidade visual azul petróleo com status por cor.</span></div>
          </div>
        </Card>
      </div>

      <Card title="Integrações futuras" description="Estrutura preparada para backend e serviços externos.">
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
    </div>
  );
}
