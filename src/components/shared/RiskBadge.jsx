import Badge from '../ui/Badge';

const riskToneMap = {
  Baixo: 'success',
  Médio: 'warning',
  Alto: 'danger'
};

export default function RiskBadge({ risk }) {
  return <Badge tone={riskToneMap[risk] || 'neutral'}>Risco {risk}</Badge>;
}
