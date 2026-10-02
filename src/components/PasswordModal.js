"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { X, Lock, AlertCircle } from "lucide-react";

export default function PasswordModal({ isOpen, onClose, onSuccess }) {
  const { verifyParentPassword, profile } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("Por favor, digite a senha.");
      return;
    }

    const isValid = verifyParentPassword(password);
    if (isValid) {
      setPassword("");
      setError("");
      onSuccess();
    } else {
      setError("Senha incorreta. Tente novamente.");
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
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="animate-modal"
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "24px",
          width: "100%",
          maxWidth: "400px",
          padding: "36px 32px 32px 32px",
          boxShadow: "0 20px 40px -8px rgba(0, 0, 0, 0.2)",
          border: "1px solid #E2E8F0",
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Close icon */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            color: "#94A3B8",
            padding: "4px",
            borderRadius: "6px",
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Title matching Tela3.jpeg */}
        <h3
          style={{
            fontSize: "17px",
            fontWeight: "700",
            color: "#334155",
            marginBottom: "24px",
          }}
        >
          Coloque a senha para prosseguir
        </h3>

        {error && (
          <div
            style={{
              backgroundColor: "#FEF2F2",
              color: "#DC2626",
              borderRadius: "10px",
              padding: "8px 12px",
              fontSize: "13px",
              fontWeight: "600",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Input field */}
          <div style={{ marginBottom: "20px" }}>
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1.5px solid #CBD5E1",
                fontSize: "15px",
                outline: "none",
                textAlign: "left",
                color: "#1E293B",
                backgroundColor: "#FFFFFF",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#2DB34A")}
              onBlur={(e) => (e.target.style.borderColor = "#CBD5E1")}
            />
          </div>

          {/* Green Pill Button "Pronto" */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              type="submit"
              style={{
                padding: "10px 42px",
                borderRadius: "20px",
                backgroundColor: "#52B76E",
                color: "#FFFFFF",
                fontWeight: "700",
                fontSize: "15px",
                boxShadow: "0 4px 12px rgba(82, 183, 110, 0.3)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#43A05E")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#52B76E")}
            >
              Pronto
            </button>
          </div>
        </form>

        <p
          style={{
            fontSize: "12px",
            color: "#94A3B8",
            marginTop: "16px",
          }}
        >
          Dica: use a mesma senha do seu cadastro (ou &quot;1234&quot;)
        </p>
      </div>
    </div>
  );
}
