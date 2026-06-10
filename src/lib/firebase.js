// Arquivo preparado para integração futura com Firebase.
// Não coloque chaves reais direto no código. Use variáveis de ambiente no Render.

export const firebaseConfigPlaceholder = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

export function initializeFirebaseMock() {
  return {
    auth: 'Firebase Authentication será conectado aqui',
    storage: 'Firebase Storage será conectado aqui'
  };
}

// Exemplo futuro:
// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getStorage } from 'firebase/storage';
// const app = initializeApp(firebaseConfigPlaceholder);
// export const auth = getAuth(app);
// export const storage = getStorage(app);
