"use client";

import React from "react";

interface Props {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  glow?: boolean;
}

export function NanoBananaLogo({ size = "md", className = "", glow = false }: Props) {
  const reactId = React.useId().replace(/:/g, "");
  const sizeMap = {
    sm: { box: "w-7 h-7 rounded-xl", icon: 18 },
    md: { box: "w-9 h-9 rounded-2xl", icon: 22 },
    lg: { box: "w-12 h-12 rounded-2xl", icon: 30 },
    xl: { box: "w-16 h-16 rounded-3xl", icon: 40 },
  };

  const current = sizeMap[size] || sizeMap.md;
  const gradBodyId = `bananaBody_${reactId}`;
  const gradStemId = `bananaStem_${reactId}`;
  const filterId = `bananaShadow_${reactId}`;

  return (
    <div
      className={`relative flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-active:scale-95 ${
        current.box
      } bg-amber-500/10 dark:bg-[#161b22] border border-amber-300/70 dark:border-[#363d47] text-amber-600 dark:text-amber-400 ${
        glow
          ? "shadow-sm shadow-amber-500/25 dark:shadow-amber-500/15"
          : "shadow-2xs"
      } ${className}`}
    >
      <svg
        width={current.icon}
        height={current.icon}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 group-hover:rotate-6 select-none pointer-events-none"
      >
        <defs>
          {/* Warm Nano Banana Gradient */}
          <linearGradient id={gradBodyId} x1="6" y1="8" x2="26" y2="26" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="45%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          {/* Fresh Stem Gradient */}
          <linearGradient id={gradStemId} x1="6" y1="5" x2="10" y2="10" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#65a30d" />
            <stop offset="100%" stopColor="#4d7c0f" />
          </linearGradient>

          {/* Die-Cut Sticker Soft Shadow */}
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#b45309" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Die-Cut Sticker White Contour */}
        <path
          d="M 9.5 9.5 C 7.5 16, 11 25.5, 22.5 25.5 C 25.5 25.5, 27.5 23.5, 27 20.5 C 20 21.5, 14 16, 9.5 9.5 Z"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
          filter={`url(#${filterId})`}
        />

        {/* Main Nano Banana Body */}
        <path
          d="M 9.5 9.5 C 7.5 16, 11 25.5, 22.5 25.5 C 25.5 25.5, 27.5 23.5, 27 20.5 C 20 21.5, 14 16, 9.5 9.5 Z"
          fill={`url(#${gradBodyId})`}
        />

        {/* Facet Line for 3D Volume */}
        <path
          d="M 10 10.5 C 10.5 16.5, 15 22.5, 24.5 22"
          stroke="#b45309"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.55"
        />

        {/* Gloss Highlight (Nano Sheen) */}
        <path
          d="M 8.8 14 C 9.5 19, 13.5 24, 21 24.5"
          stroke="#ffffff"
          strokeWidth="1.3"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Fresh Cut Stem */}
        <path
          d="M 7.2 9 L 8.5 6 L 10.5 7 L 9.5 9.8 Z"
          fill={`url(#${gradStemId})`}
          stroke="#3f6212"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />

        {/* Ripe Bottom Tip */}
        <circle cx="26.8" cy="20.8" r="1" fill="#78350f" />

        {/* Nano Sparkle (Top-Right) */}
        <path
          d="M 24 4.5 L 24.8 6.5 L 27 7.2 L 24.8 8 L 24 10 L 23.2 8 L 21 7.2 L 23.2 6.5 Z"
          fill="#fbbf24"
        />

        {/* Nano Sparkle (Micro Accent) */}
        <circle cx="29" cy="14" r="0.8" fill="#f59e0b" />
      </svg>
    </div>
  );
}
