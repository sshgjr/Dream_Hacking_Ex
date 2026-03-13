import SplineBackground from "@/components/SplineBackground";
import DreamInput from "@/components/DreamInput";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-5 page-enter">
      <SplineBackground />

      <div className="relative z-10 w-full max-w-xl text-center">
        {/* Decorative top symbol */}
        <div
          className="mb-6 text-sm tracking-[0.3em] uppercase float-subtle"
          style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', opacity: 0.5 }}
        >
          ✦ Oracle ✦
        </div>

        {/* Title */}
        <h1
          className="text-6xl md:text-7xl mb-3 tracking-tight"
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

        <DreamInput />

        {/* Bottom decoration */}
        <div
          className="mt-16 text-xs tracking-[0.25em] uppercase"
          style={{ color: 'rgba(201,168,76,0.2)', fontFamily: 'var(--font-display)' }}
        >
          Powered by AI Dream Interpretation
        </div>
      </div>
    </div>
  );
}
