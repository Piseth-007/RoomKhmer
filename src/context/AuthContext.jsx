// src/context/AuthContext.jsx
//
// Central place for authentication state and actions. Wrap the app with
// <AuthProvider> once (done in main.jsx) and then call useAuth() anywhere
// to read the current user or trigger login/register/logout.

import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { auth, db, googleProvider } from "../firebase/config";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);


  const loadProfile = async (user) => {
    if (!user) {
      setProfile(null);
      return;
    }

    const ref = doc(db, "users", user.uid);
    const snapshot = await getDoc(ref);

    if (snapshot.exists()) {
      setProfile(snapshot.data());
    } else {
      setProfile(null);
    }
  };

  const createProfile = async (user, extra = {}) => {
    const ref = doc(db, "users", user.uid);

    const data = {
      uid: user.uid,
      name: user.displayName || extra.name || "",
      email: user.email,
      phone: extra.phone || "",
      role: extra.role || "student",
      createdAt: serverTimestamp(),
    };

    await setDoc(ref, data, { merge: true });

    setProfile(data);
  };

  // ============================================================
  // ACTIONS
  // ============================================================

  const register = async ({ name, email, phone, password, role }) => {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    if (name) {
      await updateProfile(credential.user, { displayName: name });
    }

    await createProfile(credential.user, { name, phone, role });

    return credential.user;
  };

  const login = async (email, password) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);

    await loadProfile(credential.user);

    return credential.user;
  };

  const loginWithGoogle = async () => {
    const credential = await signInWithPopup(auth, googleProvider);

    const ref = doc(db, "users", credential.user.uid);
    const snapshot = await getDoc(ref);

    // First time this Google account signs in, create their profile doc.
    if (!snapshot.exists()) {
      await createProfile(credential.user, { role: "student" });
    } else {
      setProfile(snapshot.data());
    }

    return credential.user;
  };

  const logout = () => {
    setProfile(null);
    return signOut(auth);
  };

  // ============================================================
  // WATCH AUTH STATE
  // ============================================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        await loadProfile(user);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    profile,
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
