const defaultMessage = 'Não foi possível concluir a operação agora.';

const friendlyMessages = {
  'auth/invalid-credential': 'E-mail ou senha inválidos.',
  'auth/user-not-found': 'E-mail ou senha inválidos.',
  'auth/wrong-password': 'E-mail ou senha inválidos.',
  'auth/too-many-requests': 'Muitas tentativas. Aguarde um pouco e tente novamente.',
  'auth/network-request-failed': 'Falha de conexão. Verifique sua internet.',
  'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
  'auth/weak-password': 'A senha precisa ter pelo menos 6 caracteres.',
  'auth/invalid-email': 'Digite um e-mail válido.',
  'auth/not-authenticated': 'Faça login novamente para continuar.',
  'firebase/not-configured': 'Firebase não configurado. Verifique o arquivo .env.',
  'supabase/not-configured': 'Supabase não configurado. Verifique o arquivo .env.',
  'form/incomplete': 'Preencha projeto, tipo, título e descrição.',
  'file/missing': 'Selecione um arquivo para enviar.',
  'file/too-large': 'O arquivo deve ter no máximo 10 MB.',
  'file/invalid-format': 'Formato de arquivo não permitido.',
  'storage/upload-failed': 'Não foi possível enviar a evidência.',
  'storage/url-failed': 'Não foi possível gerar a URL do arquivo.',
  'storage/rollback-failed': 'Não foi possível salvar os metadados e a limpeza do arquivo enviado não foi confirmada.',
  'firestore/metadata-failed': 'Não foi possível salvar os metadados da evidência.',
  'firestore/audit-event-failed': 'A evidência foi enviada, mas o evento de auditoria não foi registrado.',
  'auth/logout-failed': 'Não foi possível sair da conta agora.',
  'profile/load-failed': 'Não foi possível carregar o perfil do usuário.'
};

export function createAppError(code, message = friendlyMessages[code] || defaultMessage, options = {}) {
  const error = new Error(message);
  error.code = code;
  if (options.cause) error.cause = options.cause;
  return error;
}

export function getFriendlyErrorMessage(error, fallback = defaultMessage) {
  if (!error) return fallback;
  if (error.code && friendlyMessages[error.code]) return friendlyMessages[error.code];
  if (error.message && Object.values(friendlyMessages).includes(error.message)) return error.message;
  return fallback;
}

export function logTechnicalError(context, error) {
  if (import.meta.env.DEV) {
    console.error(context, error);
  }
}
