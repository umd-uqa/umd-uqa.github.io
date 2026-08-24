/**
 * EVENTS COMPONENT
 * Expanded layout: 1400px container width for maximum screen usage.
 * Typography: 20px body text and 16px labels to match About Us.
 */
window.Events = function Events() {
    const annualEvents = [
        {
            month: "Sept",
            day: "15",
            title: "Quantum Leap Career Nexus",
            subtitle: "QLCN 2026 · University of Maryland",
            description: "A career fair and professional development event bringing together quantum computing students, researchers, and industry professionals. QLCN connects tomorrow's quantum workforce with leading organizations through networking, recruitment, and mentorship workshops.",
            highlights: [
                "Networking with quantum industry professionals and recruiters",
                "Workshops focused on internship and job placement",
                "Career development and mentorship opportunities for undergraduates"
            ],
            links: [
                { label: "Register via Handshake", url: "https://go.umd.edu/QLCNregister", primary: true },
                { label: "Register without Handshake", url: "https://go.umd.edu/attendQLCN", primary: false }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#0f1128] text-[#f0f0f8] font-sans selection:bg-[#9296c8]/30 animate-fade-in">

            {/* Container expanded to 1400px to match site-wide ultra-wide standard */}
            <div className="max-w-[1400px] mx-auto px-10 py-[120px] pb-[120px]">

                {/* Simplified Header: Uniform font and optimized size */}
                <h1 className="font-['Raleway'] text-[clamp(32px,5vw,48px)] font-semibold tracking-tight leading-[1.2] mb-16 text-[#a8abdb]">
                    Upcoming Events
                </h1>

                {/* ANNUAL EVENTS SECTION */}
                <div className="mb-14">
                    {/* Label increased to 16px to match About Us labels */}
                    <div className="font-['Raleway'] text-[16px] font-bold tracking-[0.22em] uppercase text-[#9296c8] mb-10">
                        Annual
                    </div>

                    <div className="space-y-0">
                        {annualEvents.map((event, index) => (
                            <div key={index} className="grid grid-cols-[140px_1fr] gap-12 py-12 border-t border-white/10 first:border-t-0 last:border-b last:border-white/10">

                                {/* Date Column: Scaled for the 1400px container */}
                                <div className="text-left pt-1">
                                    <div className="font-['Raleway'] text-[14px] font-bold tracking-[0.16em] uppercase text-[#9296c8]">
                                        {event.month}
                                    </div>
                                    <div className="font-['Raleway'] text-[56px] font-light text-white leading-none">
                                        {event.day}
                                    </div>
                                </div>

                                {/* Content Column: Body text at 20px */}
                                <div className="space-y-3">
                                    <h2 className="font-['Raleway'] text-[28px] font-semibold text-white">
                                        {event.title}
                                    </h2>
                                    <div className="text-[18px] text-[#a8abdb] italic mb-5">
                                        {event.subtitle}
                                    </div>
                                    <p className="text-[20px] text-[#f0f0f8]/80 leading-[1.9] mb-6">
                                        {event.description}
                                    </p>

                                    {/* Highlights List: Increased to 20px for high readability */}
                                    <ul className="space-y-4 mb-8">
                                        {event.highlights.map((item, i) => (
                                            <li key={i} className="relative pl-8 text-[20px] text-[#f0f0f8]/80 leading-[1.8] before:content-['—'] before:absolute before:left-0 before:text-[#9296c8]">
                                                {item}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Action Buttons: Consistent padding and font */}
                                    <div className="flex gap-5 pt-6 flex-wrap">
                                        {event.links.map((link, i) => (
                                            <a
                                                key={i}
                                                href={link.url}
                                                target="_blank"
                                                className={`font-['Raleway'] text-[15px] font-bold px-8 py-3.5 rounded-[6px] tracking-wide transition-all ${
                                                    link.primary
                                                        ? "bg-[#9296c8] text-[#0f1128] hover:brightness-110"
                                                        : "border border-[#9a9dd4]/35 text-[#a8abdb] hover:bg-[#9a9dd4]/10"
                                                }`}
                                            >
                                                {link.label}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RECURRING SECTION: Text increased to 20px */}
                <div className="pt-12 border-t border-white/10">
                    <div className="font-['Raleway'] text-[16px] font-bold tracking-[0.22em] uppercase text-[#9296c8] mb-8">
                        Recurring
                    </div>
                    <div className="space-y-5 text-[20px] text-[#f0f0f8]/80 leading-[1.9]">
                        <p>
                            <strong className="font-semibold text-[#f0f0f8]">Weekly General Body Meetings</strong> — Every Wednesday at 6:00 PM · Room 2124, John S. Toll Physics Building
                        </p>
                        <p className="text-[18px] text-[#f0f0f8]/60">
                            Announcements for additional events and opportunities are posted in our{" "}
                            <a href="https://discord.gg/qtqcAjhRVP" className="text-[#a8abdb] border-b border-[#a8abdb]/30 hover:border-[#a8abdb] transition-colors">
                                Discord server
                            </a>. Check the{" "}
                            <a href="#calendar" className="text-[#a8abdb] border-b border-[#a8abdb]/30 hover:border-[#a8abdb] transition-colors">
                                Calendar tab
                            </a> for the full schedule.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};