/**
 * ABOUT US COMPONENT
 * Expanded layout: 1400px container width for better screen usage.
 * Typography: 20px body text and 16px labels for high readability.
 */
window.About = function About({ navigateTo }) {
  return (
      <div className="min-h-screen bg-[#0f1128] text-[#f0f0f8] font-sans selection:bg-[#9296c8]/30 animate-fade-in">

        {/* Container expanded to 1400px with responsive mobile padding */}
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 md:px-10 py-24 sm:py-28 md:py-[120px] pb-16 sm:pb-24 md:pb-[120px]">

          {/* Simplified Header: Consistent weight and size */}
          <h1 className="font-['Nexa_Free'] text-[clamp(32px,5vw,48px)] font-extrabold tracking-tight leading-[1.2] mb-12 text-[#a8abdb]">
            About UMD Undergraduate Quantum Association
          </h1>

          {/* WHO WE ARE SECTION */}
          <section className="mb-10">
            {/* Label size consistent with large-scale UI */}
            <h2 className="font-['Nexa_Free'] text-[16px] font-extrabold tracking-[0.22em] uppercase text-[#9296c8] mb-8">
              Who We Are
            </h2>
            {/* Body text at 20px for clear readability on wide displays */}
            <div className="space-y-6 text-[20px] text-[#f0f0f8]/80 leading-[1.9]">
              <p>
                The Undergraduate Quantum Association (UQA) is a research and career-oriented student organization
                which provides a space for students to engage with and learn more about quantum science.
                UQA helps to connect the campus community to the frontiers of quantum through various events.
              </p>
              <p>
                Our community consists of physics, computer science, and other majors who are eager to explore quantum science.
                Regardless of major, everyone is welcome at UQA.
                Follow along at the{" "}
                
                  href="#schedule"
                  onClick={(e) => {
                    if (navigateTo) {
                      e.preventDefault();
                      navigateTo('schedule');
                    }
                  }}
                  className="text-[#a8abdb] border-b border-[#b0b3e0]/30 hover:border-[#b0b3e0] transition-colors"
                >
                  schedule
                </a>
                {" "}or join our{" "}
                <a href="https://discord.gg/qtqcAjhRVP" target="_blank" rel="noopener noreferrer" className="text-[#a8abdb] border-b border-[#b0b3e0]/30 hover:border-[#b0b3e0] transition-colors">
                  Discord server
                </a>
                {" "}for announcements about meetings, events, and opportunities.
              </p>
            </div>
          </section>

          <hr className="border-none border-t border-white/10 mb-10" />

          {/* WHAT WE DO SECTION */}
          <section className="mb-10">
            <h2 className="font-['Nexa_Free'] text-[16px] font-extrabold tracking-[0.22em] uppercase text-[#9296c8] mb-8">
              What We Do
            </h2>
            <ul className="space-y-7">
              {[
                "Taken tours to local facilities like IonQ, a quantum computing company focused on software and hardware development.",
                "Invited speakers from quantum industries to discuss their work via a speaker series.",
                "Invited UMD faculty to discuss quantum research opportunities on campus.",
                "Collaborated with hackathon organizations to create a quantum computing track."
              ].map((item, i) => (
                  <li key={i} className="relative pl-8 text-[20px] text-[#f0f0f8]/80 leading-[1.8] before:content-['—'] before:absolute before:left-0 before:text-[#9296c8]">
                    {item}
                  </li>
              ))}
            </ul>
          </section>

          <hr className="border-none border-t border-white/10 mb-10" />

          {/* WHY JOIN UQA? SECTION */}
          <section className="mb-10">
            <h2 className="font-['Nexa_Free'] text-[16px] font-extrabold tracking-[0.22em] uppercase text-[#9296c8] mb-8">
              Why Join UQA?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              <div className="space-y-3">
                <h3 className="font-['Nexa_Free'] font-extrabold text-[18px] text-white">Learn & Grow</h3>
                <p className="text-[16px] text-[#f0f0f8]/60 leading-[1.75]">Access workshops, tutorials, and resources to build your quantum computing skills from beginner to advanced levels.</p>
              </div>
              <div className="space-y-3">
                <h3 className="font-['Nexa_Free'] font-extrabold text-[18px] text-white">Network</h3>
                <p className="text-[16px] text-[#f0f0f8]/60 leading-[1.75]">Connect with like-minded students, researchers, and industry professionals in the quantum computing field.</p>
              </div>
              <div className="space-y-3">
                <h3 className="font-['Nexa_Free'] font-extrabold text-[18px] text-white">Hands-On Experience</h3>
                <p className="text-[16px] text-[#f0f0f8]/60 leading-[1.75]">Work on real quantum computing projects using platforms like IBM Qiskit and participate in hackathons.</p>
              </div>
              <div className="space-y-3">
                <h3 className="font-['Nexa_Free'] font-extrabold text-[18px] text-white">Community</h3>
                <p className="text-[16px] text-[#f0f0f8]/60 leading-[1.75]">Be part of a welcoming community that supports your academic and professional growth in quantum technologies.</p>
              </div>
            </div>
          </section>

          <hr className="border-none border-t border-white/10 mb-10" />

          {/* SUPPORTED BY SECTION */}
          <section className="mb-10">
            <h2 className="font-['Nexa_Free'] text-[16px] font-extrabold tracking-[0.22em] uppercase text-[#9296c8] mb-8">
              Supported By
            </h2>
            <div className="text-[20px] text-[#f0f0f8]/80 leading-[1.9] mb-6">
              <p>
                Supported by the{" "}
                
                  href="https://rqs.umd.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#a8abdb] border-b border-[#b0b3e0]/30 hover:border-[#b0b3e0] transition-colors"
                >
                  Institute for Robust Quantum Simulation (RQS)
                </a>
                .
              </p>
            </div>
            <div className="pt-2">
              
                href="https://rqs.umd.edu/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block transition-transform hover:scale-105 focus:outline-none"
              >
                <img
                  src="nsf-rqs-logo.png"
                  alt="Institute for Robust Quantum Simulation (RQS) Logo"
                  className="h-14 sm:h-16 md:h-20 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
                />
              </a>
            </div>
          </section>

          <div className="mt-[80px] pt-8 border-t border-white/10 text-[18px] text-[#f0f0f8]/60 text-center">
            <strong className="font-extrabold text-white">Weekly General Body Meetings</strong> — Every Wednesday at 6:00 PM · Room 2124, John S. Toll Physics Building
          </div>

        </div>
      </div>
  );
};
      </div>
  );
};
