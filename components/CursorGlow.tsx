"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

export default function CursorGlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -200, y: -200 });
  const smoothRef = useRef({ x: -200, y: -200 });
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef(0);
  const lastSpawnRef = useRef(0);

  const spawnParticle = useCallback((x: number, y: number) => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.3 + Math.random() * 1.2;
    particlesRef.current.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.5,
      life: 1,
      maxLife: 40 + Math.random() * 60,
      size: 1 + Math.random() * 2.5,
      hue: 38 + Math.random() * 12,
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const glow = glowRef.current;
    if (!canvas || !glow) return;

    const ctx = canvas.getContext("2d")!;
    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    const animate = () => {
      frameRef.current++;
      const { x: mx, y: my } = mouseRef.current;
      const smooth = smoothRef.current;

      // Smooth interpolation for glow
      smooth.x += (mx - smooth.x) * 0.12;
      smooth.y += (my - smooth.y) * 0.12;

      // Position the glow div
      glow.style.transform = `translate(${smooth.x - 200}px, ${smooth.y - 200}px)`;

      // Spawn particles on movement
      const now = frameRef.current;
      if (now - lastSpawnRef.current > 2 && mx > 0) {
        for (let i = 0; i < 2; i++) {
          spawnParticle(
            smooth.x + (Math.random() - 0.5) * 20,
            smooth.y + (Math.random() - 0.5) * 20
          );
        }
        lastSpawnRef.current = now;
      }

      // Cap particles
      if (particlesRef.current.length > 120) {
        particlesRef.current = particlesRef.current.slice(-120);
      }

      // Draw particles
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter((p) => {
        p.life -= 1 / p.maxLife;
        if (p.life <= 0) return false;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.01; // slight gravity
        p.vx *= 0.99;

        const alpha = p.life * 0.6;
        const size = p.size * p.life;

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 70%, 65%, ${alpha})`;
        ctx.fill();

        // Glow around particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 70%, 65%, ${alpha * 0.15})`;
        ctx.fill();

        return true;
      });

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, [spawnParticle]);

  return (
    <>
      {/* Soft radial glow following cursor */}
      <div
        ref={glowRef}
        className="pointer-events-none fixed z-30"
        style={{
          width: 400,
          height: 400,
          willChange: "transform",
          background:
            "radial-gradient(circle, rgba(201,168,76,0.07) 0%, rgba(201,168,76,0.03) 30%, rgba(201,168,76,0) 70%)",
          borderRadius: "50%",
        }}
      />
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-30"
        style={{ willChange: "transform" }}
      />
    </>
  );
}
