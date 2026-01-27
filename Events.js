window.Events = function Events() {
  const [openSection, setOpenSection] = React.useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const eventStyle = "w-full text-left p-6 bg-[#2d3255] border border-[#3b4166] rounded-lg shadow-md transition-all hover:bg-[#3b4166] flex justify-between items-center";
  const contentStyle = "bg-[#1a1c2e] border-x border-b border-[#3b4166] rounded-b-lg p-8 animate-fade-in text-slate-300 leading-relaxed";

  return (
      <div className="max-w-4xl mx-auto px-8 py-16 min-h-screen">
        <h2 className="text-4xl font-light text-white mb-12 tracking-wide">
          Upcoming <span className="text-[#7c7fc4]">Events</span>
        </h2>

        <div className="space-y-6">
          {/* QLCN Dropdown */}
          <div className="dropdown-item">
            <button
                onClick={() => toggleSection('qlcn')}
                className={`${eventStyle} ${openSection === 'qlcn' ? 'rounded-b-none border-b-0' : ''}`}
            >
              <span className="text-2xl font-light text-white">QLCN</span>
              <span className="text-[#7c7fc4] text-xl">{openSection === 'qlcn' ? '−' : '+'}</span>
            </button>

            {openSection === 'qlcn' && (
                <div className={contentStyle}>
                  <h4 className="text-[#7c7fc4] mb-2 font-medium">Quantum Learning Coalition Network</h4>
                  <p>Details regarding the QLCN event will be posted here soon. Stay tuned for workshops and networking opportunities centered around quantum education.</p>
                </div>
            )}
          </div>

          {/* Bitcamp Dropdown */}
          <div className="dropdown-item">
            <button
                onClick={() => toggleSection('bitcamp')}
                className={`${eventStyle} ${openSection === 'bitcamp' ? 'rounded-b-none border-b-0' : ''}`}
            >
              <span className="text-2xl font-light text-white">Bitcamp</span>
              <span className="text-[#7c7fc4] text-xl">{openSection === 'bitcamp' ? '−' : '+'}</span>
            </button>

            {openSection === 'bitcamp' && (
                <div className={contentStyle}>
                  <h4 className="text-[#7c7fc4] mb-2 font-medium">UMD's Premier Hackathon</h4>
                  <p>UQA will be participating in Bitcamp! Information about our quantum track, hardware challenges, and mentorship will be updated here as the event approaches.</p>
                </div>
            )}
          </div>
        </div>

        <div className="mt-16 p-8 bg-[#232742] rounded-lg border border-[#3b4166] text-center">
          <p className="text-slate-400 italic">More events are currently being planned. Check the Calendar tab for the full schedule.</p>
        </div>
      </div>
  );
};