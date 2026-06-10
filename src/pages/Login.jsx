import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, FileCheck2, LockKeyhole, ShieldCheck } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'marina.azevedo@auditra.com.br', password: 'auditra123' });
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.email || !form.password) {
      setError('Informe e-mail e senha para continuar.');
      return;
    }

    setError('');
    navigate('/dashboard');
  }

  return (
    <main className="login-page">
      <section className="login-hero">
        <div className="brand-row">
          <div className="brand-mark large">A</div>
          <div>
            <strong>Auditra</strong>
            <span>Governança, compliance e rastreabilidade em P&D</span>
          </div>
        </div>

        <div className="login-copy">
          <span className="eyebrow">Plataforma SaaS B2B</span>
          <h1>Controle projetos de P&D com rastreabilidade de ponta a ponta.</h1>
          <p>
            Organize horas, evidências, aprovações, custos e relatórios em uma interface segura para equipes técnicas, financeiras e de compliance.
          </p>
        </div>

        <div className="login-highlights">
          <article>
            <ShieldCheck size={22} />
            <strong>Compliance</strong>
            <span>Validação de registros, documentos e aprovações.</span>
          </article>
          <article>
            <FileCheck2 size={22} />
            <strong>Auditoria</strong>
            <span>Trilhas claras para cada ação crítica.</span>
          </article>
          <article>
            <CheckCircle2 size={22} />
            <strong>Governança</strong>
            <span>Visão executiva para projetos, riscos e entregas.</span>
          </article>
        </div>
      </section>

      <section className="login-card">
        <div className="login-card-header">
          <LockKeyhole size={26} />
          <div>
            <h2>Entrar na Auditra</h2>
            <p>Acesso simulado para apresentação do frontend.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label="E-mail"
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="seu.email@empresa.com.br"
          />
          <Input
            label="Senha"
            type="password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            placeholder="Digite sua senha"
          />
          {error && <div className="form-feedback error">{error}</div>}
          <Button type="submit" className="full-width" icon={ArrowRight}>Entrar</Button>
        </form>

        <button className="forgot-link" type="button">Esqueci minha senha</button>

        <div className="integration-note">
          Preparado para Firebase Authentication, sem autenticação real nesta versão.
        </div>
      </section>
    </main>
  );
}
