const React = window.React || require('react');

window.Home = function Home() {
  // 72-point smooth coordinate generator
  const generatePoints = (rx, ry, cx, cy) => {
    let xValues = [];
    let yValues = [];
    for (let i = 0; i <= 360; i += 5) {
      const rad = (i * Math.PI) / 180;
      xValues.push((cx + rx * Math.cos(rad)).toFixed(1));
      yValues.push((cy + ry * Math.sin(rad)).toFixed(1));
    }
    return { x: xValues.join(';'), y: yValues.join(';') };
  };

  // Scaled down proportions for a more compact look
  const rx = 240; // Down from 320
  const ry = 100; // Down from 130
  const orbitPath = generatePoints(rx, ry, 500, 250);

  return (
      <div className="flex flex-col min-h-screen bg-[#09091F] items-center">

        {/* 1. HERO SECTION */}
        <div className="relative w-full flex flex-col items-center pt-44">

          {/* ATOM CONTAINER: Reduced to h-[400px] for a tighter fit */}
          <div className="relative w-full max-w-6xl h-[400px] flex items-center justify-center pointer-events-none">

            {/* NEBULA GLOW: Scaled down to match */}
            <div className="absolute w-[500px] h-[350px] bg-[#C084FC]/10 blur-[100px] rounded-full" />

            <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 500">
              <defs>
                <filter id="neonGlow" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="blur" />
                  <feFlood flood-color="#C084FC" result="color" />
                  <feComposite in="color" in2="blur" operator="in" result="glow" />
                  <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <radialGradient id="nucleusGrad">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#C084FC" />
                </radialGradient>
              </defs>

              {/* Nucleus Core: Slightly smaller to match rescaled orbits */}
              <circle cx="500" cy="250" r="30" fill="url(#nucleusGrad)" filter="url(#neonGlow)" />

              {/* SYMMETRIC ORBITALS: 0, 60, 120 degree rotations */}
              {[0, 60, 120].map((rotation, i) => (
                  <g key={rotation} transform={`rotate(${rotation} 500 250)`}>
                    <ellipse
                        cx="500" cy="250" rx={rx} ry={ry}
                        fill="none" stroke="#FFFFFF" strokeWidth="2"
                        opacity="0.6" filter="url(#neonGlow)"
                    />
                    <circle r="8" fill="#FFFFFF" filter="url(#neonGlow)">
                      <animate attributeName="cx" values={orbitPath.x} dur={`${6 + i * 0.5}s`} repeatCount="indefinite" />
                      <animate attributeName="cy" values={orbitPath.y} dur={`${6 + i * 0.5}s`} repeatCount="indefinite" />
                    </circle>
                  </g>
              ))}
            </svg>
          </div>

          {/* HERO TEXT: Adjusted margin for the smaller atom container */}
          <div className="relative z-10 text-center -mt-4 mb-24">
            <h1 className="text-4xl md:text-7xl font-light tracking-tight leading-tight text-white">
              Discover the Future of <br className="hidden md:block" />
              <span className="text-[#9B6EFF]">Engineering</span> and <span className="text-[#C084FC]">Technology</span>
            </h1>
          </div>
        </div>

        {/* 2. BENTO SECTION */}
        <section className="w-full max-w-6xl px-6 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <div className="p-10 rounded-[2.5rem] border border-[#9B6EFF]/20 flex flex-col justify-between"
                 style={{ backgroundColor: 'rgba(155, 110, 255, 0.05)' }}>
              <div>
                <h4 className="text-[#E040FB] text-xs font-bold uppercase tracking-widest mb-6">Our Community</h4>
                <p className="text-3xl md:text-4xl font-bold mb-8 leading-tight text-white">
                  A welcoming space for physics majors, CS enthusiasts, and quantum explorers.
                </p>
              </div>
              <a href="#about" className="text-white border-b border-[#E040FB] pb-1 font-medium no-underline">
                Learn more about our mission →
              </a>
            </div>

            <div className="p-10 rounded-[2.5rem] border border-white/5 flex flex-col gap-10"
                 style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
              <div>
                <h4 className="font-bold text-white text-xl mb-3">Weekly Workshops</h4>
                <p className="text-[#9B97C2] text-lg leading-relaxed">
                  Every Wednesday at 6:00 PM in the Physics Building.
                </p>
              </div>
              <div className="h-px w-full bg-white/5" />
              <div>
                <h4 className="font-bold text-white text-xl mb-3">Professional Network</h4>
                <p className="text-[#9B97C2] text-lg leading-relaxed">
                  Connect with researchers and industry guest lecturers.
                </p>
              </div>
            </div>

          </div>
        </section>

      </div>
  );
};