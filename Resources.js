const React = window.React || require('react');

window.Resources = function Resources() {
  const resourceGroups = [
    {
      title: "Semester Relevant",
      items: [
        { name: "QuEra Intro", desc: "Introduction to neutral atom quantum computing and the Aquila processor.", link: "#" },
        { name: "QuEra Slack", desc: "Join the community for technical support and neutral atom discussions.", link: "#" },
        { name: "Bloqade GitHub", desc: "The SDK for neutral atom quantum computing based on the Julia language.", link: "#" },
        { name: "Starter Tutorials", desc: "Guided notebooks to get your first neutral atom programs running.", link: "#" }
      ]
    },
    {
      title: "Introductory Materials",
      items: [
        { name: "Intro to Quantum Computing", desc: "A high-level overview of qubits, gates, and quantum advantage.", link: "#" },
        { name: "Intro to Quantum Science", desc: "The underlying physics and technology of modern quantum systems.", link: "#" },
        { name: "CHSH Game", desc: "Interactive visualization of Bell's Inequality and quantum non-locality.", link: "#" }
      ]
    },
    {
      title: "Commonly Used Resources",
      items: [
        { name: "Nielsen & Chuang", desc: "The 'Bible' of Quantum Computation and Quantum Information.", link: "#" },
        { name: "Preskill's Notes", desc: "Advanced lecture notes on quantum information and computation.", link: "#" },
        { name: "John Watrous Video Series", desc: "The IBM 'Introduction to Quantum Information' lecture series.", link: "#" },
        { name: "IBM Quantum Learning", desc: "Official courses, lab access, and the Qiskit textbook.", link: "#" },
        { name: "Pennylane", desc: "Python library for quantum machine learning and automatic differentiation.", link: "#" },
        { name: "Qubit.guide", desc: "Curated learning paths for beginners and experts alike.", link: "#" },
        { name: "Repository of Resources", desc: "The massive UQA collection of papers, tools, and extra materials.", link: "#" }
      ]
    }
  ];

  return (
      <div className="min-h-screen pb-32 px-6 w-full" style={{ background: '#09091F' }}>
        <div className="max-w-6xl mx-auto">

          {/* 1. Header: pt-28 spacing as requested */}
          <div className="pt-28 mb-16">
            <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-tight text-white">
              Quantum <span className="text-[#9B6EFF]">Resources</span>
            </h1>
          </div>

          {/* 2. Resource Sections */}
          <div className="space-y-20">
            {resourceGroups.map((group, idx) => (
                <div key={idx}>

                  {/* Section Header with Line */}
                  <div className="flex items-center gap-6 mb-4">
                    <h2 className="text-3xl font-light text-white whitespace-nowrap">
                      {group.title}
                    </h2>
                    <div className="h-[1px] w-full bg-white/10" />
                  </div>

                  {/* Resource Grid: mt-12 spacing applied here */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                    {group.items.map((item, i) => (
                        <a
                            key={i}
                            href={item.link}
                            className="block p-10 rounded-[2.5rem] border border-white/[0.03] transition-colors hover:bg-[#161635] no-underline"
                            style={{ backgroundColor: '#11112b' }}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-white tracking-wide">
                              {item.name}
                            </h3>
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                              <span className="text-white/30 text-sm">↗</span>
                            </div>
                          </div>
                          <p className="text-[#9B97C2] font-light text-[15px] leading-relaxed">
                            {item.desc}
                          </p>
                        </a>
                    ))}
                  </div>
                </div>
            ))}
          </div>

        </div>
      </div>
  );
};