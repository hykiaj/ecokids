"use client";

import React, { useState } from "react";
import { KidAvatar } from "./Avatars";
import AvatarModal from "./AvatarModal";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
  X,
  User,
  Shield,
  Settings,
  LogOut,
  Camera,
  Check,
} from "lucide-react";

export default function SideMenu({
  isOpen,
  onClose,
  onRequestParentsArea,
  onOpenSettings,
}) {
  const { profile, logout } = useAuth();
  const { isDark } = useTheme();
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.35)",
        backdropFilter: "blur(2px)",
        display: "flex",
        justifyContent: "flex-end",
        zIndex: 999,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <aside
        className="animate-drawer"
        style={{
          width: "290px",
          height: "100%",
          backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
          boxShadow: "-8px 0 24px rgba(0, 0, 0, 0.15)",
          display: "flex",
          flexDirection: "column",
          padding: "36px 24px 32px 24px",
          borderLeft: isDark ? "1px solid #334155" : "1px solid #E2E8F0",
          transition: "background-color 0.25s ease, border-color 0.25s ease",
        }}
      >
        {/* Close Button on top */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
          <button
            onClick={onClose}
            style={{
              padding: "6px",
              borderRadius: "8px",
              color: isDark ? "#94A3B8" : "#94A3B8",
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* User Card on Top matching Tela3.jpeg */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            paddingBottom: "24px",
            borderBottom: isDark ? "1px solid #334155" : "1px solid #F1F5F9",
            marginBottom: "20px",
          }}
        >
          {/* Large Kid Avatar */}
          <div style={{ position: "relative", marginBottom: "14px" }}>
            <KidAvatar size={88} />
          </div>

          <h3
            style={{
              fontSize: "17px",
              fontWeight: "800",
              color: isDark ? "#F8FAFC" : "#1E293B",
              marginBottom: "4px",
            }}
          >
            {profile.kidName || "Nome da criança"}
          </h3>
          <p
            style={{
              fontSize: "13px",
              fontWeight: "600",
              color: isDark ? "#94A3B8" : "#64748B",
            }}
          >
            {profile.parentName || "Responsável"}
          </p>
        </div>

        {/* Navigation Items */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1, overflowY: "auto" }}>
          <button
            onClick={() => setAvatarModalOpen(true)}
            style={{
              textAlign: "left",
              padding: "12px 14px",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: "700",
              color: isDark ? "#E2E8F0" : "#334155",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isDark ? "#334155" : "#F8FAFC")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <Camera size={18} color={isDark ? "#94A3B8" : "#64748B"} />
            <span>Alterar avatar</span>
          </button>

          {/* Área dos pais - triggers password modal */}
          <button
            onClick={() => {
              onClose();
              onRequestParentsArea();
            }}
            style={{
              textAlign: "left",
              padding: "12px 14px",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: "700",
              color: isDark ? "#E2E8F0" : "#334155",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isDark ? "#14532D30" : "#F0FDF4")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <Shield size={18} color="#2DB34A" />
            <span>Área dos pais</span>
          </button>

          {/* Configurações */}
          <button
            onClick={() => {
              if (onOpenSettings) onOpenSettings();
            }}
            style={{
              textAlign: "left",
              padding: "12px 14px",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: "700",
              color: isDark ? "#E2E8F0" : "#334155",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isDark ? "#334155" : "#F8FAFC")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <Settings size={18} color={isDark ? "#94A3B8" : "#64748B"} />
            <span>Configurações</span>
          </button>

          {/* Alternância de Modo Claro e Escuro */}
          <div style={{ marginTop: "4px" }}>
            <ThemeToggle variant="menu-item" />
          </div>
        </nav>

        {/* Bottom Sair button in red/coral */}
        <div style={{ paddingTop: "16px", borderTop: isDark ? "1px solid #334155" : "1px solid #F1F5F9" }}>
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: "800",
              color: "#EF4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isDark ? "#450A0A30" : "#FEF2F2")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Dialog para alteração do Avatar */}
      <AvatarModal
        isOpen={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
      />
    </div>
  );
}
