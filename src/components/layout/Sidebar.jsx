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
  Settings,
  ShieldCheck,
  Users,
  X
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: BarChart3 },
  { label: 'Projetos', path: '/projetos', icon: FolderKanban },
  { label: 'Registro de Horas', path: '/horas', icon: FileClock },
  { label: 'Evidências', path: '/evidencias', icon: ClipboardList },
  { label: 'Aprovações', path: '/aprovacoes', icon: CheckSquare },
  { label: 'Relatórios', path: '/relatorios', icon: FileText },
  { label: 'Auditoria', path: '/auditoria', icon: ShieldCheck },
  { label: 'Empresas', path: '/empresas', icon: Building2 },
  { label: 'Usuários', path: '/usuarios', icon: Users },
  { label: 'Configurações', path: '/configuracoes', icon: Settings }
];

export default function Sidebar({ collapsed, mobileOpen, onToggle, onCloseMobile }) {
  const navigate = useNavigate();

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
        {navItems.map((item) => {
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
        <button className="sidebar-link logout" type="button" onClick={() => navigate('/login')}>
          <LogOut size={19} />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}
