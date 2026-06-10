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
import TimeEntries from '../pages/TimeEntries';
import Users from '../pages/Users';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projetos" element={<Projects />} />
        <Route path="/projetos/:id" element={<ProjectDetail />} />
        <Route path="/horas" element={<TimeEntries />} />
        <Route path="/evidencias" element={<Evidence />} />
        <Route path="/aprovacoes" element={<Approvals />} />
        <Route path="/relatorios" element={<Reports />} />
        <Route path="/auditoria" element={<Audit />} />
        <Route path="/empresas" element={<Companies />} />
        <Route path="/usuarios" element={<Users />} />
        <Route path="/configuracoes" element={<Settings />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
