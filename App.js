const { useState, useEffect } = React;

function UMDUQAWebsite() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      setCurrentPage(hash);
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (id) => {
    window.location.hash = id;
  };

  const navigation = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'events', label: 'Events' },    // Keeping the original
    { id: 'calendar', label: 'Calendar' }, // Adding the new one
    { id: 'resources', label: 'Resources' }
  ];

  return (
      <div className="min-h-screen bg-[#232742] text-slate-200 font-sans">
        <nav className="bg-[#232742] border-b border-[#3b4166] sticky top-0 z-50">
          <div className="w-full px-6 lg:px-12 py-4">

            {/* RESPONSIVE ENGINE:
            - On large screens (xl:), it uses a 3-column grid for perfect centering.
            - On medium screens (md:), it uses flex-wrap to prevent overlap.
            - On small screens, it stacks everything centered.
         */}
            <div className="flex flex-col md:flex-row md:flex-wrap xl:grid xl:grid-cols-3 items-center justify-between gap-y-4">

              {/* 1. LEFT SECTION: LOGO */}
              <div
                  className="flex justify-center md:justify-start cursor-pointer flex-shrink-0"
                  onClick={() => navigateTo('home')}
              >
                <img
                    src="UQA_White.png"
                    alt="UQA Logo"
                    className="h-16 md:h-20 w-auto object-contain transition-transform hover:scale-105"
                />
              </div>

              {/* 2. CENTER SECTION: NAVIGATION LINKS */}
              <div className="flex justify-center items-center gap-6 md:gap-8 lg:gap-12">
                {navigation.map(item => (
                    <button
                        key={item.id}
                        onClick={() => navigateTo(item.id)}
                        className={`text-base lg:text-lg transition-colors font-light tracking-wide whitespace-nowrap ${
                            currentPage === item.id ? 'text-[#7c7fc4]' : 'text-slate-300 hover:text-[#7c7fc4]'
                        }`}
                    >
                      {item.label}
                    </button>
                ))}
              </div>

              {/* 3. RIGHT SECTION: SOCIALS & CTA */}
              <div className="flex flex-wrap justify-center md:justify-end items-center gap-4 lg:gap-8">
                <div className="flex items-center gap-4 border-r border-[#3b4166] pr-4 md:border-none md:pr-0">
                  <a href="https://www.instagram.com/umd.uqa/" target="_blank" className="hover:opacity-100 opacity-70 transition-opacity">
                    <img src="https://cdn.simpleicons.org/instagram/E4405F" alt="Instagram" className="h-5 w-5" />
                  </a>
                  <a href="https://www.linkedin.com/company/umduqa/" target="_blank" className="hover:opacity-100 opacity-70 transition-opacity">
                    <img src="https://img.icons8.com/ios-filled/50/7c7fc4/linkedin.png" alt="LinkedIn" className="h-5 w-5" />
                  </a>
                </div>

                <button
                    onClick={() => navigateTo('contact')}
                    className="bg-[#7c7fc4] hover:bg-white hover:text-[#232742] text-white px-6 lg:px-8 py-2.5 rounded-full transition-all shadow-lg text-sm lg:text-base font-medium whitespace-nowrap"
                >
                  Contact UMD UQA
                </button>
              </div>

            </div>
          </div>
        </nav>

        <main className="animate-fade-in">
          {currentPage === 'home' && window.Home && <window.Home />}
          {currentPage === 'about' && window.About && <window.About />}
          {currentPage === 'events' && window.Events && <window.Events />}
          {/* Add the new Calendar logic here */}
          {currentPage === 'calendar' && window.Calendar && <window.Calendar />}
          {currentPage === 'resources' && window.Resources && <window.Resources />}
          {currentPage === 'contact' && window.Contact && <window.Contact />}

          {currentPage !== 'home' && !window[currentPage.charAt(0).toUpperCase() + currentPage.slice(1)] && (
              <div className="flex items-center justify-center min-h-[60vh] text-slate-400">
                <p className="animate-pulse">Initializing Quantum Module...</p>
              </div>
          )}
        </main>

        <footer className="bg-[#1a1c2e] border-t border-[#3b4166] mt-16">
          <div className="max-w-7xl mx-auto px-8 py-8 text-center text-slate-400 text-sm">
            <p>© 2026 UMD Undergraduate Quantum Association</p>
          </div>
        </footer>
      </div>
  );
}

const root = window.ReactDOM.createRoot(document.getElementById('root'));
root.render(<UMDUQAWebsite />);