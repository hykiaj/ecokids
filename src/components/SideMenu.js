"use client";

import React, { useState } from "react";
import { KidAvatar } from "./Avatars";
import AvatarModal from "./AvatarModal";
import { useAuth } from "@/context/AuthContext";
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
  const { profile, logout, updateProfileData } = useAuth();
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.25)",
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
          width: "280px",
          height: "100%",
          backgroundColor: "#FFFFFF",
          boxShadow: "-8px 0 24px rgba(0, 0, 0, 0.08)",
          display: "flex",
          flexDirection: "column",
          padding: "36px 24px 32px 24px",
          borderLeft: "1px solid #E2E8F0",
        }}
      >
        {/* Close Button on top */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
          <button
            onClick={onClose}
            style={{
              padding: "6px",
              borderRadius: "8px",
              color: "#94A3B8",
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
            paddingBottom: "28px",
            borderBottom: "1px solid #F1F5F9",
            marginBottom: "24px",
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
              color: "#1E293B",
              marginBottom: "4px",
            }}
          >
            {profile.kidName || "Nome da criança"}
          </h3>
          <p
            style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#64748B",
            }}
          >
            {profile.parentName || "Responsável"}
          </p>
        </div>

        {/* Navigation Items matching Tela3.jpeg */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
          <button
            onClick={() => setAvatarModalOpen(true)}
            style={{
              textAlign: "left",
              padding: "12px 14px",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: "700",
              color: "#334155",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F8FAFC")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <Camera size={18} color="#64748B" />
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
              color: "#334155",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F0FDF4")}
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
              color: "#334155",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F8FAFC")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <Settings size={18} color="#64748B" />
            <span>Configurações</span>
          </button>
        </nav>

        {/* Bottom Sair button in red/coral */}
        <div style={{ paddingTop: "16px", borderTop: "1px solid #F1F5F9" }}>
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
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FEF2F2")}
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
