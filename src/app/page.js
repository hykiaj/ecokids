"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import LandingPage from "@/components/LandingPage";
import KidsHome from "@/components/KidsHome";
import SideMenu from "@/components/SideMenu";
import PasswordModal from "@/components/PasswordModal";
import ParentsArea from "@/components/ParentsArea";
import ConfigModal from "@/components/ConfigModal";
import AdminArea from "@/components/AdminArea";

export default function Home() {
  const { user, profile, logout, loading, needsProfileSetup } = useAuth();

  // Current view when authenticated: 'kids' (Tela 2) or 'parents' (Tela 4)
  const [currentView, setCurrentView] = useState("kids");
  const [menuOpen, setMenuOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [manualConfigOpen, setManualConfigOpen] = useState(false);
  const [dismissedSetup, setDismissedSetup] = useState(false);

  // Ao logar, caso o email não tenha perfil vinculado, a tela de configuração fica ativa
  const isConfigModalOpen = manualConfigOpen || (Boolean(user && needsProfileSetup) && !dismissedSetup);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F7FAF8",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            border: "4px solid #DCFCE7",
            borderTopColor: "#2DB34A",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  // If not logged in -> Screen 1 (Landing Page with Login/Register modal)
  if (!user) {
    return <LandingPage />;
  }

  // If logged in as admin -> direct to Admin Area
  const isAdmin = Boolean(profile?.isAdmin || user?.isAdmin);
  if (isAdmin) {
    return <AdminArea onLogout={logout} />;
  }

  // If logged in as regular user:
  return (
    <>
      {currentView === "kids" ? (
        // Screen 2: Kids Home with 9 Boards
        <KidsHome onOpenMenu={() => setMenuOpen(true)} />
      ) : (
        // Screen 4: Parents Area with metrics and phrase creation
        <ParentsArea
          onBackToKids={() => setCurrentView("kids")}
          onOpenMenu={() => setMenuOpen(true)}
        />
      )}

      {/* Screen 3: Side Menu Drawer */}
      <SideMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onRequestParentsArea={() => setPasswordModalOpen(true)}
        onOpenSettings={() => {
          setMenuOpen(false);
          setManualConfigOpen(true);
        }}
      />

      {/* Screen 3: Password Confirmation Modal to enter Parents Area */}
      <PasswordModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        onSuccess={() => {
          setPasswordModalOpen(false);
          setCurrentView("parents");
        }}
      />

      {/* Settings Modal */}
      <ConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => {
          setManualConfigOpen(false);
          setDismissedSetup(true);
        }}
      />
    </>
  );
}
