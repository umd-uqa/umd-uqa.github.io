const { useState, useEffect, useRef } = window.React || React;

/**
 * STANDALONE NAVBAR COMPONENT
 * Fully mobile-responsive with hamburger toggle, slide-down glass drawer, and desktop layout.
 */
window.Navbar = function Navbar({ currentPage, navigateTo }) {
    const auth = window.useUQAAuth ? window.useUQAAuth() : { user: null, isAdmin: false };
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navRef = useRef(null);

    const navigation = [
        { id: 'home', label: 'Home' },
        { id: 'about', label: 'About Us' },
        { id: 'schedule', label: 'Schedule' },
        { id: 'resources', label: 'Resources' }
    ];

    const isItemActive = (id) => {
        if (currentPage === id) return true;
        if (id === 'schedule' && ['schedule', 'events', 'calendar'].includes(currentPage)) return true;
        return false;
    };

    // Close mobile menu on Escape key, outside click, or window resize to desktop
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setIsMobileMenuOpen(false);
            }
        };

        const handleOutsideClick = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) {
                setIsMobileMenuOpen(false);
            }
        };

        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleOutsideClick);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleOutsideClick);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleLinkClick = (id) => {
        setIsMobileMenuOpen(false);
        navigateTo(id);
    };

    return (
        <div 
            ref={navRef}
            className="fixed top-0 left-0 right-0 z-[9999]"
        >
            <nav
                className="w-full transition-all duration-300 bg-[#0c0d23]/95 backdrop-blur-xl border-b border-white/[0.08] px-5 sm:px-8 md:px-10 py-5 md:py-7"
            >
                <div className="relative flex items-center justify-between w-full max-w-[1400px] mx-auto">

                    {/* LOGO */}
                    <div 
                        className="flex-shrink-0 cursor-pointer z-10" 
                        onClick={() => handleLinkClick('home')}
                    >
                        <img
                            src="UQA_White.png"
                            alt="UMD UQA Logo"
                            className="h-12 sm:h-14 md:h-16 w-auto object-contain transition-transform hover:scale-105"
                        />
                    </div>

                    {/* DESKTOP NAV LINKS: Optically centered slightly left */}
                    <div className="hidden lg:flex absolute left-[47%] -translate-x-1/2 top-1/2 -translate-y-1/2 items-center justify-center gap-8 xl:gap-12 z-0">
                        {navigation.map(item => (
                            <button
                                key={item.id}
                                onClick={() => handleLinkClick(item.id)}
                                className={`font-['Nexa_Free'] transition-colors font-extrabold tracking-wide whitespace-nowrap text-base md:text-lg ${
                                    isItemActive(item.id) 
                                        ? 'text-[#a8abdb]' 
                                        : 'text-slate-400 hover:text-[#a8abdb]'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* DESKTOP SOCIALS & ACTIONS: Pushed further right */}
                    <div className="hidden lg:flex items-center gap-5 xl:gap-7 ml-auto -mr-2 sm:-mr-4 z-10">
                        <div className="flex items-center gap-5 pr-5 border-r border-white/10">
                            <a href="https://www.instagram.com/umd.uqa/" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 opacity-75 transition-all hover:scale-110">
                                <img src="https://cdn.simpleicons.org/instagram/cbd5e1" alt="Instagram" className="h-5 w-5" />
                            </a>
                            <a href="https://www.linkedin.com/company/umduqa/" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 opacity-75 transition-all hover:scale-110">
                                <img src="https://img.icons8.com/ios-filled/50/cbd5e1/linkedin.png" alt="LinkedIn" className="h-5 w-5" />
                            </a>
                            <a href="https://discord.gg/qtqcAjhRVP" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 opacity-75 transition-all hover:scale-110">
                                <img src="https://cdn.simpleicons.org/discord/cbd5e1" alt="Discord" className="h-5 w-5" />
                            </a>
                        </div>

                        {/* Google Auth Status / User Profile Trigger */}
                        <button
                            onClick={() => handleLinkClick(auth.isAdmin ? 'admin' : 'auth')}
                            title={auth.user ? `Signed in as ${auth.user.email}` : "Sign in with Google"}
                            className={`font-['Nexa_Free'] px-4 py-2 rounded-lg border transition-all flex items-center gap-2.5 text-xs sm:text-sm font-extrabold shadow-sm ${
                                currentPage === 'auth' || (auth.isAdmin && currentPage === 'admin')
                                    ? 'bg-[#9296c8] text-[#0f1128] border-[#9296c8]'
                                    : auth.user
                                        ? 'bg-[#9296c8]/15 border-[#9296c8]/40 text-[#a8abdb] hover:bg-[#9296c8]/25'
                                        : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:border-white/25 hover:bg-white/10'
                            }`}
                        >
                            {auth.user ? (
                                <>
                                    <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0 bg-[#9296c8]/30 flex items-center justify-center text-[10px]">
                                        {auth.user.photoURL ? (
                                            <img src={auth.user.photoURL} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <span>{auth.user.displayName?.charAt(0) || 'U'}</span>
                                        )}
                                    </div>
                                    <span className="truncate max-w-[90px]">
                                        {auth.user.displayName?.split(' ')[0] || 'User'}
                                    </span>
                                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    <span>Sign In</span>
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => handleLinkClick('contact')}
                            className="font-['Nexa_Free'] bg-[#9a9dd4]/15 border border-[#9a9dd4]/35 text-[#a8abdb] px-5 py-2 rounded-lg transition-all text-sm font-extrabold whitespace-nowrap hover:bg-[#9a9dd4]/25 shadow-sm"
                        >
                            Contact
                        </button>
                    </div>

                    {/* MOBILE HAMBURGER BUTTON (visible <1024px, hidden >=1024px) */}
                    <div className="flex items-center gap-3 lg:hidden ml-auto z-10">
                        {/* Compact Mobile Auth Avatar (if signed in) */}
                        {auth.user && (
                            <button
                                onClick={() => handleLinkClick(auth.isAdmin ? 'admin' : 'auth')}
                                className="w-8 h-8 rounded-full overflow-hidden border border-[#9296c8]/50 flex items-center justify-center bg-[#9296c8]/20"
                                title={auth.user.email}
                            >
                                {auth.user.photoURL ? (
                                    <img src={auth.user.photoURL} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-xs text-white font-bold">{auth.user.displayName?.charAt(0) || 'U'}</span>
                                )}
                            </button>
                        )}

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle Navigation Menu"
                            aria-expanded={isMobileMenuOpen}
                            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors focus:outline-none"
                        >
                            <div className="w-6 h-5 flex flex-col justify-between items-center relative">
                                <span className={`h-0.5 w-6 bg-white rounded-full transition-all duration-300 transform ${
                                    isMobileMenuOpen ? 'rotate-45 translate-y-2 bg-[#a8abdb]' : ''
                                }`} />
                                <span className={`h-0.5 w-6 bg-white rounded-full transition-all duration-300 ${
                                    isMobileMenuOpen ? 'opacity-0' : ''
                                }`} />
                                <span className={`h-0.5 w-6 bg-white rounded-full transition-all duration-300 transform ${
                                    isMobileMenuOpen ? '-rotate-45 -translate-y-2 bg-[#a8abdb]' : ''
                                }`} />
                            </div>
                        </button>
                    </div>

                </div>

                {/* ── MOBILE DRAWER DROPDOWN ── */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden mt-4 pt-4 pb-3 border-t border-white/10 space-y-4 animate-fade-in">
                        {/* Navigation Links */}
                        <div className="flex flex-col space-y-1">
                            {navigation.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => handleLinkClick(item.id)}
                                    className={`font-['Nexa_Free'] px-4 py-3 rounded-xl text-left font-extrabold text-lg transition-colors flex items-center justify-between ${
                                        isItemActive(item.id)
                                            ? 'bg-[#9296c8]/20 text-[#a8abdb]'
                                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    <span>{item.label}</span>
                                    {isItemActive(item.id) && (
                                        <span className="w-2 h-2 rounded-full bg-[#a8abdb]"></span>
                                    )}
                                </button>
                            ))}
                            <button
                                onClick={() => handleLinkClick('contact')}
                                className={`font-['Nexa_Free'] px-4 py-3 rounded-xl text-left font-extrabold text-lg transition-colors flex items-center justify-between ${
                                    currentPage === 'contact'
                                        ? 'bg-[#9296c8]/20 text-[#a8abdb]'
                                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <span>Contact Us</span>
                                {currentPage === 'contact' && (
                                    <span className="w-2 h-2 rounded-full bg-[#a8abdb]"></span>
                                )}
                            </button>
                        </div>

                        {/* Mobile Auth Button */}
                        <div className="pt-2 border-t border-white/10">
                            <button
                                onClick={() => handleLinkClick(auth.isAdmin ? 'admin' : 'auth')}
                                className={`font-['Nexa_Free'] w-full py-3 px-4 rounded-xl font-extrabold text-sm transition-all flex items-center justify-center gap-3 ${
                                    auth.isAdmin
                                        ? 'bg-[#9296c8] text-[#0f1128]'
                                        : auth.user
                                            ? 'bg-[#9296c8]/20 border border-[#9296c8]/40 text-[#a8abdb]'
                                            : 'bg-white/10 border border-white/15 text-white hover:bg-white/15'
                                }`}
                            >
                                {auth.user ? (
                                    <>
                                        <div className="w-6 h-6 rounded-full overflow-hidden bg-[#9296c8]/30 flex items-center justify-center text-xs">
                                            {auth.user.photoURL ? (
                                                <img src={auth.user.photoURL} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <span>{auth.user.displayName?.charAt(0) || 'U'}</span>
                                            )}
                                        </div>
                                        <span>{auth.isAdmin ? "Admin Dashboard" : `Signed in as ${auth.user.displayName || auth.user.email}`}</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                        <span>Sign In with Google</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Social Links in Drawer */}
                        <div className="flex items-center justify-center gap-8 pt-3 pb-1 border-t border-white/10">
                            <a href="https://www.instagram.com/umd.uqa/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white p-2">
                                <img src="https://cdn.simpleicons.org/instagram/cbd5e1" alt="Instagram" className="h-5 w-5" />
                            </a>
                            <a href="https://www.linkedin.com/company/umduqa/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white p-2">
                                <img src="https://img.icons8.com/ios-filled/50/cbd5e1/linkedin.png" alt="LinkedIn" className="h-5 w-5" />
                            </a>
                            <a href="https://discord.gg/qtqcAjhRVP" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white p-2">
                                <img src="https://cdn.simpleicons.org/discord/cbd5e1" alt="Discord" className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                )}
            </nav>
        </div>
    );
};
