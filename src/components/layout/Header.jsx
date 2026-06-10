import { Bell, Menu, Search } from 'lucide-react';

const pageNames = {
  '/dashboard': 'Dashboard',
  '/projetos': 'Projetos',
  '/horas': 'Registro de Horas',
  '/evidencias': 'Evidências',
  '/aprovacoes': 'Aprovações',
  '/relatorios': 'Relatórios',
  '/auditoria': 'Auditoria',
  '/empresas': 'Empresas',
  '/usuarios': 'Usuários',
  '/configuracoes': 'Configurações'
};

export default function Header({ pathname, onOpenMobile }) {
  const pageTitle = pathname.startsWith('/projetos/') ? 'Detalhe do Projeto' : pageNames[pathname] || 'Auditra';

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="icon-button mobile-menu" type="button" onClick={onOpenMobile} aria-label="Abrir menu">
          <Menu size={22} />
        </button>
        <div>
          <span className="topbar-kicker">Página atual</span>
          <h2>{pageTitle}</h2>
        </div>
      </div>

      <div className="topbar-search">
        <Search size={18} />
        <input type="search" placeholder="Buscar projetos, evidências ou usuários" />
      </div>

      <div className="topbar-actions">
        <button className="notification-button" type="button" aria-label="Notificações">
          <Bell size={20} />
          <span>3</span>
        </button>
        <div className="user-chip">
          <div className="avatar">MA</div>
          <div>
            <strong>Marina Azevedo</strong>
            <small>Administrador</small>
          </div>
        </div>
      </div>
    </header>
  );
}
