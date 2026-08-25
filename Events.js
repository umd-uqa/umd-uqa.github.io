const { useState, useEffect } = window.React || React;

/**
 * EVENTS COMPONENT
 * Expanded layout: 1400px container width for maximum screen usage.
 * Typography: 20px body text and 16px labels to match About Us.
 * Dynamic CMS: Loads events from Firestore with Lightbox, flyer posters, inline admin CRUD, and fallback data.
 */
window.Events = function Events({ navigateTo }) {
  const auth = window.useUQAAuth ? window.useUQAAuth() : { user: null, isAdmin: false };

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
      posterUrl: "",
      posterPath: "",
      posterAlt: "QLCN 2026 Poster",
      isAnnual: true,
      order: 1
    }
  ];

  const [events, setEvents] = useState(defaultAnnualEvents);
  const [selectedLightboxPoster, setSelectedLightboxPoster] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  // Load live Supabase events
  const loadEvents = async () => {
    if (window.isSupabaseConfigured && window.isSupabaseConfigured() && window.uqaSupabase) {
      try {
        const { data, error } = await window.uqaSupabase
          .from('events')
          .select('*')
          .order('order_num', { ascending: true });

        if (!error && data && data.length > 0) {
          setEvents(data);
        } else {
          setEvents(defaultAnnualEvents);
        }
      } catch (err) {
        console.warn("[Events] Supabase load warning:", err);
        setEvents(defaultAnnualEvents);
      }
    } else {
      setEvents(defaultAnnualEvents);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Keyboard shortcut (Esc) for closing lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedLightboxPoster(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Inline Admin CRUD Actions
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

      if (editingEvent?.id) {
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
      loadEvents();
    } catch (err) {
      alert("Failed to save event: " + err.message);
    }
  };

  const handleDeleteInlineEvent = async (eventId, posterPath) => {
    if (!confirm("Are you sure you want to remove this event?")) return;
    try {
      if (window.uqaSupabase && window.isSupabaseConfigured() && eventId) {
        const { error } = await window.uqaSupabase.from('events').delete().eq('id', eventId);
        if (error) throw error;
      }
      if (posterPath && window.uqaSupabase?.storage) {
        try {
          await window.uqaSupabase.storage.from('posters').remove([posterPath]);
        } catch (e) {}
      }
      setEvents(events.filter(e => e.id !== eventId));
    } catch (err) {
      alert("Failed to delete event: " + err.message);
    }
  };

  const postersList = events.filter(e => Boolean(e.poster_url || e.posterUrl));

  return (
    <div className="min-h-screen bg-[#0f1128] text-[#f0f0f8] font-sans selection:bg-[#9296c8]/30 animate-fade-in">

      {/* Container expanded to 1400px to match site-wide ultra-wide standard */}
      <div className="max-w-[1400px] mx-auto px-10 py-[120px] pb-[120px]">

        {/* Simplified Header: Uniform font and optimized size */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <h1 className="font-['Raleway'] text-[clamp(32px,5vw,48px)] font-semibold tracking-tight leading-[1.2] text-[#a8abdb]">
            Upcoming Events
          </h1>
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
                  posterUrl: "",
                  posterPath: "",
                  posterAlt: "Event Poster",
                  isAnnual: true,
                  order: events.length + 1
                });
                setIsEventModalOpen(true);
              }}
              className="bg-[#9296c8] text-[#0f1128] font-bold px-5 py-2.5 rounded-lg text-xs hover:brightness-110 transition-all flex items-center gap-2 shadow-lg"
            >
              <span>Add New Event</span>
            </button>
          )}
        </div>

        {/* ANNUAL & SCHEDULED EVENTS SECTION */}
        <div className="mb-14">
          <div className="font-['Raleway'] text-[16px] font-bold tracking-[0.22em] uppercase text-[#9296c8] mb-10">
            Featured & Annual Events
          </div>

          <div className="space-y-0">
            {events.map((event, index) => {
              const posterImage = event.poster_url || event.posterUrl;
              return (
                <div key={event.id || index} className="grid grid-cols-1 md:grid-cols-[130px_1fr] gap-6 md:gap-10 pt-6 md:pt-7 pb-3 md:pb-3.5 border-t border-white/10 first:border-t-0 last:border-b last:border-white/10 relative group">

                  {/* Date Column: Scaled for the 1400px container */}
                  <div className="text-left pt-0.5 flex md:flex-col items-baseline md:items-start gap-3 md:gap-0">
                    <div className="font-['Raleway'] text-[14px] font-bold tracking-[0.16em] uppercase text-[#9296c8]">
                      {event.month}
                    </div>
                    <div className="font-['Raleway'] text-[52px] font-light text-white leading-none">
                      {event.day}
                    </div>
                    {event.year && (
                      <div className="font-['Raleway'] text-[14px] text-slate-400 font-light mt-0.5">
                        {event.year}
                      </div>
                    )}
                  </div>

                  {/* Content Column: Justified Text with Compact Poster */}
                  <div className="min-w-0">
                    
                    {/* Header Row: Title & Subtitle + Inline Admin Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-7">
                      <div>
                        <h2 className="font-['Raleway'] text-[26px] md:text-[28px] font-semibold text-white leading-tight">
                          {event.title}
                        </h2>
                        {event.subtitle && (
                          <div className="text-[17px] text-[#a8abdb] italic mt-3 md:mt-4">
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
                            className="px-3 py-1 bg-white/10 hover:bg-white/20 text-slate-200 border border-white/20 rounded-md text-xs font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteInlineEvent(event.id, event.posterPath || event.poster_path)}
                            className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-md text-xs font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Body Content Container */}
                    <div className="block">
                      {/* Floated Poster Thumbnail (Text wraps around this with justified alignment) */}
                      {posterImage && (
                        <div
                          onClick={() => setSelectedLightboxPoster({
                            url: posterImage,
                            alt: event.poster_alt || event.posterAlt || event.title,
                            title: event.title
                          })}
                          className="float-right ml-5 sm:ml-7 mb-2.5 w-[160px] sm:w-[200px] md:w-[230px] aspect-[3/4] group/poster relative rounded-xl overflow-hidden border border-white/15 bg-[#0c0d23] cursor-pointer hover:border-[#a8abdb]/80 transition-all shadow-xl"
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

                      {/* Description: Justified text so every line aligns flush on both edges */}
                      <p className="text-[18px] md:text-[19px] text-[#f0f0f8]/85 leading-[1.75] text-justify [text-justify:inter-word] mb-2.5">
                        {event.description}
                      </p>

                      {/* Highlights List */}
                      {event.highlights && event.highlights.length > 0 && (
                        <ul className="space-y-1 mb-2.5">
                          {event.highlights.map((item, i) => (
                            <li key={i} className="relative pl-6 text-[17px] text-[#f0f0f8]/80 leading-[1.55] text-justify [text-justify:inter-word] before:content-['—'] before:absolute before:left-0 before:text-[#9296c8]">
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
                              className={`font-['Raleway'] text-[14px] md:text-[15px] font-bold px-6 py-2.5 rounded-[6px] tracking-wide transition-all ${
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

        {/* ── EVENT POSTERS & FLYERS GALLERY ── */}
        {postersList.length > 0 && (
          <div className="mb-14 pt-12 border-t border-white/10">
            <div className="font-['Raleway'] text-[16px] font-bold tracking-[0.22em] uppercase text-[#9296c8] mb-8">
              Event Posters & Flyers Gallery
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
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

      {/* ── FULLSCREEN LIGHTBOX MODAL ── */}
      {selectedLightboxPoster && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-fade-in"
          onClick={() => setSelectedLightboxPoster(null)}
        >
          <div
            className="max-w-4xl max-h-[95vh] bg-[#0c0d23] border border-white/20 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col items-center"
            onClick={e => e.stopPropagation()}
          >
            {/* Header bar */}
            <div className="w-full bg-[#0f1128] border-b border-white/10 px-6 py-3 flex justify-between items-center">
              <span className="font-bold text-white text-sm truncate">{selectedLightboxPoster.title}</span>
              <div className="flex items-center gap-4">
                <a
                  href={selectedLightboxPoster.url}
                  target="_blank"
                  download
                  className="text-xs text-[#a8abdb] hover:underline flex items-center gap-1"
                >
                  <span>Download / Open Full Res ↗</span>
                </a>
                <button
                  onClick={() => setSelectedLightboxPoster(null)}
                  className="text-slate-400 hover:text-white font-bold text-lg leading-none"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Poster Image View */}
            <div className="p-4 flex items-center justify-center overflow-auto max-h-[85vh]">
              <img
                src={selectedLightboxPoster.url}
                alt={selectedLightboxPoster.alt}
                className="max-h-[80vh] w-auto object-contain rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* Inline Event Form Modal for Admin */}
      {isEventModalOpen && editingEvent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-[#0c0d23] border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white font-['Raleway']">
                {editingEvent.id && !editingEvent.id.startsWith('default_') ? 'Edit Event' : 'Add New Event'}
              </h3>
              <button onClick={() => setIsEventModalOpen(false)} className="text-slate-400 hover:text-white font-bold text-lg">✕</button>
            </div>
            {/* Embedded Form */}
            <InlineEventForm
              event={editingEvent}
              onClose={() => setIsEventModalOpen(false)}
              onSave={handleSaveInlineEvent}
            />
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Reusable Event Form for Inline Add/Edit on Events.js
 */
function InlineEventForm({ event, onClose, onSave }) {
  const [formData, setFormData] = useState({ ...event });
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreviewUrl, setPosterPreviewUrl] = useState(event.posterUrl || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleHighlightChange = (idx, value) => {
    const newHighlights = [...formData.highlights];
    newHighlights[idx] = value;
    setFormData({ ...formData, highlights: newHighlights });
  };

  const addHighlight = () => {
    setFormData({ ...formData, highlights: [...(formData.highlights || []), ''] });
  };

  const removeHighlight = (idx) => {
    const newHighlights = formData.highlights.filter((_, i) => i !== idx);
    setFormData({ ...formData, highlights: newHighlights });
  };

  const handleLinkChange = (idx, field, value) => {
    const newLinks = [...formData.links];
    newLinks[idx] = { ...newLinks[idx], [field]: value };
    setFormData({ ...formData, links: newLinks });
  };

  const addLink = () => {
    setFormData({ ...formData, links: [...(formData.links || []), { label: '', url: '', primary: false }] });
  };

  const removeLink = (idx) => {
    const newLinks = formData.links.filter((_, i) => i !== idx);
    setFormData({ ...formData, links: newLinks });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Poster image file must be smaller than 5MB.");
        return;
      }
      setPosterFile(file);
      setPosterPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const cleanedHighlights = (formData.highlights || []).filter(h => h.trim() !== '');
    const cleanedLinks = (formData.links || []).filter(l => l.label.trim() !== '' && l.url.trim() !== '');

    await onSave({
      ...formData,
      highlights: cleanedHighlights,
      links: cleanedLinks
    }, posterFile);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Month</label>
          <input
            type="text"
            placeholder="e.g. Sept"
            value={formData.month}
            onChange={e => setFormData({ ...formData, month: e.target.value })}
            className="w-full bg-[#0f1128] border border-white/20 rounded-lg p-2.5 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Day</label>
          <input
            type="text"
            placeholder="e.g. 15"
            value={formData.day}
            onChange={e => setFormData({ ...formData, day: e.target.value })}
            className="w-full bg-[#0f1128] border border-white/20 rounded-lg p-2.5 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Year</label>
          <input
            type="text"
            placeholder="e.g. 2026"
            value={formData.year}
            onChange={e => setFormData({ ...formData, year: e.target.value })}
            className="w-full bg-[#0f1128] border border-white/20 rounded-lg p-2.5 text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Event Title</label>
        <input
          type="text"
          placeholder="e.g. Quantum Leap Career Nexus"
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          className="w-full bg-[#0f1128] border border-white/20 rounded-lg p-2.5 text-white"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Subtitle / Location</label>
        <input
          type="text"
          placeholder="e.g. QLCN 2026 · University of Maryland"
          value={formData.subtitle}
          onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
          className="w-full bg-[#0f1128] border border-white/20 rounded-lg p-2.5 text-white"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
        <textarea
          rows="3"
          placeholder="Detailed summary of the event..."
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          className="w-full bg-[#0f1128] border border-white/20 rounded-lg p-2.5 text-white"
          required
        ></textarea>
      </div>

      {/* Highlights */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Key Highlights</label>
        <div className="space-y-2">
          {formData.highlights?.map((hl, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={hl}
                onChange={e => handleHighlightChange(i, e.target.value)}
                placeholder="Highlight bullet item..."
                className="flex-1 bg-[#0f1128] border border-white/20 rounded-lg p-2 text-xs text-white"
              />
              <button type="button" onClick={() => removeHighlight(i)} className="text-red-400 px-2">✕</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addHighlight} className="text-xs text-[#a8abdb] hover:underline mt-1">+ Add Highlight Bullet</button>
      </div>

      {/* Links */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Action Buttons / Links</label>
        <div className="space-y-2">
          {formData.links?.map((lnk, i) => (
            <div key={i} className="flex gap-2 items-center bg-[#0f1128] p-2 rounded-lg border border-white/10">
              <input
                type="text"
                placeholder="Label"
                value={lnk.label}
                onChange={e => handleLinkChange(i, 'label', e.target.value)}
                className="flex-1 bg-transparent border-b border-white/20 p-1 text-xs text-white"
              />
              <input
                type="url"
                placeholder="https://..."
                value={lnk.url}
                onChange={e => handleLinkChange(i, 'url', e.target.value)}
                className="flex-1 bg-transparent border-b border-white/20 p-1 text-xs text-white"
              />
              <label className="flex items-center gap-1 text-[11px] text-slate-400 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={lnk.primary}
                  onChange={e => handleLinkChange(i, 'primary', e.target.checked)}
                />
                Primary
              </label>
              <button type="button" onClick={() => removeLink(i)} className="text-red-400 px-2">✕</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addLink} className="text-xs text-[#a8abdb] hover:underline mt-1">+ Add Action Link</button>
      </div>

      {/* Poster file input */}
      <div className="pt-2 border-t border-white/10">
        <label className="block text-xs font-semibold text-slate-300 mb-2">Poster / Flyer Image</label>
        <div className="flex gap-4 items-center">
          {posterPreviewUrl && (
            <img src={posterPreviewUrl} alt="Preview" className="w-16 h-20 object-cover rounded border border-white/20" />
          )}
          <div className="flex-1">
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileSelect}
              className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#9296c8]/20 file:text-[#a8abdb]"
            />
          </div>
          {posterPreviewUrl && (
            <button
              type="button"
              onClick={() => {
                setPosterFile(null);
                setPosterPreviewUrl('');
                setFormData({ ...formData, posterUrl: '', posterPath: '' });
              }}
              className="text-xs text-red-400 hover:underline"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 rounded-lg border border-white/10 text-slate-300 text-xs font-semibold"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 rounded-lg bg-[#9296c8] text-[#0f1128] font-bold text-xs hover:brightness-110 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Event'}
        </button>
      </div>
    </form>
  );
}
