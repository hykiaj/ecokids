"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ variant = "button", className = "" }) {
  const { theme, isDark, toggleTheme, setTheme } = useTheme();

  if (variant === "menu-item") {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        aria-label="Alternar modo claro e escuro"
        style={{
          textAlign: "left",
          padding: "12px 14px",
          borderRadius: "12px",
          fontSize: "15px",
          fontWeight: "700",
          color: isDark ? "#F8FAFC" : "#334155",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          transition: "background 0.15s ease",
          backgroundColor: "transparent",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = isDark ? "#334155" : "#F8FAFC")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "transparent")
        }
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {isDark ? (
            <Moon size={18} color="#FBBF24" />
          ) : (
            <Sun size={18} color="#F59E0B" />
          )}
          <span>{isDark ? "Modo Escuro" : "Modo Claro"}</span>
        </div>

        {/* Switch Pill */}
        <div
          style={{
            width: "44px",
            height: "24px",
            borderRadius: "12px",
            backgroundColor: isDark ? "#22C55E" : "#E2E8F0",
            position: "relative",
            transition: "background-color 0.2s ease",
            display: "flex",
            alignItems: "center",
            padding: "2px",
          }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "#FFFFFF",
              transform: isDark ? "translateX(20px)" : "translateX(0px)",
              transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isDark ? (
              <Moon size={11} color="#0F172A" />
            ) : (
              <Sun size={11} color="#F59E0B" />
            )}
          </div>
        </div>
      </button>
    );
  }

  if (variant === "selector") {
    return (
      <div style={{ display: "flex", gap: "12px", width: "100%" }}>
        <button
          type="button"
          onClick={() => setTheme("light")}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "12px 14px",
            borderRadius: "12px",
            border: !isDark ? "2px solid #22C55E" : isDark ? "1.5px solid #334155" : "1.5px solid #E2E8F0",
            backgroundColor: !isDark ? (isDark ? "#1E293B" : "#F0FDF4") : isDark ? "#0F172A" : "#FFFFFF",
            color: !isDark ? "#166534" : isDark ? "#94A3B8" : "#64748B",
            fontWeight: "700",
            fontSize: "14px",
            boxShadow: !isDark ? "0 2px 8px rgba(34, 197, 94, 0.15)" : "none",
          }}
        >
          <Sun size={18} color={!isDark ? "#EAB308" : "#94A3B8"} />
          <span>Modo Claro</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme("dark")}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "12px 14px",
            borderRadius: "12px",
            border: isDark ? "2px solid #22C55E" : "1.5px solid #CBD5E1",
            backgroundColor: isDark ? "#14532D25" : "#FFFFFF",
            color: isDark ? "#4ADE80" : "#64748B",
            fontWeight: "700",
            fontSize: "14px",
            boxShadow: isDark ? "0 2px 8px rgba(34, 197, 94, 0.15)" : "none",
          }}
        >
          <Moon size={18} color={isDark ? "#FBBF24" : "#94A3B8"} />
          <span>Modo Escuro</span>
        </button>
      </div>
    );
  }

  // Default: Header icon button
  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={className}
      aria-label={isDark ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
      title={isDark ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "42px",
        height: "42px",
        borderRadius: "12px",
        backgroundColor: isDark ? "#1E293B" : "#F0FDF4",
        border: isDark ? "1.5px solid #334155" : "1.5px solid #DCFCE7",
        color: isDark ? "#FBBF24" : "#16A34A",
        transition: "all 0.2s ease",
        boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.borderColor = "#22C55E";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.borderColor = isDark ? "#334155" : "#DCFCE7";
      }}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
