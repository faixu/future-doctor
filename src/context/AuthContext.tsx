import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signingIn: boolean;
  isAdmin: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  checkServerAdmin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAILS = ["Flust786@gmail.com"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseLoading, setFirebaseLoading] = useState(true);
  const [serverLoading, setServerLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [isServerAdmin, setIsServerAdmin] = useState(false);

  const loading = firebaseLoading || serverLoading;
  const isAdmin = (user ? ADMIN_EMAILS.map(e => e.toLowerCase()).includes(user.email?.toLowerCase() || "") : false) || isServerAdmin;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setFirebaseLoading(false);
    });
    
    // Check for server admin session
    checkServerAdmin();
    
    return unsubscribe;
  }, []);

  const checkServerAdmin = async () => {
    try {
      const res = await fetch("/api/admin/verify");
      if (res.ok) {
        const data = await res.json();
        setIsServerAdmin(data.authenticated);
      } else {
        setIsServerAdmin(false);
      }
    } catch {
      setIsServerAdmin(false);
    } finally {
      setServerLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    if (signingIn) return;
    setSigningIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Auth Error:", error);
      if (error.code === 'auth/popup-blocked') {
        alert("The login popup was blocked. Please enable popups for this site.");
      } else if (error.code === 'auth/cancelled-popup-request') {
        console.warn("Popup request was cancelled, likely due to concurrent attempts.");
      }
    } finally {
      setSigningIn(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      setIsServerAdmin(false);
    } catch (e) {
      console.error("Server logout error:", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signingIn, isAdmin, loginWithGoogle, logout, checkServerAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
