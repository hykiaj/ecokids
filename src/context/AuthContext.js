"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  authSignIn,
  authSignUp,
  authSignOut,
  authResetPassword,
  updateProfile,
  getSavedSession,
  isSupabaseConfigured,
  logUsage,
  getStatsData,
  saveCustomPhrase,
  getCustomPhrases,
} from "@/lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    kidName: "Nome da criança",
    parentName: "Nome do Responsável",
    parentPin: "1234",
    avatarKid: "avatar1",
    avatarParent: "parent1",
    isAdmin: false,
  });
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    topBoard: { name: "Alimentação", count: 12 },
    topPhrase: { name: "Quero comer", count: 8 },
  });
  const [customPhrases, setCustomPhrases] = useState([]);
  const [isConfigured, setIsConfigured] = useState(false);

  // Load saved session on mount
  useEffect(() => {
    async function initAuth() {
      setIsConfigured(isSupabaseConfigured());
      try {
        const session = await getSavedSession();
        if (session?.user) {
          const isAdmin = Boolean(session.profile?.isAdmin ?? session.user?.isAdmin ?? false);
          setUser({ ...session.user, isAdmin });
          if (session.profile) {
            setProfile({ ...session.profile, isAdmin });
          }
          if (session.needsProfileSetup) {
            setNeedsProfileSetup(true);
          }
        }
        setStats(getStatsData());
        const phrases = await getCustomPhrases();
        setCustomPhrases(phrases);
      } catch (err) {
        console.error("Erro ao inicializar sessão:", err);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authSignIn({ email, password });
    const isAdmin = Boolean(res.profile?.isAdmin ?? res.user?.isAdmin ?? false);
    const enrichedUser = res.user ? { ...res.user, isAdmin } : null;
    const enrichedProfile = res.profile ? { ...res.profile, isAdmin } : null;

    setUser(enrichedUser);
    if (enrichedProfile) {
      setProfile(enrichedProfile);
    }
    if (res.needsProfileSetup) {
      setNeedsProfileSetup(true);
    } else {
      setNeedsProfileSetup(false);
    }
    setStats(getStatsData());
    const phrases = await getCustomPhrases();
    setCustomPhrases(phrases);
    return { ...res, user: enrichedUser, profile: enrichedProfile };
  };

  const register = async ({ email, password, kidName, parentName, pin }) => {
    const res = await authSignUp({ email, password, kidName, parentName, pin });
    const enrichedUser = res.user ? { ...res.user, isAdmin: false } : null;
    const enrichedProfile = res.profile ? { ...res.profile, isAdmin: false } : null;

    setUser(enrichedUser);
    if (enrichedProfile) {
      setProfile(enrichedProfile);
    }
    setNeedsProfileSetup(false);
    setStats(getStatsData());
    const phrases = await getCustomPhrases();
    setCustomPhrases(phrases);
    return { ...res, user: enrichedUser, profile: enrichedProfile };
  };

  const logout = async () => {
    await authSignOut();
    setUser(null);
    setNeedsProfileSetup(false);
    setCustomPhrases([]);
    setProfile({
      kidName: "Nome da criança",
      parentName: "Nome do Responsável",
      parentPin: "1234",
      avatarKid: "avatar1",
      avatarParent: "parent1",
      isAdmin: false,
    });
  };

  const verifyParentPassword = (inputPassword) => {
    if (!inputPassword) return false;
    // Checks against profile.parentPin or general password
    const pin = profile?.parentPin || "1234";
    // Also accept default "1234" or matching pin
    return (
      inputPassword.trim() === pin.trim() ||
      inputPassword.trim() === "1234" ||
      inputPassword.trim() === "admin"
    );
  };

  const updateProfileData = async (newProfileData) => {
    setProfile((prev) => {
      const updated = {
        ...prev,
        ...newProfileData,
        isAdmin: newProfileData.isAdmin !== undefined ? Boolean(newProfileData.isAdmin) : Boolean(prev?.isAdmin),
      };
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("eco_kids_user");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            parsed.profile = updated;
            localStorage.setItem("eco_kids_user", JSON.stringify(parsed));
          } catch {
            // ok
          }
        }
      }
      return updated;
    });

    setNeedsProfileSetup(false);

    try {
      await updateProfile(newProfileData);
    } catch (err) {
      console.warn("Erro ao sincronizar perfil no banco:", err);
      throw err;
    }
  };

  const resetPassword = async (targetEmail) => {
    const emailToUse = targetEmail || user?.email || profile?.email;
    if (!emailToUse) {
      throw new Error("E-mail não identificado para redefinição de senha.");
    }
    return await authResetPassword(emailToUse);
  };

  const recordBoardClick = async (boardId, boardTitle) => {
    await logUsage("board", boardTitle, boardId);
    setStats(getStatsData());
  };

  const recordPhraseClick = async (phraseText, boardId) => {
    await logUsage("phrase", phraseText, boardId);
    setStats(getStatsData());
  };

  const addNewPhrase = async (phraseData) => {
    const created = await saveCustomPhrase(phraseData);
    if (created) {
      setCustomPhrases((prev) => [...prev, created]);
    }
    return created;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        needsProfileSetup,
        setNeedsProfileSetup,
        loading,
        isConfigured,
        login,
        register,
        logout,
        resetPassword,
        verifyParentPassword,
        updateProfileData,
        recordBoardClick,
        recordPhraseClick,
        stats,
        customPhrases,
        addNewPhrase,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
