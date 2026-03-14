const { useState, useEffect } = React;

function UMDUQAWebsite() {
  const [activePage, setActivePage] = useState('home');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase() || 'home';
      setActivePage(hash);
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

  const renderCurrentPage = () => {
    const pageMap = {
      'home': window.Home,
      'about': window.About,
      'events': window.Events,
      'calendar': window.Calendar,
      'resources': window.Resources,
      'contact': window.Contact
    };
    const Component = pageMap[activePage];
    return Component ? <Component /> : (
        <div className="flex items-center justify-center min-h-[80vh] text-slate-500">
          <p className="animate-pulse tracking-[0.3em] uppercase text-[10px]">Initializing Quantum Module...</p>
        </div>
    );
  };

  return (
      <div className="min-h-screen text-slate-200 font-sans selection:bg-[#9B6EFF] selection:text-white" style={{
        background: 'linear-gradient(to bottom, #09091F 0%, #060614 100%)',
        backgroundColor: '#09091F'
      }}>

        {/* FIXED NAV: Official Vector Icons */}
        <div style={{
          position: 'fixed',
          top: '25px',
          left: '0',
          right: '0',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none',
          padding: '0 20px'
        }}>
          <nav style={{
            pointerEvents: 'auto',
            backgroundColor: 'rgba(9, 9, 31, 0.85)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '100px',
            width: '100%',
            maxWidth: '1450px',
            padding: '14px 60px',
            boxShadow: '0 12px 48px rgba(0,0,0,0.5)'
          }}>
            <div className="flex items-center justify-between">

              {/* LOGO */}
              <div className="flex items-center gap-4 cursor-pointer flex-shrink-0" onClick={() => navigateTo('home')}>
                <img
                    src="UQA_White.png"
                    alt="UQA Logo"
                    className="h-10 md:h-11 w-auto object-contain transition-transform hover:scale-105"
                />
              </div>

              {/* NAVIGATION LINKS */}
              <div className="hidden md:flex justify-center items-center gap-12">
                {navigation.map(item => (
                    <button
                        key={item.id}
                        onClick={() => navigateTo(item.id)}
                        className={`text-base lg:text-lg transition-all font-light tracking-wide whitespace-nowrap relative group ${
                            activePage === item.id ? 'text-[#9B6EFF] font-bold' : 'text-slate-300 hover:text-white'
                        }`}
                    >
                      {item.label}
                      {activePage === item.id && (
                          <div className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-gradient-to-r from-[#9B6EFF] to-[#C084FC] rounded-full" />
                      )}
                    </button>
                ))}
              </div>

              {/* SOCIALS & CONTACT: Accurate Official SVG Paths */}
              <div className="flex items-center gap-10">
                <div className="hidden lg:flex items-center gap-8">

                  {/* Official Instagram */}
                  <a href="https://instagram.com/umd.uqa" target="_blank" className="hover:text-[#E4405F] text-white opacity-60 hover:opacity-100 transition-all block w-5 h-5">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                    </svg>
                  </a>

                  {/* Official LinkedIn */}
                  <a href="https://www.linkedin.com/company/umduqa/" target="_blank" className="hover:text-[#0A66C2] text-white opacity-60 hover:opacity-100 transition-all block w-5 h-5">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                    </svg>
                  </a>

                  {/* Official Discord (Clyde) */}
                  <a href="https://discord.gg/qtqcAjhRVP" target="_blank" className="hover:text-[#5865F2] text-white opacity-60 hover:opacity-100 transition-all block w-5 h-5">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2758-3.68-.2758-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1971.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"></path>
                    </svg>
                  </a>
                </div>

                <button
                    onClick={() => navigateTo('contact')}
                    className="bg-[#7c3aed] hover:bg-[#9B6EFF] text-white px-8 py-3 rounded-full transition-all shadow-lg text-base font-bold whitespace-nowrap active:scale-95"
                >
                  Contact UQA
                </button>
              </div>

            </div>
          </nav>
        </div>

        <main className="pt-24">
          {renderCurrentPage()}
        </main>

        <footer className="bg-[#09091F] border-t border-white/5 mt-auto">
          <div className="max-w-7xl mx-auto px-8 py-16 text-center text-slate-500 text-[10px] tracking-[0.2em] uppercase opacity-40">
            <p>© 2026 UMD Undergraduate Quantum Association</p>
          </div>
        </footer>
      </div>
  );
}

const root = window.ReactDOM.createRoot(document.getElementById('root'));
root.render(<UMDUQAWebsite />);