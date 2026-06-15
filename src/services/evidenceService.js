import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { supabase } from '../lib/supabase';

const EVIDENCE_BUCKET = 'evidencias';

function ensureServicesConfigured() {
  if (!supabase) {
    throw new Error('Supabase não configurado. Verifique o arquivo .env.');
  }

  if (!db) {
    throw new Error('Firebase não configurado. Verifique o arquivo .env.');
  }
}

function createUniqueFilePath(file, userId) {
  const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `${userId}/${Date.now()}-${safeFileName}`;
}

export async function uploadEvidence({
  file,
  projectId,
  title,
  description,
  evidenceType,
  activityRelated,
  user
}) {
  ensureServicesConfigured();

  if (!user?.uid) {
    throw new Error('Usuário não autenticado.');
  }

  if (!file) {
    throw new Error('Selecione um arquivo para enviar.');
  }

  if (!projectId || !title?.trim() || !description?.trim() || !evidenceType) {
    throw new Error('Preencha projeto, tipo, título e descrição.');
  }

  const filePath = createUniqueFilePath(file, user.uid);
  const { error: uploadError } = await supabase.storage
    .from(EVIDENCE_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    console.error('Falha no upload para o Supabase Storage.', uploadError);
    throw new Error('Não foi possível enviar a evidência.');
  }

  const { data: publicUrlData } = supabase.storage
    .from(EVIDENCE_BUCKET)
    .getPublicUrl(filePath);
  const fileUrl = publicUrlData?.publicUrl;

  if (!fileUrl) {
    throw new Error('Não foi possível gerar a URL pública do arquivo.');
  }

  const evidenceData = {
    projectId,
    title: title.trim(),
    description: description.trim(),
    evidenceType,
    activityRelated: activityRelated || '',
    fileName: file.name,
    filePath,
    fileUrl,
    fileSize: file.size,
    fileType: file.type || 'application/octet-stream',
    status: 'Enviada',
    userId: user.uid,
    userEmail: user.email || '',
    userName: user.displayName || user.email || '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const evidenceRef = await addDoc(collection(db, 'evidences'), evidenceData);

  await addDoc(collection(db, 'audit_events'), {
    eventType: 'EVIDENCE_UPLOADED',
    action: 'Evidência enviada',
    description: `Evidência ${title.trim()} enviada`,
    projectId,
    evidenceId: evidenceRef.id,
    userId: user.uid,
    userEmail: user.email || '',
    userName: user.displayName || user.email || '',
    createdAt: serverTimestamp()
  });

  return {
    id: evidenceRef.id,
    ...evidenceData,
    fileUrl
  };
}

export async function listEvidences() {
  if (!db) {
    throw new Error('Firebase não configurado. Verifique o arquivo .env.');
  }

  const evidencesQuery = query(
    collection(db, 'evidences'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(evidencesQuery);

  return snapshot.docs.map((evidenceDocument) => ({
    id: evidenceDocument.id,
    ...evidenceDocument.data()
  }));
}

export async function updateEvidenceStatus(evidenceId, status) {
  if (!db) {
    throw new Error('Firebase não configurado. Verifique o arquivo .env.');
  }

  await updateDoc(doc(db, 'evidences', evidenceId), {
    status,
    updatedAt: serverTimestamp()
  });
}
