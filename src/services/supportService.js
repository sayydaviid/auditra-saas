import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore';
import { canReplySupport, isAuditraAdmin } from '../config/permissions';
import { db } from '../lib/firebase';

export const SUPPORT_STATUSES = [
  'Aberto',
  'Em atendimento',
  'Aguardando cliente',
  'Resolvido',
  'Fechado'
];

export const SUPPORT_CATEGORIES = [
  'Evidências',
  'Relatórios',
  'Projetos',
  'Usuários e acessos',
  'Registro de horas',
  'Erro na plataforma',
  'Financeiro/Compliance',
  'Outro'
];

export const SUPPORT_PRIORITIES = [
  'Baixa',
  'Média',
  'Alta',
  'Crítica'
];

function getDateMillis(value) {
  if (value?.toMillis) return value.toMillis();
  if (value?.toDate) return value.toDate().getTime();
  if (value instanceof Date) return value.getTime();

  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function sortByRecentActivity(a, b) {
  const dateA = getDateMillis(a.lastMessageAt || a.updatedAt || a.createdAt);
  const dateB = getDateMillis(b.lastMessageAt || b.updatedAt || b.createdAt);

  return dateB - dateA;
}

function sortByCreatedAt(a, b) {
  return getDateMillis(a.createdAt) - getDateMillis(b.createdAt);
}

function normalizeDoc(docSnapshot) {
  return {
    id: docSnapshot.id,
    ...docSnapshot.data()
  };
}

function getUserName(currentUser, userProfile) {
  return (
    userProfile?.fullName ||
    currentUser?.displayName ||
    currentUser?.email ||
    'Usuário'
  );
}

function getCompanyScope(userProfile) {
  if (isAuditraAdmin(userProfile)) {
    return {
      companyId: userProfile?.companyId || 'auditra',
      companyName: userProfile?.companyName || 'Auditra'
    };
  }

  return {
    companyId: userProfile?.companyId || '',
    companyName: userProfile?.companyName || ''
  };
}

export async function listSupportTickets(userProfile) {
  const ticketsRef = collection(db, 'supportTickets');

  const ticketsQuery = isAuditraAdmin(userProfile)
    ? ticketsRef
    : query(ticketsRef, where('companyId', '==', userProfile?.companyId || '__sem_empresa__'));

  const snapshot = await getDocs(ticketsQuery);

  return snapshot.docs
    .map(normalizeDoc)
    .sort(sortByRecentActivity);
}

export async function createSupportTicket({
  title,
  category,
  priority,
  message,
  currentUser,
  userProfile
}) {
  const cleanTitle = title?.trim();
  const cleanMessage = message?.trim();

  if (!cleanTitle) {
    throw new Error('Informe o título do chamado.');
  }

  if (!cleanMessage) {
    throw new Error('Informe a mensagem inicial do chamado.');
  }

  const companyScope = getCompanyScope(userProfile);

  if (!companyScope.companyId) {
    throw new Error('Usuário sem empresa vinculada.');
  }

  const userName = getUserName(currentUser, userProfile);
  const userEmail = userProfile?.email || currentUser?.email || '';
  const isAdminSender = canReplySupport(userProfile);

  const ticketPayload = {
    companyId: companyScope.companyId,
    companyName: companyScope.companyName,

    title: cleanTitle,
    category: category || 'Outro',
    priority: priority || 'Média',
    status: 'Aberto',

    createdByUid: currentUser?.uid || '',
    createdByName: userName,
    createdByEmail: userEmail,

    assignedToUid: '',
    assignedToName: '',

    lastMessage: cleanMessage,
    lastMessageAt: serverTimestamp(),

    unreadForAdmin: !isAdminSender,
    unreadForCompany: isAdminSender,

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const ticketRef = await addDoc(collection(db, 'supportTickets'), ticketPayload);

  await addDoc(collection(db, 'supportTickets', ticketRef.id, 'messages'), {
    senderUid: currentUser?.uid || '',
    senderName: userName,
    senderEmail: userEmail,
    senderRole: userProfile?.role || '',
    senderType: isAdminSender ? 'admin' : 'company',
    message: cleanMessage,
    createdAt: serverTimestamp()
  });

  return {
    id: ticketRef.id,
    ...ticketPayload,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastMessageAt: new Date()
  };
}

export async function listSupportMessages(ticketId) {
  if (!ticketId) {
    return [];
  }

  const messagesRef = collection(db, 'supportTickets', ticketId, 'messages');
  const snapshot = await getDocs(messagesRef);

  return snapshot.docs
    .map(normalizeDoc)
    .sort(sortByCreatedAt);
}

export async function sendSupportMessage({
  ticketId,
  message,
  currentUser,
  userProfile
}) {
  const cleanMessage = message?.trim();

  if (!ticketId) {
    throw new Error('Chamado não informado.');
  }

  if (!cleanMessage) {
    throw new Error('Digite uma mensagem para enviar.');
  }

  const isAdminReply = canReplySupport(userProfile);
  const userName = getUserName(currentUser, userProfile);
  const userEmail = userProfile?.email || currentUser?.email || '';

  await addDoc(collection(db, 'supportTickets', ticketId, 'messages'), {
    senderUid: currentUser?.uid || '',
    senderName: userName,
    senderEmail: userEmail,
    senderRole: userProfile?.role || '',
    senderType: isAdminReply ? 'admin' : 'company',
    message: cleanMessage,
    createdAt: serverTimestamp()
  });

  await updateDoc(doc(db, 'supportTickets', ticketId), {
    lastMessage: cleanMessage,
    lastMessageAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    unreadForAdmin: !isAdminReply,
    unreadForCompany: isAdminReply
  });
}

export async function updateSupportTicketStatus(ticketId, status) {
  if (!ticketId) {
    throw new Error('Chamado não informado.');
  }

  if (!SUPPORT_STATUSES.includes(status)) {
    throw new Error('Status inválido.');
  }

  await updateDoc(doc(db, 'supportTickets', ticketId), {
    status,
    updatedAt: serverTimestamp()
  });

  return {
    id: ticketId,
    status
  };
}