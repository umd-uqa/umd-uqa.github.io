// Define the component globally so App.js can access it
window.Events = function Events() {
  const [upcomingEvents, setUpcomingEvents] = React.useState([]);
  const [loadingEvents, setLoadingEvents] = React.useState(false);
  const [eventsError, setEventsError] = React.useState(null);

  // Replace these with your actual keys from your App.js
  const API_KEY = "AIzaSyCaWjXeBYlFKDRIMHuWLB53ydiF_dxMRd0";
  const CALENDAR_ID = "3c2a01314cb17c4b0f1fe29b83c80bf8f1753a4217fa9bab39ed151a019aa919@group.calendar.google.com";

  React.useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true);
      setEventsError(null);

      try {
        const timeMin = encodeURIComponent(new Date().toISOString());
        const maxResults = 12;
        const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
          CALENDAR_ID
        )}/events?key=${API_KEY}&timeMin=${timeMin}&singleEvents=true&orderBy=startTime&maxResults=${maxResults}`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.error) {
          setEventsError(data.error.message || 'Failed to load calendar events');
        } else {
          const events = (data.items || []).map(ev => {
            const start = ev.start?.dateTime || ev.start?.date || null;
            const dateObj = start ? new Date(start) : null;
            return {
              id: ev.id,
              title: ev.summary || 'Untitled Event',
              description: ev.description || '',
              location: ev.location || 'TBD',
              dateObj
            };
          });
          setUpcomingEvents(events);
        }
      } catch (err) {
        setEventsError(err.message || 'Failed to fetch calendar events');
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  const formatEventDate = dateObj => {
    if (!dateObj) return 'TBD';
    return dateObj.toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-8 py-16">
      <div className="bg-[#2d3255] rounded-lg shadow-xl p-12 border border-[#3b4166]">
        <h2 className="text-4xl font-light text-white mb-8">Upcoming Events</h2>

        {/* SECTION 1: DYNAMIC LIST */}
        <div className="space-y-8 mb-16">
          {loadingEvents && <div className="text-slate-300 italic">Loading UQA events...</div>}
          {eventsError && <div className="text-red-400 p-4 bg-red-900/20 rounded border border-red-900">{eventsError}</div>}

          {!loadingEvents && !eventsError && upcomingEvents.length === 0 && (
            <div className="text-slate-300">No upcoming events found. Check back soon!</div>
          )}

          {!loadingEvents && !eventsError && upcomingEvents.map((event) => (
            <div key={event.id} className="border-l-4 border-[#7c7fc4] bg-[#232742] hover:bg-[#32385e] transition-colors pl-6 py-6 rounded-r-lg shadow-md border-y border-r border-[#3b4166]">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-light text-white">{event.title}</h3>
                <span className="text-[#7c7fc4] font-light whitespace-nowrap ml-4">
                  {formatEventDate(event.dateObj)}
                </span>
              </div>
              <div className="space-y-1 text-slate-300 mb-3">
                <p className="text-sm">
                  <span className="font-medium text-slate-400 uppercase tracking-wider text-xs">Location:</span> {event.location}
                </p>
              </div>
              <p className="text-slate-300 italic text-sm">{event.description}</p>
            </div>
          ))}
        </div>

        <hr className="border-[#3b4166] mb-12" />

        {/* SECTION 2: CALENDAR GRID */}
        <h3 className="text-2xl font-light text-white mb-6">Full Calendar View</h3>
        <div className="bg-[#1a1c2e] rounded-xl p-4 overflow-hidden h-[600px] mb-8 border border-[#3b4166] shadow-2xl">
          <iframe
            src={`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(CALENDAR_ID)}&ctz=America%2FNew_York`}
            style={{
              border: 0,
              width: '100%',
              height: '100%',
              filter: 'invert(90%) hue-rotate(180deg) brightness(1.1) contrast(0.9)'
            }}
            frameBorder="0"
            scrolling="no"
            title="UQA Calendar"
          ></iframe>
        </div>

        <div className="mt-12 bg-[#232742] rounded-lg p-8 text-center border border-[#3b4166]">
          <h3 className="text-2xl font-light text-white mb-3">Stay Updated</h3>
          <p className="text-slate-300">
            Follow us on social media or subscribe to our calendar to never miss an update!
          </p>
        </div>
      </div>
    </div>
  );
};