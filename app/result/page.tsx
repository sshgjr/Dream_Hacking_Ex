"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SplineBackground from "@/components/SplineBackground";
import ResultCard from "@/components/ResultCard";

interface DreamResult {
  meaning: string;
  caution: string;
  fortune: string;
}

export default function ResultPage() {
  const [result, setResult] = useState<DreamResult | null>(null);
  const [dreamText, setDreamText] = useState("");
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("dreamResult");
    const text = sessionStorage.getItem("dreamText");

    if (!stored) {
      router.push("/");
      return;
    }

    setResult(JSON.parse(stored));
    setDreamText(text || "");
  }, [router]);

  if (!result) return null;

  return (
    <div className="relative min-h-screen flex flex-col items-center px-5 py-20 page-enter">
      <SplineBackground />

      <div className="relative z-10 w-full max-w-2xl stagger-enter">
        {/* Back */}
        <button onClick={() => router.push("/")} className="back-link mb-10 flex items-center gap-2 text-sm">
          ← 다시 해몽하기
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="text-xs tracking-[0.3em] uppercase mb-4"
            style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', opacity: 0.5 }}
          >
            <span className="oracle-symbol">✦</span>
            {' '}Reading Complete{' '}
            <span className="oracle-symbol">✦</span>
          </div>
          <h1
            className="text-5xl md:text-6xl mb-3 title-glow"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 300,
              color: 'var(--ivory)',
            }}
          >
            해몽 결과
          </h1>
          <div className="gold-line w-24 mx-auto mt-4" />
        </div>

        {/* Dream quote */}
        <div className="dream-quote rounded-r-lg px-6 py-4 mb-12">
          <p
            className="text-xs uppercase tracking-[0.15em] mb-2"
            style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)' }}
          >
            내가 꾼 꿈
          </p>
          <p
            className="leading-relaxed text-base"
            style={{ color: 'var(--ivory-dim)', fontStyle: 'italic' }}
          >
            &ldquo;{dreamText}&rdquo;
          </p>
        </div>

        {/* Tarot Cards */}
        <div className="flex flex-col gap-6">
          <ResultCard
            icon="🔮"
            title="꿈의 의미"
            label="I · Meaning"
            content={result.meaning}
          />
          <ResultCard
            icon="⚠️"
            title="주의할 점"
            label="II · Caution"
            content={result.caution}
          />
          <ResultCard
            icon="✨"
            title="좋은 징조"
            label="III · Fortune"
            content={result.fortune}
          />
        </div>

        {/* Bottom */}
        <div className="text-center mt-14">
          <div className="gold-line w-16 mx-auto mb-8" />
          <button
            onClick={() => router.push("/")}
            className="px-8 py-3 rounded-xl text-sm tracking-[0.15em] uppercase transition-all duration-300"
            style={{
              border: '1px solid rgba(201,168,76,0.2)',
              color: 'var(--gold)',
              fontFamily: 'var(--font-display)',
              background: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)';
              e.currentTarget.style.background = 'rgba(201,168,76,0.05)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(201,168,76,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)';
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            다른 꿈 해몽하기
          </button>
        </div>
      </div>
    </div>
  );
}
