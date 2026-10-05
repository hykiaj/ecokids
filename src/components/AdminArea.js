"use client";

import React, { useState, useEffect } from "react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "@/context/ThemeContext";
import { getAllProfiles } from "@/lib/supabase";
import {
  Users,
  LogOut,
  Search,
  ShieldCheck,
  RefreshCw,
  Baby,
  User,
  Mail,
  Calendar,
  AlertCircle,
} from "lucide-react";

export default function AdminArea({ onLogout }) {
  const { isDark } = useTheme();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadProfiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getAllProfiles();
      setProfiles(list);
    } catch (err) {
      console.error("Falha ao listar usuários:", err);
      setError("Não foi possível carregar os usuários. Verifique suas permissões de administrador no Supabase.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const filteredProfiles = profiles.filter((p) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    const emailMatch = p.email?.toLowerCase().includes(term);
    const kidMatch = p.kidName?.toLowerCase().includes(term);
    const parentMatch = p.parentName?.toLowerCase().includes(term);
    return emailMatch || kidMatch || parentMatch;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: isDark ? "#0B1320" : "#F7FAF8",
        color: isDark ? "#F8FAFC" : "#1E293B",
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        transition: "background-color 0.25s ease",
      }}
    >
      {/* Top Navbar */}
      <header
        style={{
          backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
          borderBottom: isDark ? "1px solid #334155" : "1px solid #E2E8F0",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: isDark ? "0 1px 3px rgba(0,0,0,0.3)" : "0 1px 3px rgba(0,0,0,0.05)",
          position: "sticky",
          top: 0,
          zIndex: 10,
          transition: "background-color 0.25s ease, border-color 0.25s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Logo />
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: isDark ? "#14532D40" : "#DCFCE7",
              color: isDark ? "#4ADE80" : "#166534",
              border: isDark ? "1px solid #166534" : "none",
              padding: "4px 12px",
              borderRadius: "9999px",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            <ShieldCheck size={16} />
            Painel do Administrador
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <ThemeToggle />

          <button
            onClick={onLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: isDark ? "#450A0A40" : "#FEE2E2",
              color: isDark ? "#FCA5A5" : "#991B1B",
              border: isDark ? "1px solid #991B1B" : "1px solid #FCA5A5",
              borderRadius: "10px",
              padding: "8px 16px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? "#7F1D1D" : "#FCA5A5";
              e.currentTarget.style.color = "#FFFFFF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? "#450A0A40" : "#FEE2E2";
              e.currentTarget.style.color = isDark ? "#FCA5A5" : "#991B1B";
            }}
          >
            <LogOut size={16} />
            Sair da Conta
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          maxWidth: "1140px",
          width: "100%",
          margin: "0 auto",
          padding: "32px 20px",
        }}
      >
        {/* Page Title & Stats */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "26px",
                fontWeight: 700,
                color: isDark ? "#F8FAFC" : "#1E293B",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Users size={28} color="#2DB34A" />
              Usuários Cadastrados
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: isDark ? "#94A3B8" : "#64748B",
                margin: "4px 0 0 0",
              }}
            >
              Gerenciamento e visualização de todos os responsáveis e crianças no Eco Kids.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
                border: isDark ? "1px solid #334155" : "1px solid #E2E8F0",
                padding: "8px 16px",
                borderRadius: "12px",
                fontSize: "14px",
                color: isDark ? "#E2E8F0" : "#334155",
                fontWeight: 600,
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              }}
            >
              Total: <span style={{ color: "#2DB34A" }}>{profiles.length}</span> usuários
            </div>

            <button
              onClick={loadProfiles}
              disabled={loading}
              title="Recarregar usuários"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
                border: isDark ? "1px solid #334155" : "1px solid #CBD5E1",
                borderRadius: "12px",
                padding: "8px 14px",
                fontSize: "14px",
                color: isDark ? "#E2E8F0" : "#334155",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              }}
            >
              <RefreshCw size={15} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
              Atualizar
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              backgroundColor: isDark ? "#450A0A40" : "#FEF2F2",
              border: isDark ? "1px solid #991B1B" : "1px solid #F87171",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              color: isDark ? "#FCA5A5" : "#991B1B",
              fontSize: "14px",
            }}
          >
            <AlertCircle size={20} />
            <span style={{ flex: 1 }}>{error}</span>
            <button
              onClick={loadProfiles}
              style={{
                backgroundColor: "#EF4444",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "6px",
                padding: "6px 12px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {/* Search Input Box */}
        <div
          style={{
            backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
            border: isDark ? "1px solid #334155" : "1px solid #E2E8F0",
            borderRadius: "14px",
            padding: "16px",
            marginBottom: "20px",
            boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.2)" : "0 2px 8px rgba(0,0,0,0.02)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <Search size={20} color={isDark ? "#64748B" : "#94A3B8"} />
          <input
            type="text"
            placeholder="Filtrar por e-mail, nome da criança ou nome do responsável..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "15px",
              color: isDark ? "#F8FAFC" : "#1E293B",
              backgroundColor: "transparent",
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              style={{
                border: "none",
                background: "transparent",
                color: isDark ? "#94A3B8" : "#94A3B8",
                fontSize: "13px",
                cursor: "pointer",
                padding: "4px 8px",
              }}
            >
              Limpar
            </button>
          )}
        </div>

        {/* Table Card */}
        <div
          style={{
            backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
            borderRadius: "16px",
            border: isDark ? "1px solid #334155" : "1px solid #E2E8F0",
            boxShadow: isDark ? "0 4px 16px rgba(0,0,0,0.25)" : "0 4px 16px rgba(0,0,0,0.04)",
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
                    borderBottom: isDark ? "1px solid #334155" : "1px solid #E2E8F0",
                  }}
                >
                  <th
                    style={{
                      padding: "14px 20px",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: isDark ? "#94A3B8" : "#475569",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Mail size={14} />
                      Login (E-mail)
                    </div>
                  </th>
                  <th
                    style={{
                      padding: "14px 20px",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: isDark ? "#94A3B8" : "#475569",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Baby size={14} />
                      Nome da Criança
                    </div>
                  </th>
                  <th
                    style={{
                      padding: "14px 20px",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: isDark ? "#94A3B8" : "#475569",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <User size={14} />
                      Nome do Usuário
                    </div>
                  </th>
                  <th
                    style={{
                      padding: "14px 20px",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: isDark ? "#94A3B8" : "#475569",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Calendar size={14} />
                      Cadastro
                    </div>
                  </th>
                  <th
                    style={{
                      padding: "14px 20px",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: isDark ? "#94A3B8" : "#475569",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      textAlign: "center",
                    }}
                  >
                    Função
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        padding: "48px 20px",
                        textAlign: "center",
                        color: isDark ? "#94A3B8" : "#64748B",
                      }}
                    >
                      <div
                        style={{
                          display: "inline-block",
                          width: "32px",
                          height: "32px",
                          border: isDark ? "3px solid #166534" : "3px solid #DCFCE7",
                          borderTopColor: "#2DB34A",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                          marginBottom: "8px",
                        }}
                      />
                      <div>Carregando lista de usuários...</div>
                    </td>
                  </tr>
                ) : filteredProfiles.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        padding: "48px 20px",
                        textAlign: "center",
                        color: isDark ? "#94A3B8" : "#64748B",
                      }}
                    >
                      <Users size={36} color={isDark ? "#475569" : "#CBD5E1"} style={{ marginBottom: "8px" }} />
                      <div style={{ fontSize: "16px", fontWeight: 600, color: isDark ? "#F8FAFC" : "#334155" }}>
                        Nenhum usuário encontrado
                      </div>
                      <div style={{ fontSize: "13px", marginTop: "4px" }}>
                        {searchTerm ? "Tente buscar com outro termo." : "Nenhum perfil cadastrado no momento."}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProfiles.map((p, idx) => (
                    <tr
                      key={p.id || idx}
                      style={{
                        borderBottom: idx === filteredProfiles.length - 1 ? "none" : (isDark ? "1px solid #334155" : "1px solid #F1F5F9"),
                        backgroundColor: idx % 2 === 0 ? (isDark ? "#1E293B" : "#FFFFFF") : (isDark ? "#182234" : "#FCFDFD"),
                        transition: "background-color 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = isDark ? "#283548" : "#F8FAFC";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = idx % 2 === 0 ? (isDark ? "#1E293B" : "#FFFFFF") : (isDark ? "#182234" : "#FCFDFD");
                      }}
                    >
                      <td
                        style={{
                          padding: "16px 20px",
                          fontSize: "14px",
                          fontWeight: 600,
                          color: isDark ? "#F8FAFC" : "#0F172A",
                        }}
                      >
                        {p.email || "-"}
                      </td>
                      <td
                        style={{
                          padding: "16px 20px",
                          fontSize: "14px",
                          color: isDark ? "#E2E8F0" : "#334155",
                        }}
                      >
                        {p.kidName || "-"}
                      </td>
                      <td
                        style={{
                          padding: "16px 20px",
                          fontSize: "14px",
                          color: isDark ? "#E2E8F0" : "#334155",
                        }}
                      >
                        {p.parentName || "-"}
                      </td>
                      <td
                        style={{
                          padding: "16px 20px",
                          fontSize: "13px",
                          color: isDark ? "#94A3B8" : "#64748B",
                        }}
                      >
                        {formatDate(p.createdAt)}
                      </td>
                      <td
                        style={{
                          padding: "16px 20px",
                          textAlign: "center",
                        }}
                      >
                        {p.isAdmin ? (
                          <span
                            style={{
                              backgroundColor: isDark ? "#14532D50" : "#DCFCE7",
                              color: isDark ? "#4ADE80" : "#166534",
                              border: isDark ? "1px solid #166534" : "none",
                              padding: "4px 10px",
                              borderRadius: "9999px",
                              fontSize: "12px",
                              fontWeight: 600,
                              display: "inline-block",
                            }}
                          >
                            Admin
                          </span>
                        ) : (
                          <span
                            style={{
                              backgroundColor: "#F1F5F9",
                              color: "#475569",
                              padding: "4px 10px",
                              borderRadius: "9999px",
                              fontSize: "12px",
                              fontWeight: 500,
                              display: "inline-block",
                            }}
                          >
                            Usuário
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

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
