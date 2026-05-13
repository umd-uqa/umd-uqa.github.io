const { useState, useEffect } = React;

/**
 * CALENDAR COMPONENT
 * Enhanced typography and 1400px layout to match the site-wide readability standards.
 */
window.Calendar = function Calendar() {
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // UQA Calendar Config
    const CALENDAR_ID = '3c2a01314cb17c4b0f1fe29b83c80bf8f1753a4217fa9bab39ed151a019aa919@group.calendar.google.com';
    const API_KEY = 'YOUR_GOOGLE_API_KEY';

    useEffect(() => {
        const fetchEvents = async () => {
            const now = new Date().toISOString();
            const url = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}&timeMin=${now}&singleEvents=true&orderBy=startTime&maxResults=3`;

            try {
                const response = await fetch(url);
                const data = await response.json();
                if (data.items) {
                    setUpcomingEvents(data.items.map(item => ({
                        date: new Date(item.start.dateTime || item.start.date)
                            .toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase(),
                        title: item.summary,
                        location: item.location || "TBA",
                        color: item.colorId ? "#a8abdb" : "#9296c8"
                    })));
                }
            } catch (e) {
                console.error("Calendar Sync Error:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return (
        <div className="min-h-screen bg-[#0f1128] text-[#f0f0f8] font-sans selection:bg-[#9296c8]/30 animate-fade-in">

            {/* Container expanded to 1400px to fill the screen width */}
            <div className="max-w-[1400px] mx-auto px-10 py-[120px] pb-[120px]">

                {/* Simplified Header: Optimized size for 1400px layout */}
                <h1 className="font-['Raleway'] text-[clamp(32px,5vw,48px)] font-semibold tracking-tight leading-[1.2] mb-16 text-[#a8abdb]">
                    UQA Calendar
                </h1>

                {/* ── SECTION 1: UPCOMING EVENTS ── */}
                <div className="mb-14">
                    {/* Label increased to 16px for consistency */}
                    <div className="font-['Raleway'] text-[16px] font-bold tracking-[0.22em] uppercase text-[#9296c8] mb-10">
                        Upcoming Events
                    </div>

                    {loading ? (
                        <div className="w-full p-12 rounded-2xl border border-white/5 bg-white/[0.02] animate-pulse">
                            <p className="text-[#9296c8] text-sm uppercase tracking-widest text-center">Fetching Schedule...</p>
                        </div>
                    ) : upcomingEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {upcomingEvents.map((event, i) => (
                                <div key={i} className="p-10 rounded-3xl border border-white/5 bg-[#161836] transition-all hover:scale-[1.02] hover:border-[#a8abdb]/30">
                                    <div className="flex justify-between items-start mb-6">
                                        {/* Date increased to 32px (text-3xl) */}
                                        <span className="text-3xl font-bold text-white tracking-tighter">{event.date}</span>
                                        <div className="w-2.5 h-2.5 rounded-full mt-2" style={{ backgroundColor: event.color, boxShadow: `0 0 12px ${event.color}` }} />
                                    </div>
                                    {/* Title increased to 22px */}
                                    <h4 className="text-[22px] font-semibold text-white mb-4 leading-snug">{event.title}</h4>
                                    <p className="text-[#f0f0f8]/50 text-sm font-medium uppercase tracking-widest">📍 {event.location}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Empty state text increased to 20px */
                        <div className="w-full py-10 px-0 border-y border-white/10">
                            <p className="text-[#f0f0f8]/60 italic font-light text-[20px]">
                                No upcoming events found. Check back soon!
                            </p>
                        </div>
                    )}
                </div>

                <hr className="border-none border-t border-white/10 mb-14" />

                {/* ── SECTION 2: FULL CALENDAR VIEW ── */}
                <div className="cal-section">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
                        {/* Header consistent with 16px label style */}
                        <h2 className="font-['Raleway'] text-[clamp(24px,3vw,32px)] font-semibold text-[#a8abdb]">
                            Full Calendar View
                        </h2>

                        <a
                            href={`https://calendar.google.com/calendar/render?cid=${CALENDAR_ID}`}
                            target="_blank"
                            className="bg-[#9a9dd4]/15 border border-[#9a9dd4]/35 text-[#b0b3e0] px-8 py-3.5 rounded-lg transition-all text-[15px] font-bold hover:bg-[#9a9dd4]/25 inline-flex items-center gap-3"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 7V6h1v1h1v1H9v1H8V8H7V7h1z"/>
                                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                            </svg>
                            Add to My Calendar
                        </a>
                    </div>

                    <div className="w-full rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-[#0c0d23]">
                        <iframe
                            src={`https://calendar.google.com/calendar/embed?src=${CALENDAR_ID}&ctz=America%2FNew_York`}
                            className="w-full h-[800px] border-none opacity-90 grayscale-[0.5] invert-[0.9] hue-rotate-[200deg]"
                            scrolling="no"
                        ></iframe>
                    </div>
                </div>

                <div className="mt-24 pt-10 border-t border-white/10 text-[20px] text-[#f0f0f8]/60 text-center">
                    <strong className="font-semibold text-white">Weekly General Body Meetings</strong> — Every Wednesday at 6:00 PM · Room 2124, John S. Toll Physics Building
                </div>

            </div>
        </div>
    );
};