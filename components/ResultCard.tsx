"use client";

interface ResultCardProps {
  icon: string;
  title: string;
  content: string;
  label: string;
}

export default function ResultCard({ icon, title, content, label }: ResultCardProps) {
  return (
    <div className="tarot-card">
      <div className="tarot-card-inner rounded-xl p-7">
        {/* Top label */}
        <div className="flex items-center justify-between mb-5">
          <span
            className="text-xs uppercase tracking-[0.2em]"
            style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)' }}
          >
            {label}
          </span>
          <span className="text-2xl">{icon}</span>
        </div>

        <div className="gold-line mb-5" />

        {/* Title */}
        <h3
          className="text-2xl mb-4"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            color: 'var(--ivory)',
          }}
        >
          {title}
        </h3>

        {/* Content */}
        <p
          className="leading-relaxed text-base"
          style={{ color: 'var(--ivory-dim)' }}
        >
          {content}
        </p>

        <div className="gold-line mt-5" />
      </div>
    </div>
  );
}
