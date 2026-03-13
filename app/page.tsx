import SplineBackground from "@/components/SplineBackground";
import DreamInput from "@/components/DreamInput";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-5 page-enter">
      <SplineBackground />

      {/* GitHub link - top right */}
      <a
        href="https://github.com/sshgjr/Dream_Hacking_Ex"
        target="_blank"
        rel="noopener noreferrer"
        className="github-link"
        aria-label="GitHub Repository"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      </a>

      {/* Demo badge - top center */}
      <div className="demo-badge">
        <span className="oracle-symbol" style={{ fontSize: '8px' }}>✦</span>
        {' '}데모 버전{' '}
        <span className="oracle-symbol" style={{ fontSize: '8px' }}>✦</span>
      </div>

      <div className="relative z-10 w-full max-w-xl text-center stagger-enter">
        {/* Decorative top symbol */}
        <div
          className="mb-6 text-sm tracking-[0.3em] uppercase float-subtle"
          style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', opacity: 0.5 }}
        >
          <span className="oracle-symbol">✦</span>
          {' '}Oracle{' '}
          <span className="oracle-symbol">✦</span>
        </div>

        {/* Title */}
        <h1
          className="text-6xl md:text-7xl mb-3 tracking-tight title-glow"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 300,
            color: 'var(--ivory)',
          }}
        >
          Dream Hacking
        </h1>

        {/* Decorative line */}
        <div className="gold-line w-32 mx-auto my-5" />

        {/* Subtitle */}
        <p
          className="text-base mb-12 tracking-wide"
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            color: 'var(--mist)',
            opacity: 0.7,
          }}
        >
          당신의 꿈을 해독합니다
        </p>

        <div>
          <DreamInput />
        </div>

        {/* Demo note */}
        <p className="demo-note mt-5">
          API 키 없이 체험 가능한 데모 버전입니다
        </p>

        {/* Bottom decoration */}
        <div
          className="mt-10 text-xs tracking-[0.25em] uppercase"
          style={{ color: 'rgba(201,168,76,0.2)', fontFamily: 'var(--font-display)' }}
        >
          Powered by AI Dream Interpretation
        </div>
      </div>
    </div>
  );
}
