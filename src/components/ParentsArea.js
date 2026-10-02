"use client";

import React, { useState, useRef } from "react";
import Logo from "./Logo";
import { useAuth } from "@/context/AuthContext";
import {
  Menu,
  BarChart3,
  MessageSquare,
  Image as ImageIcon,
  UploadCloud,
  Pencil,
  LayoutGrid,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  X,
} from "lucide-react";

export default function ParentsArea({ onBackToKids, onOpenMenu }) {
  const { profile, stats, addNewPhrase } = useAuth();

  const [phraseText, setPhraseText] = useState("");
  const [selectedBoardId, setSelectedBoardId] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [successNotice, setSuccessNotice] = useState("");
  const fileInputRef = useRef(null);

  const boardOptions = [
    { id: "alimentacao", name: "Alimentação" },
    { id: "bebidas", name: "Bebidas" },
    { id: "diversao", name: "Diversão" },
    { id: "emocoes", name: "Emoções" },
    { id: "social", name: "Social" },
    { id: "rotina", name: "Rotina" },
    { id: "lugares", name: "Lugares" },
    { id: "favoritos", name: "Favoritos" },
    { id: "higiene", name: "Higiene" },
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhrase = async (e) => {
    e.preventDefault();
    if (!phraseText.trim()) {
      alert("Por favor, digite o texto da frase.");
      return;
    }
    if (!selectedBoardId) {
      alert("Por favor, selecione uma prancha.");
      return;
    }

    await addNewPhrase({
      text: phraseText.trim(),
      boardId: selectedBoardId,
      imageUrl: imagePreview || "",
    });

    const chosenBoard = boardOptions.find((b) => b.id === selectedBoardId)?.name;
    setSuccessNotice(`Frase "${phraseText}" adicionada à prancha ${chosenBoard}!`);
    setPhraseText("");
    setImagePreview(null);
    setSelectedBoardId("");

    setTimeout(() => {
      setSuccessNotice("");
    }, 4500);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#EBF6EE",
        padding: "24px 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Decorative Dots Pattern like Tela4.jpeg */}
      <div
        style={{
          position: "fixed",
          top: "40px",
          right: "90px",
          width: "120px",
          height: "90px",
          backgroundImage: "radial-gradient(#86efac 2.8px, transparent 2.8px)",
          backgroundSize: "16px 16px",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "100px",
          left: "20px",
          width: "80px",
          height: "160px",
          backgroundImage: "radial-gradient(#86efac 2.8px, transparent 2.8px)",
          backgroundSize: "16px 16px",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Main Container Card */}
      <main
        style={{
          width: "100%",
          maxWidth: "1120px",
          backgroundColor: "#FFFFFF",
          borderRadius: "32px",
          boxShadow: "0 16px 48px rgba(34, 197, 94, 0.12), 0 4px 16px rgba(0,0,0,0.04)",
          border: "2px solid #DCFCE7",
          padding: "28px 44px 44px 44px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Top Header of Área dos Pais matching Tela4.jpeg */}
        <header
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            paddingBottom: "18px",
            borderBottom: "1px solid #F1F5F9",
            marginBottom: "28px",
          }}
        >
          {/* Left: Eco Kids Logo */}
          <div>
            <Logo size="sm" />
          </div>

          {/* Center: Leaf icon and 'Área dos Pais' */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#2DB34A",
              fontWeight: "800",
              fontSize: "26px",
              letterSpacing: "-0.3px",
            }}
          >
            {/* Cute Leaf SVG */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C8 6 4 10 4 15C4 18.5 7 21 10.5 21C11.5 21 12 20.5 12 19.5V11"
                stroke="#2DB34A"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M12 2C16 6 20 10 20 15C20 18.5 17 21 13.5 21C12.5 21 12 20.5 12 19.5V11"
                stroke="#2DB34A"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            <span>Área dos Pais</span>
          </div>

          {/* Right: Actions (Voltar para Modo Criança + Hamburger Menu) */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "12px" }}>
            <button
              onClick={onBackToKids}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "12px",
                backgroundColor: "#F0FDF4",
                color: "#16A34A",
                fontWeight: "700",
                fontSize: "14px",
                border: "1px solid #BBF7D0",
              }}
            >
              <ArrowLeft size={16} />
              <span>Modo Criança</span>
            </button>

            <button
              onClick={onOpenMenu}
              aria-label="Abrir menu"
              style={{
                padding: "8px",
                borderRadius: "10px",
                color: "#22C55E",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Menu size={32} strokeWidth={2.4} />
            </button>
          </div>
        </header>

        {/* Subheader: Parent Greeting + Nova Frase button matching Tela4.jpeg */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "32px",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "22px",
                fontWeight: "800",
                color: "#1E293B",
              }}
            >
              Olá, {profile.parentName || "Nome do Responsável"}
            </h2>
          </div>

          {/* '+ Nova Frase' Button with stars */}
          <button
            onClick={() => {
              const el = document.getElementById("add-phrase-form");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 22px",
              borderRadius: "12px",
              border: "1.5px solid #86EFAC",
              backgroundColor: "#F0FDF4",
              color: "#15803D",
              fontWeight: "700",
              fontSize: "15px",
              boxShadow: "0 2px 8px rgba(34, 197, 94, 0.08)",
            }}
          >
            <Sparkles size={18} color="#16A34A" />
            <span>Nova Frase</span>
          </button>
        </div>

        {/* Success notification banner */}
        {successNotice && (
          <div
            style={{
              backgroundColor: "#ECFDF5",
              color: "#065F46",
              border: "1px solid #A7F3D0",
              borderRadius: "14px",
              padding: "14px 20px",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontWeight: "700",
            }}
          >
            <CheckCircle2 size={20} color="#059669" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* 2 Columns Layout matching Tela4.jpeg */}
        <div
          id="add-phrase-form"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "36px",
            alignItems: "start",
          }}
        >
          {/* ============================================================
              Left Column: Metrics (Pranchas mais usadas & Frases mais usadas)
             ============================================================ */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Card 1: Pranchas mais usadas */}
            <div
              style={{
                backgroundColor: "#F8FCF9",
                borderRadius: "22px",
                border: "1.5px solid #DCFCE7",
                padding: "24px",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.02)",
              }}
            >
              {/* Subtle background foliage illustration */}
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  opacity: 0.15,
                  pointerEvents: "none",
                }}
              >
                <svg width="80" height="80" viewBox="0 0 100 100">
                  <path d="M 50 10 C 20 40, 20 80, 50 90 C 80 80, 80 40, 50 10 Z" fill="#22C55E" />
                </svg>
              </div>

              {/* Title with icon */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "18px",
                  color: "#16A34A",
                  fontWeight: "800",
                  fontSize: "17px",
                }}
              >
                <BarChart3 size={22} color="#16A34A" strokeWidth={2.4} />
                <span>Pranchas mais usadas</span>
              </div>

              {/* Inner White Box */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "16px",
                  border: "1px solid #E2E8F0",
                  padding: "22px 20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                }}
              >
                <p
                  style={{
                    fontSize: "15px",
                    lineHeight: "1.65",
                    color: "#334155",
                    fontWeight: "600",
                  }}
                >
                  <strong style={{ color: "#0F172A" }}>{profile.kidName || "Nome da criança"}</strong>{" "}
                  usou a ({" "}
                  <span style={{ color: "#16A34A", fontWeight: "700" }}>
                    {stats?.topBoard?.name || "Alimentação"}
                  </span>{" "}
                  ) ao total de ({" "}
                  <span style={{ color: "#16A34A", fontWeight: "700" }}>
                    {stats?.topBoard?.count || 12}
                  </span>{" "}
                  ) vezes.
                </p>
              </div>
            </div>

            {/* Card 2: Frases mais usadas */}
            <div
              style={{
                backgroundColor: "#F8FCF9",
                borderRadius: "22px",
                border: "1.5px solid #DCFCE7",
                padding: "24px",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.02)",
              }}
            >
              {/* Title with speech bubble icon */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "18px",
                  color: "#16A34A",
                  fontWeight: "800",
                  fontSize: "17px",
                }}
              >
                <MessageSquare size={22} color="#16A34A" strokeWidth={2.4} />
                <span>Frases mais usadas</span>
              </div>

              {/* Inner White Box */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "16px",
                  border: "1px solid #E2E8F0",
                  padding: "22px 20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                }}
              >
                <p
                  style={{
                    fontSize: "15px",
                    lineHeight: "1.65",
                    color: "#334155",
                    fontWeight: "600",
                  }}
                >
                  <strong style={{ color: "#0F172A" }}>{profile.kidName || "Nome da criança"}</strong>{" "}
                  usou a ({" "}
                  <span style={{ color: "#16A34A", fontWeight: "700" }}>
                    {stats?.topPhrase?.name || "Quero comer"}
                  </span>{" "}
                  ) ao total de ({" "}
                  <span style={{ color: "#16A34A", fontWeight: "700" }}>
                    {stats?.topPhrase?.count || 8}
                  </span>{" "}
                  ) vezes.
                </p>
              </div>
            </div>
          </div>

          {/* ============================================================
              Right Column: Creation Form (Adicionar Imagem, Texto, Prancha)
             ============================================================ */}
          <form
            onSubmit={handleSavePhrase}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {/* Box 1: Adicionar Imagem */}
            <div
              style={{
                backgroundColor: "#F8FCF9",
                borderRadius: "22px",
                border: "1.5px solid #DCFCE7",
                padding: "20px 24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "14px",
                  color: "#16A34A",
                  fontWeight: "800",
                  fontSize: "16px",
                }}
              >
                <ImageIcon size={20} color="#16A34A" strokeWidth={2.4} />
                <span>Adicionar Imagem</span>
              </div>

              {/* Dropzone container matching Tela4.jpeg */}
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: "2px dashed #86EFAC",
                  borderRadius: "16px",
                  backgroundColor: "#FFFFFF",
                  padding: "24px 16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  textAlign: "center",
                  minHeight: "120px",
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F0FDF4")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FFFFFF")}
              >
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />

                {imagePreview ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <img
                      src={imagePreview}
                      alt="Prévia"
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        border: "1px solid #CBD5E1",
                      }}
                    />
                    <div style={{ textAlign: "left" }}>
                      <p style={{ fontSize: "14px", fontWeight: "700", color: "#16A34A" }}>
                        Imagem selecionada!
                      </p>
                      <span style={{ fontSize: "12px", color: "#64748B" }}>
                        Clique para trocar
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <UploadCloud size={38} color="#22C55E" strokeWidth={1.8} style={{ marginBottom: "8px" }} />
                    <p style={{ fontSize: "13px", color: "#64748B", fontWeight: "600" }}>
                      Clique para enviar ou arraste a imagem aqui
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Box 2: Adicionar texto da frase */}
            <div
              style={{
                backgroundColor: "#F8FCF9",
                borderRadius: "22px",
                border: "1.5px solid #DCFCE7",
                padding: "20px 24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "14px",
                  color: "#16A34A",
                  fontWeight: "800",
                  fontSize: "16px",
                }}
              >
                <Pencil size={20} color="#16A34A" strokeWidth={2.4} />
                <span>Adicionar texto da frase</span>
              </div>

              {/* Input field matching Tela4.jpeg */}
              <input
                type="text"
                value={phraseText}
                onChange={(e) => setPhraseText(e.target.value)}
                placeholder="Digite o texto da frase aqui..."
                required
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  borderRadius: "14px",
                  border: "1.5px solid #E2E8F0",
                  backgroundColor: "#FFFFFF",
                  fontSize: "14px",
                  outline: "none",
                  color: "#1E293B",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#2DB34A")}
                onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
              />
            </div>

            {/* Box 3: Prancha que será adicionada */}
            <div
              style={{
                backgroundColor: "#F8FCF9",
                borderRadius: "22px",
                border: "1.5px solid #DCFCE7",
                padding: "20px 24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "14px",
                  color: "#16A34A",
                  fontWeight: "800",
                  fontSize: "16px",
                }}
              >
                <LayoutGrid size={20} color="#16A34A" strokeWidth={2.4} />
                <span>Prancha que será adicionada</span>
              </div>

              {/* Select Dropdown matching Tela4.jpeg */}
              <select
                value={selectedBoardId}
                onChange={(e) => setSelectedBoardId(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  borderRadius: "14px",
                  border: "1.5px solid #E2E8F0",
                  backgroundColor: "#FFFFFF",
                  fontSize: "14px",
                  outline: "none",
                  color: selectedBoardId ? "#1E293B" : "#94A3B8",
                  cursor: "pointer",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#2DB34A")}
                onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
              >
                <option value="" disabled>
                  Selecione uma prancha...
                </option>
                {boardOptions.map((opt) => (
                  <option key={opt.id} value={opt.id} style={{ color: "#1E293B" }}>
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              style={{
                padding: "14px",
                borderRadius: "14px",
                backgroundColor: "#2DB34A",
                color: "#FFFFFF",
                fontWeight: "800",
                fontSize: "16px",
                boxShadow: "0 6px 18px rgba(45, 179, 74, 0.28)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <Sparkles size={18} />
              <span>Salvar Frase na Prancha</span>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
