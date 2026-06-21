import { useMemo } from 'react';
import { AlertTriangle, CheckSquare, ClipboardList, FileCheck2, FileText, FolderKanban, Timer } from 'lucide-react';
import AlertList from '../components/dashboard/AlertList';
import DashboardCharts from '../components/dashboard/DashboardCharts';
import PageHeader from '../components/shared/PageHeader';
import ProgressBar from '../components/shared/ProgressBar';
import RiskBadge from '../components/shared/RiskBadge';
import StatCard from '../components/shared/StatCard';
import StatusBadge from '../components/shared/StatusBadge';
import Timeline from '../components/shared/Timeline';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import { useAuth } from '../contexts/AuthContext';
import { isAuditraAdmin } from '../config/permissions';
import {
  alerts,
  approvals,
  dashboardCriticalProjects,
  evidence,
  projects,
  recentActivities,
  reports,
  timeEntries
} from '../data/mockData';

function belongsToUserCompany(item, userProfile) {
  if (isAuditraAdmin(userProfile)) {
    return true;
  }

  if (!userProfile?.companyId) {
    return false;
  }

  return item.companyId === userProfile.companyId;
}

function calculateDocumentCompleteness(scopedProjects) {
  if (!scopedProjects.length) return 0;

  const total = scopedProjects.reduce((sum, project) => {
    return sum + Number(project.completion || 0);
  }, 0);

  return Math.round(total / scopedProjects.length);
}

export default function Dashboard() {
  const { userProfile } = useAuth();

  const scopedProjects = useMemo(() => {
    return projects.filter((project) => belongsToUserCompany(project, userProfile));
  }, [userProfile]);

  const scopedTimeEntries = useMemo(() => {
    return timeEntries.filter((entry) => belongsToUserCompany(entry, userProfile));
  }, [userProfile]);

  const scopedEvidence = useMemo(() => {
    return evidence.filter((item) => belongsToUserCompany(item, userProfile));
  }, [userProfile]);

  const scopedApprovals = useMemo(() => {
    return approvals.filter((item) => belongsToUserCompany(item, userProfile));
  }, [userProfile]);

  const scopedReports = useMemo(() => {
    return reports.filter((item) => belongsToUserCompany(item, userProfile));
  }, [userProfile]);

  const scopedAlerts = useMemo(() => {
    return alerts.filter((item) => belongsToUserCompany(item, userProfile));
  }, [userProfile]);

  const scopedRecentActivities = useMemo(() => {
    return recentActivities.filter((item) => belongsToUserCompany(item, userProfile));
  }, [userProfile]);

  const scopedCriticalProjects = useMemo(() => {
    return dashboardCriticalProjects.filter((project) => belongsToUserCompany(project, userProfile));
  }, [userProfile]);

  const dashboardMetrics = useMemo(() => {
    const activeProjects = scopedProjects.filter((project) => project.status === 'Ativo').length;

    const monthlyHours = scopedTimeEntries.reduce((sum, entry) => {
      return sum + Number(entry.hours || 0);
    }, 0);

    const pendingEvidence = scopedEvidence.filter((item) =>
      item.status === 'Enviada' || item.status === 'Em análise'
    ).length;

    const openApprovals = scopedApprovals.filter((item) =>
      item.status === 'Pendente' || item.status === 'Correção solicitada'
    ).length;

    const documentRisks = scopedProjects.filter((project) =>
      project.risk === 'Alto' || project.completion < 65
    ).length;

    const readyReports = scopedReports.filter((report) =>
      report.status === 'Pronto' || report.status === 'Aprovado'
    ).length;

    const documentCompleteness = calculateDocumentCompleteness(scopedProjects);

    return {
      activeProjects,
      monthlyHours,
      pendingEvidence,
      openApprovals,
      documentRisks,
      readyReports,
      documentCompleteness
    };
  }, [scopedProjects, scopedTimeEntries, scopedEvidence, scopedApprovals, scopedReports]);

  const criticalColumns = [
    { key: 'name', label: 'Projeto' },
    { key: 'company', label: 'Empresa' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'risk', label: 'Risco', render: (row) => <RiskBadge risk={row.risk} /> },
    { key: 'completion', label: 'Completude', render: (row) => <ProgressBar value={row.completion} /> }
  ];

  return (
    <div className="page-stack">
      <PageHeader
        title="Dashboard executivo"
        description="Resumo operacional dos projetos de P&D, riscos documentais, evidências e aprovações."
      />

      <div className="stats-grid six-cards">
        <StatCard
          title="Projetos ativos"
          value={dashboardMetrics.activeProjects}
          subtitle="Carteira visível para seu perfil"
          icon={FolderKanban}
        />

        <StatCard
          title="Horas no mês"
          value={dashboardMetrics.monthlyHours}
          subtitle="Registros consolidados"
          icon={Timer}
          tone="green"
        />

        <StatCard
          title="Evidências pendentes"
          value={dashboardMetrics.pendingEvidence}
          subtitle="Aguardando análise"
          icon={ClipboardList}
          tone="orange"
        />

        <StatCard
          title="Aprovações em aberto"
          value={dashboardMetrics.openApprovals}
          subtitle="Itens na fila"
          icon={CheckSquare}
          tone="blue"
        />

        <StatCard
          title="Riscos documentais"
          value={dashboardMetrics.documentRisks}
          subtitle="Atenção necessária"
          icon={AlertTriangle}
          tone="red"
        />

        <StatCard
          title="Relatórios prontos"
          value={dashboardMetrics.readyReports}
          subtitle="Disponíveis para revisão"
          icon={FileText}
          tone="green"
        />
      </div>

      <DashboardCharts />

      <div className="dashboard-grid two-columns">
        <Card title="Alertas operacionais" description="Pontos que exigem acompanhamento">
          <AlertList alerts={scopedAlerts} />
        </Card>

        <Card title="Completude documental" description="Indicador consolidado da carteira visível">
          <div className="document-score">
            <FileCheck2 size={38} />
            <strong>{dashboardMetrics.documentCompleteness}%</strong>
            <p>
              Indicador calculado a partir dos projetos visíveis para o perfil atual.
              Projetos com risco médio ou alto exigem maior acompanhamento documental.
            </p>
            <ProgressBar value={dashboardMetrics.documentCompleteness} label="Documentação consolidada" />
          </div>
        </Card>
      </div>

      <div className="dashboard-grid two-columns">
        <Card title="Projetos críticos" description="Projetos com risco ou baixa completude documental">
          <Table
            columns={criticalColumns}
            data={scopedCriticalProjects}
            emptyTitle="Nenhum projeto crítico"
          />
        </Card>

        <Card title="Atividades recentes" description="Últimas movimentações visíveis para seu perfil">
          <Timeline items={scopedRecentActivities} />
        </Card>
      </div>
    </div>
  );
}