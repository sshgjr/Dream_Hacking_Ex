"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000;
const MAGNETIC_RANGE = 120;
const MAGNETIC_STRENGTH = 0.3;

export default function DreamInput() {
  const [dream, setDream] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();
  const abortRef = useRef<AbortController | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const btnWrapRef = useRef<HTMLDivElement>(null);

  // Magnetic button effect
  useEffect(() => {
    const btn = btnRef.current;
    const wrap = btnWrapRef.current;
    if (!btn || !wrap) return;

    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MAGNETIC_RANGE) {
        const pull = (1 - dist / MAGNETIC_RANGE) * MAGNETIC_STRENGTH;
        btn.style.transform = `translate(${dx * pull}px, ${dy * pull}px) scale(${1 + pull * 0.05})`;
      } else {
        btn.style.transform = "translate(0, 0) scale(1)";
      }
    };

    const onLeave = () => {
      btn.style.transform = "translate(0, 0) scale(1)";
    };

    window.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const callApi = useCallback(
    async (attempt: number): Promise<Response> => {
      const controller = new AbortController();
      abortRef.current = controller;

      const res = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dream }),
        signal: controller.signal,
      });

      if (res.status === 429 && attempt < MAX_RETRIES) {
        setStatus(`요청 대기 중... (${attempt + 1}/${MAX_RETRIES} 재시도)`);
        await new Promise((r) => setTimeout(r, RETRY_DELAY * (attempt + 1)));
        return callApi(attempt + 1);
      }

      return res;
    },
    [dream]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStatus("");

    if (dream.trim().length < 10) {
      setError("꿈 내용을 10자 이상 입력해주세요.");
      return;
    }

    setLoading(true);
    setStatus("꿈을 해석하고 있어요...");

    try {
      const res = await callApi(0);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "오류가 발생했습니다.");
        return;
      }

      sessionStorage.setItem("dreamResult", JSON.stringify(data));
      sessionStorage.setItem("dreamText", dream);
      router.push("/result");
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError("서버와 연결할 수 없습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
      setStatus("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="relative group">
        <textarea
          value={dream}
          onChange={(e) => setDream(e.target.value)}
          placeholder="간밤에 꾼 꿈을 자유롭게 적어주세요..."
          rows={5}
          className="dream-input w-full p-6 rounded-xl text-[var(--ivory)] resize-none text-base leading-relaxed"
          disabled={loading}
        />
        <div
          className="absolute bottom-4 right-4 text-xs transition-opacity duration-300"
          style={{ color: "rgba(201,168,76,0.3)", opacity: dream.length > 0 ? 1 : 0 }}
        >
          {dream.length}자
        </div>
      </div>

      {error && (
        <p className="mt-3 text-sm animate-shake" style={{ color: "#e07a5f" }}>
          {error}
        </p>
      )}

      {status && !error && (
        <p
          className="mt-3 text-sm"
          style={{ color: "var(--mist)", opacity: 0.7 }}
        >
          <span className="loading-dots">{status}</span>
        </p>
      )}

      <div ref={btnWrapRef} className="mt-6">
        <button
          ref={btnRef}
          type="submit"
          disabled={loading}
          className="btn-oracle w-full py-4 rounded-xl text-lg tracking-widest uppercase"
          style={{
            transition: "transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease, opacity 0.3s ease",
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              해석 중...
            </span>
          ) : (
            "꿈 해몽하기"
          )}
        </button>
      </div>
    </form>
  );
}
