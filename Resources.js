const { useState } = window.React;

window.Resources = function Resources() {
  // --- STATE FOR DROPDOWN VIDEO MENU ---
  const [activeVideo, setActiveVideo] = useState("agOdzgWTr-Y");

  const videoResources = [
    { id: "agOdzgWTr-Y", title: "QUERA Workshop 1" },
    { id: "i_MKOCxInOQ", title: "QUERA Quantum Challenge Walkthrough" },
    { id: "xEa3WIzgxDQ", title: "QUERA Workshop 2" }
  ];

  // --- UQA LECTURES ---
  const uqaPresentations = [
    { title: "Intro to Quantum Computing", link: "https://docs.google.com/presentation/d/1bGQW5ZHiP69EGtNNrue6r17IT3a_Wy68/edit?usp=sharing", category: "Intro" },
    { title: "Intro to Quantum Science & Tech", link: "https://docs.google.com/presentation/d/1L-pnUIX8-Oi_3yKMdaxhA9xWEE19dAAzyV7X0St_O4I/edit?usp=sharing", category: "Intro" },
    { title: "CHSH Game", link: "https://docs.google.com/presentation/d/14-I5L8XVgem824K5SYbRdeYHeXoRQ_as/edit?usp=sharing", category: "Specific Topics" },
    { title: "QuEra Intro", link: "https://docs.google.com/presentation/d/1owfEtq9Vm_r-tKQn5uNuWE_pLUlX9M-Aq-T-YQF_oNg/edit", category: "Semester Relevant" }
  ];

  // --- DEV TOOLS & PLATFORMS ---
  const devTools = [
    { title: "QuEra Slack (#umd-uqa)", link: "https://join.slack.com/t/querapublic/shared_invite/zt-1r86wjwxs-OcdmXqBOisO~AHISXTL80w", desc: "Mentors, Office Hours & Q&A" },
    { title: "Bloqade GitHub", link: "https://github.com/QuEraComputing/bloqade", desc: "Neutral atom computing" },
    { title: "Starter Tutorials", link: "https://github.com/QuEraComputing/quera-education", desc: "QuEra educational code" },
    { title: "Awesome Quantum Computing", link: "https://github.com/desireevl/awesome-quantum-computing", desc: "Huge repository of resources" }
  ];

  const platforms = [
    { title: "IBM Quantum Learning", link: "https://quantum.cloud.ibm.com/learning/en" },
    { title: "Pennylane (QML)", link: "https://pennylane.ai/qml/demonstrations" },
    { title: "Neutral Atom / QuEra", link: "https://qbook.quera.com/" },
    { title: "Qubit.guide", link: "https://qubit.guide/" }
  ];

  return (
      <div className="min-h-screen pb-32 px-6 w-full" style={{ background: '#09091F' }}>
        <div className="max-w-6xl mx-auto">

          {/* 1. HEADER */}
          <div className="pt-28 mb-12">
            <h1 className="text-5xl md:text-7xl font-light tracking-tight text-white">
              UQA <span className="text-[#9B6EFF]">Resources</span>
            </h1>
          </div>

          {/* 2. THE VIDEO DROPDOWN MENU */}
          <div className="mb-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-white/5 pb-4">
              <h2 className="text-2xl font-light text-white">Featured Videos</h2>

              <select
                  value={activeVideo}
                  onChange={(e) => setActiveVideo(e.target.value)}
                  className="bg-[#11112b] border border-white/10 text-white text-sm rounded-xl px-4 py-2 outline-none focus:border-[#9B6EFF] transition-colors cursor-pointer"
              >
                {videoResources.map(video => (
                    <option key={video.id} value={video.id}>
                      {video.title}
                    </option>
                ))}
              </select>
            </div>

            <div className="w-full aspect-video rounded-[2.5rem] overflow-hidden border border-white/5 bg-[#11112b] shadow-2xl">
              <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${activeVideo}`}
                  title="Quantum Video Player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* 3. UQA LECTURES */}
          <div className="mb-16">
            <h2 className="text-2xl font-light text-white mb-6 border-b border-white/5 pb-4">UQA Created Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {uqaPresentations.map((item, i) => (
                  <a
                      key={i} href={item.link} target="_blank" rel="noopener noreferrer"
                      className="p-8 rounded-[2rem] border border-white/5 bg-[#11112b] hover:border-[#9B6EFF]/50 transition-all no-underline flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#9B6EFF] mb-2 block">{item.category}</span>
                      <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                    </div>
                    <div className="mt-6 text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
                      Open Slides →
                    </div>
                  </a>
              ))}
            </div>
          </div>

          {/* 4. PRIMARY TOOL: Vercel Graph */}
          <div className="mb-16 group relative p-[1px] rounded-[2.5rem] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#C084FC] to-[#9B6EFF] opacity-30 group-hover:opacity-50 transition-opacity" />
            <div className="relative h-full bg-[#11112b] p-8 md:p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-3xl font-bold text-white mb-3">Quantum Coalition Learning Graph</h3>
                <p className="text-[#9B97C2] font-light max-w-2xl">
                  The visual, interactive roadmap for learning quantum protocols, math prerequisites, and IBM course mappings.
                </p>
              </div>
              <a
                  href="https://quantum-coalition-learning-resource.vercel.app/graph"
                  target="_blank" rel="noopener noreferrer"
                  className="shrink-0 px-8 py-4 rounded-xl bg-white text-black font-bold hover:bg-[#C084FC] hover:text-white transition-all no-underline"
              >
                Launch Graph ↗
              </a>
            </div>
          </div>

          {/* 5. REPOS & COMMUNITY */}
          <div className="mb-16">
            <h2 className="text-2xl font-light text-white mb-6 border-b border-white/5 pb-4">Repositories & Community</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {devTools.map((item, i) => (
                  <a
                      key={i} href={item.link} target="_blank" rel="noopener noreferrer"
                      className="p-6 rounded-3xl border border-white/5 bg-[#11112b] hover:border-[#C084FC]/50 transition-all no-underline flex flex-col"
                  >
                    <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                    <p className="text-[#9B97C2] text-sm flex-grow">{item.desc}</p>
                  </a>
              ))}
            </div>
          </div>

          {/* 6. PLATFORMS & TEXTBOOKS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            <div className="p-8 rounded-[2.5rem] border border-white/5 bg-[#11112b]">
              <h3 className="text-xl font-bold text-white mb-6">Learning Platforms & Demos</h3>
              <div className="flex flex-col gap-3">
                {platforms.map((item, i) => (
                    <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="p-4 rounded-xl border border-white/5 bg-[#09091F] text-white text-sm hover:bg-white/5 transition-colors flex justify-between items-center no-underline">
                      {item.title} <span className="text-[#9B6EFF]">↗</span>
                    </a>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-[2.5rem] border border-white/5 bg-[#11112b] flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Textbooks & Notes</h3>
                <ul className="space-y-4">
                  <li className="text-slate-400 text-sm"><strong className="text-white block">Quantum Computation and Information</strong> Nielsen and Chuang</li>
                  <li className="text-slate-400 text-sm"><strong className="text-white block">Quantum Physics (4th Edition)</strong> Griffiths and Schroeter</li>
                  <li>
                    <a href="https://www.lorentz.leidenuniv.nl/quantumcomputers/literature/preskill_1_to_6.pdf" target="_blank" rel="noopener noreferrer" className="text-[#9B6EFF] text-sm hover:underline font-bold flex items-center gap-2 mt-4">
                      Preskill's Lecture Notes ↗
                    </a>
                  </li>
                </ul>
              </div>

              <a href="https://discord.com/channels/904445219926323241/1414590353197109288/1422352189212459022" target="_blank" rel="noopener noreferrer" className="mt-8 p-4 rounded-xl border border-[#5865F2]/20 bg-[#5865F2]/10 text-[#5865F2] text-sm font-bold text-center hover:bg-[#5865F2] hover:text-white transition-all block no-underline">
                Open UQA Discord Channel
              </a>
            </div>

          </div>

        </div>
      </div>
  );
};