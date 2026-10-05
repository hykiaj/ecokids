"use client";

import React, { useState } from "react";
import Logo from "./Logo";
import { KidAvatar } from "./Avatars";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { resolveCustomImageUrl } from "@/lib/supabase";
import {
  Menu,
  Volume2,
  ArrowLeft,
  Plus,
  Sparkles,
} from "lucide-react";

// Ilustrações dedicadas no estilo visual de PranchaRotina.jpeg
function renderPhraseIllustration(boardId, phraseText, themeColor) {
  const normalized = (phraseText || "").toLowerCase().trim();

  // 1. ROTINA (específico da imagem PranchaRotina.jpeg)
  if (normalized.includes("lição") || normalized.includes("escola") || normalized.includes("estudar")) {
    return (
      <svg viewBox="0 0 100 100" style={{ width: "66px", height: "66px" }}>
        {/* Caderno com espiral */}
        <rect x="24" y="16" width="46" height="62" rx="7" fill="#C4B5FD" stroke="#6D28D9" strokeWidth="2.5" transform="rotate(-6 47 47)" />
        <rect x="28" y="20" width="38" height="54" rx="4" fill="#FFFFFF" transform="rotate(-6 47 47)" />
        {/* Linhas de pauta */}
        <line x1="34" y1="36" x2="58" y2="33" stroke="#DDD6FE" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="33" y1="46" x2="57" y2="43" stroke="#DDD6FE" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="32" y1="56" x2="56" y2="53" stroke="#DDD6FE" strokeWidth="2.5" strokeLinecap="round" />
        {/* Espiral */}
        <ellipse cx="23" cy="26" rx="2.5" ry="4" fill="#6D28D9" transform="rotate(-6 23 26)" />
        <ellipse cx="21.5" cy="36" rx="2.5" ry="4" fill="#6D28D9" transform="rotate(-6 21.5 36)" />
        <ellipse cx="20" cy="46" rx="2.5" ry="4" fill="#6D28D9" transform="rotate(-6 20 46)" />
        <ellipse cx="18.5" cy="56" rx="2.5" ry="4" fill="#6D28D9" transform="rotate(-6 18.5 56)" />
        <ellipse cx="17" cy="66" rx="2.5" ry="4" fill="#6D28D9" transform="rotate(-6 17 66)" />
        {/* Caneta ao lado */}
        <g transform="translate(62, 34) rotate(18)">
          <rect x="0" y="0" width="7" height="34" rx="3.5" fill="#7C3AED" stroke="#4C1D95" strokeWidth="1.8" />
          <polygon points="0,34 7,34 3.5,42" fill="#DDD6FE" stroke="#4C1D95" strokeWidth="1.2" />
          <line x1="2" y1="6" x2="2" y2="18" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        </g>
      </svg>
    );
  }

  if (normalized.includes("pentear") || normalized.includes("cabelo")) {
    return (
      <svg viewBox="0 0 100 100" style={{ width: "66px", height: "66px" }}>
        {/* Escova de cabelo roxa inclinada */}
        <g transform="translate(50, 48) rotate(-35) translate(-20, -38)">
          {/* Cabeça da escova */}
          <ellipse cx="20" cy="25" rx="19" ry="24" fill="#C4B5FD" stroke="#6D28D9" strokeWidth="2.5" />
          <ellipse cx="20" cy="25" rx="14" ry="19" fill="#7C3AED" stroke="#5B21B6" strokeWidth="1.5" />
          {/* Cerdas */}
          <circle cx="14" cy="18" r="1.4" fill="#FFFFFF" />
          <circle cx="20" cy="16" r="1.4" fill="#FFFFFF" />
          <circle cx="26" cy="18" r="1.4" fill="#FFFFFF" />
          <circle cx="12" cy="24" r="1.4" fill="#FFFFFF" />
          <circle cx="20" cy="24" r="1.6" fill="#FFFFFF" />
          <circle cx="28" cy="24" r="1.4" fill="#FFFFFF" />
          <circle cx="14" cy="30" r="1.4" fill="#FFFFFF" />
          <circle cx="20" cy="32" r="1.4" fill="#FFFFFF" />
          <circle cx="26" cy="30" r="1.4" fill="#FFFFFF" />
          {/* Cabo da escova */}
          <path d="M 16 46 L 15 72 C 15 75, 25 75, 25 72 L 24 46 Z" fill="#A78BFA" stroke="#6D28D9" strokeWidth="2.5" />
        </g>
      </svg>
    );
  }

  if (normalized.includes("trocar") || normalized.includes("roupa")) {
    return (
      <svg viewBox="0 0 100 100" style={{ width: "68px", height: "68px" }}>
        {/* Guarda-roupa roxo aberto */}
        <rect x="22" y="14" width="56" height="72" rx="9" fill="#DDD6FE" stroke="#6D28D9" strokeWidth="2.5" />
        <rect x="27" y="19" width="46" height="62" rx="6" fill="#F5F3FF" stroke="#A78BFA" strokeWidth="1.5" />
        {/* Barra superior de cabides */}
        <line x1="27" y1="28" x2="73" y2="28" stroke="#6D28D9" strokeWidth="2" strokeLinecap="round" />
        {/* Camiseta Amarela no cabide 1 */}
        <path d="M 37 34 L 33 40 L 37 42 L 38 56 L 46 56 L 47 42 L 51 40 L 47 34 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M 42 28 Q 42 32 40 34" stroke="#D97706" strokeWidth="1.5" fill="none" />
        {/* Vestido / Camiseta Rosa no cabide 2 */}
        <path d="M 55 34 L 51 40 L 54 42 L 53 58 L 65 58 L 64 42 L 67 40 L 63 34 Z" fill="#F472B6" stroke="#BE185D" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M 59 28 Q 59 32 57 34" stroke="#BE185D" strokeWidth="1.5" fill="none" />
        {/* Prateleira inferior com roupas dobradas */}
        <line x1="27" y1="67" x2="73" y2="67" stroke="#C4B5FD" strokeWidth="2" />
        <rect x="36" y="70" width="28" height="6" rx="2.5" fill="#60A5FA" stroke="#2563EB" strokeWidth="1.2" />
      </svg>
    );
  }

  if (normalized.includes("comer") || normalized.includes("fome") || normalized.includes("alimento")) {
    return (
      <svg viewBox="0 0 100 100" style={{ width: "66px", height: "66px" }}>
        {/* Prato de comida com arroz, frango e brócolis */}
        <ellipse cx="50" cy="54" rx="42" ry="30" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="2.5" />
        <ellipse cx="50" cy="53" rx="34" ry="23" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.8" />
        {/* Porção de Arroz branquinho */}
        <ellipse cx="38" cy="48" rx="14" ry="11" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />
        <circle cx="34" cy="46" r="1.2" fill="#CBD5E1" />
        <circle cx="38" cy="44" r="1.2" fill="#CBD5E1" />
        <circle cx="41" cy="49" r="1.2" fill="#CBD5E1" />
        {/* Frango grelhado douradinho */}
        <path d="M 40 60 C 40 52, 58 50, 68 56 C 72 60, 68 68, 56 68 C 44 68, 40 65, 40 60 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1.8" />
        <line x1="48" y1="57" x2="54" y2="61" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="56" y1="56" x2="62" y2="60" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
        {/* Brócolis verdinhos */}
        <circle cx="56" cy="43" r="5" fill="#22C55E" stroke="#15803D" strokeWidth="1.2" />
        <circle cx="63" cy="44" r="5.5" fill="#16A34A" stroke="#15803D" strokeWidth="1.2" />
        <circle cx="59" cy="38" r="4.8" fill="#4ADE80" stroke="#15803D" strokeWidth="1.2" />
      </svg>
    );
  }

  if (normalized.includes("dormir") || normalized.includes("sono") || normalized.includes("noite")) {
    return (
      <svg viewBox="0 0 100 100" style={{ width: "66px", height: "66px" }}>
        {/* Lua dourada com gorro de dormir e 'z z z' */}
        <path
          d="M 56 22 C 34 22, 28 46, 36 64 C 44 80, 68 78, 76 68 C 64 68, 48 58, 50 38 C 50 30, 53 25, 56 22 Z"
          fill="#FBBF24"
          stroke="#D97706"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Olho fechado dormindo e bochecha */}
        <path d="M 43 51 Q 46 54 49 51" stroke="#78350F" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <circle cx="44" cy="55" r="2.2" fill="#F87171" opacity="0.6" />
        {/* Gorro de dormir roxo no topo da lua */}
        <path d="M 47 26 C 45 20, 52 14, 60 18 L 62 26 Z" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="1.8" />
        <circle cx="62" cy="18" r="3.5" fill="#FFFFFF" stroke="#6D28D9" strokeWidth="1.2" />
        {/* Z Z Z flutuando */}
        <text x="68" y="36" fontFamily="sans-serif" fontSize="13" fontWeight="900" fill="#7C3AED">Z</text>
        <text x="74" y="48" fontFamily="sans-serif" fontSize="11" fontWeight="800" fill="#8B5CF6">z</text>
        <text x="78" y="58" fontFamily="sans-serif" fontSize="9" fontWeight="800" fill="#A78BFA">z</text>
      </svg>
    );
  }

  // 2. BEBIDAS (água, suco, leite, sede)
  if (normalized.includes("água") || normalized.includes("copo") || normalized.includes("sede")) {
    return (
      <svg viewBox="0 0 100 100" style={{ width: "64px", height: "64px" }}>
        <path d="M 33 28 L 38 74 C 38 78, 44 80, 50 80 C 56 80, 62 78, 62 74 L 67 28 Z" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2.6" />
        <path d="M 37 44 Q 50 48 63 44 L 60 72 C 60 75, 55 77, 50 77 C 45 77, 40 75, 40 72 Z" fill="#38BDF8" opacity="0.85" />
        {/* Cubos de gelo */}
        <rect x="42" y="50" width="8" height="8" rx="2" fill="#FFFFFF" opacity="0.8" />
        <rect x="51" y="56" width="7" height="7" rx="2" fill="#FFFFFF" opacity="0.8" />
        {/* Gotinhas de água */}
        <circle cx="48" cy="20" r="2.5" fill="#0284C7" />
        <circle cx="58" cy="23" r="2" fill="#0284C7" />
      </svg>
    );
  }

  if (normalized.includes("suco")) {
    return (
      <svg viewBox="0 0 100 100" style={{ width: "64px", height: "64px" }}>
        <path d="M 34 30 L 39 74 C 39 78, 44 80, 50 80 C 56 80, 61 78, 61 74 L 66 30 Z" fill="#FEF3C7" stroke="#D97706" strokeWidth="2.5" />
        <path d="M 37 42 Q 50 46 63 42 L 60 72 C 60 75, 55 77, 50 77 C 45 77, 40 75, 40 72 Z" fill="#F59E0B" opacity="0.9" />
        {/* Canudinho listrado */}
        <line x1="52" y1="14" x2="48" y2="60" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
        <line x1="52" y1="14" x2="62" y2="10" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
        {/* Rodela de laranja */}
        <circle cx="66" cy="30" r="9" fill="#FB923C" stroke="#C2410C" strokeWidth="1.5" />
      </svg>
    );
  }

  if (normalized.includes("leite")) {
    return (
      <svg viewBox="0 0 100 100" style={{ width: "64px", height: "64px" }}>
        <rect x="36" y="32" width="28" height="46" rx="4" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
        <polygon points="36,32 44,22 56,22 64,32" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
        <rect x="45" y="16" width="10" height="6" rx="1.5" fill="#38BDF8" />
        <circle cx="50" cy="52" r="7" fill="#38BDF8" opacity="0.4" />
        <text x="42" y="56" fontSize="10" fontWeight="900" fill="#0284C7">MILK</text>
      </svg>
    );
  }

  // 3. DIVERSÃO (brincar, desenho, tablet, parque)
  if (normalized.includes("brincar") || normalized.includes("brinquedo")) {
    return (
      <svg viewBox="0 0 100 100" style={{ width: "66px", height: "66px" }}>
        {/* Blocos de montar coloridos */}
        <rect x="22" y="46" width="26" height="26" rx="4" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
        <text x="30" y="65" fontSize="16" fontWeight="900" fill="#FFFFFF">A</text>
        <rect x="52" y="46" width="26" height="26" rx="4" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
        <text x="60" y="65" fontSize="16" fontWeight="900" fill="#FFFFFF">B</text>
        <rect x="37" y="22" width="26" height="26" rx="4" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
        <text x="45" y="41" fontSize="16" fontWeight="900" fill="#FFFFFF">C</text>
      </svg>
    );
  }

  if (normalized.includes("tablet") || normalized.includes("jogar") || normalized.includes("assistir")) {
    return (
      <svg viewBox="0 0 100 100" style={{ width: "66px", height: "66px" }}>
        <rect x="20" y="24" width="60" height="48" rx="8" fill="#1E293B" stroke="#0F172A" strokeWidth="2.5" />
        <rect x="25" y="29" width="50" height="38" rx="4" fill="#38BDF8" />
        {/* Estrela alegre na tela */}
        <polygon points="50,33 53,41 62,42 55,48 57,57 50,52 43,57 45,48 38,42 47,41" fill="#FBBF24" />
      </svg>
    );
  }

  // 4. HIGIENE (banho, dentes, mãos, xixi)
  if (normalized.includes("mão") || normalized.includes("lavar")) {
    return (
      <svg viewBox="0 0 100 100" style={{ width: "66px", height: "66px" }}>
        {/* Torneira e mãos com bolhas */}
        <path d="M 44 20 L 56 20 C 60 20, 62 24, 62 30 L 62 38" fill="none" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
        <rect x="42" y="16" width="16" height="6" rx="2" fill="#64748B" />
        {/* Gotas caindo */}
        <circle cx="62" cy="46" r="2.5" fill="#38BDF8" />
        <circle cx="62" cy="54" r="2" fill="#38BDF8" />
        {/* Bolhas de sabão */}
        <circle cx="40" cy="58" r="6" fill="#FCE7F3" stroke="#DB2777" strokeWidth="1.5" />
        <circle cx="48" cy="68" r="5" fill="#FCE7F3" stroke="#DB2777" strokeWidth="1.5" />
        <circle cx="58" cy="66" r="7" fill="#FCE7F3" stroke="#DB2777" strokeWidth="1.5" />
      </svg>
    );
  }

  if (normalized.includes("dente") || normalized.includes("escovar")) {
    return (
      <svg viewBox="0 0 100 100" style={{ width: "66px", height: "66px" }}>
        {/* Dente feliz e reluzente */}
        <path
          d="M 50 25 C 38 25, 30 35, 32 50 C 34 60, 42 78, 45 78 C 48 78, 48 66, 50 66 C 52 66, 52 78, 55 78 C 58 78, 66 60, 68 50 C 70 35, 62 25, 50 25 Z"
          fill="#FFFFFF"
          stroke="#0284C7"
          strokeWidth="2.5"
        />
        {/* Rostinho feliz no dente */}
        <circle cx="44" cy="44" r="1.8" fill="#0284C7" />
        <circle cx="56" cy="44" r="1.8" fill="#0284C7" />
        <path d="M 46 50 Q 50 54 54 50" stroke="#0284C7" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        {/* Brilho reluzente */}
        <path d="M 68 28 L 71 34 L 77 37 L 71 40 L 68 46 L 65 40 L 59 37 L 65 34 Z" fill="#FBBF24" />
      </svg>
    );
  }

  if (normalized.includes("banho")) {
    return (
      <svg viewBox="0 0 100 100" style={{ width: "66px", height: "66px" }}>
        {/* Banheira fofa com patinho amarelo */}
        <path d="M 22 46 L 78 46 C 78 68, 68 76, 50 76 C 32 76, 22 68, 22 46 Z" fill="#F0FDFA" stroke="#0D9488" strokeWidth="2.5" />
        {/* Patinho de borracha */}
        <circle cx="46" cy="38" r="7" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
        <polygon points="52,38 58,40 52,42" fill="#EA580C" />
        <circle cx="48" cy="36" r="1" fill="#78350F" />
        {/* Bolhas */}
        <circle cx="34" cy="42" r="5" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.2" />
        <circle cx="62" cy="40" r="6" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.2" />
      </svg>
    );
  }

  // 5. EMOÇÕES (feliz, triste, bravo, medo, abraço)
  if (normalized.includes("feliz") || normalized.includes("alegre")) {
    return (
      <svg viewBox="0 0 100 100" style={{ width: "66px", height: "66px" }}>
        <circle cx="50" cy="50" r="30" fill="#FEF08A" stroke="#EAB308" strokeWidth="2.5" />
        <circle cx="40" cy="44" r="2.8" fill="#713F12" />
        <circle cx="60" cy="44" r="2.8" fill="#713F12" />
        <circle cx="36" cy="51" r="3" fill="#F87171" opacity="0.6" />
        <circle cx="64" cy="51" r="3" fill="#F87171" opacity="0.6" />
        <path d="M 38 54 Q 50 68 62 54" stroke="#713F12" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  if (normalized.includes("triste")) {
    return (
      <svg viewBox="0 0 100 100" style={{ width: "66px", height: "66px" }}>
        <circle cx="50" cy="50" r="30" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="2.5" />
        <circle cx="40" cy="46" r="2.8" fill="#0369A1" />
        <circle cx="60" cy="46" r="2.8" fill="#0369A1" />
        <path d="M 40 60 Q 50 50 60 60" stroke="#0369A1" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <circle cx="63" cy="52" r="2.2" fill="#0284C7" />
      </svg>
    );
  }

  if (normalized.includes("abraço") || normalized.includes("carinho")) {
    return (
      <svg viewBox="0 0 100 100" style={{ width: "66px", height: "66px" }}>
        <path
          d="M 50 32 C 44 22, 28 25, 28 40 C 28 54, 50 72, 50 72 C 50 72, 72 54, 72 40 C 72 25, 56 22, 50 32 Z"
          fill="#F43F5E"
          stroke="#BE123C"
          strokeWidth="2.5"
        />
        {/* Dois bracinhos fofos abraçando */}
        <path d="M 26 44 C 36 38, 44 48, 52 48" stroke="#FFE4E6" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 74 44 C 64 38, 56 48, 48 48" stroke="#FFE4E6" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  // 6. SOCIAL (olá, tchau, obrigado, por favor)
  if (normalized.includes("olá") || normalized.includes("tchau") || normalized.includes("oi")) {
    return (
      <svg viewBox="0 0 100 100" style={{ width: "66px", height: "66px" }}>
        {/* Mãozinha acenando */}
        <g transform="translate(50, 50) rotate(10) translate(-25, -25)">
          <path
            d="M 16 32 C 16 28, 20 28, 20 32 L 20 18 C 20 15, 24 15, 24 18 L 24 14 C 24 11, 28 11, 28 14 L 28 16 C 28 13, 32 13, 32 16 L 32 32 C 34 32, 38 32, 38 26 C 38 22, 42 24, 40 28 C 38 36, 32 44, 28 46 L 16 46 Z"
            fill="#FBBF24"
            stroke="#D97706"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </g>
        <line x1="68" y1="28" x2="74" y2="24" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" />
        <line x1="72" y1="36" x2="80" y2="34" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // Fallback genérico fofo e colorido
  return (
    <svg viewBox="0 0 100 100" style={{ width: "64px", height: "64px" }}>
      <circle cx="50" cy="50" r="30" fill="#FFFFFF" stroke={themeColor} strokeWidth="2.5" />
      <polygon points="50,28 56,42 70,43 59,52 63,66 50,58 37,66 41,52 30,43 44,42" fill={themeColor} opacity="0.85" />
    </svg>
  );
}

// Pequenas ilustrações decorativas flutuantes nos cantos de cada cartão
function CornerDoodles({ color = "#C4B5FD" }) {
  return (
    <>
      <svg
        style={{
          position: "absolute",
          top: "12px",
          left: "12px",
          width: "20px",
          height: "20px",
          opacity: 0.5,
          pointerEvents: "none",
        }}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>

      <svg
        style={{
          position: "absolute",
          top: "14px",
          right: "14px",
          width: "18px",
          height: "18px",
          opacity: 0.55,
          pointerEvents: "none",
        }}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>

      <svg
        style={{
          position: "absolute",
          bottom: "12px",
          right: "12px",
          width: "16px",
          height: "16px",
          opacity: 0.45,
          pointerEvents: "none",
        }}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
      >
        <circle cx="12" cy="12" r="6" />
      </svg>
    </>
  );
}

export default function KidsHome({ onOpenMenu }) {
  const { profile, recordBoardClick, recordPhraseClick, customPhrases } = useAuth();
  const { isDark } = useTheme();
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [speakingText, setSpeakingText] = useState("");

  const speak = (text) => {
    setSpeakingText(text);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";
      utterance.rate = 0.95;
      utterance.onend = () => setSpeakingText("");
      utterance.onerror = () => setSpeakingText("");
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setSpeakingText(""), 2000);
    }
  };

  const boards = [
    {
      id: "alimentacao",
      title: "Alimentação",
      themeColor: "#D97706",
      deepColor: "#78350F",
      borderColor: "#F6C28B",
      bgTop: "#FFF5EB",
      bgScreen: "#FFF8F0",
      phrases: [
        "Quero comer",
        "Estou com fome",
        "Gostoso",
        "Fruta",
        "Mais um pouco",
      ],
      renderIcon: () => (
        <svg viewBox="0 0 100 100" style={{ width: "68px", height: "68px" }}>
          <circle cx="50" cy="50" r="34" fill="#FFFFFF" stroke="#FDE68A" strokeWidth="2" />
          <path d="M 36 28 C 32 28, 30 35, 33 42 C 34 44, 36 45, 36 68 L 38 68 C 38 45, 40 44, 41 42 C 44 35, 42 28, 38 28 Z" fill="#92400E" />
          <path d="M 48 26 L 48 40 C 48 45, 49 45, 49 68 L 51 68 C 51 45, 52 45, 52 40 L 52 26 L 50.5 26 L 50.5 35 L 49.5 35 L 49.5 26 Z" fill="#92400E" />
          <path d="M 62 26 C 65 26, 65 38, 64 45 C 63 46, 63 48, 63 68 L 61 68 C 61 48, 61 46, 61 26 Z" fill="#92400E" />
        </svg>
      ),
    },
    {
      id: "bebidas",
      title: "Bebidas",
      themeColor: "#0284C7",
      deepColor: "#0369A1",
      borderColor: "#A8D5F6",
      bgTop: "#EBF5FE",
      bgScreen: "#F0F8FE",
      phrases: [
        "Quero água",
        "Estou com sede",
        "Suco",
        "Leite geladinho",
        "Mais um copo",
      ],
      renderIcon: () => (
        <svg viewBox="0 0 100 100" style={{ width: "68px", height: "68px" }}>
          <circle cx="50" cy="50" r="34" fill="#FFFFFF" stroke="#BAE6FD" strokeWidth="2" />
          <path d="M 37 32 L 41 68 C 41 71, 44 72, 50 72 C 56 72, 59 71, 59 68 L 63 32 Z" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2.5" />
          <path d="M 40 45 Q 50 48 60 45 L 58 66 C 58 69, 55 70, 50 70 C 45 70, 42 69, 42 66 Z" fill="#38BDF8" opacity="0.8" />
          <circle cx="44" cy="27" r="2.2" fill="#0284C7" />
          <circle cx="55" cy="24" r="2.6" fill="#0284C7" />
        </svg>
      ),
    },
    {
      id: "diversao",
      title: "Diversão",
      themeColor: "#CA8A04",
      deepColor: "#854D0E",
      borderColor: "#FDE047",
      bgTop: "#FEFDE8",
      bgScreen: "#FEFCE8",
      phrases: [
        "Quero brincar",
        "Desenhar",
        "Jogar no tablet",
        "Assistir desenho",
        "Parque",
      ],
      renderIcon: () => (
        <svg viewBox="0 0 100 100" style={{ width: "68px", height: "68px" }}>
          <circle cx="50" cy="50" r="34" fill="#FFFFFF" stroke="#FEF08A" strokeWidth="2" />
          <path
            d="M 50 25 L 56 38 L 70 40 L 59 50 L 62 64 L 50 57 L 38 64 L 41 50 L 30 40 L 44 38 Z"
            fill="#FBBF24"
            stroke="#D97706"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <circle cx="46" cy="46" r="1.5" fill="#78350F" />
          <circle cx="54" cy="46" r="1.5" fill="#78350F" />
          <path d="M 47 50 Q 50 53 53 50" stroke="#78350F" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: "emocoes",
      title: "Emoções",
      themeColor: "#E11D48",
      deepColor: "#9F1239",
      borderColor: "#F9A8D4",
      bgTop: "#FDF2F4",
      bgScreen: "#FFF1F2",
      phrases: [
        "Estou feliz",
        "Estou triste",
        "Estou bravo",
        "Estou com medo",
        "Preciso de um abraço",
      ],
      renderIcon: () => (
        <svg viewBox="0 0 100 100" style={{ width: "68px", height: "68px" }}>
          <circle cx="50" cy="50" r="34" fill="#FFFFFF" stroke="#FBCFE8" strokeWidth="2" />
          <path
            d="M 50 35 C 44 26, 31 29, 31 41 C 31 52, 50 67, 50 67 C 50 67, 69 52, 69 41 C 69 29, 56 26, 50 35 Z"
            fill="#F43F5E"
            stroke="#BE123C"
            strokeWidth="2.5"
          />
          <path d="M 37 38 C 37 35, 41 33, 44 34" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      ),
    },
    {
      id: "social",
      title: "Social",
      themeColor: "#16A34A",
      deepColor: "#14532D",
      borderColor: "#A7F3D0",
      bgTop: "#EDF8F0",
      bgScreen: "#F0FDF4",
      phrases: [
        "Olá!",
        "Tudo bem?",
        "Obrigado",
        "Por favor",
        "Tchau!",
      ],
      renderIcon: () => (
        <svg viewBox="0 0 100 100" style={{ width: "68px", height: "68px" }}>
          <circle cx="50" cy="50" r="34" fill="#FFFFFF" stroke="#BBF7D0" strokeWidth="2" />
          <circle cx="43" cy="40" r="8" fill="#4ADE80" stroke="#15803D" strokeWidth="2" />
          <path d="M 31 62 C 31 52, 38 51, 43 51 C 48 51, 55 52, 55 62 Z" fill="#4ADE80" stroke="#15803D" strokeWidth="2" />
          <circle cx="58" cy="42" r="7.5" fill="#86EFAC" stroke="#15803D" strokeWidth="2" />
          <path d="M 48 64 C 48 55, 54 54, 58 54 C 63 54, 69 55, 69 64 Z" fill="#86EFAC" stroke="#15803D" strokeWidth="2" />
        </svg>
      ),
    },
    {
      id: "rotina",
      title: "Rotina",
      themeColor: "#7C3AED",
      deepColor: "#3B1A66",
      borderColor: "#C4B5FD",
      bgTop: "#F5F2FF",
      bgScreen: "#F4F0FD",
      phrases: [
        "Lição de casa",
        "Pentear cabelo",
        "Trocar de roupa",
        "Quero comer",
        "Quero dormir",
      ],
      renderIcon: () => (
        <svg viewBox="0 0 100 100" style={{ width: "68px", height: "68px" }}>
          <circle cx="50" cy="50" r="34" fill="#FFFFFF" stroke="#DDD6FE" strokeWidth="2" />
          <circle cx="50" cy="50" r="22" fill="#F5F3FF" stroke="#7C3AED" strokeWidth="3" />
          <line x1="50" y1="50" x2="50" y2="36" stroke="#5B21B6" strokeWidth="3" strokeLinecap="round" />
          <line x1="50" y1="50" x2="60" y2="50" stroke="#5B21B6" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="50" cy="50" r="3" fill="#7C3AED" />
        </svg>
      ),
    },
    {
      id: "lugares",
      title: "Lugares",
      themeColor: "#0D9488",
      deepColor: "#115E59",
      borderColor: "#99F6E4",
      bgTop: "#F0FDFA",
      bgScreen: "#ECFDF5",
      phrases: [
        "Quero ir para casa",
        "Parquinho",
        "Escola",
        "Casa da vovó",
        "Praia",
      ],
      renderIcon: () => (
        <svg viewBox="0 0 100 100" style={{ width: "68px", height: "68px" }}>
          <circle cx="50" cy="50" r="34" fill="#FFFFFF" stroke="#A7F3D0" strokeWidth="2" />
          <path
            d="M 50 26 C 41 26, 35 32, 35 41 C 35 52, 50 69, 50 69 C 50 69, 65 52, 65 41 C 65 32, 59 26, 50 26 Z"
            fill="#14B8A6"
            stroke="#0F766E"
            strokeWidth="2.5"
          />
          <circle cx="50" cy="40" r="6" fill="#FFFFFF" />
        </svg>
      ),
    },
    {
      id: "favoritos",
      title: "Favoritos",
      themeColor: "#D97706",
      deepColor: "#78350F",
      borderColor: "#FDE68A",
      bgTop: "#FFFDF0",
      bgScreen: "#FEFCE8",
      phrases: [
        "Música favorita",
        "Brinquedo favorito",
        "Meu desenho",
        "Minha comida preferida",
        "História favorita",
      ],
      renderIcon: () => (
        <svg viewBox="0 0 100 100" style={{ width: "68px", height: "68px" }}>
          <circle cx="50" cy="50" r="34" fill="#FFFFFF" stroke="#FEF08A" strokeWidth="2" />
          <path
            d="M 50 35 C 44 26, 31 29, 31 41 C 31 52, 50 67, 50 67 C 50 67, 69 52, 69 41 C 69 29, 56 26, 50 35 Z"
            fill="#FDE047"
            stroke="#D97706"
            strokeWidth="2.5"
          />
        </svg>
      ),
    },
    {
      id: "higiene",
      title: "Higiene",
      themeColor: "#DB2777",
      deepColor: "#831843",
      borderColor: "#FBCFE8",
      bgTop: "#FDF2F8",
      bgScreen: "#FFF1F8",
      phrases: [
        "Lavar as mãos",
        "Escovar os dentes",
        "Tomar banho",
        "Fazer xixi",
        "Pentear o cabelo",
      ],
      renderIcon: () => (
        <svg viewBox="0 0 100 100" style={{ width: "68px", height: "68px" }}>
          <circle cx="50" cy="50" r="34" fill="#FFFFFF" stroke="#FCE7F3" strokeWidth="2" />
          <path d="M 40 44 C 40 38, 60 38, 60 44 L 60 66 C 60 70, 40 70, 40 66 Z" fill="#F472B6" stroke="#BE185D" strokeWidth="2.5" />
          <rect x="47" y="34" width="6" height="6" fill="#FDF2F8" stroke="#BE185D" strokeWidth="2" />
          <path d="M 44 34 L 56 34 L 56 30 L 40 30 C 40 30, 41 33, 44 34 Z" fill="#FDF2F8" stroke="#BE185D" strokeWidth="2" />
          <circle cx="36" cy="33" r="2.5" fill="#BE185D" />
        </svg>
      ),
    },
  ];

  const handleCardClick = (board) => {
    speak(board.title);
    recordBoardClick(board.id, board.title);
    setSelectedBoard(board);
  };

  const handlePhraseClick = (phraseText, board) => {
    speak(phraseText);
    recordPhraseClick(phraseText, board.id);
  };

  const handleAddCustomPrompt = () => {
    speak("Você pode adicionar frases personalizadas na Área dos Pais!");
  };

  // Frases customizadas cadastradas pelos pais para este board
  const boardCustomPhrases = selectedBoard
    ? customPhrases.filter(
        (p) => p.boardId === selectedBoard.id || p.board_id === selectedBoard.id
      )
    : [];

  // =========================================================================
  // TELA DEDICADA DA PRANCHA SELECIONADA (estilo PranchaRotina.jpeg)
  // =========================================================================
  if (selectedBoard) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: isDark ? "#0B1320" : (selectedBoard.bgScreen || selectedBoard.bgTop),
          padding: "20px 24px 36px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          transition: "background-color 0.25s ease",
        }}
      >
        {/* Logo Eco Kids no canto superior esquerdo exatamente como na imagem */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "24px",
            zIndex: 10,
          }}
        >
          <Logo size="sm" />
        </div>

        {/* Mancha orgânica superior direita com a cor do board */}
        <div
          style={{
            position: "absolute",
            top: "-90px",
            right: "-70px",
            width: "360px",
            height: "360px",
            borderRadius: "45% 55% 40% 60% / 50% 40% 60% 50%",
            backgroundColor: selectedBoard.borderColor,
            opacity: isDark ? 0.25 : 0.6,
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        {/* Padrão de pontinhos superior direito */}
        <div
          style={{
            position: "absolute",
            top: "28px",
            right: "120px",
            width: "100px",
            height: "70px",
            backgroundImage: `radial-gradient(${selectedBoard.themeColor} 2.5px, transparent 2.5px)`,
            backgroundSize: "16px 16px",
            opacity: isDark ? 0.35 : 0.6,
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        {/* Mancha orgânica inferior esquerda */}
        <div
          style={{
            position: "absolute",
            bottom: "-120px",
            left: "-80px",
            width: "380px",
            height: "320px",
            borderRadius: "60% 40% 55% 45% / 45% 60% 40% 55%",
            backgroundColor: selectedBoard.borderColor,
            opacity: isDark ? 0.25 : 0.55,
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        {/* Padrão de pontinhos lateral esquerdo */}
        <div
          style={{
            position: "absolute",
            bottom: "180px",
            left: "12px",
            width: "36px",
            height: "120px",
            backgroundImage: `radial-gradient(${selectedBoard.themeColor} 2.5px, transparent 2.5px)`,
            backgroundSize: "16px 16px",
            opacity: isDark ? 0.35 : 0.55,
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        {/* Quadro Principal Estilo Tablet com Bordas Arredondadas */}
        <main
          className="animate-modal"
          style={{
            width: "100%",
            maxWidth: "1060px",
            backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
            borderRadius: "32px",
            boxShadow: isDark
              ? "0 16px 48px rgba(0, 0, 0, 0.5), 0 4px 16px rgba(0, 0, 0, 0.3)"
              : `0 16px 40px rgba(0, 0, 0, 0.05), 0 4px 16px ${selectedBoard.themeColor}12`,
            border: isDark ? "2px solid #334155" : `2px solid ${selectedBoard.borderColor}90`,
            padding: "24px 32px 32px 32px",
            position: "relative",
            zIndex: 1,
            marginTop: "16px",
            transition: "background-color 0.25s ease, border-color 0.25s ease",
          }}
        >
          {/* Cabeçalho da Prancha: Botão Voltar, Título Centralizado e Menu */}
          <header
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "28px",
              position: "relative",
            }}
          >
            {/* Botão de Voltar redondo/pill como na imagem */}
            <button
              onClick={() => setSelectedBoard(null)}
              aria-label="Voltar para pranchas"
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "14px",
                backgroundColor: isDark ? "#0F172A" : selectedBoard.bgTop,
                border: isDark ? "1.5px solid #334155" : `1.5px solid ${selectedBoard.borderColor}`,
                color: selectedBoard.themeColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.borderColor = selectedBoard.themeColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.borderColor = isDark ? "#334155" : selectedBoard.borderColor;
              }}
            >
              <ArrowLeft size={22} strokeWidth={2.6} />
            </button>

            {/* Título Centralizado com a tipografia e cor do tema */}
            <h1
              style={{
                fontSize: "36px",
                fontWeight: "900",
                color: isDark ? "#F8FAFC" : (selectedBoard.deepColor || selectedBoard.themeColor),
                letterSpacing: "-0.5px",
                margin: 0,
                textAlign: "center",
              }}
            >
              {selectedBoard.title}
            </h1>

            {/* Controles da Direita: Alternador de Tema e Menu Hambúrguer */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <ThemeToggle />
              <button
                onClick={onOpenMenu}
                aria-label="Abrir menu"
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "14px",
                  backgroundColor: isDark ? "#0F172A" : "transparent",
                  border: isDark ? "1.5px solid #334155" : "none",
                  color: selectedBoard.themeColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? "#334155" : selectedBoard.bgTop;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? "#0F172A" : "transparent";
                }}
              >
                <Menu size={30} strokeWidth={2.4} />
              </button>
            </div>
          </header>

          {/* Banner de áudio falando em tempo real */}
          {speakingText && (
            <div
              style={{
                backgroundColor: isDark ? "#14532D40" : selectedBoard.bgTop,
                border: `1.5px solid ${selectedBoard.borderColor}`,
                color: isDark ? "#4ADE80" : (selectedBoard.deepColor || selectedBoard.themeColor),
                padding: "10px 20px",
                borderRadius: "14px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontWeight: "800",
                fontSize: "16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
              }}
            >
              <Volume2 size={20} className="animate-pulse" />
              <span>Falando: &ldquo;{speakingText}&rdquo;</span>
            </div>
          )}

          {/* Grade de Frases 3 x 2 idêntica a PranchaRotina.jpeg */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
            }}
          >
            {/* 5 Frases principais com ilustração */}
            {selectedBoard.phrases.map((phraseText, idx) => (
              <div
                key={idx}
                onClick={() => handlePhraseClick(phraseText, selectedBoard)}
                className="eco-card-interactive"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handlePhraseClick(phraseText, selectedBoard)}
                style={{
                  borderRadius: "24px",
                  border: isDark ? `2px solid ${selectedBoard.borderColor}70` : `2px solid ${selectedBoard.borderColor}`,
                  background: isDark
                    ? "#0F172A"
                    : `linear-gradient(180deg, ${selectedBoard.bgTop} 0%, #FFFFFF 60%)`,
                  padding: "20px 14px 18px 14px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                  minHeight: "195px",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  boxShadow: isDark ? "0 4px 14px rgba(0, 0, 0, 0.3)" : "0 4px 14px rgba(0, 0, 0, 0.03)",
                }}
              >
                {/* Elementos decorativos nos cantos */}
                <CornerDoodles color={selectedBoard.borderColor} />

                {/* Badge Circular Central com a Ilustração */}
                <div
                  style={{
                    width: "92px",
                    height: "92px",
                    borderRadius: "50%",
                    backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
                    border: `2px solid ${selectedBoard.borderColor}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  {renderPhraseIllustration(selectedBoard.id, phraseText, selectedBoard.themeColor)}
                </div>

                {/* Título da Frase / Ação */}
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: "800",
                    color: isDark ? "#F8FAFC" : (selectedBoard.deepColor || "#1E293B"),
                    textAlign: "center",
                    marginTop: "12px",
                    lineHeight: "1.25",
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  {phraseText}
                </span>
              </div>
            ))}

            {/* Frases customizadas adicionadas na Área dos Pais (com a imagem do banco de dados image_url) */}
            {boardCustomPhrases.map((customP) => {
              const phraseText = customP.text || customP.phrase_text || "";
              const rawImgUrl = customP.image_url || customP.imageUrl || "";
              const resolvedImgUrl = resolveCustomImageUrl(rawImgUrl);

              return (
                <div
                  key={customP.id}
                  onClick={() => handlePhraseClick(phraseText, selectedBoard)}
                  className="eco-card-interactive"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && handlePhraseClick(phraseText, selectedBoard)}
                  style={{
                    borderRadius: "24px",
                    border: isDark ? `2px solid ${selectedBoard.borderColor}70` : `2px solid ${selectedBoard.borderColor}`,
                    background: isDark
                      ? "#0F172A"
                      : `linear-gradient(180deg, ${selectedBoard.bgTop} 0%, #FFFFFF 60%)`,
                    padding: "20px 14px 18px 14px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    minHeight: "195px",
                    position: "relative",
                    overflow: "hidden",
                    cursor: "pointer",
                    boxShadow: isDark ? "0 4px 14px rgba(0, 0, 0, 0.3)" : "0 4px 14px rgba(0, 0, 0, 0.03)",
                  }}
                >
                  <CornerDoodles color={selectedBoard.borderColor} />
                  <div
                    style={{
                      width: "92px",
                      height: "92px",
                      borderRadius: "50%",
                      backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
                      border: `2px solid ${selectedBoard.borderColor}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                      position: "relative",
                      zIndex: 2,
                      overflow: "hidden",
                    }}
                  >
                    {resolvedImgUrl ? (
                      <img
                        src={resolvedImgUrl}
                        alt={phraseText}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      renderPhraseIllustration(selectedBoard.id, phraseText, selectedBoard.themeColor)
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: "18px",
                      fontWeight: "800",
                      color: isDark ? "#F8FAFC" : (selectedBoard.deepColor || "#1E293B"),
                      textAlign: "center",
                      marginTop: "12px",
                      lineHeight: "1.25",
                      position: "relative",
                      zIndex: 2,
                    }}
                  >
                    {phraseText}
                  </span>
                </div>
              );
            })}

            {/* 6º Cartão: Botão '+' Tracejado como na imagem de referência */}
            <div
              onClick={handleAddCustomPrompt}
              className="eco-card-interactive"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleAddCustomPrompt()}
              style={{
                borderRadius: "24px",
                border: `2px dashed ${selectedBoard.borderColor}`,
                backgroundColor: isDark ? "#0F172A60" : `${selectedBoard.bgTop}60`,
                padding: "20px 14px 18px 14px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "195px",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <div
                style={{
                  width: "88px",
                  height: "88px",
                  borderRadius: "50%",
                  border: `2px dashed ${selectedBoard.borderColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
                }}
              >
                <Plus size={36} strokeWidth={2.6} color={selectedBoard.themeColor} />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // =========================================================================
  // TELA PRINCIPAL DAS 9 PRANCHAS
  // =========================================================================
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: isDark ? "#0B1320" : "#EBF6EE",
        padding: "24px 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        transition: "background-color 0.25s ease",
      }}
    >
      {/* Padrão decorativo de pontinhos */}
      <div
        style={{
          position: "fixed",
          top: "40px",
          right: "80px",
          width: "120px",
          height: "100px",
          backgroundImage: `radial-gradient(${isDark ? "#166534" : "#86efac"} 2.8px, transparent 2.8px)`,
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
          backgroundImage: `radial-gradient(${isDark ? "#166534" : "#86efac"} 2.8px, transparent 2.8px)`,
          backgroundSize: "16px 16px",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Main Tablet-Like Frame */}
      <main
        style={{
          width: "100%",
          maxWidth: "1060px",
          backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
          borderRadius: "32px",
          boxShadow: isDark
            ? "0 16px 48px rgba(0, 0, 0, 0.5), 0 4px 16px rgba(0, 0, 0, 0.3)"
            : "0 16px 48px rgba(34, 197, 94, 0.12), 0 4px 16px rgba(0,0,0,0.04)",
          border: isDark ? "2px solid #334155" : "2px solid #DCFCE7",
          padding: "28px 40px 40px 40px",
          position: "relative",
          zIndex: 1,
          transition: "background-color 0.25s ease, border-color 0.25s ease",
        }}
      >
        {/* Top Header of the Internal Page */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "32px",
            paddingBottom: "8px",
          }}
        >
          {/* Left: Logo & Kid Avatar Greeting */}
          <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            <Logo size="sm" />

            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <KidAvatar size={48} />
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "800",
                  color: isDark ? "#F8FAFC" : "#1E293B",
                  letterSpacing: "-0.2px",
                }}
              >
                Olá, {profile.kidName || "Nome da criança"}
              </h2>
            </div>
          </div>

          {/* Right: Theme Toggle & Hamburger Menu Button */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <ThemeToggle />
            <button
              onClick={onOpenMenu}
              aria-label="Abrir menu"
              style={{
                padding: "10px",
                borderRadius: "12px",
                color: isDark ? "#4ADE80" : "#22C55E",
                backgroundColor: isDark ? "#0F172A" : "transparent",
                border: isDark ? "1.5px solid #334155" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isDark ? "#334155" : "#F0FDF4")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isDark ? "#0F172A" : "transparent")}
            >
              <Menu size={34} strokeWidth={2.4} />
            </button>
          </div>
        </header>

        {/* Real-time speaking banner */}
        {speakingText && (
          <div
            style={{
              backgroundColor: isDark ? "#14532D40" : "#DCFCE7",
              color: isDark ? "#4ADE80" : "#166534",
              padding: "10px 20px",
              borderRadius: "14px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontWeight: "700",
              fontSize: "15px",
            }}
          >
            <Volume2 size={20} className="animate-pulse" />
            <span>Falando: &ldquo;{speakingText}&rdquo;</span>
          </div>
        )}

        {/* 9 Communication Boards Grid (3 x 3) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
          }}
        >
          {boards.map((board) => (
            <div
              key={board.id}
              onClick={() => handleCardClick(board)}
              className="eco-card-interactive"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleCardClick(board)}
              style={{
                borderRadius: "22px",
                border: isDark ? `2px solid ${board.borderColor}70` : `2px solid ${board.borderColor}`,
                overflow: "hidden",
                cursor: "pointer",
                backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
                display: "flex",
                flexDirection: "column",
                boxShadow: isDark ? "0 4px 14px rgba(0, 0, 0, 0.25)" : "0 4px 12px rgba(0, 0, 0, 0.03)",
              }}
            >
              {/* Top part with background color and icon illustration */}
              <div
                style={{
                  backgroundColor: isDark ? "#1E293B" : board.bgTop,
                  padding: "18px 0 12px 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "110px",
                  position: "relative",
                }}
              >
                {board.renderIcon()}
              </div>

              {/* Bottom part with board title in color */}
              <div
                style={{
                  backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
                  padding: "14px 12px",
                  textAlign: "center",
                  borderTop: isDark ? `1px solid ${board.borderColor}40` : `1px solid ${board.borderColor}50`,
                }}
              >
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: "800",
                    color: board.themeColor,
                    letterSpacing: "-0.2px",
                  }}
                >
                  {board.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
