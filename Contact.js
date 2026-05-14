/**
 * CONTACT COMPONENT
 * Expanded layout: 1400px container width for maximum screen usage.
 * Typography: 20px body text and 16px labels for high readability.
 */
window.Contact = function Contact() {
  return (
      <div className="min-h-screen bg-[#0f1128] text-[#f0f0f8] font-sans selection:bg-[#9296c8]/30 animate-fade-in">

        {/* 1400px container matching site-wide ultra-wide standard */}
        <div className="max-w-[1400px] mx-auto px-10 py-[120px] pb-[120px]">

          {/* Simplified Header: Uniform font and optimized size */}
          <h1 className="font-['Raleway'] text-[clamp(32px,5vw,48px)] font-semibold tracking-tight leading-[1.2] mb-4 text-[#a8abdb]">
            Get In Touch
          </h1>
          <p className="text-[20px] text-[#f0f0f8]/60 mb-16 leading-relaxed">
            We'd love to hear from you — students, researchers, and partners alike.
          </p>

          {/* TWO-COL CONTACT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-16">

            <div className="space-y-8">
              <div className="font-['Raleway'] text-[16px] font-bold tracking-[0.22em] uppercase text-[#9296c8]">
                For Students
              </div>
              <h2 className="text-[28px] font-semibold text-white">Visit Us</h2>
              <p className="text-[20px] text-[#f0f0f8]/80 leading-[1.9]">
                Looking to get involved or attend a workshop? The best way to find us is in person.
              </p>

              <div className="pt-8 border-t border-white/10">
                <div className="font-['Raleway'] text-[13px] font-bold tracking-[0.14em] uppercase text-[#9296c8] mb-3">
                  Location
                </div>
                <div className="text-[22px] font-semibold text-white mb-3">
                  Physics Toll 2124
                </div>
                <p className="text-[18px] text-[#f0f0f8]/60 leading-relaxed">
                  Check the <a href="#events" className="text-[#a8abdb] border-b border-[#a8abdb]/30 hover:border-[#a8abdb] transition-colors">Events</a> page for specific meeting dates and times.
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="font-['Raleway'] text-[16px] font-bold tracking-[0.22em] uppercase text-[#9296c8]">
                For Partners
              </div>
              <h2 className="text-[28px] font-semibold text-white">Contact Us</h2>
              <p className="text-[20px] text-[#f0f0f8]/80 leading-[1.9]">
                For research collaborations, industry partnerships, or general administrative inquiries, please reach out to our executive board.
              </p>
              <div className="pt-8 border-t border-white/10 italic text-[18px] text-[#f0f0f8]/50 leading-relaxed">
                All inquiries are monitored by our board, and we will get back to you as soon as possible.
              </div>
            </div>

          </div>

          <hr className="border-none border-t border-white/10 mb-16" />

          {/* EMAIL CTA SECTION */}
          <div className="text-center py-10">
            <p className="text-[20px] text-[#f0f0f8]/60 mb-10">
              Prefer direct messaging? Reach us via email.
            </p>

            <a
                href="mailto:umd_uqa@gmail.com"
                className="inline-flex items-center gap-4 bg-[#9a9dd4]/15 border border-[#9a9dd4]/35 text-[#a8abdb] px-10 py-5 rounded-lg transition-all text-[18px] font-bold hover:bg-[#9a9dd4]/25 mb-6"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/>
              </svg>
              Email Us
            </a>

            <div className="text-[18px]">
              <a href="mailto:umd_uqa@gmail.com" className="text-[#a8abdb] border-b border-[#a8abdb]/30 hover:border-[#a8abdb] transition-colors">
                umd_uqa@gmail.com
              </a>
            </div>
          </div>

        </div>
      </div>
  );
};
{/* TWO-COL CONTACT GRID */}
