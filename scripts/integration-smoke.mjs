import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  query,
  serverTimestamp,
  setDoc,
  terminate,
  where
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

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
const email = `auditra.smoke.${testId}@example.com`;
const password = `Smoke-${testId}!`;
const fullName = 'Teste Integração';
const bucket = 'evidencias';
const results = [];
let authUser;
let evidenceRef;
let auditRef;
let filePath;

const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID
});
const auth = getAuth(app);
const db = getFirestore(app);
const supabase = createClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY
);

try {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  authUser = credential.user;
  await updateProfile(authUser, { displayName: fullName });
  results.push('Firebase Authentication: conta temporária criada');

  await setDoc(doc(db, 'users', authUser.uid), {
    uid: authUser.uid,
    firstName: 'Teste',
    lastName: 'Integração',
    fullName,
    email,
    role: 'Pesquisador',
    status: 'Ativo',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  const profileSnapshot = await getDoc(doc(db, 'users', authUser.uid));
  if (!profileSnapshot.exists() || profileSnapshot.data().fullName !== fullName) {
    throw new Error('Perfil temporário não foi salvo corretamente.');
  }
  results.push('Cloud Firestore: users/{uid} criado e lido');

  await signOut(auth);
  const loginCredential = await signInWithEmailAndPassword(auth, email, password);
  authUser = loginCredential.user;
  const loginProfileSnapshot = await getDoc(doc(db, 'users', authUser.uid));
  if (authUser.displayName !== fullName || loginProfileSnapshot.data()?.fullName !== fullName) {
    throw new Error('Nome completo não persistiu após novo login.');
  }
  results.push('Firebase Authentication: logout/login preservou o nome completo');

  filePath = `${authUser.uid}/${Date.now()}-smoke-test.txt`;
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, new Blob(['Auditra integration smoke test'], { type: 'text/plain' }), {
      cacheControl: '3600',
      upsert: false
    });
  if (uploadError) throw new Error(`Supabase upload: ${uploadError.message}`);

  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
  const publicResponse = await fetch(publicUrlData.publicUrl);
  if (!publicResponse.ok) throw new Error(`URL pública retornou HTTP ${publicResponse.status}.`);
  results.push('Supabase Storage: upload e URL pública funcionando');

  evidenceRef = await addDoc(collection(db, 'evidences'), {
    projectId: 'smoke-test',
    title: 'Smoke test',
    description: 'Registro temporário de validação',
    evidenceType: 'Documento técnico',
    activityRelated: 'Teste',
    fileName: 'smoke-test.txt',
    filePath,
    fileUrl: publicUrlData.publicUrl,
    fileSize: 30,
    fileType: 'text/plain',
    status: 'Enviada',
    userId: authUser.uid,
    userEmail: email,
    userName: fullName,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  auditRef = await addDoc(collection(db, 'audit_events'), {
    eventType: 'EVIDENCE_UPLOADED',
    action: 'Evidência enviada',
    description: 'Evidência Smoke test enviada',
    projectId: 'smoke-test',
    userId: authUser.uid,
    userEmail: email,
    userName: fullName,
    createdAt: serverTimestamp()
  });

  const evidenceSnapshot = await getDocs(query(collection(db, 'evidences'), where('userId', '==', authUser.uid), limit(1)));
  const auditSnapshot = await getDocs(query(collection(db, 'audit_events'), where('userId', '==', authUser.uid), limit(1)));
  if (evidenceSnapshot.empty || auditSnapshot.empty) {
    throw new Error('Evidência ou evento de auditoria não pôde ser listado.');
  }
  results.push('Cloud Firestore: evidência e evento criados e listados');
} finally {
  const cleanupErrors = [];

  if (evidenceRef) await deleteDoc(evidenceRef).catch((error) => cleanupErrors.push(error));
  if (auditRef) await deleteDoc(auditRef).catch((error) => cleanupErrors.push(error));
  if (authUser) await deleteDoc(doc(db, 'users', authUser.uid)).catch((error) => cleanupErrors.push(error));
  if (filePath) {
    const { error } = await supabase.storage.from(bucket).remove([filePath]);
    if (error) cleanupErrors.push(error);
  }
  if (authUser) {
    await signInWithEmailAndPassword(auth, email, password).catch(() => {});
    await deleteUser(auth.currentUser || authUser).catch((error) => cleanupErrors.push(error));
  }
  await terminate(db).catch(() => {});

  if (cleanupErrors.length) {
    console.error(`Limpeza temporária incompleta: ${cleanupErrors.map((error) => error.message).join('; ')}`);
  } else if (authUser) {
    results.push('Limpeza: dados temporários removidos');
  }
}

for (const result of results) {
  console.log(result);
}
