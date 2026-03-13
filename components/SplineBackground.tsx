"use client";

import { useMemo, useEffect, useRef, useState, useCallback } from "react";
import Spline from "@splinetool/react-spline";

interface Star {
  id: number;
  baseLeft: number;
  baseTop: number;
  duration: number;
  delay: number;
  maxOpacity: number;
  large: boolean;
  depth: number; // 0-1, higher = more parallax
}

interface ShootingStar {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  length: number;
  life: number;
}

function generateStars(count: number): Star[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    baseLeft: Math.random() * 100,
    baseTop: Math.random() * 100,
    duration: 2 + Math.random() * 4,
    delay: Math.random() * 5,
    maxOpacity: 0.3 + Math.random() * 0.6,
    large: Math.random() > 0.85,
    depth: 0.2 + Math.random() * 0.8,
  }));
}

export default function SplineBackground() {
  const stars = useMemo(() => generateStars(80), []);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });
  const starElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const shootingIdRef = useRef(0);

  // Parallax mouse tracking
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Smooth parallax animation loop
  useEffect(() => {
    let animId: number;
    const animate = () => {
      const smooth = smoothMouseRef.current;
      const target = mouseRef.current;
      smooth.x += (target.x - smooth.x) * 0.05;
      smooth.y += (target.y - smooth.y) * 0.05;

      const offsetX = (smooth.x - 0.5) * 2;
      const offsetY = (smooth.y - 0.5) * 2;

      starElementsRef.current.forEach((el, i) => {
        if (!el) return;
        const star = stars[i];
        const px = offsetX * star.depth * 20;
        const py = offsetY * star.depth * 20;
        el.style.transform = `translate(${px}px, ${py}px)`;
      });

      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [stars]);

  // Shooting stars spawner
  const spawnShootingStar = useCallback(() => {
    const id = shootingIdRef.current++;
    const newStar: ShootingStar = {
      id,
      x: Math.random() * 80 + 10,
      y: Math.random() * 40,
      angle: 20 + Math.random() * 30,
      speed: 2 + Math.random() * 3,
      length: 80 + Math.random() * 120,
      life: 1,
    };
    setShootingStars((prev) => [...prev.slice(-3), newStar]);

    // Remove after animation
    setTimeout(() => {
      setShootingStars((prev) => prev.filter((s) => s.id !== id));
    }, 1500);
  }, []);

  useEffect(() => {
    // Initial shooting star
    const initialDelay = setTimeout(() => spawnShootingStar(), 2000);

    const interval = setInterval(
      () => {
        if (Math.random() > 0.4) spawnShootingStar();
      },
      3000 + Math.random() * 5000
    );
    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, [spawnShootingStar]);

  return (
    <>
      <div className="fixed inset-0 -z-10 bg-[#0a0e1a]">
        <div className="absolute inset-0 opacity-60 spline-wrapper">
          <Spline scene="https://prod.spline.design/aXRsBYd0Z2oJDnka/scene.splinecode" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a]/30 via-transparent to-[#0a0e1a]/70" />
      </div>

      <div ref={containerRef} className="starfield">
        {stars.map((star, i) => (
          <div
            key={star.id}
            ref={(el) => { starElementsRef.current[i] = el; }}
            className={`star ${star.large ? "star--large" : ""}`}
            style={{
              left: `${star.baseLeft}%`,
              top: `${star.baseTop}%`,
              "--duration": `${star.duration}s`,
              "--delay": `${star.delay}s`,
              "--max-opacity": star.maxOpacity,
              willChange: "transform",
            } as React.CSSProperties}
          />
        ))}

        {/* Shooting stars */}
        {shootingStars.map((s) => (
          <div
            key={s.id}
            className="shooting-star"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              "--angle": `${s.angle}deg`,
              "--length": `${s.length}px`,
              "--speed": `${0.6 + s.speed * 0.15}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </>
  );
}
