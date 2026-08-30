/**
 * HOMEPAGE COMPONENT
 * Hero atom is a hidden click-the-electron game: click all 3 electrons and the
 * atom shakes, blows apart, and a fresh one fades in. Nothing about layout or
 * copy changes — only a faint "x/3" counter appears once someone is actually
 * interacting with it.
 */
const { useRef, useEffect, useState } = window.React || React;

window.Home = function Home({ navigateTo }) {
  const handleNav = (target) => {
    if (navigateTo) {
      navigateTo(target);
    } else {
      window.location.hash = target;
    }
  };

  // ---- Game refs (mutable, don't need to trigger re-renders) ----
  const shakeWrapperRef = useRef(null);
  const atomGroupRef = useRef(null);
  const particlesRef = useRef(null);
  const dotRefs = useRef([]);
  const hitAreaRefs = useRef([]);
  const electronsRef = useRef([]);
  const gameActiveRef = useRef(true);
  const spawnTimeRef = useRef(0);
  const rafRef = useRef(null);

  // Orbit periods + starting phase (approximates the original SMIL begin offsets)
  const ORBIT_DEFS = [
    { dur: 6, phase: 0 },
    { dur: 9, phase: (2 / 9) * Math.PI * 2 },
    { dur: 7, phase: (4 / 7) * Math.PI * 2 },
  ];
  const TOTAL_ELECTRONS = ORBIT_DEFS.length;

  const [hitCount, setHitCount] = useState(0);
  const [hintVisible, setHintVisible] = useState(false);

  const buildElectrons = () => {
    electronsRef.current = ORBIT_DEFS.map((def) => ({
      speed: (2 * Math.PI) / def.dur,
      phase: def.phase,
      hit: false,
    }));
    spawnTimeRef.current = performance.now();
    gameActiveRef.current = true;
    setHitCount(0);
  };

  useEffect(() => {
    buildElectrons();

    const loop = (now) => {
      if (gameActiveRef.current) {
        const elapsed = (now - spawnTimeRef.current) / 1000;
        electronsRef.current.forEach((e, i) => {
          if (e.hit) return;
          const angle = e.phase + elapsed * e.speed;
          const x = 100 + 82 * Math.cos(angle);
          const y = 100 + 30 * Math.sin(angle);
          const dot = dotRefs.current[i];
          const hitArea = hitAreaRefs.current[i];
          if (dot) { dot.setAttribute('cx', x); dot.setAttribute('cy', y); }
          if (hitArea) { hitArea.setAttribute('cx', x); hitArea.setAttribute('cy', y); }
        });
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleElectronHit = (index) => {
    if (!gameActiveRef.current) return;
    const electron = electronsRef.current[index];
    if (!electron || electron.hit) return;

    electron.hit = true;
    const dot = dotRefs.current[index];
    if (dot) {
      dot.style.fill = '#8ff0c0';
      dot.setAttribute('r', '5.5');
    }
    setHintVisible(true);

    setHitCount((c) => {
      const next = c + 1;
      if (next >= TOTAL_ELECTRONS) {
        gameActiveRef.current = false;
        setTimeout(shakeAtom, 250);
      }
      return next;
    });
  };

  const shakeAtom = () => {
    const wrapper = shakeWrapperRef.current;
    if (!wrapper) return;
    const duration = 650;
    const start = performance.now();
    const step = (now) => {
      const t = now - start;
      if (t > duration) {
        wrapper.setAttribute('transform', 'translate(0,0)');
        explodeAtom();
        return;
      }
      const mag = 6 * (1 - t / duration);
      const dx = (Math.random() - 0.5) * 2 * mag;
      const dy = (Math.random() - 0.5) * 2 * mag;
      wrapper.setAttribute('transform', `translate(${dx},${dy})`);
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const explodeAtom = () => {
    spawnParticles();
    const group = atomGroupRef.current;
    if (group) {
      group.style.transition = 'transform 0.55s cubic-bezier(.2,.7,.3,1), opacity 0.55s ease-out';
      group.style.transform = 'rotate(90deg) scale(2.4)';
      group.style.opacity = '0';
    }

    setTimeout(() => {
      dotRefs.current.forEach((dot) => {
        if (dot) {
          dot.style.fill = '#ffffff';
          dot.setAttribute('r', '4');
        }
      });
      buildElectrons();
      setHintVisible(false);

      if (group) {
        group.style.transition = 'none';
        group.style.transform = 'rotate(90deg) scale(0.4)';
        group.style.opacity = '0';
        void group.offsetWidth; // force reflow
        group.style.transition = 'transform 0.5s cubic-bezier(.2,.8,.3,1), opacity 0.5s ease-in';
        group.style.transform = 'rotate(90deg) scale(1)';
        group.style.opacity = '1';
      }
    }, 600);
  };

  const spawnParticles = () => {
    const layer = particlesRef.current;
    if (!layer) return;
    const NS = 'http://www.w3.org/2000/svg';
    const count = 14;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3;
      const dist = 40 + Math.random() * 45;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      const p = document.createElementNS(NS, 'circle');
      p.setAttribute('cx', 100);
      p.setAttribute('cy', 100);
      p.setAttribute('r', 1.4 + Math.random() * 1.4);
      p.setAttribute('fill', Math.random() > 0.5 ? '#cfd1f0' : '#8ff0c0');
      p.style.transition = 'transform 0.7s ease-out, opacity 0.7s ease-out';
      p.style.transform = 'translate(0px,0px)';
      p.style.opacity = '1';
      layer.appendChild(p);
      requestAnimationFrame(() => {
        p.style.transform = `translate(${dx}px,${dy}px)`;
        p.style.opacity = '0';
      });
      setTimeout(() => p.remove(), 750);
    }
  };

  return (
      <div className="w-full animate-fade-in">
        <section className="relative min-h-screen flex flex-col items-center justify-start pt-28 sm:pt-32 text-center px-5 sm:px-8 md:px-10 overflow-hidden">
          {/* Background Gradient Glow */}
          <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_45%,rgba(154,157,212,0.12)_0%,transparent_65%)]" />

          {/* ATOM VISUAL: doubles as a hidden click-the-electron game */}
          <div className="relative z-10 mb-8 drop-shadow-[0_0_20px_rgba(154,157,212,0.5)]">
            <svg
                viewBox="0 0 200 200"
                className="w-[280px] sm:w-[350px] md:w-[420px] h-[280px] sm:h-[350px] md:h-[420px] mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                style={{ overflow: 'visible' }}
            >
              <g ref={shakeWrapperRef} transform="translate(0,0)">
                <g
                    ref={atomGroupRef}
                    style={{ transformOrigin: '100px 100px', transform: 'rotate(90deg)', opacity: 1 }}
                >
                  {/* Nucleus */}
                  <circle cx="100" cy="100" r="7" fill="#ffffff" />

                  {[0, 1, 2].map((i) => {
                    const rotation = i === 0 ? 0 : i === 1 ? 60 : -60;
                    return (
                        <g key={i} transform={rotation ? `rotate(${rotation} 100 100)` : undefined}>
                          <ellipse cx="100" cy="100" rx="82" ry="30" fill="none" stroke="#9a9dd4" strokeWidth="1.2" opacity="0.4" />
                          {/* Invisible, oversized click target */}
                          <circle
                              ref={(el) => (hitAreaRefs.current[i] = el)}
                              r="13"
                              fill="transparent"
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleElectronHit(i)}
                          />
                          {/* Visible electron */}
                          <circle
                              ref={(el) => (dotRefs.current[i] = el)}
                              r="4"
                              fill="#ffffff"
                              style={{ pointerEvents: 'none', transition: 'fill 0.15s ease, r 0.15s ease' }}
                          />
                        </g>
                    );
                  })}
                </g>
              </g>
              {/* Explosion particles render here, outside the shaking/scaling group */}
              <g ref={particlesRef} />
            </svg>

            {/* Faint hint — only appears once the game is actually being played */}
            <div
                className="text-center text-[11px] font-medium tracking-wide text-[#9a9dd4] mt-1 transition-opacity duration-300"
                style={{ opacity: hintVisible && hitCount < TOTAL_ELECTRONS ? 0.6 : 0 }}
            >
              {hitCount}/{TOTAL_ELECTRONS}
            </div>
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
                className="border border-[#9a9dd4]/40 text-[#b0b3e0] px-7 py-3 rounded-md font-['Nexa_Free'] font-extrabold text-[14px] hover:bg-white/5 transition-all cursor-pointer w-full sm:w-auto text-center"
            >
              When We Meet
            </button>
          </div>
        </section>
      </div>
  );
};
