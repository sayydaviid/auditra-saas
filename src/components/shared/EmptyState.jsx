import { SearchX } from 'lucide-react';

export default function EmptyState({ title = 'Nada encontrado', description = 'Tente ajustar os filtros usados nesta tela.' }) {
  return (
    <div className="empty-state">
      <SearchX size={34} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
