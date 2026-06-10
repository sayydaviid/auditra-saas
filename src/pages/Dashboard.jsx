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
import {
  alerts,
  dashboardCriticalProjects,
  dashboardMetrics,
  recentActivities
} from '../data/mockData';

export default function Dashboard() {
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
        <StatCard title="Projetos ativos" value={dashboardMetrics.activeProjects} subtitle="Carteira em execução" icon={FolderKanban} />
        <StatCard title="Horas no mês" value={dashboardMetrics.monthlyHours} subtitle="Registros consolidados" icon={Timer} tone="green" />
        <StatCard title="Evidências pendentes" value={dashboardMetrics.pendingEvidence} subtitle="Aguardando análise" icon={ClipboardList} tone="orange" />
        <StatCard title="Aprovações em aberto" value={dashboardMetrics.openApprovals} subtitle="Itens na fila" icon={CheckSquare} tone="blue" />
        <StatCard title="Riscos documentais" value={dashboardMetrics.documentRisks} subtitle="Atenção necessária" icon={AlertTriangle} tone="red" />
        <StatCard title="Relatórios prontos" value={dashboardMetrics.readyReports} subtitle="Disponíveis para revisão" icon={FileText} tone="green" />
      </div>

      <DashboardCharts />

      <div className="dashboard-grid two-columns">
        <Card title="Alertas operacionais" description="Pontos que exigem acompanhamento">
          <AlertList alerts={alerts} />
        </Card>

        <Card title="Completude documental" description="Indicador consolidado da carteira">
          <div className="document-score">
            <FileCheck2 size={38} />
            <strong>{dashboardMetrics.documentCompleteness}%</strong>
            <p>Boa evolução, mas ainda existem evidências e relatórios pendentes em projetos de risco médio e alto.</p>
            <ProgressBar value={dashboardMetrics.documentCompleteness} label="Documentação consolidada" />
          </div>
        </Card>
      </div>

      <div className="dashboard-grid two-columns">
        <Card title="Projetos críticos" description="Projetos com risco ou baixa completude documental">
          <Table columns={criticalColumns} data={dashboardCriticalProjects} emptyTitle="Nenhum projeto crítico" />
        </Card>

        <Card title="Atividades recentes" description="Últimas movimentações registradas no sistema">
          <Timeline items={recentActivities} />
        </Card>
      </div>
    </div>
  );
}
