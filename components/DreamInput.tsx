"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DreamInput() {
  const [dream, setDream] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (dream.trim().length < 10) {
      setError("꿈 내용을 10자 이상 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dream }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "오류가 발생했습니다.");
        return;
      }

      sessionStorage.setItem("dreamResult", JSON.stringify(data));
      sessionStorage.setItem("dreamText", dream);
      router.push("/result");
    } catch {
      setError("서버와 연결할 수 없습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="relative">
        <textarea
          value={dream}
          onChange={(e) => setDream(e.target.value)}
          placeholder="간밤에 꾼 꿈을 자유롭게 적어주세요..."
          rows={5}
          className="dream-input w-full p-6 rounded-xl text-[var(--ivory)] resize-none text-base leading-relaxed"
          disabled={loading}
        />
        <div className="absolute bottom-4 right-4 text-xs" style={{ color: 'rgba(201,168,76,0.3)' }}>
          {dream.length > 0 && `${dream.length}자`}
        </div>
      </div>

      {error && (
        <p className="mt-3 text-sm" style={{ color: '#e07a5f' }}>{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-oracle mt-6 w-full py-4 rounded-xl text-lg tracking-widest uppercase"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            해석 중...
          </span>
        ) : (
          "꿈 해몽하기"
        )}
      </button>
    </form>
  );
}
