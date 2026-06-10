import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="brand-mark large">A</div>
      <h1>Página não encontrada</h1>
      <p>A rota acessada não existe no frontend da Auditra.</p>
      <Button as={Link} to="/dashboard">Voltar ao dashboard</Button>
    </main>
  );
}
