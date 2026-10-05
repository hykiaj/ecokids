"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import ThemeToggle from "./ThemeToggle";
import { X, Settings, Database, Check, UserPlus, AlertCircle, KeyRound, Palette } from "lucide-react";

function ConfigModalContent({ onClose }) {
  const { user, profile, updateProfileData, isConfigured, needsProfileSetup, resetPassword } = useAuth();
  const { isDark } = useTheme();

  const [kidName, setKidName] = useState(
    profile?.kidName && profile.kidName !== "Nome da criança" ? profile.kidName : ""
  );
  const [parentName, setParentName] = useState(
    profile?.parentName &&
      profile.parentName !== "Nome do Responsável" &&
      profile.parentName !== "Responsável"
      ? profile.parentName
      : ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Estado para fluxo de redefinição de senha via Supabase
  const [isResetting, setIsResetting] = useState(false);
  const [resetNotice, setResetNotice] = useState(false);
  const [resetError, setResetError] = useState("");

  const handleResetPassword = async () => {
    const emailToUse = user?.email || profile?.email;
    if (!emailToUse) {
      setResetError("Não foi possível identificar o e-mail da conta.");
      return;
    }

    setIsResetting(true);
    setResetNotice(false);
    setResetError("");

    try {
      await resetPassword(emailToUse);
      setResetNotice(true);
      setTimeout(() => setResetNotice(false), 7000);
    } catch (err) {
      if (err.message?.includes("rate limit") || err.status === 429) {
        setResetError("Limite de envio de e-mails atingido no provedor. Aguarde alguns instantes.");
      } else {
        setResetError(err.message || "Erro ao solicitar redefinição de senha.");
      }
    } finally {
      setIsResetting(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!kidName.trim()) {
      setErrorMsg("Por favor, informe o nome da criança.");
      return;
    }
    if (!parentName.trim()) {
      setErrorMsg("Por favor, informe o nome do responsável.");
      return;
    }

    setErrorMsg("");
    setIsSaving(true);

    try {
      await updateProfileData({
        kidName: kidName.trim(),
        parentName: parentName.trim(),
      });
      setSavedNotice(true);
      setTimeout(() => {
        setSavedNotice(false);
        onClose();
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || "Erro ao salvar no banco de dados. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.45)",
        backdropFilter: "blur(3px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !needsProfileSetup) onClose();
      }}
    >
      <div
        className="animate-modal"
        style={{
          backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
          borderRadius: "24px",
          width: "100%",
          maxWidth: "480px",
          padding: "32px",
          boxShadow: isDark ? "0 20px 40px -8px rgba(0, 0, 0, 0.6)" : "0 20px 40px -8px rgba(0, 0, 0, 0.2)",
          border: isDark ? "1px solid #334155" : "1px solid #E2E8F0",
          position: "relative",
          maxHeight: "90vh",
          overflowY: "auto",
          transition: "background-color 0.25s ease, border-color 0.25s ease",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            color: isDark ? "#94A3B8" : "#94A3B8",
            padding: "4px",
            borderRadius: "6px",
          }}
          title="Fechar"
        >
          <X size={20} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <div
            style={{
              padding: "10px",
              borderRadius: "12px",
              backgroundColor: needsProfileSetup
                ? (isDark ? "#78350F30" : "#FEF3C7")
                : (isDark ? "#14532D30" : "#F0FDF4"),
              color: needsProfileSetup ? "#D97706" : "#16A34A",
            }}
          >
            {needsProfileSetup ? <UserPlus size={22} /> : <Settings size={22} />}
          </div>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: "800", color: isDark ? "#F8FAFC" : "#1E293B" }}>
              {needsProfileSetup ? "Vincular Perfil no Banco" : "Configurações do Eco Kids"}
            </h3>
            <p style={{ fontSize: "13px", color: isDark ? "#94A3B8" : "#64748B" }}>
              {needsProfileSetup
                ? "Complete os nomes para salvar seu usuário no banco de dados"
                : "Gerencie perfis, aparência e conexão"}
            </p>
          </div>
        </div>

        {/* Card explicativo quando o usuário precisa vincular os dados */}
        {needsProfileSetup && (
          <div
            style={{
              backgroundColor: isDark ? "#451A0340" : "#FFFBEB",
              border: isDark ? "1.5px solid #92400E" : "1.5px solid #FDE68A",
              borderRadius: "14px",
              padding: "14px 16px",
              marginBottom: "18px",
              fontSize: "13px",
              color: isDark ? "#FCD34D" : "#92400E",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "700" }}>
              <span>👋 Olá! Seu email ainda não possui perfil vinculado</span>
            </div>
            <p style={{ marginTop: "4px", fontSize: "12px", lineHeight: "1.4", color: isDark ? "#FDE68A" : "#B45309" }}>
              Para começar a usar as pranchas e salvar suas preferências, digite o nome da criança e do responsável abaixo. Os dados serão salvos no banco de dados automaticamente.
            </p>
          </div>
        )}

        {/* Seção de Aparência: Modo Claro e Modo Escuro */}
        <div
          style={{
            backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
            border: isDark ? "1.5px solid #334155" : "1.5px solid #E2E8F0",
            borderRadius: "14px",
            padding: "14px 16px",
            marginBottom: "18px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            <Palette size={16} color={isDark ? "#4ADE80" : "#16A34A"} />
            <strong style={{ fontSize: "13px", color: isDark ? "#F8FAFC" : "#1E293B" }}>
              Aparência do Aplicativo
            </strong>
          </div>
          <ThemeToggle variant="selector" />
        </div>

        {/* Supabase status block */}
        <div
          style={{
            backgroundColor: isDark ? "#0F172A" : (isConfigured ? "#ECFDF5" : "#F8FAFC"),
            border: isDark ? "1.5px solid #334155" : (isConfigured ? "1.5px solid #A7F3D0" : "1.5px solid #E2E8F0"),
            borderRadius: "14px",
            padding: "14px 16px",
            marginBottom: "20px",
            fontSize: "13px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <Database size={16} color={isConfigured ? "#059669" : (isDark ? "#94A3B8" : "#64748B")} />
            <strong style={{ color: isConfigured ? (isDark ? "#4ADE80" : "#065F46") : (isDark ? "#E2E8F0" : "#334155") }}>
              Status do Banco: {isConfigured ? "Supabase Conectado" : "Modo Local / Demo"}
            </strong>
          </div>
          <p style={{ color: isDark ? "#94A3B8" : "#64748B", fontSize: "12px", lineHeight: "1.4" }}>
            {isConfigured
              ? "As alterações feitas aqui serão sincronizadas diretamente na tabela profiles."
              : "Modo demonstração: os dados serão gravados no armazenamento local."}
          </p>
        </div>

        {savedNotice && (
          <div
            style={{
              backgroundColor: isDark ? "#064E3B40" : "#ECFDF5",
              color: isDark ? "#6EE7B7" : "#065F46",
              border: isDark ? "1px solid #065F46" : "1px solid #A7F3D0",
              borderRadius: "10px",
              padding: "10px 14px",
              fontSize: "13px",
              fontWeight: "700",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Check size={16} />
            <span>Perfil salvo no banco de dados com sucesso!</span>
          </div>
        )}

        {errorMsg && (
          <div
            style={{
              backgroundColor: isDark ? "#450A0A40" : "#FEF2F2",
              color: isDark ? "#FCA5A5" : "#991B1B",
              border: isDark ? "1px solid #991B1B" : "1px solid #FECACA",
              borderRadius: "10px",
              padding: "10px 14px",
              fontSize: "13px",
              fontWeight: "600",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave}>
          <div style={{ marginBottom: "14px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "700",
                color: isDark ? "#E2E8F0" : "#334155",
                marginBottom: "6px",
              }}
            >
              Nome da Criança *
            </label>
            <input
              type="text"
              value={kidName}
              placeholder="Ex: Sofia ou Lucas"
              onChange={(e) => setKidName(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: isDark ? "1.5px solid #475569" : "1.5px solid #CBD5E1",
                backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
                color: isDark ? "#F8FAFC" : "#1E293B",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "700",
                color: isDark ? "#E2E8F0" : "#334155",
                marginBottom: "6px",
              }}
            >
              Nome do Responsável *
            </label>
            <input
              type="text"
              value={parentName}
              placeholder="Ex: Mariana ou Carlos"
              onChange={(e) => setParentName(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: isDark ? "1.5px solid #475569" : "1.5px solid #CBD5E1",
                backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
                color: isDark ? "#F8FAFC" : "#1E293B",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>

          {/* Seção de Redefinição de Senha via serviço nativo do Supabase */}
          <div
            style={{
              backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
              border: isDark ? "1.5px solid #334155" : "1.5px solid #E2E8F0",
              borderRadius: "14px",
              padding: "14px 16px",
              marginBottom: "22px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: "1 1 200px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                  <KeyRound size={15} color={isDark ? "#94A3B8" : "#475569"} />
                  <strong style={{ fontSize: "13px", color: isDark ? "#F8FAFC" : "#1E293B" }}>Redefinição de Senha</strong>
                </div>
                <p style={{ fontSize: "12px", color: isDark ? "#94A3B8" : "#64748B", margin: 0, lineHeight: "1.4" }}>
                  Enviar link seguro para:{" "}
                  <span style={{ fontWeight: "600", color: isDark ? "#E2E8F0" : "#334155" }}>
                    {user?.email || profile?.email || "e-mail da conta"}
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={handleResetPassword}
                disabled={isResetting}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  borderRadius: "10px",
                  backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
                  border: isDark ? "1.5px solid #475569" : "1.5px solid #CBD5E1",
                  color: isDark ? "#F8FAFC" : "#334155",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: isResetting ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  if (!isResetting) {
                    e.currentTarget.style.borderColor = "#2DB34A";
                    e.currentTarget.style.color = "#2DB34A";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isResetting) {
                    e.currentTarget.style.borderColor = isDark ? "#475569" : "#CBD5E1";
                    e.currentTarget.style.color = isDark ? "#F8FAFC" : "#334155";
                  }
                }}
              >
                <KeyRound size={14} />
                <span>{isResetting ? "Enviando..." : "Redefinir Senha"}</span>
              </button>
            </div>

            {resetNotice && (
              <div
                style={{
                  marginTop: "12px",
                  backgroundColor: isDark ? "#064E3B40" : "#ECFDF5",
                  color: isDark ? "#6EE7B7" : "#065F46",
                  border: isDark ? "1px solid #065F46" : "1px solid #A7F3D0",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  fontSize: "12px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Check size={14} />
                <span>E-mail de redefinição enviado pelo Supabase! Verifique sua caixa de entrada.</span>
              </div>
            )}

            {resetError && (
              <div
                style={{
                  marginTop: "12px",
                  backgroundColor: isDark ? "#450A0A40" : "#FEF2F2",
                  color: isDark ? "#FCA5A5" : "#991B1B",
                  border: isDark ? "1px solid #991B1B" : "1px solid #FECACA",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  fontSize: "12px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <AlertCircle size={14} />
                <span>{resetError}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSaving}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "12px",
              backgroundColor: isSaving ? "#94A3B8" : "#2DB34A",
              color: "#FFFFFF",
              fontWeight: "800",
              fontSize: "15px",
              boxShadow: "0 4px 12px rgba(45, 179, 74, 0.25)",
              cursor: isSaving ? "not-allowed" : "pointer",
            }}
          >
            {isSaving ? "Salvando no Banco..." : "Salvar e Continuar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ConfigModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return <ConfigModalContent onClose={onClose} />;
}
