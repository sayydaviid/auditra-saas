import {
  BarChart3,
  Building2,
  CheckSquare,
  ClipboardList,
  FileClock,
  FileText,
  FolderKanban,
  LogOut,
  Menu,
  MessageCircle,
  Settings,
  ShieldCheck,
  Users,
  X
} from 'lucide-react';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getFriendlyErrorMessage, logTechnicalError } from '../../lib/errorMessages';
import { hasPermission } from '../../config/permissions';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: BarChart3, permission: 'dashboard:view' },
  { label: 'Projetos', path: '/projetos', icon: FolderKanban, permission: 'projects:view' },
  { label: 'Registro de Horas', path: '/horas', icon: FileClock, permission: 'time:view' },
  { label: 'Evidências', path: '/evidencias', icon: ClipboardList, permission: 'evidence:view' },
  { label: 'Aprovações', path: '/aprovacoes', icon: CheckSquare, permission: 'approvals:view' },
  { label: 'Relatórios', path: '/relatorios', icon: FileText, permission: 'reports:view' },
  { label: 'Auditoria', path: '/auditoria', icon: ShieldCheck, permission: 'audit:view' },
  { label: 'Atendimento', path: '/atendimento', icon: MessageCircle, permission: 'support:view' },
  { label: 'Empresas', path: '/empresas', icon: Building2, permission: 'companies:view' },
  { label: 'Usuários', path: '/usuarios', icon: Users, permission: 'users:view' },
  { label: 'Configurações', path: '/configuracoes', icon: Settings, permission: 'settings:view' }
];

export default function Sidebar({ collapsed, mobileOpen, onToggle, onCloseMobile }) {
  const navigate = useNavigate();
  const { logout, userProfile } = useAuth();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutError, setLogoutError] = useState('');

  const visibleNavItems = navItems.filter((item) =>
    hasPermission(userProfile?.role, item.permission)
  );

  async function handleLogout() {
    setLogoutError('');
    setLogoutLoading(true);

    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      logTechnicalError('Falha ao sair da conta.', error);
      setLogoutError(getFriendlyErrorMessage(error, 'Não foi possível sair da conta agora.'));
    } finally {
      setLogoutLoading(false);
    }
  }

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-brand">
        <button className="mobile-close" type="button" onClick={onCloseMobile} aria-label="Fechar menu">
          <X size={20} />
        </button>

        <div className="brand-mark">A</div>

        {!collapsed && (
          <div>
            <strong>Auditra</strong>
            <span>Governança de P&D</span>
          </div>
        )}
      </div>

      <button className="sidebar-toggle" type="button" onClick={onToggle} aria-label="Recolher sidebar">
        <Menu size={18} />
        {!collapsed && <span>Recolher menu</span>}
      </button>

      <nav className="sidebar-nav" aria-label="Menu principal">
        {visibleNavItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onCloseMobile}
            >
              <Icon size={19} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        {logoutError && !collapsed && (
          <div className="form-feedback error" role="alert">
            {logoutError}
          </div>
        )}

        <button className="sidebar-link logout" type="button" onClick={handleLogout} disabled={logoutLoading}>
          <LogOut size={19} />
          {!collapsed && <span>{logoutLoading ? 'Saindo...' : 'Sair'}</span>}
        </button>
      </div>
    </aside>
  );
}