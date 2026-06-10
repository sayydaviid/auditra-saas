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
import { evidenceChart, projectStatusChart, validationTimeChart, weeklyHours } from '../../data/mockData';

const chartColors = ['#0f766e', '#2563eb', '#f59e0b', '#ef4444'];

export default function DashboardCharts() {
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

      <Card title="Status dos projetos" description="Distribuição geral da carteira">
        <div className="chart-box pie-chart-box">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={projectStatusChart} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={4}>
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
