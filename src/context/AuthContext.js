import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { auth } from "../config/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  async function login(email, password) {
    const response = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password,
    );
    return response.user;
  }

  async function register(name, email, password) {
    const response = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password,
    );

    if (name?.trim()) {
      await updateProfile(response.user, { displayName: name.trim() });
    }

    return response.user;
  }

  async function logout() {
    await signOut(auth);
  }

  const value = useMemo(
    () => ({
      user,
      authLoading,
      login,
      register,
      logout,
      isAuthenticated: !!user,
    }),
    [user, authLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
