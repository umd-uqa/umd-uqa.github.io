const { useState, useEffect } = React;

function UMDUQAWebsite() {
  const [currentPage, setCurrentPage] = useState('home');

  // Sync state with URL Hash so the "Back" button and URL update
  useEffect(() => {
    const handleHashChange = () => {
      // Pull the ID from the URL (e.g., #events -> events)
      const hash = window.location.hash.replace('#', '') || 'home';
      setCurrentPage(hash);
      window.scrollTo(0, 0); // Always reset scroll on page change
    };

    // Listen for manual URL changes or back/forward buttons
    window.addEventListener('hashchange', handleHashChange);

    // Check hash on initial load
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Use this function for all navigation clicks
  const navigateTo = (id) => {
    window.location.hash = id;
  };

  const navigation = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'events', label: 'Events' }
  ];

  return (
    <div className="min-h-screen bg-[#232742] text-slate-200 font-sans">
     <nav className="bg-[#232742] border-b border-[#3b4166] sticky top-0 z-50">
       {/* Container uses w-full and consistent horizontal padding */}
       <div className="w-full px-12 py-6">
         {/* The grid-cols-3 ensures the middle section is perfectly centered */}
         <div className="grid grid-cols-3 items-center">

           {/* 1. LEFT SECTION: LOGO */}
           <div
             className="flex justify-start cursor-pointer"
             onClick={() => navigateTo('home')}
           >
             <img
               src="UQA_White.png"
               alt="UQA Logo"
               /* Increased from h-16 to h-24 for better readability */
               className="h-24 w-auto object-contain transition-transform hover:scale-105"
             />
           </div>

           {/* 2. CENTER SECTION: NAVIGATION LINKS */}
           <div className="flex justify-center items-center gap-12">
             {navigation.map(item => (
               <button
                 key={item.id}
                 onClick={() => navigateTo(item.id)}
                 className={`text-lg transition-colors font-light tracking-wide whitespace-nowrap ${
                   currentPage === item.id ? 'text-[#7c7fc4]' : 'text-slate-300 hover:text-[#7c7fc4]'
                 }`}
               >
                 {item.label}
               </button>
             ))}
           </div>

           {/* 3. RIGHT SECTION: SOCIALS & CTA */}
           <div className="flex justify-end items-center gap-10">
             <div className="flex items-center gap-8">

               {/* Instagram */}
               <a
                 href="https://www.instagram.com/umd.uqa/?hl=en"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="group flex items-center gap-2 text-slate-400 hover:text-[#E4405F] transition-all duration-300"
               >
                 <img
                   src="https://cdn.simpleicons.org/instagram/E4405F"
                   alt="Instagram"
                   className="h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity"
                 />
                 <span className="text-sm font-light tracking-wide">Instagram</span>
               </a>

               {/* LinkedIn - Fixed Icon and Spacing */}
               <a
                 href="https://www.linkedin.com/company/umduqa/?trk=ppro_cprof"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="group flex items-center gap-2 text-slate-400 hover:text-[#0A66C2] transition-all duration-300"
               >
                 <img
                   /* Using a direct SVG path to ensure it bypasses common CDN blockages */
                   src="https://img.icons8.com/ios-filled/50/0A66C2/linkedin.png"
                   alt="LinkedIn"
                   className="h-5 w-5 opacity-80 group-hover:opacity-100 transition-opacity filter brightness-110"
                 />
                 <span className="text-sm font-light tracking-wide whitespace-nowrap">LinkedIn</span>
               </a>

             </div>

             <button
               onClick={() => navigateTo('contact')}
               className="bg-[#7c7fc4] hover:bg-[#6a6db0] text-white px-8 py-2.5 rounded-full transition-all shadow-lg text-base font-light whitespace-nowrap"
             >
               Contact UMD UQA
             </button>
           </div>
         </div>
       </div>
     </nav>

      {/* 2. MAIN CONTENT AREA (Modular Switching) */}
      <main className="animate-fade-in">
        {/* Safety Checks: Only render if the component has been attached to the window */}
        {currentPage === 'home' && window.Home && <window.Home />}
        {currentPage === 'about' && window.About && <window.About />}
        {currentPage === 'events' && window.Events && <window.Events />}
        {currentPage === 'contact' && window.Contact && <window.Contact />}

        {/* Fallback: While Babel is processing the separate files */}
        {currentPage !== 'home' && !window[currentPage.charAt(0).toUpperCase() + currentPage.slice(1)] && (
          <div className="flex items-center justify-center min-h-[60vh] text-slate-400">
            <p className="animate-pulse">Initializing Quantum Module...</p>
          </div>
        )}
      </main>

      {/* 3. FOOTER */}
      <footer className="bg-[#1a1c2e] border-t border-[#3b4166] mt-16">
        <div className="max-w-7xl mx-auto px-8 py-8 text-center text-slate-400 text-sm">
          <p className="mb-1">© 2025 UMD Undergraduate Quantum Association</p>
          <p>Empowering the next generation of quantum scientists</p>
        </div>
      </footer>
    </div>
  );
}

// Render using the global ReactDOM from your script tags
const root = window.ReactDOM.createRoot(document.getElementById('root'));
root.render(<UMDUQAWebsite />);