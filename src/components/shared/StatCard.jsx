import Card from '../ui/Card';

export default function StatCard({ title, value, subtitle, icon: Icon, tone = 'blue' }) {
  return (
    <Card className={`stat-card stat-${tone}`}>
      <div className="stat-icon">{Icon && <Icon size={22} />}</div>
      <div>
        <p>{title}</p>
        <strong>{value}</strong>
        {subtitle && <span>{subtitle}</span>}
      </div>
    </Card>
  );
}
