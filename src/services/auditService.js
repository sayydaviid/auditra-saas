import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { createAppError } from '../lib/errorMessages';
import { db } from '../lib/firebase';

export async function listAuditEvents() {
  if (!db) {
    throw createAppError('firebase/not-configured');
  }

  const auditQuery = query(
    collection(db, 'audit_events'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(auditQuery);

  return snapshot.docs.map((auditDocument) => ({
    id: auditDocument.id,
    ...auditDocument.data()
  }));
}
