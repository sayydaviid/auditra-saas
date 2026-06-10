import Badge from '../ui/Badge';

const statusToneMap = {
  Ativo: 'success',
  Ativa: 'success',
  Aprovado: 'success',
  Aprovada: 'success',
  Aprovadas: 'success',
  Aprovados: 'success',
  Finalizado: 'success',
  Pronto: 'success',
  Registrado: 'success',
  Validado: 'success',
  Atualizado: 'info',
  Enviada: 'info',
  'Em análise': 'info',
  Planejado: 'info',
  'Em revisão': 'warning',
  'Aguardando revisão': 'warning',
  'Em geração': 'info',
  Pendente: 'warning',
  Pendentes: 'warning',
  Reprovada: 'danger',
  Reprovado: 'danger',
  Reprovadas: 'danger',
  Reprovados: 'danger',
  Atrasado: 'danger',
  Inativo: 'neutral',
  'Correção solicitada': 'warning'
};

export default function StatusBadge({ status }) {
  return <Badge tone={statusToneMap[status] || 'neutral'}>{status}</Badge>;
}
