const { useState, useEffect } = React;

/**
 * MAIN WEBSITE COMPONENT (ROUTER)
 * This file handles the logic: state, navigation, and component swapping.
 */
function UMDUQAWebsite() {
  const [currentPage, setCurrentPage] = useState('home');

  // Logic to handle hash changes (e.g., #about, #resources)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      setCurrentPage(hash);
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Sync on load
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Helper function passed to Navbar to trigger page changes
  const navigateTo = (id) => {
    window.location.hash = id;
  };

  return (
      <div className="min-h-screen text-slate-200 font-sans bg-[#0f1128]">

        {/* ── NAVBAR LOGIC ──
          Calls the external Navbar component and passes state/logic down as props. */}
        {window.Navbar && (
            <window.Navbar currentPage={currentPage} navigateTo={navigateTo} />
        )}

        {/* ── MAIN PAGE ROUTER ──
          Swaps based on the window-bound components defined in other files. */}
        <main className="pt-[52px]">
          {currentPage === 'home' && window.Home && <window.Home />}
          {currentPage === 'about' && window.About && <window.About />}
          {currentPage === 'events' && window.Events && <window.Events />}
          {currentPage === 'calendar' && window.Calendar && <window.Calendar />}
          {currentPage === 'resources' && window.Resources && <window.Resources />}
          {currentPage === 'contact' && window.Contact && <window.Contact />}

          {/* Fallback display if a component is still initializing */}
          {(!window[currentPage.charAt(0).toUpperCase() + currentPage.slice(1)] && currentPage !== 'home') && (
              <div className="flex items-center justify-center min-h-[60vh] text-slate-400">
                <p className="animate-pulse text-xl">Initializing Quantum Module: {currentPage}...</p>
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

// Final render call
const root = window.ReactDOM.createRoot(document.getElementById('root'));
root.render(<UMDUQAWebsite />);