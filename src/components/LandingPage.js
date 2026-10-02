"use client";

import React, { useState } from "react";
import Logo from "./Logo";
import { useAuth } from "@/context/AuthContext";
import { getStoragePublicUrl } from "@/lib/supabase";
import {
  ShieldCheck,
  Heart,
  X,
  Lock,
  Mail,
  User,
  Sparkles,
  ArrowRight,
  Smile,
  Info,
} from "lucide-react";

export default function LandingPage() {
  const { login, register, isConfigured } = useAuth();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // 'login' or 'register'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [kidName, setKidName] = useState("");
  const [parentName, setParentName] = useState("");
  const [pin, setPin] = useState("");

  const handleOpenAuth = (mode = "login") => {
    setAuthMode(mode);
    setErrorMsg("");
    setAuthModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      if (authMode === "login") {
        await login(email, password);
      } else {
        if (!email || !password) {
          throw new Error("Por favor preencha email e senha.");
        }
        await register({
          email,
          password,
          kidName: kidName || "Nome da criança",
          parentName: parentName || "Nome do Responsável",
          pin: pin || password,
        });
      }
      setAuthModalOpen(false);
    } catch (err) {
      setErrorMsg(err.message || "Erro ao autenticar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F7FAF8",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Organic Green Shapes */}
      <div
        style={{
          position: "absolute",
          top: "-120px",
          right: "-120px",
          width: "550px",
          height: "550px",
          borderRadius: "60% 40% 70% 30% / 50% 60% 40% 50%",
          backgroundColor: "#DCFCE7",
          opacity: 0.65,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-150px",
          right: "-50px",
          width: "500px",
          height: "450px",
          borderRadius: "50% 50% 30% 70% / 60% 40% 60% 40%",
          backgroundColor: "#D1FAE5",
          opacity: 0.5,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Main Content Wrapper */}
      <div
        style={{
          maxWidth: "1220px",
          margin: "0 auto",
          padding: "24px 32px 60px 32px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Navigation Bar */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 0 32px 0",
          }}
        >
          <Logo size="md" />

          {/* Nav links */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "36px",
            }}
          >
            <a
              href="#inicio"
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#2C3E50",
                cursor: "pointer",
              }}
            >
              Inicio
            </a>
            <a
              href="#sobre"
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#475569",
                cursor: "pointer",
              }}
            >
              Sobre
            </a>
            <a
              href="#recursos"
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#475569",
                cursor: "pointer",
              }}
            >
              Recursos
            </a>
            <a
              href="#contato"
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#475569",
                cursor: "pointer",
              }}
            >
              Contato
            </a>
          </nav>

          {/* Action Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              onClick={() => handleOpenAuth("login")}
              style={{
                padding: "9px 26px",
                borderRadius: "10px",
                border: "1.5px solid #2DB34A",
                color: "#2DB34A",
                backgroundColor: "transparent",
                fontWeight: "700",
                fontSize: "15px",
              }}
            >
              Entrar
            </button>
            <button
              onClick={() => handleOpenAuth("register")}
              style={{
                padding: "10px 26px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#2DB34A",
                color: "#FFFFFF",
                fontWeight: "700",
                fontSize: "15px",
                boxShadow: "0 4px 12px rgba(45, 179, 74, 0.25)",
              }}
            >
              Cadastrar
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 1fr",
            gap: "50px",
            alignItems: "center",
            padding: "40px 0 50px 0",
          }}
        >
          {/* Left Column Text */}
          <div>
            {/* Pill badge */}
            <div
              style={{
                display: "inline-block",
                padding: "7px 18px",
                backgroundColor: "#EAF7ED",
                color: "#2DB34A",
                fontSize: "13px",
                fontWeight: "800",
                borderRadius: "20px",
                letterSpacing: "0.8px",
                marginBottom: "22px",
              }}
            >
              BEM-VINDO AO ECO KIDS
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: "52px",
                lineHeight: "1.18",
                fontWeight: "900",
                color: "#1E293B",
                marginBottom: "22px",
              }}
            >
              Sentimentos importam. Aqui,{" "}
              <span style={{ color: "#2DB34A" }}>eles têm voz.</span>
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: "18px",
                lineHeight: "1.6",
                color: "#64748B",
                maxWidth: "510px",
                marginBottom: "36px",
              }}
            >
              O Eco Kids ajuda crianças a expressarem o que sentem, desenvolvendo
              empatia, comunicação e conexão com os outros.
            </p>

            {/* CTA Buttons */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "18px",
                marginBottom: "32px",
              }}
            >
              <button
                onClick={() => handleOpenAuth("login")}
                style={{
                  padding: "14px 44px",
                  borderRadius: "12px",
                  backgroundColor: "#2DB34A",
                  color: "#FFFFFF",
                  fontWeight: "700",
                  fontSize: "16px",
                  boxShadow: "0 8px 18px rgba(45, 179, 74, 0.28)",
                }}
              >
                Entrar
              </button>
              <button
                onClick={() => handleOpenAuth("register")}
                style={{
                  padding: "13px 40px",
                  borderRadius: "12px",
                  border: "1.5px solid #CBD5E1",
                  backgroundColor: "#FFFFFF",
                  color: "#334155",
                  fontWeight: "700",
                  fontSize: "16px",
                }}
              >
                Cadastrar
              </button>
            </div>

            {/* Safe environment badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#2DB34A",
                fontWeight: "600",
                fontSize: "15px",
              }}
            >
              <ShieldCheck size={20} strokeWidth={2.4} />
              <span>Ambiente seguro e acolhedor</span>
            </div>
          </div>

          {/* Right Column: Hero Visual with Mother, Child, Puzzle and Dots */}
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Green Dots Pattern */}
            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "-20px",
                width: "90px",
                height: "90px",
                backgroundImage: "radial-gradient(#86efac 2.5px, transparent 2.5px)",
                backgroundSize: "14px 14px",
                zIndex: 1,
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "30px",
                left: "-15px",
                width: "90px",
                height: "90px",
                backgroundImage: "radial-gradient(#86efac 2.5px, transparent 2.5px)",
                backgroundSize: "14px 14px",
                zIndex: 1,
              }}
            />

            {/* Speech bubble with green smiling face */}
            <div
              style={{
                position: "absolute",
                top: "24px",
                left: "30px",
                zIndex: 4,
                backgroundColor: "#FFFFFF",
                borderRadius: "50%",
                padding: "10px",
                boxShadow: "0 8px 24px rgba(45, 179, 74, 0.18)",
                border: "2px solid #86EFAC",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Smile size={32} color="#2DB34A" strokeWidth={2.4} />
            </div>

            {/* Main organic frame */}
            <div
              style={{
                position: "relative",
                width: "480px",
                height: "360px",
                borderRadius: "45% 55% 50% 50% / 50% 45% 55% 50%",
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)",
                backgroundColor: "#F0FDF4",
                border: "4px solid #FFFFFF",
                zIndex: 2,
              }}
            >
              <img
                src={getStoragePublicUrl("ecokids", "landing-page-image.jpeg")}
                alt="Mãe e filho usando tablet com o Eco Kids"
                onError={(e) => {
                  // Fallback temporário caso o arquivo ainda não tenha sido carregado no bucket
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop";
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            </div>

            {/* 4-Piece Colored Jigsaw Puzzle Badge on bottom-right */}
            <div
              style={{
                position: "absolute",
                bottom: "-15px",
                right: "15px",
                zIndex: 4,
                width: "100px",
                height: "100px",
                filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.15))",
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Red piece (top right) */}
                <path
                  d="M 50 10 L 80 10 C 85 10, 88 14, 88 20 L 88 35 C 83 35, 80 39, 80 43 C 80 47, 83 50, 88 50 L 88 50 L 50 50 L 50 35 C 54 35, 57 32, 57 28 C 57 24, 54 21, 50 21 Z"
                  fill="#EF4444"
                />
                {/* Blue piece (top left) */}
                <path
                  d="M 20 10 L 50 10 L 50 21 C 46 21, 43 24, 43 28 C 43 32, 46 35, 50 35 L 50 50 L 35 50 C 35 46, 31 43, 27 43 C 23 43, 20 46, 20 50 L 12 50 C 12 45, 12 20, 20 10 Z"
                  fill="#3B82F6"
                />
                {/* Green piece (bottom left) */}
                <path
                  d="M 12 50 L 20 50 C 20 54, 23 57, 27 57 C 31 57, 35 54, 35 50 L 50 50 L 50 65 C 46 65, 43 68, 43 72 C 43 76, 46 79, 50 79 L 50 90 L 20 90 C 14 90, 12 85, 12 80 Z"
                  fill="#22C55E"
                />
                {/* Yellow piece (bottom right) */}
                <path
                  d="M 50 50 L 88 50 L 88 80 C 88 85, 85 90, 80 90 L 50 90 L 50 79 C 54 79, 57 76, 57 72 C 57 68, 54 65, 50 65 Z"
                  fill="#EAB308"
                />
              </svg>
            </div>
          </div>
        </section>

        {/* Bottom Rounded Information Card Section */}
        <section
          style={{
            marginTop: "30px",
            backgroundColor: "#FFFFFF",
            borderRadius: "28px",
            padding: "36px 44px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
            border: "1px solid #E2E8F0",
            display: "grid",
            gridTemplateColumns: "1.1fr 1.6fr",
            gap: "50px",
            alignItems: "center",
          }}
        >
          {/* Card Left: Green heart and empathy statement */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              borderRight: "1px solid #EEF2F6",
              paddingRight: "40px",
            }}
          >
            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                backgroundColor: "#F0FDF4",
                border: "2px solid #86EFAC",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Heart size={34} color="#2DB34A" strokeWidth={2.2} />
            </div>
            <p
              style={{
                fontSize: "15px",
                lineHeight: "1.6",
                fontWeight: "700",
                color: "#1E293B",
              }}
            >
              A ausência da fala oral não reflete falta de sentimento,
              inteligência ou desejo de se conectar com os outros.
            </p>
          </div>

          {/* Card Right: O que é o Eco Kids? */}
          <div>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "800",
                color: "#0F172A",
                marginBottom: "12px",
              }}
            >
              O que é o Eco Kids?
            </h3>
            <p
              style={{
                fontSize: "14px",
                lineHeight: "1.65",
                color: "#475569",
              }}
            >
              O Eco Kids foi criado com a intenção de ajudar a incluir todos os
              que querem se sentirem escutados, até aqueles que não conseguem
              falar para serem escutados. O Eco Kids veio para ajudar crianças
              não verbais a se comunicarem por meio dele e assim expressarem seus
              sentimentos.
            </p>
          </div>
        </section>
      </div>

      {/* ============================================================
          Modal de Login & Cadastro com Supabase
         ============================================================ */}
      {authModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            padding: "20px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setAuthModalOpen(false);
          }}
        >
          <div
            className="animate-modal"
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "24px",
              width: "100%",
              maxWidth: "460px",
              padding: "36px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              border: "1px solid #E2E8F0",
              position: "relative",
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setAuthModalOpen(false)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                color: "#94A3B8",
                padding: "6px",
                borderRadius: "8px",
              }}
            >
              <X size={22} />
            </button>

            {/* Modal Header */}
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <Logo size="sm" className="justify-center" />
              <p
                style={{
                  fontSize: "14px",
                  color: "#64748B",
                  marginTop: "8px",
                  fontWeight: "600",
                }}
              >
                {authMode === "login"
                  ? "Acesse a plataforma de comunicação do seu filho"
                  : "Crie sua conta para começar a usar o Eco Kids"}
              </p>
            </div>

            {/* Supabase status badge */}
            <div
              style={{
                backgroundColor: isConfigured ? "#ECFDF5" : "#EFF6FF",
                border: isConfigured ? "1px solid #A7F3D0" : "1px solid #BFDBFE",
                borderRadius: "10px",
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "12px",
                color: isConfigured ? "#065F46" : "#1E40AF",
                marginBottom: "20px",
                fontWeight: "600",
              }}
            >
              <Info size={16} />
              <span>
                {isConfigured
                  ? "Conectado ao Supabase com autenticação ativa"
                  : "Modo demonstração com suporte completo e salvamento local"}
              </span>
            </div>

            {/* Tabs for switching between Login and Cadastro */}
            <div
              style={{
                display: "flex",
                backgroundColor: "#F1F5F9",
                borderRadius: "12px",
                padding: "4px",
                marginBottom: "24px",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setErrorMsg("");
                }}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "9px",
                  fontWeight: "700",
                  fontSize: "14px",
                  backgroundColor: authMode === "login" ? "#FFFFFF" : "transparent",
                  color: authMode === "login" ? "#2DB34A" : "#64748B",
                  boxShadow:
                    authMode === "login" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
                }}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("register");
                  setErrorMsg("");
                }}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "9px",
                  fontWeight: "700",
                  fontSize: "14px",
                  backgroundColor:
                    authMode === "register" ? "#FFFFFF" : "transparent",
                  color: authMode === "register" ? "#2DB34A" : "#64748B",
                  boxShadow:
                    authMode === "register" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
                }}
              >
                Cadastrar
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div
                style={{
                  backgroundColor: "#FEF2F2",
                  color: "#B91C1C",
                  border: "1px solid #FECACA",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  fontSize: "13px",
                  fontWeight: "600",
                  marginBottom: "16px",
                }}
              >
                {errorMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {authMode === "register" && (
                <>
                  <div style={{ marginBottom: "14px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: "700",
                        color: "#334155",
                        marginBottom: "6px",
                      }}
                    >
                      Nome da Criança
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="text"
                        value={kidName}
                        onChange={(e) => setKidName(e.target.value)}
                        placeholder="Ex: Sofia"
                        required
                        style={{
                          width: "100%",
                          padding: "11px 14px",
                          borderRadius: "10px",
                          border: "1.5px solid #CBD5E1",
                          fontSize: "14px",
                          outline: "none",
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "14px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: "700",
                        color: "#334155",
                        marginBottom: "6px",
                      }}
                    >
                      Nome do Responsável
                    </label>
                    <input
                      type="text"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="Ex: Mariana"
                      required
                      style={{
                        width: "100%",
                        padding: "11px 14px",
                        borderRadius: "10px",
                        border: "1.5px solid #CBD5E1",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>
                </>
              )}

              {/* Email */}
              <div style={{ marginBottom: "14px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#334155",
                    marginBottom: "6px",
                  }}
                >
                  Email
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                    required
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      borderRadius: "10px",
                      border: "1.5px solid #CBD5E1",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: "14px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#334155",
                    marginBottom: "6px",
                  }}
                >
                  Senha {authMode === "register" && "(usada também na Área dos Pais)"}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha secreta"
                  required
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: "10px",
                    border: "1.5px solid #CBD5E1",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: "12px",
                  backgroundColor: "#2DB34A",
                  color: "#FFFFFF",
                  fontWeight: "800",
                  fontSize: "15px",
                  marginTop: "12px",
                  boxShadow: "0 4px 14px rgba(45, 179, 74, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading
                  ? "Aguarde..."
                  : authMode === "login"
                  ? "Entrar no Eco Kids"
                  : "Criar Conta e Acessar"}
                {!loading && <ArrowRight size={18} />}
              </button>

              {/* Quick test account helper */}
              <div
                style={{
                  marginTop: "16px",
                  textAlign: "center",
                  fontSize: "13px",
                  color: "#64748B",
                }}
              >
                <span>Dica rápida: </span>
                <button
                  type="button"
                  onClick={() => {
                    setEmail("pais@ecokids.com");
                    setPassword("123456");
                  }}
                  style={{
                    color: "#2DB34A",
                    fontWeight: "700",
                    textDecoration: "underline",
                  }}
                >
                  Preencher dados de teste
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
