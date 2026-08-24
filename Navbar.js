/**
 * STANDALONE NAVBAR COMPONENT
 * Scaled up for better readability with responsive Google Authentication status trigger.
 */
window.Navbar = function Navbar({ currentPage, navigateTo }) {
    const auth = window.useUQAAuth ? window.useUQAAuth() : { user: null };

    const navigation = [
        { id: 'home', label: 'Home' },
        { id: 'about', label: 'About Us' },
        { id: 'events', label: 'Events' },
        { id: 'calendar', label: 'Calendar' },
        { id: 'resources', label: 'Resources' }
    ];

    return (
        <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            pointerEvents: 'none'
        }}>
            <nav
                className="w-full transition-all duration-500 ease-in-out"
                style={{
                    pointerEvents: 'auto',
                    backgroundColor: 'rgba(12, 13, 35, 0.95)',
                    backdropFilter: 'blur(16px)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '18px 40px',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <div className="flex items-center justify-between w-full max-w-[1400px] mx-auto gap-4 md:gap-12">

                    {/* LOGO */}
                    <div className="flex-shrink-0 cursor-pointer" onClick={() => navigateTo('home')}>
                        <img
                            src="UQA_White.png"
                            alt="UMD UQA Logo"
                            className="h-10 sm:h-12 md:h-14 w-auto object-contain transition-transform hover:scale-105"
                        />
                    </div>

                    {/* NAV LINKS */}
                    <div className="flex items-center justify-center flex-grow gap-4 sm:gap-8 md:gap-12 lg:gap-16">
                        {navigation.map(item => (
                            <button
                                key={item.id}
                                onClick={() => navigateTo(item.id)}
                                className={`transition-colors font-semibold tracking-wide whitespace-nowrap
                  text-[14px] sm:text-base md:text-lg
                  ${currentPage === item.id ? 'text-[#a8abdb]' : 'text-slate-400 hover:text-[#a8abdb]'}
                `}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* SOCIALS & ACTIONS */}
                    <div className="flex items-center gap-4 sm:gap-6 md:gap-8 flex-shrink-0">
                        <div className="hidden xl:flex items-center gap-8">
                            <a href="https://www.instagram.com/umd.uqa/" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 opacity-80 transition-opacity">
                                <img src="https://cdn.simpleicons.org/instagram/cbd5e1" alt="Instagram" className="h-6 w-6" />
                            </a>
                            <a href="https://www.linkedin.com/company/umduqa/" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 opacity-80 transition-opacity">
                                <img src="https://img.icons8.com/ios-filled/50/cbd5e1/linkedin.png" alt="LinkedIn" className="h-6 w-6" />
                            </a>
                            <a href="https://discord.gg/qtqcAjhRVP" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 opacity-80 transition-opacity">
                                <img src="https://cdn.simpleicons.org/discord/cbd5e1" alt="Discord" className="h-6 w-6" />
                            </a>
                        </div>

                        {/* Google Auth Status / Sign In Trigger */}
                        <button
                            onClick={() => navigateTo('auth')}
                            title={auth.user ? `Signed in as ${auth.user.email}` : "Sign in with Google"}
                            className={`p-2 sm:px-3 sm:py-2 rounded-lg border transition-all flex items-center gap-2 text-xs sm:text-sm font-bold ${
                                currentPage === 'auth'
                                    ? 'bg-[#9296c8] text-[#0f1128] border-[#9296c8]'
                                    : auth.user
                                        ? 'bg-[#9296c8]/15 border-[#9296c8]/40 text-[#a8abdb] hover:bg-[#9296c8]/25'
                                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-[#a8abdb] hover:border-white/20'
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
                                    <span className="hidden sm:inline truncate max-w-[100px]">
                                        {auth.user.displayName?.split(' ')[0] || 'User'}
                                    </span>
                                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    <span className="hidden sm:inline">Sign In</span>
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => navigateTo('contact')}
                            className="bg-[#9a9dd4]/15 border border-[#9a9dd4]/35 text-[#a8abdb]
              px-5 py-2 sm:px-8 sm:py-3 rounded-lg transition-all
              text-[13px] sm:text-[15px] font-bold whitespace-nowrap hover:bg-[#9a9dd4]/25"
                        >
                            Contact
                        </button>
                    </div>

                </div>
            </nav>
        </div>
    );
};