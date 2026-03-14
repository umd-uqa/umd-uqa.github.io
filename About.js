const React = window.React || require('react');

window.About = function About() {
  return (
      <div className="min-h-screen text-white pb-32 px-6 w-full" style={{ background: '#09091F' }}>
        <div className="max-w-5xl mx-auto">

          {/* 1. Header: Keeps the pt-44 drop for nav bar clearance */}
          <div className="pt-28 mb-20">
            <h1 className="text-5xl md:text-6xl font-light tracking-tight leading-tight">
              About{' '}
              <span style={{
                background: 'linear-gradient(to right, #7C3AED, #C084FC)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
              UMD UQA
            </span>
            </h1>
          </div>

          {/* 2. Mission & Vision */}
          <div className="space-y-14 mb-20"> {/* Reduced mb-28 to mb-20 */}
            <div className="flex">
              <div className="w-[3px] rounded-full flex-shrink-0 mr-8" style={{ background: 'linear-gradient(to bottom, #9B6EFF, #C084FC)' }} />
              <div>
                <h3 className="text-xs font-bold uppercase mb-4" style={{ color: '#9B6EFF', letterSpacing: '0.15em' }}>Our Mission</h3>
                <p className="text-lg md:text-xl leading-relaxed font-light" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  The Undergraduate Quantum Association is committed to making quantum technologies
                  accessible and understandable to undergraduate students of all majors and backgrounds.
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="w-[3px] rounded-full flex-shrink-0 mr-8" style={{ background: 'linear-gradient(to bottom, #E040FB, #C084FC)' }} />
              <div>
                <h3 className="text-xs font-bold uppercase mb-4" style={{ color: '#E040FB', letterSpacing: '0.15em' }}>Our Vision</h3>
                <p className="text-lg md:text-xl leading-relaxed font-light" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  We envision a community where students can freely explore quantum concepts and build
                  connections with peers who share their passion for quantum science.
                </p>
              </div>
            </div>
          </div>

          {/* Divider: Tightened mb-20 to mb-12 to fix the 'big space' */}
          <div className="h-px w-full mb-12" style={{ background: 'rgba(155,110,255,0.15)' }} />

          {/* 3. Why Join UQA? - All 4 cards restored */}
          <h2 className="text-4xl md:text-5xl font-light mb-12 tracking-tight">Why Join UQA?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Learn & Grow */}
            <div className="p-8 rounded-2xl" style={{ background: 'rgba(124,58,237,0.10)', border: '1px solid rgba(155,110,255,0.25)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: 'rgba(155,110,255,0.15)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9B6EFF" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h4 className="font-semibold text-lg mb-3" style={{ color: '#9B6EFF' }}>Learn &amp; Grow</h4>
              <p className="leading-relaxed text-sm" style={{ color: '#9B97C2' }}>
                Access workshops, tutorials, and resources to build your quantum computing skills from beginner to advanced levels.
              </p>
            </div>

            {/* Network */}
            <div className="p-8 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: 'rgba(224,64,251,0.12)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E040FB" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
              </div>
              <h4 className="font-semibold text-lg mb-3" style={{ color: '#E040FB' }}>Network</h4>
              <p className="leading-relaxed text-sm" style={{ color: '#9B97C2' }}>
                Connect with like-minded students, researchers, and industry professionals in the quantum computing field.
              </p>
            </div>

            {/* Hands-On Experience */}
            <div className="p-8 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: 'rgba(192,132,252,0.12)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C084FC" strokeWidth="2" strokeLinecap="round">
                  <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                </svg>
              </div>
              <h4 className="font-semibold text-lg mb-3" style={{ color: '#C084FC' }}>Hands-On Experience</h4>
              <p className="leading-relaxed text-sm" style={{ color: '#9B97C2' }}>
                Work on real quantum computing projects using platforms like IBM Qiskit and participate in hackathons.
              </p>
            </div>

            {/* Community */}
            <div className="p-8 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2" strokeLinecap="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                </svg>
              </div>
              <h4 className="font-semibold text-lg mb-3" style={{ color: 'rgba(255,255,255,0.75)' }}>Community</h4>
              <p className="leading-relaxed text-sm" style={{ color: '#9B97C2' }}>
                Be part of a welcoming community that supports your academic and professional growth in quantum technologies.
              </p>
            </div>

          </div>
        </div>
      </div>
  );
};