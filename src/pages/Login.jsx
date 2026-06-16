import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, CheckCircle2, FileCheck2, LockKeyhole, ShieldCheck, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import SessionLoading from '../components/shared/SessionLoading';
import { useAuth } from '../contexts/AuthContext';
import { getFriendlyErrorMessage } from '../lib/errorMessages';

const authSchema = z.object({
  mode: z.enum(['login', 'register']),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().trim().min(1, 'E-mail obrigatório').email('Informe um e-mail válido'),
  password: z.string().min(1, 'Senha obrigatória'),
  confirmPassword: z.string()
}).superRefine((data, context) => {
  if (data.mode !== 'register') return;

  if (!data.firstName.trim()) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['firstName'], message: 'Nome obrigatório' });
  }

  if (!data.lastName.trim()) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['lastName'], message: 'Sobrenome obrigatório' });
  }

  if (data.password.length < 6) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['password'], message: 'A senha precisa ter pelo menos 6 caracteres.' });
  }

  if (!data.confirmPassword) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['confirmPassword'], message: 'Confirmar senha obrigatório' });
  } else if (data.confirmPassword !== data.password) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['confirmPassword'], message: 'As senhas precisam ser iguais' });
  }
});

const defaultValues = {
  mode: 'login',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    currentUser,
    authLoading,
    loginLoading,
    resetPasswordLoading,
    registerLoading,
    login,
    resetPassword,
    register: registerUser,
    isFirebaseConfigured
  } = useAuth();
  const [mode, setMode] = useState('login');
  const [feedback, setFeedback] = useState(null);
  const {
    register,
    handleSubmit,
    clearErrors,
    getValues,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(authSchema),
    defaultValues
  });

  function changeMode(nextMode) {
    setMode(nextMode);
    setFeedback(null);
    reset({ ...defaultValues, mode: nextMode });
  }

  async function submit(data) {
    setFeedback(null);

    try {
      if (mode === 'register') {
        await registerUser(data);
        navigate('/dashboard', { replace: true });
        return;
      }

      await login(data.email.trim(), data.password);
      const destination = location.state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    } catch (error) {
      const fallback = mode === 'register'
        ? 'Não foi possível criar sua conta agora.'
        : 'Não foi possível entrar agora.';
      setFeedback({ type: 'error', message: getFriendlyErrorMessage(error, fallback) });
    }
  }

  async function handleResetPassword() {
    const email = getValues('email')?.trim();
    setFeedback(null);
    clearErrors();

    if (!email) {
      setFeedback({ type: 'error', message: 'Digite seu e-mail para receber o link de recuperação.' });
      return;
    }

    try {
      await resetPassword(email);
      setFeedback({ type: 'success', message: 'Enviamos um link de recuperação para o seu e-mail.' });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getFriendlyErrorMessage(error, 'Não foi possível enviar o link de recuperação agora.')
      });
    }
  }

  if (authLoading) {
    return <SessionLoading />;
  }

  if (currentUser && !loginLoading && !registerLoading && !isSubmitting) {
    return <Navigate to="/dashboard" replace />;
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
        <div className="auth-mode-toggle" role="tablist" aria-label="Acesso à plataforma">
          <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => changeMode('login')}>Entrar</button>
          <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => changeMode('register')}>Criar conta</button>
        </div>

        <div className="login-card-header">
          {mode === 'login' ? <LockKeyhole size={26} /> : <UserPlus size={26} />}
          <div>
            <h2>{mode === 'login' ? 'Entrar na Auditra' : 'Criar sua conta'}</h2>
            <p>{mode === 'login' ? 'Acesse com seu usuário cadastrado.' : 'Cadastre-se para começar a usar a plataforma.'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(submit)}>
          <input type="hidden" {...register('mode')} />
          {mode === 'register' && (
            <div className="auth-name-grid">
              <Input label="Nome" error={errors.firstName?.message} {...register('firstName')} />
              <Input label="Sobrenome" error={errors.lastName?.message} {...register('lastName')} />
            </div>
          )}
          <Input
            label="E-mail"
            type="email"
            placeholder="seu.email@empresa.com.br"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            error={errors.password?.message}
            {...register('password')}
          />
          {mode === 'register' && (
            <Input
              label="Confirmar senha"
              type="password"
              placeholder="Digite a senha novamente"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
          )}
          {feedback && <div className={`form-feedback ${feedback.type}`}>{feedback.message}</div>}
          <Button
            type="submit"
            className="full-width"
            icon={mode === 'login' ? ArrowRight : UserPlus}
            disabled={isSubmitting || loginLoading || registerLoading || resetPasswordLoading}
          >
            {mode === 'login'
              ? (loginLoading ? 'Entrando...' : 'Entrar')
              : (registerLoading || isSubmitting ? 'Criando conta...' : 'Criar conta')}
          </Button>
        </form>

        {mode === 'login' && (
          <button
            className="forgot-link"
            type="button"
            onClick={handleResetPassword}
            disabled={resetPasswordLoading || loginLoading || registerLoading || isSubmitting}
          >
            {resetPasswordLoading ? 'Enviando...' : 'Esqueci minha senha'}
          </button>
        )}

        <div className="integration-note">
          {isFirebaseConfigured
            ? 'Autenticação e perfil protegidos pelo Firebase.'
            : 'Firebase ainda não configurado neste ambiente. Preencha as variáveis VITE_FIREBASE_* no .env.'}
        </div>
      </section>
    </main>
  );
}
