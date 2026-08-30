const { useState, useEffect } = window.React || React;

/**
 * UMD UQA UNIFIED SCHEDULE & EVENTS COMPONENT
 * Consolidates Featured Events, Google Calendar Sync, Interactive Embed, and Flyer Gallery.
 * Layout: 1400px maximum container width for site-wide consistency.
 */
window.Schedule = function Schedule({ navigateTo }) {
  const auth = window.useUQAAuth ? window.useUQAAuth() : { user: null, isAdmin: false };

  // Google Calendar Configuration
  const CALENDAR_ID = '3c2a01314cb17c4b0f1fe29b83c80bf8f1753a4217fa9bab39ed151a019aa919@group.calendar.google.com';

  // Default hardcoded fallback event
  const defaultAnnualEvents = [
    {
      id: "default_qlcn",
      month: "Sept",
      day: "15",
      year: "2026",
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
      ],
      poster_url: "",
      poster_path: "",
      poster_alt: "QLCN 2026 Poster",
      is_annual: true,
      order_num: 1
    }
  ];

  const [supabaseEvents, setSupabaseEvents] = useState([]);
  const [googleEvents, setGoogleEvents] = useState([]);
  const [mergedEvents, setMergedEvents] = useState(defaultAnnualEvents);
  const [selectedLightboxPoster, setSelectedLightboxPoster] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Fetch live Supabase events
  const loadSupabaseEvents = async () => {
    if (window.isSupabaseConfigured && window.isSupabaseConfigured() && window.uqaSupabase) {
      try {
        const { data, error } = await window.uqaSupabase
          .from('events')
          .select('*')
          .order('order_num', { ascending: true });

        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn("[Schedule] Supabase load warning:", err);
      }
    }
    return defaultAnnualEvents;
  };

  // 2. Fetch Google Calendar upcoming events
  const loadGoogleCalendarEvents = async () => {
    try {
      // Fetch public Google Calendar feed
      const icalUrl = `https://calendar.google.com/calendar/ical/${encodeURIComponent(CALENDAR_ID)}/public/basic.ics`;
      // Alternatively try direct gviz or public API if configured
      return [];
    } catch (e) {
      console.warn("[Schedule] Google Calendar fetch notice:", e);
      return [];
    }
  };

  // 3. Harmonize and merge Supabase + Google Calendar events
  const syncAndMergeEvents = async () => {
    setLoading(true);
    const sbData = await loadSupabaseEvents();
    const gcalData = await loadGoogleCalendarEvents();

    setSupabaseEvents(sbData);
    setGoogleEvents(gcalData);

    // Merge: Supabase enhanced records take priority
    const combined = [...sbData];

    gcalData.forEach(gEvent => {
      // Check if this Google Calendar event has already been saved/enhanced in Supabase
      const alreadyExists = sbData.some(s => 
        (s.title && gEvent.title && s.title.toLowerCase().trim() === gEvent.title.toLowerCase().trim()) ||
        (s.id === gEvent.id)
      );

      if (!alreadyExists) {
        combined.push({
          id: gEvent.id || `gcal_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          title: gEvent.title,
          subtitle: gEvent.location ? `📍 ${gEvent.location}` : "Google Calendar Event",
          month: gEvent.month || "TBD",
          day: gEvent.day || "—",
          year: gEvent.year || "2026",
          description: gEvent.description || "Scheduled meeting on the official UQA Calendar.",
          highlights: gEvent.highlights || [],
          links: gEvent.links || [],
          poster_url: "",
          poster_path: "",
          poster_alt: gEvent.title || "Event Poster",
          is_annual: false,
          isGCal: true,
          order_num: 99
        });
      }
    });

    setMergedEvents(combined.length > 0 ? combined : defaultAnnualEvents);
    setLoading(false);
  };

  useEffect(() => {
    syncAndMergeEvents();
  }, []);

  // Keyboard shortcut (Escape) to close Lightbox modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedLightboxPoster(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Inline Admin Save Action (Edits in place, uploads posters, saves to Supabase)
  const handleSaveInlineEvent = async (eventData, file) => {
    if (!window.uqaSupabase || !window.isSupabaseConfigured()) {
      alert("Supabase is not configured yet. Set up credentials in supabase-config.js.");
      return;
    }
    try {
      let poster_url = eventData.poster_url || eventData.posterUrl || "";
      let poster_path = eventData.poster_path || eventData.posterPath || "";

      if (file) {
        const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const filePath = `${Date.now()}_${cleanName}`;
        const { error: uploadErr } = await window.uqaSupabase.storage
          .from('posters')
          .upload(filePath, file, { cacheControl: '3600', upsert: true });

        if (uploadErr) throw new Error(uploadErr.message);

        const { data: urlData } = window.uqaSupabase.storage
          .from('posters')
          .getPublicUrl(filePath);

        poster_url = urlData?.publicUrl || "";
        poster_path = filePath;
      }

      const payload = {
        month: eventData.month,
        day: eventData.day,
        year: eventData.year || "2026",
        title: eventData.title,
        subtitle: eventData.subtitle || "",
        description: eventData.description,
        highlights: eventData.highlights || [],
        links: eventData.links || [],
        poster_url,
        poster_path,
        poster_alt: eventData.poster_alt || eventData.title || "Event Poster",
        is_annual: Boolean(eventData.is_annual || eventData.isAnnual),
        order_num: Number(eventData.order_num || eventData.order) || 1,
        updated_at: new Date().toISOString()
      };

      // If updating existing event (including an enhanced GCal item)
      if (editingEvent?.id && !editingEvent.isGCal) {
        payload.id = editingEvent.id;
        const { error } = await window.uqaSupabase.from('events').upsert(payload);
        if (error) throw error;
      } else {
        payload.created_at = new Date().toISOString();
        const { error } = await window.uqaSupabase.from('events').insert([payload]);
        if (error) throw error;
      }

      setIsEventModalOpen(false);
      setEditingEvent(null);
      syncAndMergeEvents();
    } catch (err) {
      alert("Failed to save event: " + err.message);
    }
  };

  const handleDeleteInlineEvent = async (eventId, posterPath) => {
    if (!confirm("Are you sure you want to remove this event?")) return;
    try {
      if (window.uqaSupabase && window.isSupabaseConfigured() && eventId && !eventId.startsWith('gcal_')) {
        const { error } = await window.uqaSupabase.from('events').delete().eq('id', eventId);
        if (error) throw error;
      }
      if (posterPath && window.uqaSupabase?.storage) {
        try {
          await window.uqaSupabase.storage.from('posters').remove([posterPath]);
        } catch (e) {}
      }
      setMergedEvents(mergedEvents.filter(e => e.id !== eventId));
    } catch (err) {
      alert("Failed to delete event: " + err.message);
    }
  };

  const postersList = mergedEvents.filter(e => Boolean(e.poster_url || e.posterUrl));

  return (
    <div className="min-h-screen bg-[#0f1128] text-[#f0f0f8] font-sans selection:bg-[#9296c8]/30 animate-fade-in">

      {/* Container expanded to 1400px with responsive mobile padding */}
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 md:px-10 py-24 sm:py-28 md:py-[120px] pb-16 sm:pb-24 md:pb-[120px]">

        {/* ── PAGE HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="font-['Nexa_Free'] text-[clamp(32px,5vw,48px)] font-extrabold tracking-tight leading-[1.2] text-[#a8abdb]">
              Schedule & Events
            </h1>
            <p className="text-[#f0f0f8]/60 text-base sm:text-lg mt-2">
              Explore upcoming quantum workshops, speaker series, career fairs, and weekly meetings.
            </p>
          </div>

          {auth.isAdmin && (
            <button
              onClick={() => {
                setEditingEvent({
                  month: "Sept",
                  day: "15",
                  year: "2026",
                  title: "",
                  subtitle: "",
                  description: "",
                  highlights: [""],
                  links: [{ label: "Register", url: "", primary: true }],
                  poster_url: "",
                  poster_path: "",
                  poster_alt: "Event Poster",
                  is_annual: true,
                  order_num: mergedEvents.length + 1
                });
                setIsEventModalOpen(true);
              }}
              className="bg-[#9296c8] text-[#0f1128] font-bold px-6 py-3 rounded-lg text-sm hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add New Event</span>
            </button>
          )}
        </div>

        {/* ── SECTION 1: FEATURED & UPCOMING EVENTS ── */}
        <div className="mb-20">
          <div className="font-['Nexa_Free'] text-[16px] font-extrabold tracking-[0.22em] uppercase text-[#9296c8] mb-8">
            Featured & Upcoming Events
          </div>

          <div className="space-y-0">
            {mergedEvents.map((event, index) => {
              const posterImage = event.poster_url || event.posterUrl;
              return (
                <div key={event.id || index} className="grid grid-cols-1 md:grid-cols-[130px_1fr] gap-6 md:gap-10 pt-6 md:pt-7 pb-3 md:pb-3.5 border-t border-white/10 first:border-t-0 last:border-b last:border-white/10 relative group">

                  {/* Date Column */}
                  <div className="text-left pt-0.5 flex md:flex-col items-baseline md:items-start gap-3 md:gap-0">
                    <div className="font-['Nexa_Free'] text-[14px] font-extrabold tracking-[0.16em] uppercase text-[#9296c8]">
                      {event.month}
                    </div>
                    <div className="font-['Nexa_Free'] text-[52px] font-light text-white leading-none">
                      {event.day}
                    </div>
                    {event.year && (
                      <div className="font-['Nexa_Free'] text-[14px] text-slate-400 font-light mt-0.5">
                        {event.year}
                      </div>
                    )}
                  </div>

                  {/* Content Column: Justified Text with Compact Floated Poster */}
                  <div className="min-w-0">
                    
                    {/* Header Row: Title & Subtitle + Inline Admin Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-7">
                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="font-['Nexa_Free'] text-[24px] sm:text-[26px] md:text-[28px] font-extrabold text-white leading-tight">
                            {event.title}
                          </h2>
                          {event.isGCal && (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#9296c8]/20 text-[#a8abdb] border border-[#9296c8]/30">
                              Calendar Sync
                            </span>
                          )}
                        </div>
                        {event.subtitle && (
                          <div className="text-[16px] sm:text-[17px] text-[#a8abdb] italic mt-3 md:mt-4">
                            {event.subtitle}
                          </div>
                        )}
                      </div>

                      {/* Inline Admin Edit/Delete Controls */}
                      {auth.isAdmin && (
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => {
                              setEditingEvent(event);
                              setIsEventModalOpen(true);
                            }}
                            className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-slate-200 border border-white/20 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5 text-[#9296c8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Edit / Enhance</span>
                          </button>
                          <button
                            onClick={() => handleDeleteInlineEvent(event.id, event.posterPath || event.poster_path)}
                            className="px-3.5 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-md text-xs font-semibold transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Body Content Container */}
                    <div className="block">
                      {/* Floated Poster Thumbnail */}
                      {posterImage && (
                        <div
                          onClick={() => setSelectedLightboxPoster({
                            url: posterImage,
                            alt: event.poster_alt || event.posterAlt || event.title,
                            title: event.title
                          })}
                          className="float-right ml-4 sm:ml-7 mb-2.5 w-[130px] sm:w-[180px] md:w-[230px] aspect-[3/4] group/poster relative rounded-xl overflow-hidden border border-white/15 bg-[#0c0d23] cursor-pointer hover:border-[#a8abdb]/80 transition-all shadow-xl"
                        >
                          <img
                            src={posterImage}
                            alt={event.poster_alt || event.posterAlt || event.title}
                            className="w-full h-full object-cover group-hover/poster:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover/poster:opacity-100 transition-opacity flex flex-col justify-end p-2.5">
                            <span className="text-white font-bold text-xs leading-tight flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5 text-[#9296c8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                              </svg>
                              Enlarge Flyer
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Description: Justified text */}
                      <p className="text-[17px] sm:text-[18px] md:text-[19px] text-[#f0f0f8]/85 leading-[1.75] text-justify [text-justify:inter-word] mb-2.5">
                        {event.description}
                      </p>

                      {/* Highlights List */}
                      {event.highlights && event.highlights.length > 0 && (
                        <ul className="space-y-1 mb-2.5">
                          {event.highlights.map((item, i) => (
                            <li key={i} className="relative pl-6 text-[16px] sm:text-[17px] text-[#f0f0f8]/80 leading-[1.55] text-justify [text-justify:inter-word] before:content-['—'] before:absolute before:left-0 before:text-[#9296c8]">
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Action Links */}
                      {event.links && event.links.length > 0 && (
                        <div className="pt-1 flex items-center gap-3.5 flex-wrap clear-both">
                          {event.links.map((link, i) => (
                            <a
                              key={i}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`font-['Nexa_Free'] text-[13px] sm:text-[14px] md:text-[15px] font-extrabold px-5 sm:px-6 py-2.5 rounded-[6px] tracking-wide transition-all ${
                                link.primary
                                  ? "bg-[#9296c8] text-[#0f1128] hover:brightness-110 shadow-md"
                                  : "border border-[#9a9dd4]/35 text-[#a8abdb] hover:bg-[#9a9dd4]/10"
                              }`}
                            >
                              {link.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SECTION 2: FULL INTERACTIVE GOOGLE CALENDAR ── */}
        <div className="mb-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
            <div>
              <div className="font-['Nexa_Free'] text-[16px] font-extrabold tracking-[0.22em] uppercase text-[#9296c8]">
                Interactive Schedule
              </div>
              <h2 className="font-['Nexa_Free'] text-[clamp(24px,3vw,32px)] font-extrabold text-white mt-1">
                Full Calendar Schedule
              </h2>
            </div>

            <a
              href={`https://calendar.google.com/calendar/render?cid=${encodeURIComponent(CALENDAR_ID)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#9a9dd4]/15 border border-[#9a9dd4]/35 text-[#b0b3e0] px-6 py-3 rounded-lg transition-all text-[14px] font-bold hover:bg-[#9a9dd4]/25 inline-flex items-center gap-2.5 shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 7V6h1v1h1v1H9v1H8V8H7V7h1z"/>
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
              </svg>
              <span>Add to My Calendar</span>
            </a>
          </div>

          <div className="w-full rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-[#0c0d23]">
            <iframe
              src={`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(CALENDAR_ID)}&ctz=America%2FNew_York`}
              className="w-full h-[480px] sm:h-[620px] md:h-[750px] border-none opacity-90 grayscale-[0.5] invert-[0.9] hue-rotate-[200deg]"
              scrolling="no"
              title="UMD UQA Google Calendar Schedule"
            ></iframe>
          </div>
        </div>

        {/* ── SECTION 3: EVENT POSTERS & FLYERS GALLERY ── */}
        {postersList.length > 0 && (
          <div className="mb-14 pt-12 border-t border-white/10">
            <div className="font-['Nexa_Free'] text-[16px] font-extrabold tracking-[0.22em] uppercase text-[#9296c8] mb-8">
              Event Posters & Flyers Gallery
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {postersList.map((evt, i) => (
                <div
                  key={evt.id || i}
                  onClick={() => setSelectedLightboxPoster({
                    url: evt.poster_url || evt.posterUrl,
                    alt: evt.poster_alt || evt.posterAlt || evt.title,
                    title: evt.title
                  })}
                  className="group relative rounded-2xl overflow-hidden border border-white/10 bg-[#0c0d23] cursor-pointer hover:border-[#a8abdb]/60 transition-all shadow-lg aspect-[3/4]"
                >
                  <img
                    src={evt.poster_url || evt.posterUrl}
                    alt={evt.poster_alt || evt.posterAlt || evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    <span className="text-white font-bold text-sm leading-tight">{evt.title}</span>
                    <span className="text-[#a8abdb] text-xs mt-1">Click to Enlarge</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── FULLSCREEN LIGHTBOX MODAL ── */}
      {selectedLightboxPoster && (
        <div 
          onClick={() => setSelectedLightboxPoster(null)}
          className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
          >
            <button
              onClick={() => setSelectedLightboxPoster(null)}
              className="absolute -top-12 right-0 sm:-right-12 text-white/70 hover:text-white p-2 text-2xl font-bold transition-colors"
              title="Close (Esc)"
            >
              ✕
            </button>
            <img
              src={selectedLightboxPoster.url}
              alt={selectedLightboxPoster.alt}
              className="max-h-[80vh] w-auto object-contain rounded-2xl shadow-2xl border border-white/15"
            />
            {selectedLightboxPoster.title && (
              <div className="text-center mt-4 text-white font-bold text-lg">
                {selectedLightboxPoster.title}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── INLINE ADMIN EVENT EDIT MODAL ── */}
      {isEventModalOpen && (
        <InlineEventModal
          event={editingEvent}
          onClose={() => {
            setIsEventModalOpen(false);
            setEditingEvent(null);
          }}
          onSave={handleSaveInlineEvent}
        />
      )}

    </div>
  );
};

// Compatibility aliases
window.Events = window.Schedule;
window.Calendar = window.Schedule;

/**
 * Inline Event Edit Modal for Admins
 */
function InlineEventModal({ event, onClose, onSave }) {
  const [formData, setFormData] = useState({
    month: event?.month || "Sept",
    day: event?.day || "15",
    year: event?.year || "2026",
    title: event?.title || "",
    subtitle: event?.subtitle || "",
    description: event?.description || "",
    highlights: event?.highlights && event.highlights.length > 0 ? event.highlights : [""],
    links: event?.links && event.links.length > 0 ? event.links : [{ label: "Register", url: "", primary: true }],
    poster_url: event?.poster_url || event?.posterUrl || "",
    poster_path: event?.poster_path || event?.posterPath || "",
    is_annual: Boolean(event?.is_annual || event?.isAnnual),
    order_num: Number(event?.order_num || event?.order) || 1
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(event?.poster_url || event?.posterUrl || "");
  const [saving, setSaving] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Flyer image must be smaller than 5MB.");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleHighlightChange = (index, value) => {
    const next = [...formData.highlights];
    next[index] = value;
    setFormData({ ...formData, highlights: next });
  };

  const addHighlight = () => {
    setFormData({ ...formData, highlights: [...formData.highlights, ""] });
  };

  const removeHighlight = (index) => {
    setFormData({ ...formData, highlights: formData.highlights.filter((_, i) => i !== index) });
  };

  const handleLinkChange = (index, field, value) => {
    const next = [...formData.links];
    next[index] = { ...next[index], [field]: value };
    setFormData({ ...formData, links: next });
  };

  const addLink = () => {
    setFormData({ ...formData, links: [...formData.links, { label: "Learn More", url: "", primary: false }] });
  };

  const removeLink = (index) => {
    setFormData({ ...formData, links: formData.links.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.month || !formData.day || !formData.description) {
      alert("Please fill in the title, month, day, and description.");
      return;
    }
    setSaving(true);
    const cleanedHighlights = formData.highlights.filter(h => h.trim() !== "");
    const cleanedLinks = formData.links.filter(l => l.label.trim() !== "" && l.url.trim() !== "");
    
    await onSave({
      ...formData,
      highlights: cleanedHighlights,
      links: cleanedLinks
    }, selectedFile);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-[#161836] border border-white/20 rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 text-white shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
          <h3 className="text-2xl font-extrabold text-white font-['Nexa_Free']">
            {event?.id ? "Edit & Enhance Event" : "Create New Event"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Date & Year */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#9296c8] mb-1">Month</label>
              <input
                type="text"
                value={formData.month}
                onChange={e => setFormData({ ...formData, month: e.target.value })}
                placeholder="Sept"
                className="w-full bg-[#0c0d23] border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#9296c8] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#9296c8] mb-1">Day</label>
              <input
                type="text"
                value={formData.day}
                onChange={e => setFormData({ ...formData, day: e.target.value })}
                placeholder="15"
                className="w-full bg-[#0c0d23] border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#9296c8] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#9296c8] mb-1">Year</label>
              <input
                type="text"
                value={formData.year}
                onChange={e => setFormData({ ...formData, year: e.target.value })}
                placeholder="2026"
                className="w-full bg-[#0c0d23] border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#9296c8] outline-none"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase text-[#9296c8] mb-1">Event Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="Quantum Leap Career Nexus"
              className="w-full bg-[#0c0d23] border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#9296c8] outline-none"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-xs font-bold uppercase text-[#9296c8] mb-1">Subtitle / Location Tag</label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="QLCN 2026 · University of Maryland"
              className="w-full bg-[#0c0d23] border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#9296c8] outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase text-[#9296c8] mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Full description of the event..."
              className="w-full bg-[#0c0d23] border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#9296c8] outline-none"
            />
          </div>

          {/* Flyer Poster Upload */}
          <div>
            <label className="block text-xs font-bold uppercase text-[#9296c8] mb-1">Event Flyer / Poster Image (Max 5MB)</label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#9296c8]/20 file:text-[#a8abdb] hover:file:bg-[#9296c8]/30 cursor-pointer"
              />
              {previewUrl && (
                <img src={previewUrl} alt="Preview" className="w-12 h-16 object-cover rounded-lg border border-white/20" />
              )}
            </div>
          </div>

          {/* Highlights */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase text-[#9296c8]">Highlight Bullet Points</label>
              <button type="button" onClick={addHighlight} className="text-xs text-[#a8abdb] hover:underline font-semibold">+ Add Point</button>
            </div>
            <div className="space-y-2">
              {formData.highlights.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={e => handleHighlightChange(index, e.target.value)}
                    placeholder="e.g. Networking with quantum employers"
                    className="flex-1 bg-[#0c0d23] border border-white/15 rounded-xl px-4 py-2 text-white text-sm focus:border-[#9296c8] outline-none"
                  />
                  {formData.highlights.length > 1 && (
                    <button type="button" onClick={() => removeHighlight(index)} className="px-3 py-2 bg-red-500/20 text-red-300 rounded-xl text-xs hover:bg-red-500/30">✕</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Links */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase text-[#9296c8]">Action & Registration Buttons</label>
              <button type="button" onClick={addLink} className="text-xs text-[#a8abdb] hover:underline font-semibold">+ Add Link</button>
            </div>
            <div className="space-y-2">
              {formData.links.map((link, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={link.label}
                    onChange={e => handleLinkChange(index, 'label', e.target.value)}
                    placeholder="Button Label"
                    className="w-1/3 bg-[#0c0d23] border border-white/15 rounded-xl px-3 py-2 text-white text-sm focus:border-[#9296c8] outline-none"
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={e => handleLinkChange(index, 'url', e.target.value)}
                    placeholder="https://..."
                    className="flex-1 bg-[#0c0d23] border border-white/15 rounded-xl px-3 py-2 text-white text-sm focus:border-[#9296c8] outline-none"
                  />
                  <label className="flex items-center gap-1 text-xs text-slate-300 shrink-0">
                    <input
                      type="checkbox"
                      checked={link.primary}
                      onChange={e => handleLinkChange(index, 'primary', e.target.checked)}
                      className="rounded"
                    />
                    Primary
                  </label>
                  {formData.links.length > 1 && (
                    <button type="button" onClick={() => removeLink(index)} className="px-2.5 py-2 bg-red-500/20 text-red-300 rounded-xl text-xs hover:bg-red-500/30">✕</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#9296c8] hover:brightness-110 text-[#0f1128] text-sm font-bold shadow-lg transition-all disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
  );
}
