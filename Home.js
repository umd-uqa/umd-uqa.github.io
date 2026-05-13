/**
 * HOMEPAGE COMPONENT
 * Restored elliptical electron orbits following the actual paths.
 * Optimized with SMIL animateMotion to prevent page load freezing.
 */
window.Home = function Home() {
  // Shared elliptical path used for all three orbits
  const orbitPath = "M 182, 100 A 82 30 0 1 1 18 100 A 82 30 0 1 1 182 100";

  return (
      <div className="w-full animate-fade-in">
        <section className="relative min-h-screen flex flex-col items-center justify-start pt-32 text-center px-10 overflow-hidden">

          {/* Background Gradient Glow */}
          <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_45%,rgba(154,157,212,0.12)_0%,transparent_65%)]" />

          {/* ATOM VISUAL: Electrons following elliptical paths */}
          <div className="relative z-10 mb-8 drop-shadow-[0_0_20px_rgba(154,157,212,0.5)]">
            <svg
                viewBox="0 0 200 200"
                width="420"
                height="420"
                xmlns="http://www.w3.org/2000/svg"
                style={{ overflow: 'visible' }}
            >
              {/* Nucleus */}
              <circle cx="100" cy="100" r="7" fill="#ffffff" />

              {/* ORBIT 1: Horizontal */}
              <g>
                <ellipse cx="100" cy="100" rx="82" ry="30" fill="none" stroke="#9a9dd4" strokeWidth="1.2" opacity="0.4" />
                <circle r="4" fill="#ffffff">
                  <animateMotion dur="6s" repeatCount="indefinite" path={orbitPath} />
                </circle>
              </g>

              {/* ORBIT 2: 60 Degree Rotation */}
              <g transform="rotate(60 100 100)">
                <ellipse cx="100" cy="100" rx="82" ry="30" fill="none" stroke="#9a9dd4" strokeWidth="1.2" opacity="0.4" />
                <circle r="4" fill="#ffffff">
                  <animateMotion dur="9s" repeatCount="indefinite" path={orbitPath} begin="-2s" />
                </circle>
              </g>

              {/* ORBIT 3: -60 Degree Rotation */}
              <g transform="rotate(-60 100 100)">
                <ellipse cx="100" cy="100" rx="82" ry="30" fill="none" stroke="#9a9dd4" strokeWidth="1.2" opacity="0.4" />
                <circle r="4" fill="#ffffff">
                  <animateMotion dur="7s" repeatCount="indefinite" path={orbitPath} begin="-4s" />
                </circle>
              </g>
            </svg>
          </div>

          {/* Hero Typography */}
          <h1 className="relative z-10 font-['Raleway'] text-[clamp(32px,5vw,60px)] font-light leading-[1.15] mb-9 text-white">
            Discover the Future of<br />
            <strong className="font-bold text-[#b0b3e0]">Engineering</strong> and <strong className="font-bold text-[#b0b3e0]">Technology</strong>
          </h1>

          <div className="relative z-10 flex gap-3">
            <button
                onClick={() => window.location.hash = 'about'}
                className="bg-[#9a9dd4] text-[#181a38] px-7 py-3 rounded-md font-semibold text-[14px] hover:brightness-110 transition-all cursor-pointer"
            >
              Learn More About Us
            </button>
            <button
                onClick={() => window.location.hash = 'calendar'}
                className="border border-[#9a9dd4]/40 text-[#b0b3e0] px-7 py-3 rounded-md font-medium text-[14px] hover:bg-white/5 transition-all cursor-pointer"
            >
              When We Meet
            </button>
          </div>
        </section>
      </div>
  );
};