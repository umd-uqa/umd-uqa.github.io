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
    { id: 'events', label: 'Events' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'resources', label: 'Resources' }
  ];

  return (
      <div className="min-h-screen text-slate-200 font-sans" style={{
        background: 'linear-gradient(to bottom, #232742 0%, #1a1c2e 50%, #121425 100%)',
        backgroundColor: '#121425'
      }}>

        {/* DYNAMIC NAV WRAPPER: Handles floating position and side-padding on resize */}
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '0',
          right: '0',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none',
          padding: '0 12px'
        }}>
          <nav
              className="w-full max-w-7xl transition-all duration-500 ease-in-out"
              style={{
                pointerEvents: 'auto',
                backgroundColor: 'rgba(35, 39, 66, 0.4)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '100px',
                padding: '8px 16px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
              }}
          >
            {/* Internal Layout: Gaps scale from 2 to 10 based on width */}
            <div className="flex items-center justify-between gap-2 sm:gap-4 md:gap-8 lg:gap-10">

              {/* LOGO: Scales from h-8 to h-12 */}
              <div
                  className="flex-shrink-0 cursor-pointer"
                  onClick={() => navigateTo('home')}
              >
                <img
                    src="UQA_White.png"
                    alt="UQA Logo"
                    className="h-8 sm:h-9 md:h-12 w-auto object-contain transition-transform hover:scale-105"
                />
              </div>

              {/* NAVIGATION LINKS: Font size and gaps scale dynamically */}
              <div className="flex items-center justify-center flex-grow gap-2 sm:gap-4 md:gap-8 lg:gap-12">
                {navigation.map(item => (
                    <button
                        key={item.id}
                        onClick={() => navigateTo(item.id)}
                        className={`transition-colors font-medium tracking-wide whitespace-nowrap
                    text-[10px] sm:text-xs md:text-sm lg:text-base
                    ${currentPage === item.id ? 'text-[#7c7fc4]' : 'text-slate-300 hover:text-[#7c7fc4]'}
                  `}
                    >
                      {item.label}
                    </button>
                ))}
              </div>

              {/* SOCIALS & CTA: Hides socials on mobile, keeps button scaled */}
              <div className="flex items-center flex-shrink-0 gap-4">
                <div className="hidden xl:flex items-center gap-4">
                  <a href="https://www.instagram.com/umd.uqa/" target="_blank" className="hover:opacity-100 opacity-70 transition-opacity">
                    <img src="https://cdn.simpleicons.org/instagram/E4405F" alt="Instagram" className="h-4 w-4" />
                  </a>
                  <a href="https://www.linkedin.com/company/umduqa/" target="_blank" className="hover:opacity-100 opacity-70 transition-opacity">
                    <img src="https://img.icons8.com/ios-filled/50/7c7fc4/linkedin.png" alt="LinkedIn" className="h-4 w-4" />
                  </a>
                  <a href="https://discord.gg/qtqcAjhRVP" target="_blank" className="hover:opacity-100 opacity-80 transition-opacity">
                    <img src="https://cdn.simpleicons.org/discord/5865F2" alt="Discord" className="h-4 w-4" />
                  </a>
                </div>

                <button
                    onClick={() => navigateTo('contact')}
                    className="bg-[#7c7fc4] hover:bg-white hover:text-[#232742] text-white
                  px-4 py-1.5 sm:px-6 sm:py-2 rounded-full transition-all shadow-lg
                  text-[10px] sm:text-xs md:text-sm font-bold whitespace-nowrap"
                >
                  Contact
                </button>
              </div>

            </div>
          </nav>
        </div>

        {/* MAIN CONTENT AREA */}
        <main className="animate-fade-in">
          {currentPage === 'home' && window.Home && <window.Home />}
          {currentPage === 'about' && window.About && <window.About />}
          {currentPage === 'events' && window.Events && <window.Events />}
          {currentPage === 'calendar' && window.Calendar && <window.Calendar />}
          {currentPage === 'resources' && window.Resources && <window.Resources />}
          {currentPage === 'contact' && window.Contact && <window.Contact />}

          {currentPage !== 'home' && !window[currentPage.charAt(0).toUpperCase() + currentPage.slice(1)] && (
              <div className="flex items-center justify-center min-h-[60vh] text-slate-400">
                <p className="animate-pulse">Initializing Quantum Module...</p>
              </div>
          )}
        </main>

        <footer className="bg-[#0f1120] border-t border-[#3b4166] mt-16">
          <div className="max-w-7xl mx-auto px-8 py-12 text-center text-slate-400 text-sm">
            <p>© 2026 UMD Undergraduate Quantum Association</p>
          </div>
        </footer>
      </div>
  );
}

const root = window.ReactDOM.createRoot(document.getElementById('root'));
root.render(<UMDUQAWebsite />);