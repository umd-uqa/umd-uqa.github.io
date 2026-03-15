const { useState, useEffect } = React;

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
                        color: item.colorId ? "#C084FC" : "#9B6EFF"
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
        <div className="min-h-screen pb-32 px-6 w-full" style={{ background: '#09091F' }}>
            <div className="max-w-6xl mx-auto">

                {/* 1. MAIN HEADER: Changed pt-28 to pt-16 to fix the stacking issue */}
                <div className="pt-16">
                    <h1 className="text-4xl md:text-6xl font-light tracking-tight leading-tight text-white">
                        UQA <span className="text-[#C084FC]">Calendar</span>
                    </h1>
                </div>

                {/* 2. UPCOMING EVENTS: mt-12 spacing maintained */}
                <div className="mt-12">
                    {loading ? (
                        <div className="p-8 rounded-2xl border border-white/5 animate-pulse" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                            <p className="text-slate-500 text-xs uppercase tracking-widest">Fetching Schedule...</p>
                        </div>
                    ) : upcomingEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {upcomingEvents.map((event, i) => (
                                <div key={i} className="p-8 rounded-3xl border border-white/[0.03]" style={{ backgroundColor: '#11112b' }}>
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-2xl font-bold text-white tracking-tighter">{event.date}</span>
                                        <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: event.color, boxShadow: `0 0 10px ${event.color}` }} />
                                    </div>
                                    <h4 className="text-lg font-bold text-white mb-1">{event.title}</h4>
                                    <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">📍 {event.location}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full p-8 rounded-2xl border border-white/5" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#9B6EFF]" />
                                <p className="text-[#9B97C2] italic font-light tracking-wide">
                                    No upcoming events found. Check back soon!
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. SUB HEADER: mt-12 spacing */}
                <div className="mt-12">
                    <h2 className="text-2xl md:text-4xl font-light tracking-tight text-white">
                        Full <span className="text-[#C084FC]">Calendar</span> View
                    </h2>
                </div>

                {/* 4. CALENDAR GRID: mt-12 spacing */}
                <div className="mt-12">
                    <div className="w-full rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl"
                         style={{ backgroundColor: 'rgba(255, 255, 255, 0.01)', minHeight: '700px' }}>
                        <iframe
                            src={`https://calendar.google.com/calendar/embed?src=${CALENDAR_ID}&ctz=America%2FNew_York`}
                            style={{ border: 0 }}
                            width="100%"
                            height="700"
                            frameBorder="0"
                            scrolling="no"
                            className="opacity-90 grayscale-[0.5] invert-[0.9] hue-rotate-[200deg]"
                        ></iframe>
                    </div>
                </div>

            </div>
        </div>
    );
};