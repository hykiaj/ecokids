"use client";

import React, { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { resolveCustomImageUrl } from "@/lib/supabase";

export function KidAvatar({ size = 48, className = "", src, style = {} }) {
  const { profile } = useAuth();
  const [errorUrl, setErrorUrl] = useState(null);

  const avatarSource = src || profile?.avatarKid;
  const resolvedUrl = useMemo(() => {
    if (!avatarSource || avatarSource === "avatar1") return null;
    return resolveCustomImageUrl(avatarSource);
  }, [avatarSource]);

  const isError = Boolean(resolvedUrl && errorUrl === resolvedUrl);

  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
        border: "2px solid #E2E8F0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        position: "relative",
        clipPath: "circle(50% at 50% 50%)",
        WebkitClipPath: "circle(50% at 50% 50%)",
        WebkitMaskImage: "-webkit-radial-gradient(white, black)",
        transform: "translateZ(0)",
        ...style,
      }}
    >
      {resolvedUrl && !isError ? (
        <img
          src={resolvedUrl}
          alt="Avatar da criança"
          onError={() => setErrorUrl(resolvedUrl)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            borderRadius: "50%",
            clipPath: "circle(50% at 50% 50%)",
            WebkitClipPath: "circle(50% at 50% 50%)",
          }}
        />
      ) : (
        <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", display: "block", borderRadius: "50%" }}>
          {/* Soft circle background */}
          <circle cx="50" cy="50" r="50" fill="#FEF3C7" />

          {/* Brown/Auburn hair behind */}
          <circle cx="50" cy="52" r="38" fill="#B45309" />
          <ellipse cx="26" cy="60" rx="14" ry="20" fill="#D97706" />
          <ellipse cx="74" cy="60" rx="14" ry="20" fill="#D97706" />

          {/* Neck */}
          <rect x="43" y="66" width="14" height="12" fill="#FED7AA" />

          {/* Shirt (Lilac/Purple) */}
          <path d="M 22 100 Q 50 74 78 100 Z" fill="#8B5CF6" />
          <path d="M 40 76 Q 50 82 60 76" stroke="#EDE9FE" strokeWidth="2.5" fill="none" />

          {/* Face */}
          <ellipse cx="50" cy="50" rx="26" ry="25" fill="#FFEDD5" />

          {/* Rosy Cheeks */}
          <circle cx="34" cy="56" r="4.5" fill="#FDA4AF" opacity="0.6" />
          <circle cx="66" cy="56" r="4.5" fill="#FDA4AF" opacity="0.6" />

          {/* Eyes (big friendly dark eyes) */}
          <ellipse cx="38" cy="48" rx="3" ry="3.5" fill="#451A03" />
          <circle cx="37" cy="46.5" r="1.2" fill="#FFFFFF" />

          <ellipse cx="62" cy="48" rx="3" ry="3.5" fill="#451A03" />
          <circle cx="61" cy="46.5" r="1.2" fill="#FFFFFF" />

          {/* Eyebrows */}
          <path d="M 33 43 Q 38 41 42 43" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M 58 43 Q 62 41 67 43" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" fill="none" />

          {/* Smile */}
          <path d="M 44 57 Q 50 63 56 57" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Cute small nose */}
          <circle cx="50" cy="52" r="1.2" fill="#FDBA74" />

          {/* Hair bangs */}
          <path
            d="M 25 44 C 28 32, 42 26, 50 26 C 60 26, 72 32, 75 44 C 70 38, 58 35, 50 38 C 42 35, 30 38, 25 44 Z"
            fill="#D97706"
          />

          {/* Purple/Lilac Headband (tiara) */}
          <path
            d="M 27 38 C 32 26, 68 26, 73 38"
            stroke="#7C3AED"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          {/* Headband bow or decoration */}
          <circle cx="71" cy="33" r="3.5" fill="#A78BFA" />
        </svg>
      )}
    </div>
  );
}

export function ParentAvatar({ size = 48, className = "" }) {
  return (
    <div
      className={`relative inline-block rounded-full overflow-hidden flex-shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: "#FEF3C7",
        border: "2.5px solid #E2E8F0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Background circle */}
        <circle cx="50" cy="50" r="50" fill="#FEF08A" opacity="0.4" />

        {/* Brown wavy hair behind */}
        <circle cx="50" cy="48" r="38" fill="#5A3E2B" />
        <ellipse cx="23" cy="62" rx="14" ry="24" fill="#5A3E2B" />
        <ellipse cx="77" cy="62" rx="14" ry="24" fill="#5A3E2B" />

        {/* Neck */}
        <rect x="44" y="65" width="12" height="14" fill="#FED7AA" />

        {/* Shirt (Soft purple/violet) */}
        <path d="M 20 100 Q 50 72 80 100 Z" fill="#7C3AED" />
        <path d="M 38 78 Q 50 86 62 78" stroke="#DDD6FE" strokeWidth="2.5" fill="none" />

        {/* Face */}
        <ellipse cx="50" cy="48" rx="25" ry="24" fill="#FFEDD5" />

        {/* Soft blush */}
        <circle cx="34" cy="53" r="4" fill="#FB7185" opacity="0.45" />
        <circle cx="66" cy="53" r="4" fill="#FB7185" opacity="0.45" />

        {/* Eyes */}
        <ellipse cx="38" cy="46" rx="2.8" ry="3" fill="#292524" />
        <circle cx="37" cy="45" r="1" fill="#FFFFFF" />

        <ellipse cx="62" cy="46" rx="2.8" ry="3" fill="#292524" />
        <circle cx="61" cy="45" r="1" fill="#FFFFFF" />

        {/* Eyebrows */}
        <path d="M 33 41 Q 38 39 42 41" stroke="#5A3E2B" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        <path d="M 58 41 Q 62 39 67 41" stroke="#5A3E2B" strokeWidth="1.6" strokeLinecap="round" fill="none" />

        {/* Smile */}
        <path d="M 43 55 Q 50 61 57 55" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Gentle nose */}
        <path d="M 49 48 L 50 51" stroke="#FDBA74" strokeWidth="1.5" strokeLinecap="round" />

        {/* Hair Bangs / Front Hair */}
        <path
          d="M 25 42 C 28 28, 42 22, 50 22 C 60 22, 73 28, 75 42 C 68 32, 54 32, 50 36 C 44 32, 32 34, 25 42 Z"
          fill="#5A3E2B"
        />
        <path
          d="M 24 45 C 28 54, 26 65, 30 72 C 26 68, 22 55, 23 46 Z"
          fill="#6B462C"
        />
        <path
          d="M 76 45 C 72 54, 74 65, 70 72 C 74 68, 78 55, 77 46 Z"
          fill="#6B462C"
        />
      </svg>
    </div>
  );
}
