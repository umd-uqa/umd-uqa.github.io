const { useState, useEffect } = window.React || React;

const DEFAULT_EVENTS = [
    {
        id: "qlcn_2026",
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
        posterAlt: "QLCN 2026 Official Event Poster",
        isAnnual: true,
        order: 1
    }
];

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

/**
 * EVENTS COMPONENT
 * Expanded layout: 1400px container width for maximum screen usage.
 * Includes Firestore real-time sync, Event Lightbox modal, Poster Gallery, and inline Admin CRUD.
 */
window.Events = function Events() {
    const auth = window.useUQAAuth ? window.useUQAAuth() : { isAdmin: false };
    const [events, setEvents] = useState(() => {
        try {
            const cached = localStorage.getItem('uqa_events_cache');
            return cached ? JSON.parse(cached) : DEFAULT_EVENTS;
        } catch (e) {
            return DEFAULT_EVENTS;
        }
    });
    const [loadingEvents, setLoadingEvents] = useState(false);

    // Lightbox modal state for posters
    const [lightboxPoster, setLightboxPoster] = useState(null);

    // Inline Admin modal state
    const [eventModalOpen, setEventModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);

    const saveEventsCache = (list) => {
        try {
            localStorage.setItem('uqa_events_cache', JSON.stringify(list));
        } catch (e) {
            console.warn("Storage quota or error saving events to localStorage:", e);
        }
    };

    // Fetch events from Firestore
    const fetchEvents = async () => {
        if (window.isFirebaseConfigured() && window.uqaDb) {
            setLoadingEvents(true);
            try {
                const snap = await window.uqaDb.collection('events').orderBy('order', 'asc').get().catch(() => window.uqaDb.collection('events').get());
                if (!snap.empty) {
                    const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setEvents(list);
                    saveEventsCache(list);
                }
            } catch (err) {
                console.warn("[Events] Firestore fetch failed, keeping local cache:", err);
            } finally {
                setLoadingEvents(false);
            }
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // Inline Admin Save Event
    const handleSaveEvent = async (formData, posterFile) => {
        try {
            let finalPosterUrl = formData.posterUrl || '';

            if (posterFile) {
                if (window.isFirebaseConfigured() && window.uqaStorage) {
                    const storageRef = window.uqaStorage.ref();
                    const fileExt = posterFile.name.split('.').pop();
                    const fileName = `posters/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
                    const posterRef = storageRef.child(fileName);
                    const uploadTask = await posterRef.put(posterFile);
                    finalPosterUrl = await uploadTask.ref.getDownloadURL();
                } else {
                    finalPosterUrl = await fileToBase64(posterFile);
                }
            }

            const payload = {
                title: formData.title || 'Untitled Event',
                subtitle: formData.subtitle || '',
                month: formData.month || 'TBA',
                day: formData.day || '00',
                year: formData.year || '2026',
                description: formData.description || '',
                highlights: formData.highlights || [],
                links: formData.links || [],
                posterUrl: finalPosterUrl,
                posterAlt: formData.posterAlt || (formData.title + ' Poster'),
                isAnnual: Boolean(formData.isAnnual),
                order: Number(formData.order) || 1,
                updatedAt: new Date().toISOString()
            };

            if (window.isFirebaseConfigured() && window.uqaDb) {
                if (editingEvent && editingEvent.id && !editingEvent.id.startsWith('demo_') && editingEvent.id !== 'qlcn_2026') {
                    await window.uqaDb.collection('events').doc(editingEvent.id).update(payload);
                } else {
                    payload.createdAt = new Date().toISOString();
                    const docRef = await window.uqaDb.collection('events').add(payload);
                    payload.id = docRef.id;
                }
            }

            setEvents(prev => {
                let updated;
                if (editingEvent) {
                    updated = prev.map(e => (e.id === editingEvent.id || e.docId === editingEvent.id) ? { ...payload, id: editingEvent.id } : e);
                } else {
                    const newId = payload.id || 'evt_' + Date.now();
                    updated = [...prev, { ...payload, id: newId }];
                }
                saveEventsCache(updated);
                return updated;
            });

            setEventModalOpen(false);
            setEditingEvent(null);
        } catch (err) {
            console.error("Save event error:", err);
            alert("Failed to save event: " + err.message);
        }
    };

    // Inline Admin Delete Event
    const handleDeleteEvent = async (eventToDelete) => {
        if (!window.confirm(`Are you sure you want to delete and take away "${eventToDelete.title}"?`)) {
            return;
        }

        try {
            if (window.isFirebaseConfigured() && window.uqaDb) {
                if (eventToDelete.id && eventToDelete.id !== 'qlcn_2026' && !eventToDelete.id.startsWith('demo_')) {
                    await window.uqaDb.collection('events').doc(eventToDelete.id).delete();
                }
                if (eventToDelete.posterUrl && eventToDelete.posterUrl.includes('firebasestorage.googleapis.com') && window.uqaStorage) {
                    try {
                        const fileRef = window.uqaStorage.refFromURL(eventToDelete.posterUrl);
                        await fileRef.delete();
                    } catch (storageErr) {
                        console.warn("Storage cleanup note:", storageErr);
                    }
                }
            }

            setEvents(prev => {
                const updated = prev.filter(e => e.id !== eventToDelete.id && e.title !== eventToDelete.title);
                saveEventsCache(updated);
                return updated;
            });
        } catch (err) {
            console.error("Delete event error:", err);
            alert("Failed to delete event: " + err.message);
        }
    };

    // Extract posters for the gallery
    const posterGalleryItems = events.filter(e => Boolean(e.posterUrl));

    return (
        <div className="min-h-screen bg-[#0f1128] text-[#f0f0f8] font-sans selection:bg-[#9296c8]/30 animate-fade-in">
            {/* Container expanded to 1400px to match site-wide ultra-wide standard */}
            <div className="max-w-[1400px] mx-auto px-10 py-[120px] pb-[120px]">

                {/* Header Row */}
                <div className="flex items-center justify-between mb-16 flex-wrap gap-4">
                    <h1 className="font-['Raleway'] text-[clamp(32px,5vw,48px)] font-semibold tracking-tight leading-[1.2] text-[#a8abdb]">
                        Upcoming Events
                    </h1>

                    {auth.isAdmin && (
                        <div className="flex items-center gap-3">
                            <span className="bg-[#9296c8]/15 border border-[#9296c8]/30 text-[#a8abdb] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                Admin Mode Active
                            </span>
                            <button
                                onClick={() => { setEditingEvent(null); setEventModalOpen(true); }}
                                className="bg-[#9296c8] text-[#0f1128] font-bold text-xs px-4 py-2 rounded-lg hover:brightness-110 transition-all flex items-center gap-1.5 shadow-lg shadow-[#9296c8]/20"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                + Add New Event
                            </button>
                        </div>
                    )}
                </div>

                {/* ANNUAL / SCHEDULED EVENTS SECTION */}
                <div className="mb-14">
                    <div className="flex items-center justify-between mb-10">
                        <div className="font-['Raleway'] text-[16px] font-bold tracking-[0.22em] uppercase text-[#9296c8]">
                            Annual & Featured
                        </div>
                        {loadingEvents && <span className="text-xs text-slate-400 animate-pulse">Syncing events...</span>}
                    </div>

                    <div className="space-y-0">
                        {events.map((event, index) => (
                            <div key={event.id || index} className="grid grid-cols-[140px_1fr] gap-12 py-12 border-t border-white/10 first:border-t-0 last:border-b last:border-white/10 group relative">

                                {/* Date Column: Scaled for the 1400px container */}
                                <div className="text-left pt-1 flex flex-col justify-between">
                                    <div>
                                        <div className="font-['Raleway'] text-[14px] font-bold tracking-[0.16em] uppercase text-[#9296c8]">
                                            {event.month}
                                        </div>
                                        <div className="font-['Raleway'] text-[56px] font-light text-white leading-none">
                                            {event.day}
                                        </div>
                                        {event.year && (
                                            <div className="text-xs font-mono text-slate-400 mt-1">
                                                {event.year}
                                            </div>
                                        )}
                                    </div>

                                    {/* Inline Poster Thumbnail */}
                                    {event.posterUrl && (
                                        <div
                                            onClick={() => setLightboxPoster({ url: event.posterUrl, title: event.title, alt: event.posterAlt })}
                                            className="mt-6 w-24 h-32 rounded-lg overflow-hidden border border-white/15 bg-black/40 cursor-pointer group/poster relative hover:border-[#a8abdb] transition-all"
                                            title="Click to enlarge flyer"
                                        >
                                            <img src={event.posterUrl} alt={event.posterAlt || event.title} className="w-full h-full object-cover group-hover/poster:scale-105 transition-transform" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/poster:opacity-100 flex items-center justify-center transition-opacity text-[10px] font-bold text-white uppercase tracking-wider">
                                                Zoom
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Content Column: Body text at 20px */}
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between gap-4 flex-wrap">
                                        <div>
                                            <h2 className="font-['Raleway'] text-[28px] font-semibold text-white">
                                                {event.title}
                                            </h2>
                                            {event.subtitle && (
                                                <div className="text-[18px] text-[#a8abdb] italic mb-4">
                                                    {event.subtitle}
                                                </div>
                                            )}
                                        </div>

                                        {/* Inline Admin Actions on Card */}
                                        {auth.isAdmin && (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => { setEditingEvent(event); setEventModalOpen(true); }}
                                                    className="bg-white/5 hover:bg-white/10 text-[#a8abdb] text-xs font-bold px-3.5 py-1.5 rounded-md border border-white/15 transition-colors flex items-center gap-1"
                                                >
                                                    Edit Event
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteEvent(event)}
                                                    className="bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-bold px-3.5 py-1.5 rounded-md border border-red-500/20 transition-colors flex items-center gap-1"
                                                >
                                                    Take Away
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-[20px] text-[#f0f0f8]/80 leading-[1.9] mb-6">
                                        {event.description}
                                    </p>

                                    {/* Highlights List: Increased to 20px for high readability */}
                                    {event.highlights && event.highlights.length > 0 && (
                                        <ul className="space-y-4 mb-8">
                                            {event.highlights.map((item, i) => (
                                                <li key={i} className="relative pl-8 text-[20px] text-[#f0f0f8]/80 leading-[1.8] before:content-['—'] before:absolute before:left-0 before:text-[#9296c8]">
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {/* Action Buttons: Consistent padding and font */}
                                    {event.links && event.links.length > 0 && (
                                        <div className="flex gap-5 pt-6 flex-wrap">
                                            {event.links.map((link, i) => (
                                                <a
                                                    key={i}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
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
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── SECTION 2: EVENT POSTERS & FLYERS GALLERY ── */}
                {posterGalleryItems.length > 0 && (
                    <div className="mb-16 pt-12 border-t border-white/10">
                        <div className="font-['Raleway'] text-[16px] font-bold tracking-[0.22em] uppercase text-[#9296c8] mb-8">
                            Event Posters & Flyers Gallery
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                            {posterGalleryItems.map((item, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setLightboxPoster({ url: item.posterUrl, title: item.title, alt: item.posterAlt })}
                                    className="group/gallery cursor-pointer bg-[#0c0d23] border border-white/10 rounded-2xl overflow-hidden hover:border-[#9296c8]/50 transition-all shadow-lg"
                                >
                                    <div className="aspect-[3/4] bg-black/40 overflow-hidden relative">
                                        <img
                                            src={item.posterUrl}
                                            alt={item.posterAlt || item.title}
                                            className="w-full h-full object-cover group-hover/gallery:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover/gallery:opacity-100 transition-opacity flex items-end p-4">
                                            <span className="text-xs font-bold text-white bg-[#9296c8]/80 backdrop-blur-sm px-3 py-1.5 rounded">
                                                Click to Enlarge 🔍
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="text-xs font-bold text-[#9296c8] uppercase">{item.month} {item.day}</div>
                                        <div className="text-sm font-bold text-white truncate mt-0.5">{item.title}</div>
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
                            <a href="https://discord.gg/qtqcAjhRVP" target="_blank" rel="noopener noreferrer" className="text-[#a8abdb] border-b border-[#a8abdb]/30 hover:border-[#a8abdb] transition-colors">
                                Discord server
                            </a>. Check the{" "}
                            <a href="#calendar" className="text-[#a8abdb] border-b border-[#a8abdb]/30 hover:border-[#a8abdb] transition-colors">
                                Calendar tab
                            </a> for the full schedule.
                        </p>
                    </div>
                </div>

            </div>

            {/* ── LIGHTBOX MODAL FOR FULLSCREEN POSTERS ── */}
            {lightboxPoster && (
                <div
                    onClick={() => setLightboxPoster(null)}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative max-w-4xl max-h-[90vh] bg-[#0c0d23] border border-white/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
                    >
                        <div className="p-4 bg-[#0f1128] border-b border-white/10 flex items-center justify-between">
                            <h4 className="font-['Raleway'] font-bold text-white text-base md:text-lg">{lightboxPoster.title}</h4>
                            <button
                                onClick={() => setLightboxPoster(null)}
                                className="text-slate-400 hover:text-white text-2xl font-bold px-2 leading-none"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-4 flex-grow overflow-auto flex items-center justify-center bg-black/50">
                            <img
                                src={lightboxPoster.url}
                                alt={lightboxPoster.alt || lightboxPoster.title}
                                className="max-h-[75vh] w-auto object-contain rounded-lg shadow-2xl"
                            />
                        </div>
                        <div className="p-3 bg-[#0f1128] border-t border-white/10 text-right">
                            <a
                                href={lightboxPoster.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-[#a8abdb] hover:underline font-semibold"
                            >
                                Open Full Image in New Tab ↗
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* ── INLINE EVENT ADD / EDIT MODAL ── */}
            {eventModalOpen && (
                <InlineEventModal
                    event={editingEvent}
                    onClose={() => { setEventModalOpen(false); setEditingEvent(null); }}
                    onSave={handleSaveEvent}
                />
            )}
        </div>
    );
};

/**
 * Reusable Inline Event Modal for Events Page
 */
function InlineEventModal({ event, onClose, onSave }) {
    const [title, setTitle] = useState(event?.title || '');
    const [subtitle, setSubtitle] = useState(event?.subtitle || '');
    const [month, setMonth] = useState(event?.month || 'Sept');
    const [day, setDay] = useState(event?.day || '15');
    const [year, setYear] = useState(event?.year || '2026');
    const [description, setDescription] = useState(event?.description || '');
    const [highlights, setHighlights] = useState(event?.highlights ? [...event.highlights] : ['']);
    const [links, setLinks] = useState(event?.links ? [...event.links] : [{ label: 'Register', url: '', primary: true }]);
    const [posterUrl, setPosterUrl] = useState(event?.posterUrl || '');
    const [posterFile, setPosterFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(event?.posterUrl || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("Poster file size must be less than 5MB.");
                return;
            }
            setPosterFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleHighlightChange = (idx, val) => {
        const next = [...highlights];
        next[idx] = val;
        setHighlights(next);
    };

    const handleLinkChange = (idx, field, val) => {
        const next = [...links];
        next[idx] = { ...next[idx], [field]: val };
        setLinks(next);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSave({
                title,
                subtitle,
                month,
                day,
                year,
                description,
                highlights: highlights.filter(h => h.trim().length > 0),
                links: links.filter(l => l.url.trim().length > 0),
                posterUrl,
                isAnnual: true,
                order: event?.order || 1
            }, posterFile);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-[#0c0d23] border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h3 className="font-['Raleway'] text-2xl font-bold text-white">
                        {event ? 'Edit Event & Poster' : 'Create New Event'}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Event Title *</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Quantum Leap Career Nexus"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full bg-[#0f1128] border border-white/15 rounded-lg px-4 py-2.5 text-white text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Subtitle / Location</label>
                        <input
                            type="text"
                            placeholder="e.g. QLCN 2026 · University of Maryland"
                            value={subtitle}
                            onChange={e => setSubtitle(e.target.value)}
                            className="w-full bg-[#0f1128] border border-white/15 rounded-lg px-4 py-2.5 text-white text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Month *</label>
                            <input
                                type="text"
                                required
                                placeholder="Sept"
                                value={month}
                                onChange={e => setMonth(e.target.value)}
                                className="w-full bg-[#0f1128] border border-white/15 rounded-lg px-3 py-2 text-white text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Day *</label>
                            <input
                                type="text"
                                required
                                placeholder="15"
                                value={day}
                                onChange={e => setDay(e.target.value)}
                                className="w-full bg-[#0f1128] border border-white/15 rounded-lg px-3 py-2 text-white text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Year</label>
                            <input
                                type="text"
                                placeholder="2026"
                                value={year}
                                onChange={e => setYear(e.target.value)}
                                className="w-full bg-[#0f1128] border border-white/15 rounded-lg px-3 py-2 text-white text-sm"
                            />
                        </div>
                    </div>

                    {/* Poster Upload Section */}
                    <div className="p-4 bg-[#0f1128] border border-white/10 rounded-xl space-y-2">
                        <label className="block text-xs font-bold uppercase text-[#a8abdb]">Event Flyer / Poster Image</label>
                        <div className="flex items-center gap-4">
                            {previewUrl ? (
                                <div className="w-16 h-20 bg-black/40 rounded border border-white/20 overflow-hidden relative group">
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => { setPosterFile(null); setPreviewUrl(''); setPosterUrl(''); }}
                                        className="absolute inset-0 bg-red-900/80 text-white text-[10px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <div className="w-16 h-20 border border-dashed border-white/20 rounded flex items-center justify-center text-[10px] text-slate-500 text-center p-1">
                                    No Image
                                </div>
                            )}

                            <div className="space-y-1">
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg, image/jpg, image/webp"
                                    onChange={handleFileChange}
                                    className="text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#9296c8]/20 file:text-[#a8abdb]"
                                />
                                <p className="text-[11px] text-slate-400">PNG, JPG, WebP (under 5MB).</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Description *</label>
                        <textarea
                            rows={3}
                            required
                            placeholder="Event overview..."
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full bg-[#0f1128] border border-white/15 rounded-lg px-4 py-2.5 text-white text-sm"
                        />
                    </div>

                    {/* Highlights */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-bold uppercase text-slate-300">Bullet Highlights</label>
                            <button type="button" onClick={() => setHighlights([...highlights, ''])} className="text-xs text-[#a8abdb] hover:underline font-semibold">+ Add Point</button>
                        </div>
                        {highlights.map((h, i) => (
                            <div key={i} className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="e.g. Networking session with quantum researchers"
                                    value={h}
                                    onChange={e => handleHighlightChange(i, e.target.value)}
                                    className="flex-grow bg-[#0f1128] border border-white/15 rounded-lg px-3 py-2 text-white text-xs"
                                />
                                <button type="button" onClick={() => setHighlights(highlights.filter((_, idx) => idx !== i))} className="text-red-400 px-2">✕</button>
                            </div>
                        ))}
                    </div>

                    {/* Links */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-bold uppercase text-slate-300">Action Links</label>
                            <button type="button" onClick={() => setLinks([...links, { label: 'Register', url: '', primary: false }])} className="text-xs text-[#a8abdb] hover:underline font-semibold">+ Add Link</button>
                        </div>
                        {links.map((l, i) => (
                            <div key={i} className="flex gap-2 items-center">
                                <input
                                    type="text"
                                    placeholder="Label"
                                    value={l.label}
                                    onChange={e => handleLinkChange(i, 'label', e.target.value)}
                                    className="w-1/3 bg-[#0f1128] border border-white/15 rounded-lg px-3 py-2 text-white text-xs"
                                />
                                <input
                                    type="url"
                                    placeholder="https://..."
                                    value={l.url}
                                    onChange={e => handleLinkChange(i, 'url', e.target.value)}
                                    className="flex-grow bg-[#0f1128] border border-white/15 rounded-lg px-3 py-2 text-white text-xs"
                                />
                                <button type="button" onClick={() => setLinks(links.filter((_, idx) => idx !== i))} className="text-red-400 px-2">✕</button>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="bg-[#9296c8] text-[#0f1128] font-bold text-sm px-6 py-2 rounded-lg hover:brightness-110 disabled:opacity-50">
                            {isSubmitting ? 'Saving Event...' : (event ? 'Save Event Changes' : 'Create Event')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}