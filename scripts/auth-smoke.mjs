import { readFileSync } from 'node:fs';
import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';

function loadEnv() {
  return Object.fromEntries(
    readFileSync('.env', 'utf8')
      .split(/\r?\n/)
      .filter((line) => line && !line.trimStart().startsWith('#') && line.includes('='))
      .map((line) => {
        const separator = line.indexOf('=');
        return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
      })
  );
}

const env = loadEnv();
const testId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const email = `auditra.auth.${testId}@example.com`;
const password = `Auth-${testId}!`;
const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID
}, `auth-smoke-${testId}`);
const auth = getAuth(app);
let user;
const results = [];

try {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  user = credential.user;
  await signOut(auth);

  try {
    await signInWithEmailAndPassword(auth, email, 'senha-incorreta');
    throw new Error('Login com senha incorreta foi aceito.');
  } catch (error) {
    if (!['auth/invalid-credential', 'auth/wrong-password'].includes(error.code)) {
      throw error;
    }
    if (auth.currentUser) {
      throw new Error('Senha incorreta alterou a sessão autenticada.');
    }
    results.push(`Senha incorreta rejeitada com ${error.code}`);
  }

  await sendPasswordResetEmail(auth, email);
  results.push('E-mail de recuperação solicitado com sucesso');

  const loginCredential = await signInWithEmailAndPassword(auth, email, password);
  user = loginCredential.user;
  results.push('Login correto confirmado');
} finally {
  if (!auth.currentUser && user) {
    await signInWithEmailAndPassword(auth, email, password).catch(() => {});
  }
  await deleteUser(auth.currentUser || user).catch(() => {});
}

for (const result of results) {
  console.log(result);
}
console.log('Limpeza: conta temporária removida');
