import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import Approvals from '../pages/Approvals';
import Audit from '../pages/Audit';
import Companies from '../pages/Companies';
import Dashboard from '../pages/Dashboard';
import Evidence from '../pages/Evidence';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import ProjectDetail from '../pages/ProjectDetail';
import Projects from '../pages/Projects';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';
import Support from '../pages/Support';
import TimeEntries from '../pages/TimeEntries';
import Users from '../pages/Users';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route element={<ProtectedRoute permission="dashboard:view" />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route element={<ProtectedRoute permission="projects:view" />}>
            <Route path="/projetos" element={<Projects />} />
          </Route>

          <Route element={<ProtectedRoute permission="projects:detail" />}>
            <Route path="/projetos/:id" element={<ProjectDetail />} />
          </Route>

          <Route element={<ProtectedRoute permission="time:view" />}>
            <Route path="/horas" element={<TimeEntries />} />
          </Route>

          <Route element={<ProtectedRoute permission="evidence:view" />}>
            <Route path="/evidencias" element={<Evidence />} />
          </Route>

          <Route element={<ProtectedRoute permission="approvals:view" />}>
            <Route path="/aprovacoes" element={<Approvals />} />
          </Route>

          <Route element={<ProtectedRoute permission="reports:view" />}>
            <Route path="/relatorios" element={<Reports />} />
          </Route>

          <Route element={<ProtectedRoute permission="audit:view" />}>
            <Route path="/auditoria" element={<Audit />} />
          </Route>

          <Route element={<ProtectedRoute permission="support:view" />}>
            <Route path="/atendimento" element={<Support />} />
          </Route>

          <Route element={<ProtectedRoute permission="companies:view" />}>
            <Route path="/empresas" element={<Companies />} />
          </Route>

          <Route element={<ProtectedRoute permission="users:view" />}>
            <Route path="/usuarios" element={<Users />} />
          </Route>

          <Route element={<ProtectedRoute permission="settings:view" />}>
            <Route path="/configuracoes" element={<Settings />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}