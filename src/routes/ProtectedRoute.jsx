import { Navigate, Outlet, useLocation } from 'react-router-dom';
import SessionLoading from '../components/shared/SessionLoading';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission } from '../config/permissions';

export default function ProtectedRoute({ permission }) {
  const { currentUser, userProfile, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return <SessionLoading />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!userProfile) {
    return <SessionLoading />;
  }

  const isActive = userProfile.status === 'Ativo';

  const isAuditraAdmin = userProfile.role === 'Administrador Auditra';

  const hasCompanyLink = isAuditraAdmin || Boolean(userProfile.companyId);

  if (!isActive || !hasCompanyLink) {
    return (
      <main className="page">
        <section className="page-header">
          <div>
            <p className="eyebrow">Conta em análise</p>
            <h1>Aguardando aprovação</h1>
            <p>
              Seu cadastro foi criado, mas ainda precisa ser ativado e vinculado a uma empresa
              pela Auditra.
            </p>
          </div>
        </section>

        <section className="card">
          <h2>Acesso pendente</h2>
          <p>
            Assim que sua conta for aprovada, você poderá acessar os recursos permitidos para
            seu perfil dentro da plataforma.
          </p>
        </section>
      </main>
    );
  }

  if (permission && !hasPermission(userProfile.role, permission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}