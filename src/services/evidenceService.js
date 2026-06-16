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
import { createAppError, logTechnicalError } from '../lib/errorMessages';
import { getFileExtension, validateEvidenceFile } from '../lib/evidenceFileValidation';
import { db } from '../lib/firebase';
import { supabase } from '../lib/supabase';

const EVIDENCE_BUCKET = 'evidencias';

function ensureServicesConfigured() {
  if (!supabase) {
    throw createAppError('supabase/not-configured');
  }

  if (!db) {
    throw createAppError('firebase/not-configured');
  }
}

function sanitizePathSegment(value = 'sem-identificador') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    || 'sem-identificador';
}

function createUniqueId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function createUniqueFilePath(file, userId, projectId) {
  const extension = getFileExtension(file.name);
  const fileNameWithoutExtension = extension
    ? file.name.slice(0, -extension.length)
    : file.name;
  const safeBaseName = sanitizePathSegment(fileNameWithoutExtension || 'evidencia');
  const safeUserId = sanitizePathSegment(userId);
  const safeProjectId = sanitizePathSegment(projectId || 'sem-projeto');
  return `${safeUserId}/${safeProjectId}/${safeBaseName}-${createUniqueId()}${extension}`;
}

function wait(ms) {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
}

async function removeUploadedFile(filePath) {
  let lastError = null;

  for (let attempt = 1; attempt <= 6; attempt += 1) {
    await wait(attempt * 500);

    const { error } = await supabase.storage.from(EVIDENCE_BUCKET).remove([filePath]);

    if (error) {
      lastError = error;
      continue;
    }

    const { error: downloadError } = await supabase.storage.from(EVIDENCE_BUCKET).download(filePath);

    if (downloadError) {
      return true;
    }
  }

  const { error: finalRemoveError } = await supabase.storage.from(EVIDENCE_BUCKET).remove([filePath]);
  if (!finalRemoveError) {
    await wait(500);
    const { error: downloadError } = await supabase.storage.from(EVIDENCE_BUCKET).download(filePath);
    if (downloadError) return true;
  }

  lastError = finalRemoveError || lastError;
  logTechnicalError('Rollback não confirmou a remoção do arquivo enviado.', lastError || { filePath });
  return false;
}

function queueDeferredFileRemoval(filePath) {
  const delays = [1000, 3000, 7000];
  let lastDeferredRemovalError = null;

  void (async () => {
    for (const delay of delays) {
      await wait(delay);
      const { error } = await supabase.storage.from(EVIDENCE_BUCKET).remove([filePath]);

      if (error) {
        lastDeferredRemovalError = error;
        continue;
      }

      const { error: downloadError } = await supabase.storage.from(EVIDENCE_BUCKET).download(filePath);
      if (downloadError) return;
    }

    logTechnicalError('Limpeza diferida não confirmou a remoção do arquivo enviado.', lastDeferredRemovalError || { filePath });
  })();
}

export async function uploadEvidence({
  file,
  projectId,
  title,
  description,
  evidenceType,
  activityRelated,
  user,
  onUploadStart,
  onUploadEnd,
  onMetadataSaveStart,
  onMetadataSaveEnd
}) {
  ensureServicesConfigured();

  if (!user?.uid) {
    throw createAppError('auth/not-authenticated');
  }

  if (!projectId || !title?.trim() || !description?.trim() || !evidenceType) {
    throw createAppError('form/incomplete');
  }

  const fileValidation = validateEvidenceFile(file);

  if (!fileValidation.valid) {
    throw createAppError(fileValidation.code, fileValidation.message);
  }

  const filePath = createUniqueFilePath(file, user.uid, projectId);

  onUploadStart?.();
  try {
    const { error: uploadError } = await supabase.storage
      .from(EVIDENCE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      logTechnicalError('Falha no upload para o Supabase Storage.', uploadError);
      throw createAppError('storage/upload-failed', undefined, { cause: uploadError });
    }
  } finally {
    onUploadEnd?.();
  }

  let fileUrl = '';

  try {
    const { data: publicUrlData } = supabase.storage
      .from(EVIDENCE_BUCKET)
      .getPublicUrl(filePath);
    fileUrl = publicUrlData?.publicUrl;

    if (!fileUrl) {
      throw createAppError('storage/url-failed');
    }
  } catch (error) {
    const removed = await removeUploadedFile(filePath);
    if (!removed) queueDeferredFileRemoval(filePath);
    if (!removed) {
      throw createAppError('storage/rollback-failed', undefined, { cause: error });
    }
    if (error.code === 'storage/url-failed') throw error;
    logTechnicalError('Falha ao gerar URL pública da evidência.', error);
    throw createAppError('storage/url-failed', undefined, { cause: error });
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

  let evidenceRef;

  onMetadataSaveStart?.();
  try {
    evidenceRef = await addDoc(collection(db, 'evidences'), evidenceData);
  } catch (error) {
    logTechnicalError('Falha ao salvar metadados da evidência.', error);
    const removed = await removeUploadedFile(filePath);
    if (!removed) queueDeferredFileRemoval(filePath);
    if (!removed) {
      throw createAppError('storage/rollback-failed', undefined, { cause: error });
    }
    throw createAppError('firestore/metadata-failed', undefined, { cause: error });
  } finally {
    onMetadataSaveEnd?.();
  }

  let auditEventStatus = 'created';
  let auditEventError = null;

  try {
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
  } catch (error) {
    auditEventStatus = 'failed';
    auditEventError = createAppError('firestore/audit-event-failed', undefined, { cause: error });
    logTechnicalError('Falha ao registrar evento de auditoria da evidência.', error);
  }

  return {
    id: evidenceRef.id,
    ...evidenceData,
    fileUrl,
    auditEventStatus,
    auditEventError
  };
}

export async function listEvidences() {
  if (!db) {
    throw createAppError('firebase/not-configured');
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
    throw createAppError('firebase/not-configured');
  }

  await updateDoc(doc(db, 'evidences', evidenceId), {
    status,
    updatedAt: serverTimestamp()
  });
}
