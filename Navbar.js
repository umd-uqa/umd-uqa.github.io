/**
 * STANDALONE NAVBAR COMPONENT
 * Scaled up for better readability.
 */
window.Navbar = function Navbar({ currentPage, navigateTo }) {
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
                    padding: '18px 40px', // Increased padding for a taller navbar
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <div className="flex items-center justify-between w-full max-w-[1400px] mx-auto gap-4 md:gap-12">

                    {/* LOGO: Scaled up to h-10 to h-14 */}
                    <div className="flex-shrink-0 cursor-pointer" onClick={() => navigateTo('home')}>
                        <img
                            src="UQA_White.png"
                            alt="UQA Logo"
                            className="h-10 sm:h-12 md:h-14 w-auto object-contain transition-transform hover:scale-105"
                        />
                    </div>

                    {/* NAV LINKS: Base font size increased to 16px-18px */}
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

                    {/* SOCIALS & ACTION: Scaled icons and button */}
                    <div className="flex items-center gap-6 md:gap-8 flex-shrink-0">
                        <div className="hidden xl:flex items-center gap-8">
                            <a href="https://www.instagram.com/umd.uqa/" target="_blank" className="hover:opacity-100 opacity-80 transition-opacity">
                                <img src="https://cdn.simpleicons.org/instagram/cbd5e1" alt="Instagram" className="h-6 w-6" />
                            </a>
                            <a href="https://www.linkedin.com/company/umduqa/" target="_blank" className="hover:opacity-100 opacity-80 transition-opacity">
                                <img src="https://img.icons8.com/ios-filled/50/cbd5e1/linkedin.png" alt="LinkedIn" className="h-6 w-6" />
                            </a>
                            <a href="https://discord.gg/qtqcAjhRVP" target="_blank" className="hover:opacity-100 opacity-80 transition-opacity">
                                <img src="https://cdn.simpleicons.org/discord/cbd5e1" alt="Discord" className="h-6 w-6" />
                            </a>
                        </div>

                        <button
                            onClick={() => navigateTo('contact')}
                            className="bg-[#9a9dd4]/15 border border-[#9a9dd4]/35 text-[#a8abdb]
              px-6 py-2.5 sm:px-8 sm:py-3 rounded-lg transition-all
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