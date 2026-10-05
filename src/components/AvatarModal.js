"use client";

import React, { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { getStoragePublicUrl, uploadAvatar } from "@/lib/supabase";
import { X, Check, UploadCloud, Smile, Sparkles } from "lucide-react";

export default function AvatarModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return <AvatarModalContent onClose={onClose} />;
}

function AvatarModalContent({ onClose }) {
  const { profile, updateProfileData } = useAuth();
  const { isDark } = useTheme();

  const PRESET_AVATARS = [
    { id: "icon1.png", label: "Avatar 1", url: getStoragePublicUrl("ecokids", "icon1.png") },
    { id: "icon2.png", label: "Avatar 2", url: getStoragePublicUrl("ecokids", "icon2.png") },
    { id: "icon3.png", label: "Avatar 3", url: getStoragePublicUrl("ecokids", "icon3.png") },
    { id: "icon4.png", label: "Avatar 4", url: getStoragePublicUrl("ecokids", "icon4.png") },
  ];

  const currentAvatar = profile?.avatarKid || "icon1.png";
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
  const [customAvatarUrl, setCustomAvatarUrl] = useState(
    currentAvatar.startsWith("http") || currentAvatar.startsWith("data:") ? currentAvatar : null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // 1. Tentar upload direto no bucket do Supabase
    try {
      const bucketUrl = await uploadAvatar(file);
      if (bucketUrl) {
        setCustomAvatarUrl(bucketUrl);
        setSelectedAvatar(bucketUrl);
        setIsUploading(false);
        return;
      }
    } catch {
      // fallback local
    }

    // 2. Fallback para Data URL local caso o bucket não aceite
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setCustomAvatarUrl(dataUrl);
      setSelectedAvatar(dataUrl);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfileData({
        avatarKid: selectedAvatar,
      });
      setSuccessNotice(true);
      setTimeout(() => {
        setSuccessNotice(false);
        onClose();
      }, 1000);
    } catch (err) {
      console.error("Erro ao salvar avatar:", err);
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
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1050,
        padding: "20px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="animate-modal"
        style={{
          backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
          borderRadius: "28px",
          width: "100%",
          maxWidth: "460px",
          padding: "32px 28px",
          boxShadow: isDark ? "0 25px 50px -12px rgba(0, 0, 0, 0.6)" : "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          border: isDark ? "1.5px solid #334155" : "1.5px solid #E2E8F0",
          position: "relative",
          textAlign: "center",
          transition: "background-color 0.25s ease, border-color 0.25s ease",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            color: isDark ? "#94A3B8" : "#94A3B8",
            padding: "4px",
            borderRadius: "8px",
          }}
          title="Fechar"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "22px" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundColor: isDark ? "#14532D40" : "#DCFCE7",
              color: isDark ? "#4ADE80" : "#16A34A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "10px",
            }}
          >
            <Smile size={28} />
          </div>
          <h3 style={{ fontSize: "20px", fontWeight: "900", color: isDark ? "#F8FAFC" : "#1E293B", margin: 0 }}>
            Escolha seu Avatar
          </h3>
          <p style={{ fontSize: "13px", color: isDark ? "#94A3B8" : "#64748B", marginTop: "4px" }}>
            Selecione um dos avatares abaixo ou envie sua própria foto!
          </p>
        </div>

        {/* Predefined Avatars Grid (icon1.png, icon2.png, icon3.png, icon4.png) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "14px",
            marginBottom: "24px",
            padding: "8px",
          }}
        >
          {PRESET_AVATARS.map((item) => {
            const isSelected = selectedAvatar === item.id || selectedAvatar === item.url;
            return (
              <div key={item.id} style={{ position: "relative", width: "78px", height: "78px", margin: "0 auto" }}>
                <button
                  type="button"
                  onClick={() => setSelectedAvatar(item.id)}
                  className="eco-card-interactive"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    border: isSelected ? "3.5px solid #2DB34A" : isDark ? "2.5px solid #334155" : "2.5px solid #E2E8F0",
                    backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
                    boxShadow: isSelected ? "0 0 0 4px rgba(45, 179, 74, 0.22)" : "0 2px 6px rgba(0,0,0,0.04)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    padding: 0,
                    clipPath: "circle(50% at 50% 50%)",
                    WebkitClipPath: "circle(50% at 50% 50%)",
                    WebkitMaskImage: "-webkit-radial-gradient(white, black)",
                    transform: "translateZ(0)",
                  }}
                >
                  <img
                    src={item.url}
                    alt={item.label}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%",
                      display: "block",
                    }}
                    onError={(e) => {
                      // Fallback visual caso o arquivo ainda não esteja no bucket
                      e.currentTarget.style.display = "none";
                      if (e.currentTarget.parentElement) {
                        e.currentTarget.parentElement.style.backgroundColor = isDark ? "#14532D30" : "#F0FDF4";
                        e.currentTarget.parentElement.innerHTML = `<span style="font-size:11px;font-weight:800;color:#16A34A;">${item.id}</span>`;
                      }
                    }}
                  />
                </button>

                {isSelected && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-2px",
                      right: "-2px",
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      backgroundColor: "#2DB34A",
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px solid #FFFFFF",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                      zIndex: 5,
                      pointerEvents: "none",
                    }}
                  >
                    <Check size={14} strokeWidth={3} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Custom Uploaded Avatar Option (if any) */}
        {customAvatarUrl && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              padding: "10px 14px",
              backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
              borderRadius: "16px",
              border: isDark ? "1.5px solid #334155" : "1.5px solid #E2E8F0",
              marginBottom: "20px",
            }}
          >
            <div
              onClick={() => setSelectedAvatar(customAvatarUrl)}
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                border: selectedAvatar === customAvatarUrl ? "3px solid #2DB34A" : isDark ? "2px solid #475569" : "2px solid #CBD5E1",
                boxShadow: selectedAvatar === customAvatarUrl ? "0 0 0 3px rgba(45, 179, 74, 0.2)" : "none",
                overflow: "hidden",
                clipPath: "circle(50% at 50% 50%)",
                WebkitClipPath: "circle(50% at 50% 50%)",
                WebkitMaskImage: "-webkit-radial-gradient(white, black)",
                transform: "translateZ(0)",
                cursor: "pointer",
                flexShrink: 0,
                backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
              }}
            >
              <img
                src={customAvatarUrl}
                alt="Minha Foto"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                  display: "block",
                }}
              />
            </div>
            <div style={{ textAlign: "left", flex: 1 }}>
              <p style={{ fontSize: "13px", fontWeight: "700", color: isDark ? "#F8FAFC" : "#1E293B", margin: 0 }}>
                Foto enviada por você
              </p>
              <span style={{ fontSize: "11px", color: isDark ? "#94A3B8" : "#64748B" }}>
                {selectedAvatar === customAvatarUrl ? "Selecionada como avatar" : "Clique na foto para selecionar"}
              </span>
            </div>
            {selectedAvatar === customAvatarUrl && (
              <span
                style={{
                  backgroundColor: isDark ? "#14532D50" : "#DCFCE7",
                  color: isDark ? "#4ADE80" : "#166534",
                  fontSize: "11px",
                  fontWeight: "800",
                  padding: "4px 8px",
                  borderRadius: "12px",
                }}
              >
                Ativo
              </span>
            )}
          </div>
        )}

        {/* Upload Custom Avatar Button */}
        <div style={{ marginBottom: "24px" }}>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            style={{
              width: "100%",
              padding: "11px 16px",
              borderRadius: "14px",
              border: isDark ? "1.5px dashed #475569" : "1.5px dashed #CBD5E1",
              backgroundColor: isDark ? "#0F172A" : "#FAFAFA",
              color: isDark ? "#CBD5E1" : "#475569",
              fontSize: "13px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              cursor: isUploading ? "not-allowed" : "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (!isUploading) {
                e.currentTarget.style.backgroundColor = isDark ? "#334155" : "#F0FDF4";
                e.currentTarget.style.borderColor = "#86EFAC";
                e.currentTarget.style.color = "#16A34A";
              }
            }}
            onMouseLeave={(e) => {
              if (!isUploading) {
                e.currentTarget.style.backgroundColor = isDark ? "#0F172A" : "#FAFAFA";
                e.currentTarget.style.borderColor = isDark ? "#475569" : "#CBD5E1";
                e.currentTarget.style.color = isDark ? "#CBD5E1" : "#475569";
              }
            }}
          >
            <UploadCloud size={18} />
            <span>{isUploading ? "Carregando imagem..." : "Enviar foto do dispositivo..."}</span>
          </button>
        </div>

        {/* Success Notice */}
        {successNotice && (
          <div
            style={{
              backgroundColor: isDark ? "#064E3B40" : "#ECFDF5",
              color: isDark ? "#6EE7B7" : "#065F46",
              border: isDark ? "1px solid #065F46" : "1px solid #A7F3D0",
              borderRadius: "12px",
              padding: "10px",
              fontSize: "13px",
              fontWeight: "700",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <Check size={16} />
            <span>Avatar atualizado com sucesso!</span>
          </div>
        )}

        {/* Save Button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          style={{
            width: "100%",
            padding: "13px",
            borderRadius: "14px",
            backgroundColor: isSaving ? "#94A3B8" : "#2DB34A",
            color: "#FFFFFF",
            fontWeight: "800",
            fontSize: "15px",
            boxShadow: "0 4px 14px rgba(45, 179, 74, 0.28)",
            cursor: isSaving ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <Sparkles size={17} />
          <span>{isSaving ? "Salvando..." : "Salvar Avatar"}</span>
        </button>
      </div>
    </div>
  );
}
