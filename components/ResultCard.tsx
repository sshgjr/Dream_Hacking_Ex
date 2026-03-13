"use client";

import { useRef, useCallback } from "react";

interface ResultCardProps {
  icon: string;
  title: string;
  content: string;
  label: string;
}

export default function ResultCard({ icon, title, content, label }: ResultCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current;
    const inner = innerRef.current;
    const shimmer = shimmerRef.current;
    if (!card || !inner || !shimmer) return;

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      // 3D tilt: ±12 degrees
      const tiltX = (y - 0.5) * -12;
      const tiltY = (x - 0.5) * 12;

      inner.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;

      // Holographic shimmer position
      shimmer.style.background = `radial-gradient(
        circle at ${x * 100}% ${y * 100}%,
        rgba(201,168,76,0.15) 0%,
        rgba(232,212,139,0.05) 30%,
        transparent 70%
      )`;
      shimmer.style.opacity = "1";
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    const inner = innerRef.current;
    const shimmer = shimmerRef.current;
    if (inner) {
      inner.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
    }
    if (shimmer) {
      shimmer.style.opacity = "0";
    }
  }, []);

  return (
    <div
      ref={cardRef}
      className="tarot-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={innerRef}
        className="tarot-card-inner rounded-xl p-7"
        style={{
          transition: "transform 0.15s ease-out, border-color 0.4s, box-shadow 0.4s",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Holographic shimmer overlay */}
        <div
          ref={shimmerRef}
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            opacity: 0,
            transition: "opacity 0.3s ease",
            mixBlendMode: "screen",
          }}
        />

        {/* Top label */}
        <div className="relative flex items-center justify-between mb-5">
          <span
            className="text-xs uppercase tracking-[0.2em]"
            style={{ color: "var(--gold)", fontFamily: "var(--font-display)" }}
          >
            {label}
          </span>
          <span className="text-2xl">{icon}</span>
        </div>

        <div className="gold-line mb-5 relative" />

        {/* Title */}
        <h3
          className="text-2xl mb-4 relative"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            color: "var(--ivory)",
          }}
        >
          {title}
        </h3>

        {/* Content */}
        <p
          className="leading-relaxed text-base relative"
          style={{ color: "var(--ivory-dim)" }}
        >
          {content}
        </p>

        <div className="gold-line mt-5 relative" />
      </div>
    </div>
  );
}
