import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { get, ref, serverTimestamp, set } from 'firebase/database';
import { auth, db } from '../config/firebase';

const AuthContext = createContext();

const mapAuthError = (code) => {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Šis el. paštas jau užregistruotas.';
    case 'auth/invalid-email':
      return 'Neteisingas el. pašto formatas.';
    case 'auth/weak-password':
      return 'Slaptažodis turi būti bent 6 simbolių.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Neteisingas el. paštas arba slaptažodis.';
    default:
      return `Klaida (${code}): patikrinkite Firebase nustatymus.`;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const snap = await get(ref(db, `users/${currentUser.uid}`));
          setProfile(snap.exists() ? snap.val() : { email: currentUser.email });
        } catch {
          setProfile({ email: currentUser.email });
        }
      } else {
        setProfile(null);
      }
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  const register = async (name, email, password) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const profileData = {
        uid: cred.user.uid,
        name: name.trim(),
        email: email.trim(),
        createdAt: serverTimestamp(),
      };
      await set(ref(db, `users/${cred.user.uid}`), profileData);
      setProfile(profileData);
    } catch (err) {
      throw new Error(mapAuthError(err.code));
    }
  };

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      throw new Error(mapAuthError(err.code));
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, authLoading, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}