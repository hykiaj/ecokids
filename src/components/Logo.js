"use client";

import React, { useState } from "react";
import { getStoragePublicUrl } from "@/lib/supabase";

export default function Logo({ size = "md", className = "", style = {} }) {
  const [hasError, setHasError] = useState(false);

  const scale = size === "sm" ? 0.75 : size === "lg" ? 1.25 : 1;
  const width = Math.round(140 * scale);
  const height = Math.round(55 * scale);

  const logoUrl = getStoragePublicUrl("ecokids", "logo.png");

  return (
    <div
      className={`inline-flex items-center select-none ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        cursor: "pointer",
        ...style,
      }}
    >
      {!hasError && logoUrl ? (
        <img
          src={logoUrl}
          alt="Eco Kids Logo"
          onError={() => setHasError(true)}
          style={{
            height: `${height}px`,
            width: "auto",
            maxWidth: `${width * 1.6}px`,
            objectFit: "contain",
            display: "block",
          }}
        />
      ) : (
        <svg
          width={width}
          height={height}
          viewBox="0 0 160 65"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Sun with rays */}
          <g transform="translate(14, 14)">
            <line x1="0" y1="-12" x2="0" y2="-16" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="8.5" y1="-8.5" x2="11.5" y2="-11.5" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="12" y1="0" x2="16" y2="0" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="-8.5" y1="-8.5" x2="-11.5" y2="-11.5" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="-12" y1="0" x2="-16" y2="0" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="0" cy="0" r="9" fill="#FBBF24" />
            <circle cx="-3" cy="-1.5" r="1.2" fill="#78350F" />
            <circle cx="3" cy="-1.5" r="1.2" fill="#78350F" />
            <path d="M -3.5 2 Q 0 5 3.5 2" stroke="#78350F" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </g>

          {/* Rainbow behind */}
          <g transform="translate(42, 22)">
            <path d="M -16 0 A 16 16 0 0 1 16 0" stroke="#EF4444" strokeWidth="3" fill="none" />
            <path d="M -13 0 A 13 13 0 0 1 13 0" stroke="#FBBF24" strokeWidth="3" fill="none" />
            <path d="M -10 0 A 10 10 0 0 1 10 0" stroke="#06B6D4" strokeWidth="3" fill="none" />
          </g>

          {/* Green hand with flower / heart in palm */}
          <g transform="translate(18, 44)">
            <path
              d="M -7 5 C -8 3, -8 -1, -7 -3 L -7 -7 C -7 -8.5, -5 -8.5, -5 -7 L -5 -2 C -5 -3, -3 -3, -3 -1 L -3 -6 C -3 -7.5, -1 -7.5, -1 -6 L -1 -1 C -1 -2, 1 -2, 1 -0.5 L 1 -5 C 1 -6.5, 3 -6.5, 3 -5 L 3 1 C 3 0, 5 0, 5 1.5 L 5 4 C 5 7, 3 10, -2 10 C -5 10, -7 8, -7 5 Z"
              fill="#22C55E"
            />
            <circle cx="-1" cy="4" r="1.8" fill="#FFFFFF" />
          </g>

          {/* ECO text */}
          <text
            x="32"
            y="40"
            fontFamily="system-ui, -apple-system, 'Quicksand', 'Nunito', sans-serif"
            fontWeight="900"
            fontSize="24"
            letterSpacing="-0.5px"
            fill="#22C55E"
          >
            ECO
          </text>

          {/* Orange plus / star between ECO and KIDS */}
          <g transform="translate(86, 31)">
            <path
              d="M 0 -4 L 1.2 -1.2 L 4 0 L 1.2 1.2 L 0 4 L -1.2 1.2 L -4 0 L -1.2 -1.2 Z"
              fill="#F59E0B"
            />
          </g>

          {/* KIDS text */}
          <text
            x="32"
            y="60"
            fontFamily="system-ui, -apple-system, 'Quicksand', 'Nunito', sans-serif"
            fontWeight="900"
            fontSize="22"
            letterSpacing="0.5px"
            fill="#EAB308"
          >
            KIDS
          </text>
        </svg>
      )}
    </div>
  );
}
