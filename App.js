const { useState, useEffect } = React;

/**
 * MAIN WEBSITE COMPONENT (ROUTER)
 * Handles hash-based navigation and component mounting.
 */
function UMDUQAWebsite() {
  const [currentPage, setCurrentPage] = useState('home');

  // Logic to handle hash changes (e.g., #about, #resources, #auth, #admin)
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

  // Helper function passed to Navbar/components to trigger immediate page changes
  const navigateTo = (id) => {
    const cleanId = (id || 'home').replace('#', '');
    setCurrentPage(cleanId);
    if (window.location.hash !== `#${cleanId}`) {
      window.location.hash = cleanId;
    }
    window.scrollTo(0, 0);
  };

  const isAuthPortalRoute = currentPage === 'auth' || currentPage === 'login';
  const isAdminRoute = currentPage === 'admin';
  const isScheduleRoute = currentPage === 'schedule' || currentPage === 'events' || currentPage === 'calendar';

  const ScheduleComponent = window.Schedule || window.Events || window.Calendar;

  return (
      <div className="min-h-screen text-slate-200 font-sans bg-[#0f1128]">

        {/* ── NAVBAR LOGIC ── */}
        {window.Navbar && (
            <window.Navbar currentPage={currentPage} navigateTo={navigateTo} />
        )}

        {/* ── MAIN PAGE ROUTER ── */}
        <main className="pt-[52px]">
          {currentPage === 'home' && window.Home && <window.Home navigateTo={navigateTo} />}
          {currentPage === 'about' && window.About && <window.About navigateTo={navigateTo} />}
          {isScheduleRoute && ScheduleComponent && <ScheduleComponent navigateTo={navigateTo} />}
          {currentPage === 'resources' && window.Resources && <window.Resources navigateTo={navigateTo} />}
          {currentPage === 'contact' && window.Contact && <window.Contact navigateTo={navigateTo} />}
          {isAuthPortalRoute && window.AuthPortal && <window.AuthPortal navigateTo={navigateTo} />}
          {isAdminRoute && window.Admin && <window.Admin navigateTo={navigateTo} />}

          {/* Fallback display if a component is still initializing */}
          {(!window[currentPage.charAt(0).toUpperCase() + currentPage.slice(1)] && currentPage !== 'home' && !isAuthPortalRoute && !isAdminRoute && !isScheduleRoute) && (
              <div className="flex items-center justify-center min-h-[60vh] text-slate-400">
                <p className="animate-pulse text-xl">Initializing Quantum Module: {currentPage}...</p>
              </div>
          )}
        </main>

        <footer className="bg-[#0f1120] border-t border-[#3b4166] mt-16">
          <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-slate-400 text-sm">
            <p>© 2026 UMD Undergraduate Quantum Association</p>
            <div className="flex items-center gap-6 text-xs">
              <button
                onClick={() => navigateTo('auth')}
                className="text-slate-500 hover:text-[#a8abdb] transition-colors"
              >
                Sign In Portal
              </button>
            </div>
          </div>
        </footer>
      </div>
  );
}

// Final render call
const root = window.ReactDOM.createRoot(document.getElementById('root'));
root.render(<UMDUQAWebsite />);
