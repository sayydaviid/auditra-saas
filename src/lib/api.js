import {
  approvals,
  auditEvents,
  companies,
  dashboardMetrics,
  evidence,
  projects,
  reports,
  timeEntries,
  users
} from '../data/mockData';

const delay = (data, timeout = 250) =>
  new Promise((resolve) => {
    window.setTimeout(() => resolve(data), timeout);
  });

export function getProjects() {
  return delay(projects);
}

export function getProjectById(id) {
  return delay(projects.find((project) => project.id === id));
}

export function getUsers() {
  return delay(users);
}

export function getCompanies() {
  return delay(companies);
}

export function getEvidence() {
  return delay(evidence);
}

export function getApprovals() {
  return delay(approvals);
}

export function getReports() {
  return delay(reports);
}

export function getAuditEvents() {
  return delay(auditEvents);
}

export function getDashboardMetrics() {
  return delay(dashboardMetrics);
}

export function createTimeEntry(data) {
  const entry = {
    id: `h-${Date.now()}`,
    status: 'Pendente',
    user: 'Usuário logado',
    ...data
  };

  return delay(entry);
}

export function createEvidence(data) {
  const item = {
    id: `e-${Date.now()}`,
    status: 'Enviada',
    owner: 'Usuário logado',
    date: new Date().toLocaleDateString('pt-BR'),
    ...data
  };

  return delay(item);
}

export function updateApprovalStatus(id, status) {
  return delay({ id, status });
}

export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  futureHosting: 'Render Web Service com Node.js',
  database: 'Cloud Firestore para evidências e auditoria',
  storage: 'Supabase Storage',
  auth: 'Firebase Authentication'
};
