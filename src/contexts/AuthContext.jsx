import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, runTransaction, serverTimestamp, setDoc } from 'firebase/firestore';
import { createAppError, logTechnicalError } from '../lib/errorMessages';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';

const AuthContext = createContext(null);

function getNameParts(displayName = '') {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);

  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ')
  };
}

function getFallbackProfile(user) {
  const { firstName, lastName } = getNameParts(user?.displayName);

  return {
    uid: user?.uid || '',
    firstName,
    lastName,
    fullName: user?.displayName || user?.email || 'Usuário',
    email: user?.email || '',
    role: 'Pesquisador',
    status: 'Ativo'
  };
}

async function loadOrCreateUserProfile(user) {
  const fallbackProfile = getFallbackProfile(user);

  if (!db || !user?.uid) {
    return fallbackProfile;
  }

  const userRef = doc(db, 'users', user.uid);
  return runTransaction(db, async (transaction) => {
    const userSnapshot = await transaction.get(userRef);

    if (userSnapshot.exists()) {
      return {
        ...fallbackProfile,
        ...userSnapshot.data()
      };
    }

    transaction.set(userRef, {
      ...fallbackProfile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return fallbackProfile;
  });
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  useEffect(() => {
    if (!auth) {
      setAuthLoading(false);
      return undefined;
    }

    let active = true;
    let profileRequestId = 0;

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (!active) return;
        const requestId = ++profileRequestId;

        if (!user) {
          setCurrentUser(null);
          setUserProfile(null);
          setAuthLoading(false);
          return;
        }

        setCurrentUser(user);

        try {
          const profile = await loadOrCreateUserProfile(user);
          if (active && requestId === profileRequestId) setUserProfile(profile);
        } catch (error) {
          logTechnicalError('Não foi possível carregar o perfil do usuário.', error);
          if (active && requestId === profileRequestId) setUserProfile(getFallbackProfile(user));
        } finally {
          if (active && requestId === profileRequestId) setAuthLoading(false);
        }
      },
      () => {
        if (!active) return;
        setCurrentUser(null);
        setUserProfile(null);
        setAuthLoading(false);
      }
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  async function login(email, password) {
    if (!auth) {
      throw createAppError('firebase/not-configured');
    }

    setLoginLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const profile = await loadOrCreateUserProfile(credential.user);
      setCurrentUser(credential.user);
      setUserProfile(profile);
      return credential;
    } finally {
      setLoginLoading(false);
    }
  }

  async function resetPassword(email) {
    if (!auth) {
      throw createAppError('firebase/not-configured');
    }

    const normalizedEmail = email?.trim();

    if (!normalizedEmail) {
      throw createAppError('auth/invalid-email');
    }

    setResetPasswordLoading(true);

    try {
      await sendPasswordResetEmail(auth, normalizedEmail);
    } finally {
      setResetPasswordLoading(false);
    }
  }

  async function register({ firstName, lastName, email, password }) {
    if (!auth || !db) {
      throw createAppError('firebase/not-configured');
    }

    setRegisterLoading(true);

    try {
      const normalizedFirstName = firstName.trim();
      const normalizedLastName = lastName.trim();
      const fullName = `${normalizedFirstName} ${normalizedLastName}`.trim();
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(credential.user, { displayName: fullName });

      const profile = {
        uid: credential.user.uid,
        firstName: normalizedFirstName,
        lastName: normalizedLastName,
        fullName,
        email: credential.user.email || email.trim(),
        role: 'Pesquisador',
        status: 'Ativo'
      };

      await setDoc(doc(db, 'users', credential.user.uid), {
        ...profile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      setCurrentUser(credential.user);
      setUserProfile(profile);
      return credential;
    } finally {
      setRegisterLoading(false);
    }
  }

  async function logout() {
    if (!auth) {
      throw createAppError('firebase/not-configured');
    }

    await signOut(auth);
    setCurrentUser(null);
    setUserProfile(null);
  }

  const value = useMemo(() => ({
    currentUser,
    userProfile,
    loading: authLoading,
    authLoading,
    loginLoading,
    resetPasswordLoading,
    registerLoading,
    login,
    resetPassword,
    register,
    logout,
    isFirebaseConfigured
  }), [currentUser, userProfile, authLoading, loginLoading, resetPasswordLoading, registerLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }

  return context;
}
