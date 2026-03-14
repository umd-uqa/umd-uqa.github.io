const React = window.React || require('react');

window.Contact = function Contact() {
  return (
      <div className="min-h-screen pb-24 px-6 w-full" style={{ background: '#09091F' }}>
        <div className="max-w-5xl mx-auto">

          {/* 1. Header: pt-28 (Middle ground between 12 and 44). */}
          <div className="pt-28 mb-8 text-center">
            <h1 className="text-6xl md:text-7xl font-light tracking-tight text-white">
              Get In <span className="text-[#C084FC]">Touch</span>
            </h1>
            <p className="text-[#9B97C2] mt-6 text-lg font-light tracking-wide max-w-2xl mx-auto">
              We'd love to hear from you — students, researchers, and partners alike.
            </p>
          </div>

          {/* 2. Contact Cards Grid: mt-12 (Middle ground between 2 and 16). */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">

            {/* Card: For Students */}
            <div className="p-10 rounded-[2.5rem] border border-[#9B6EFF]/20"
                 style={{ backgroundColor: 'rgba(155, 110, 255, 0.05)' }}>
              <h4 className="text-[#9B6EFF] text-xs font-bold uppercase tracking-widest mb-4">For Students</h4>
              <h3 className="text-4xl font-bold text-white mb-6">Visit Us</h3>
              <p className="text-[#9B97C2] font-light leading-relaxed mb-8">
                Looking to get involved or attend a workshop? The best way to find us is in person.
              </p>

              <div className="p-6 rounded-2xl bg-[#09091F]/50 border border-white/5">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#9B6EFF]/10 flex items-center justify-center shrink-0">
                    <span className="text-[#9B6EFF] text-lg">📍</span>
                  </div>
                  <div>
                    <h5 className="text-white font-bold mb-1">Location</h5>
                    <p className="text-[#C084FC] font-bold mb-2">Physics Toll 2124</p>
                    <p className="text-xs text-[#9B97C2] italic leading-normal">
                      Check the <a href="#events" className="text-[#9B6EFF] underline decoration-[#9B6EFF]/30 underline-offset-2">Events</a> page for specific meeting dates and times.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card: For Partners */}
            <div className="p-10 rounded-[2.5rem] border border-white/5"
                 style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
              <h4 className="text-[#E040FB] text-xs font-bold uppercase tracking-widest mb-4">For Partners</h4>
              <h3 className="text-4xl font-bold text-white mb-6">Contact Us</h3>
              <p className="text-[#9B97C2] font-light leading-relaxed mb-8">
                For research collaborations, industry partnerships, or general administrative inquiries, please reach out to our executive board.
              </p>

              <div className="p-6 rounded-2xl bg-[#09091F]/50 border border-white/5">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#E040FB] mt-1.5 shrink-0" />
                  <p className="text-sm text-[#9B97C2] italic leading-relaxed">
                    All inquiries are monitored by our board, and we will get back to you as soon as possible.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Footer Email Section: mt-16 to maintain the visual airiness */}
          <div className="mt-16 pt-10 border-t border-white/5 text-center">
            <p className="text-[#9B97C2] mb-8 font-light">Prefer direct messaging? Reach us via email:</p>
            <a href="mailto:umd.uqa@gmail.com"
               className="inline-flex items-center gap-3 px-8 py-4 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all no-underline mb-6">
              <span className="text-lg">✉️</span>
              <span className="font-medium">Email Us</span>
            </a>
            <p className="text-[#9B6EFF] font-mono text-sm">umd.uqa@gmail.com</p>
          </div>

        </div>
      </div>
  );
};