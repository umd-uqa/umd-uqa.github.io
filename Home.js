/**
 * HOMEPAGE COMPONENT
 * Restored elliptical electron orbits following the actual paths.
 * Optimized with SMIL animateMotion and fully responsive mobile layout with instant navigation.
 */
window.Home = function Home({ navigateTo }) {
  // Shared elliptical path used for all three orbits
  const orbitPath = "M 182, 100 A 82 30 0 1 1 18 100 A 82 30 0 1 1 182 100";
  const handleNav = (target) => {
    if (navigateTo) {
      navigateTo(target);
    } else {
      window.location.hash = target;
    }
  };
  return (
      <div className="w-full animate-fade-in">
        <section className="relative min-h-screen flex flex-col items-center justify-start pt-28 sm:pt-32 text-center px-5 sm:px-8 md:px-10 overflow-hidden">
          {/* Background Gradient Glow */}
          <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_45%,rgba(154,157,212,0.12)_0%,transparent_65%)]" />
          {/* ATOM VISUAL: Electrons following elliptical paths */}
          <div className="relative z-10 mb-8 drop-shadow-[0_0_20px_rgba(154,157,212,0.5)]">
            <svg
                viewBox="0 0 200 200"
                className="w-[280px] sm:w-[350px] md:w-[420px] h-[280px] sm:h-[350px] md:h-[420px] mx-auto"
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
          <h1 className="relative z-10 font-['Nexa_Free'] text-[clamp(28px,5vw,60px)] font-light leading-[1.18] mb-8 text-white max-w-4xl mx-auto">
            Discover the Future of<br />
            <strong className="font-extrabold text-[#b0b3e0]">Engineering</strong> and <strong className="font-extrabold text-[#b0b3e0]">Technology</strong>
          </h1>
          <div className="relative z-10 flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto max-w-xs sm:max-w-none mx-auto items-stretch sm:items-center justify-center">
            <button
                onClick={() => handleNav('about')}
                className="bg-[#9a9dd4] text-[#181a38] px-7 py-3 rounded-md font-['Nexa_Free'] font-extrabold text-[14px] hover:brightness-110 transition-all cursor-pointer w-full sm:w-auto text-center shadow-lg"
            >
                Learn More About Us
            </button>
            <button
                onClick={() => handleNav('schedule')}
                className="border border-[#9a9dd4]/40 text-[#b0b3e0] px-7 py-3 rounded-md font-['Nexa_Free'] font-light text-[14px] hover:bg-white/5 transition-all cursor-pointer w-full sm:w-auto text-center"
            >
              When We Meet
            </button>
          </div>
        </section>
      </div>
  );
};
