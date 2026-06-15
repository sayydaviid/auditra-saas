import { Bell, LogOut, Menu, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

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
  const navigate = useNavigate();
  const { currentUser, userProfile, logout } = useAuth();
  const pageTitle = pathname.startsWith('/projetos/') ? 'Detalhe do Projeto' : pageNames[pathname] || 'Auditra';
  const displayName = userProfile?.fullName || currentUser?.displayName || currentUser?.email || 'Usuário';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

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
          <div className="avatar">{avatarLetter}</div>
          <div>
            <strong>{displayName}</strong>
            <small>Usuário autenticado</small>
          </div>
        </div>
        <button className="icon-button" type="button" onClick={handleLogout} aria-label="Sair">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
