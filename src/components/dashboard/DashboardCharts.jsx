import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import Card from '../ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { isAuditraAdmin } from '../../config/permissions';
import {
  evidence,
  projects,
  timeEntries,
  validationTimeChart
} from '../../data/mockData';

const chartColors = ['#0f766e', '#2563eb', '#f59e0b', '#ef4444'];

function belongsToUserCompany(item, userProfile) {
  if (isAuditraAdmin(userProfile)) {
    return true;
  }

  if (!userProfile?.companyId) {
    return false;
  }

  return item.companyId === userProfile.companyId;
}

function getMonthKey(dateString = '') {
  const [day, month, year] = dateString.split('/');

  if (!day || !month || !year) {
    return 'Sem mês';
  }

  const monthNames = {
    '01': 'Jan',
    '02': 'Fev',
    '03': 'Mar',
    '04': 'Abr',
    '05': 'Mai',
    '06': 'Jun',
    '07': 'Jul',
    '08': 'Ago',
    '09': 'Set',
    '10': 'Out',
    '11': 'Nov',
    '12': 'Dez'
  };

  return monthNames[month] || 'Sem mês';
}

function getWeekKey(dateString = '') {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return 'Sem data';
  }

  const day = date.getDate();

  if (day <= 7) return 'Sem 1';
  if (day <= 14) return 'Sem 2';
  if (day <= 21) return 'Sem 3';

  return 'Sem 4';
}

export default function DashboardCharts() {
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

  const weeklyHours = useMemo(() => {
    const weeks = {
      'Sem 1': 0,
      'Sem 2': 0,
      'Sem 3': 0,
      'Sem 4': 0
    };

    scopedTimeEntries.forEach((entry) => {
      const week = getWeekKey(entry.date);
      weeks[week] = (weeks[week] || 0) + Number(entry.hours || 0);
    });

    return Object.entries(weeks).map(([week, hours]) => ({
      week,
      hours
    }));
  }, [scopedTimeEntries]);

  const projectStatusChart = useMemo(() => {
    const statusCounts = scopedProjects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;

      return acc;
    }, {});

    return Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value
    }));
  }, [scopedProjects]);

  const evidenceChart = useMemo(() => {
    const months = {
      Mar: { month: 'Mar', enviadas: 0, pendentes: 0 },
      Abr: { month: 'Abr', enviadas: 0, pendentes: 0 },
      Mai: { month: 'Mai', enviadas: 0, pendentes: 0 },
      Jun: { month: 'Jun', enviadas: 0, pendentes: 0 }
    };

    scopedEvidence.forEach((item) => {
      const month = getMonthKey(item.date);

      if (!months[month]) {
        months[month] = { month, enviadas: 0, pendentes: 0 };
      }

      months[month].enviadas += 1;

      if (item.status === 'Enviada' || item.status === 'Em análise') {
        months[month].pendentes += 1;
      }
    });

    return Object.values(months);
  }, [scopedEvidence]);

  return (
    <div className="dashboard-grid two-columns">
      <Card title="Horas registradas por semana" description="Evolução do mês atual">
        <div className="chart-box">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weeklyHours}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hours" name="Horas" radius={[8, 8, 0, 0]} fill="#0f766e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Status dos projetos" description="Distribuição da carteira visível">
        <div className="chart-box pie-chart-box">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={projectStatusChart}
                dataKey="value"
                nameKey="name"
                innerRadius={58}
                outerRadius={92}
                paddingAngle={4}
              >
                {projectStatusChart.map((entry, index) => (
                  <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="chart-legend">
            {projectStatusChart.map((item, index) => (
              <span key={item.name}>
                <i style={{ background: chartColors[index % chartColors.length] }} />
                {item.name}: {item.value}
              </span>
            ))}
          </div>
        </div>
      </Card>

      <Card title="Evidências enviadas versus pendentes" description="Acompanhamento por mês">
        <div className="chart-box">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={evidenceChart}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="enviadas" name="Enviadas" stroke="#0f766e" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="pendentes" name="Pendentes" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Tempo médio de validação" description="Média por tipo de validação">
        <div className="chart-box">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={validationTimeChart} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" unit="d" />
              <YAxis type="category" dataKey="label" width={90} />
              <Tooltip />
              <Bar dataKey="days" name="Dias" radius={[0, 8, 8, 0]} fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}