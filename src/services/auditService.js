import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../lib/firebase';

export async function listAuditEvents() {
  if (!db) {
    throw new Error('Cloud Firestore não configurado. Verifique as variáveis VITE_FIREBASE_*.');
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
