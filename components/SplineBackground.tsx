"use client";

import { useMemo } from "react";
import Spline from "@splinetool/react-spline";

function generateStars(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: `${2 + Math.random() * 4}s`,
    delay: `${Math.random() * 5}s`,
    maxOpacity: 0.3 + Math.random() * 0.6,
    large: Math.random() > 0.85,
  }));
}

export default function SplineBackground() {
  const stars = useMemo(() => generateStars(60), []);

  return (
    <>
      <div className="fixed inset-0 -z-10 bg-[#0a0e1a]">
        <div className="absolute inset-0 opacity-60">
          <Spline scene="https://prod.spline.design/aXRsBYd0Z2oJDnka/scene.splinecode" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a]/30 via-transparent to-[#0a0e1a]/70" />
      </div>

      <div className="starfield">
        {stars.map((star) => (
          <div
            key={star.id}
            className={`star ${star.large ? "star--large" : ""}`}
            style={{
              left: star.left,
              top: star.top,
              "--duration": star.duration,
              "--delay": star.delay,
              "--max-opacity": star.maxOpacity,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </>
  );
}
