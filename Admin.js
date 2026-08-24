const { useState, useEffect, useRef } = window.React || React;

/**
 * UMD UQA ADMIN CMS DASHBOARD
 * Unified Content Management System powered by Supabase (PostgreSQL & Storage).
 */
window.Admin = function Admin({ navigateTo }) {
  const auth = window.useUQAAuth ? window.useUQAAuth() : { user: null, isAdmin: false, isLoading: false, error: null };
  const [activeTab, setActiveTab] = useState('events'); // 'events' | 'videos' | 'admins' | 'settings'

  // Data states
  const [events, setEvents] = useState([]);
  const [videos, setVideos] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Modals
  const [editingEvent, setEditingEvent] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [selectedPosterPreview, setSelectedPosterPreview] = useState(null);

  // Sign in button container ref for unauthenticated view
  const googleBtnRef = useRef(null);

  const isConfigured = window.isGoogleAuthConfigured ? window.isGoogleAuthConfigured() : false;
  const isSbConfigured = window.isSupabaseConfigured ? window.isSupabaseConfigured() : false;

  // Mount Google Sign-In button if guest
  useEffect(() => {
    if (!auth.user && googleBtnRef.current && isConfigured && auth.renderButton) {
      auth.renderButton(googleBtnRef.current, {
        theme: "filled_blue",
        size: "large",
        text: "signin_with",
        shape: "rectangular",
        width: 300
      });
    }
  }, [auth.user, isConfigured]);

  const defaultEventsFallback = [
    {
      id: "default_qlcn",
      month: "Sept",
      day: "15",
      year: "2026",
      title: "Quantum Leap Career Nexus",
      subtitle: "QLCN 2026 · University of Maryland",
      description: "A career fair and professional development event bringing together quantum computing students, researchers, and industry professionals.",
      highlights: [
        "Networking with quantum industry professionals and recruiters",
        "Workshops focused on internship and job placement"
      ],
      links: [
        { label: "Register via Handshake", url: "https://go.umd.edu/QLCNregister", primary: true }
      ],
      is_annual: true,
      order_num: 1
    }
  ];

  const defaultVideosFallback = [
    { id: "agOdzgWTr-Y", title: "QuEra Workshop 1", order_num: 1 },
    { id: "i_MKOCxInOQ", title: "QuEra Quantum Challenge Walkthrough", order_num: 2 },
    { id: "xEa3WIzgxDQ", title: "QuEra Workshop 2", order_num: 3 }
  ];

  // Fetch all CMS data from Supabase
  const loadCMSData = async () => {
    if (!auth.isAdmin) return;
    setLoadingData(true);

    if (window.uqaSupabase && isSbConfigured) {
      try {
        // 1. Fetch Events
        const { data: eventsData, error: eventsErr } = await window.uqaSupabase
          .from('events')
          .select('*')
          .order('order_num', { ascending: true });
        
        if (!eventsErr && eventsData) {
          setEvents(eventsData);
        } else {
          console.warn("[Admin] Supabase events load notice:", eventsErr);
          setEvents(defaultEventsFallback);
        }

        // 2. Fetch Videos
        const { data: vidsData, error: vidsErr } = await window.uqaSupabase
          .from('videos')
          .select('*')
          .order('order_num', { ascending: true });
        
        if (!vidsErr && vidsData) {
          setVideos(vidsData);
        } else {
          setVideos(defaultVideosFallback);
        }

        // 3. Fetch Admins
        const { data: admsData, error: admsErr } = await window.uqaSupabase
          .from('admin_emails')
          .select('*');
        
        if (!admsErr && admsData) {
          setAdmins(admsData);
        } else {
          setAdmins([
            { email: 'itskrithikmohan@gmail.com', role: 'admin', added_by: 'System' },
            { email: 'krithikm@terpmail.umd.edu', role: 'admin', added_by: 'System' },
            { email: 'umd.uqa@gmail.com', role: 'admin', added_by: 'System' }
          ]);
        }
      } catch (err) {
        console.warn("[Admin] Supabase data load error:", err);
        setEvents(defaultEventsFallback);
        setVideos(defaultVideosFallback);
      }
    } else {
      // Local/offline fallback
      setEvents(defaultEventsFallback);
      setVideos(defaultVideosFallback);
      setAdmins([
        { email: 'itskrithikmohan@gmail.com', role: 'admin', added_by: 'System' },
        { email: 'krithikm@terpmail.umd.edu', role: 'admin', added_by: 'System' },
        { email: 'umd.uqa@gmail.com', role: 'admin', added_by: 'System' }
      ]);
    }
    setLoadingData(false);
  };

  useEffect(() => {
    loadCMSData();
  }, [auth.isAdmin, isSbConfigured]);

  const showNotification = (msg, isError = false) => {
    setStatusMessage({ text: msg, isError });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  // ----------------------------------------------------
  // GUEST / UNAUTHENTICATED VIEW
  // ----------------------------------------------------
  if (!auth.user) {
    return (
      <div className="min-h-screen bg-[#0f1128] text-[#f0f0f8] font-sans selection:bg-[#9296c8]/30 animate-fade-in flex items-center justify-center px-6 py-[120px]">
        <div className="max-w-md w-full bg-[#0c0d23] border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl text-center">
          <h1 className="font-['Raleway'] text-2xl md:text-3xl font-bold text-white mb-3">Admin CMS Sign In</h1>
          <p className="text-slate-400 text-sm mb-8">
            Sign in with an authorized Google account to manage UMD UQA events, posters, and featured videos.
          </p>

          <div className="flex justify-center min-h-[44px]">
            <div ref={googleBtnRef} className="flex justify-center"></div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center text-xs text-slate-500">
            <span>Powered by Google & Supabase</span>
            <button onClick={() => navigateTo('home')} className="text-[#a8abdb] hover:underline">Home</button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // LOGGED IN BUT NOT ADMIN VIEW
  // ----------------------------------------------------
  if (!auth.isAdmin) {
    return (
      <div className="min-h-screen bg-[#0f1128] text-[#f0f0f8] font-sans selection:bg-[#9296c8]/30 animate-fade-in flex items-center justify-center px-6 py-[120px]">
        <div className="max-w-md w-full bg-[#0c0d23] border border-[#9296c8]/30 rounded-2xl p-8 md:p-10 shadow-2xl text-center space-y-6">
          <h2 className="font-['Raleway'] text-2xl font-bold text-white">Access Restricted</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Logged in as <strong className="text-white font-mono">{auth.user.email}</strong>. This account is not currently on the administrator whitelist.
          </p>

          <div className="bg-[#0f1128] border border-white/10 rounded-xl p-4 text-left text-xs text-slate-400">
            <p>To obtain admin permissions, ask an existing officer to add your email to the whitelist in Supabase.</p>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              onClick={() => auth.signOut()}
              className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold py-3 px-4 rounded-lg border border-red-500/30 text-sm transition-all"
            >
              Sign Out
            </button>
            <button
              onClick={() => navigateTo('home')}
              className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 font-bold py-3 px-4 rounded-lg border border-white/10 text-sm transition-all"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // EVENT CRUD HANDLERS
  // ----------------------------------------------------
  const handleSaveEvent = async (eventData, file) => {
    if (!window.uqaSupabase || !isSbConfigured) {
      showNotification("Supabase is not configured yet. Changes cannot persist.", true);
      return;
    }

    try {
      let poster_url = eventData.poster_url || eventData.posterUrl || "";
      let poster_path = eventData.poster_path || eventData.posterPath || "";

      // Upload file to Supabase Storage bucket 'posters' if file is selected
      if (file) {
        const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const filePath = `${Date.now()}_${cleanName}`;

        const { data: uploadData, error: uploadErr } = await window.uqaSupabase.storage
          .from('posters')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadErr) {
          throw new Error(`Poster upload failed: ${uploadErr.message}`);
        }

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
        poster_url: poster_url,
        poster_path: poster_path,
        poster_alt: eventData.poster_alt || eventData.title || "Event Poster",
        is_annual: Boolean(eventData.is_annual || eventData.isAnnual),
        order_num: Number(eventData.order_num || eventData.order) || 1,
        updated_at: new Date().toISOString()
      };

      if (editingEvent?.id && !editingEvent.id.startsWith('default_')) {
        payload.id = editingEvent.id;
        const { error } = await window.uqaSupabase.from('events').upsert(payload);
        if (error) throw error;
        showNotification("Event updated successfully!");
      } else {
        payload.created_at = new Date().toISOString();
        const { error } = await window.uqaSupabase.from('events').insert([payload]);
        if (error) throw error;
        showNotification("New event added successfully!");
      }

      setIsEventModalOpen(false);
      setEditingEvent(null);
      loadCMSData();
    } catch (err) {
      console.error("[Admin] Error saving event:", err);
      showNotification(`Failed to save event: ${err.message}`, true);
    }
  };

  const handleDeleteEvent = async (eventId, posterPath) => {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;

    try {
      if (window.uqaSupabase && isSbConfigured && eventId && !eventId.startsWith('default_')) {
        const { error } = await window.uqaSupabase.from('events').delete().eq('id', eventId);
        if (error) throw error;
      }

      // Cleanup poster from Supabase Storage if path exists
      if (posterPath && window.uqaSupabase?.storage) {
        try {
          await window.uqaSupabase.storage.from('posters').remove([posterPath]);
        } catch (e) {
          console.warn("[Admin] Poster storage deletion notice:", e);
        }
      }

      showNotification("Event deleted successfully!");
      loadCMSData();
    } catch (err) {
      console.error("[Admin] Error deleting event:", err);
      showNotification(`Failed to delete event: ${err.message}`, true);
    }
  };

  // ----------------------------------------------------
  // VIDEO CRUD HANDLERS
  // ----------------------------------------------------
  const handleSaveVideo = async (videoData) => {
    if (!window.uqaSupabase || !isSbConfigured) {
      showNotification("Supabase is not configured yet. Changes cannot persist.", true);
      return;
    }

    try {
      let videoId = videoData.id.trim();
      const match = videoId.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (match && match[1]) {
        videoId = match[1];
      }

      const payload = {
        id: videoId,
        title: videoData.title.trim(),
        order_num: Number(videoData.order_num || videoData.order) || 1,
        updated_at: new Date().toISOString()
      };

      if (!payload.id || !payload.title) {
        showNotification("Please provide both a Title and a valid YouTube ID/URL.", true);
        return;
      }

      const { error } = await window.uqaSupabase.from('videos').upsert(payload);
      if (error) throw error;

      showNotification("Video saved successfully!");
      setIsVideoModalOpen(false);
      setEditingVideo(null);
      loadCMSData();
    } catch (err) {
      console.error("[Admin] Error saving video:", err);
      showNotification(`Failed to save video: ${err.message}`, true);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!confirm("Are you sure you want to remove this video?")) return;
    try {
      if (window.uqaSupabase && isSbConfigured) {
        const { error } = await window.uqaSupabase.from('videos').delete().eq('id', videoId);
        if (error) throw error;
        showNotification("Video removed successfully!");
        loadCMSData();
      }
    } catch (err) {
      console.error("[Admin] Error deleting video:", err);
      showNotification(`Failed to delete video: ${err.message}`, true);
    }
  };

  // ----------------------------------------------------
  // WHITELIST ADMIN HANDLERS
  // ----------------------------------------------------
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (!newAdminEmail || !newAdminEmail.includes('@')) {
      showNotification("Please enter a valid email address.", true);
      return;
    }

    const cleanEmail = newAdminEmail.toLowerCase().trim();
    try {
      if (window.uqaSupabase && isSbConfigured) {
        const { error } = await window.uqaSupabase.from('admin_emails').upsert({
          email: cleanEmail,
          role: 'admin',
          added_by: auth.user.email,
          created_at: new Date().toISOString()
        });
        if (error) throw error;
        setNewAdminEmail('');
        showNotification(`Added ${cleanEmail} as admin!`);
        loadCMSData();
      }
    } catch (err) {
      console.error("[Admin] Error adding admin email:", err);
      showNotification(`Failed to add admin: ${err.message}`, true);
    }
  };

  const handleRemoveAdmin = async (email) => {
    if (email.toLowerCase().trim() === auth.user.email.toLowerCase().trim()) {
      showNotification("You cannot remove yourself from the admin whitelist.", true);
      return;
    }
    if (!confirm(`Are you sure you want to remove ${email} from administrators?`)) return;

    try {
      if (window.uqaSupabase && isSbConfigured) {
        const { error } = await window.uqaSupabase.from('admin_emails').delete().eq('email', email.toLowerCase().trim());
        if (error) throw error;
        showNotification(`Removed ${email} from admin whitelist.`);
        loadCMSData();
      }
    } catch (err) {
      console.error("[Admin] Error removing admin:", err);
      showNotification(`Failed to remove admin: ${err.message}`, true);
    }
  };

  // ----------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD UI
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-[#0f1128] text-[#f0f0f8] font-sans selection:bg-[#9296c8]/30 animate-fade-in">
      <div className="max-w-[1400px] mx-auto px-10 py-[120px] pb-[120px]">

        {/* ── FUSED TITLE & ACCOUNT PROFILE HEADER ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-10 border-b border-white/10 mb-10">
          <div>
            <h1 className="font-['Raleway'] text-[clamp(32px,5vw,48px)] font-semibold tracking-tight leading-[1.2] text-[#a8abdb] mb-2">
              Admin CMS
            </h1>
            <p className="text-slate-400 text-base md:text-lg">
              Manage website events, flyers, featured videos, and officer whitelist access via Supabase.
            </p>
          </div>

          {/* Fused Account Profile Details Card */}
          <div className="bg-[#0c0d23] border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-[#9296c8]/20 border border-[#9296c8]/40 overflow-hidden flex items-center justify-center flex-shrink-0">
              {auth.user.photoURL ? (
                <img src={auth.user.photoURL} alt={auth.user.displayName} className="w-full h-full object-cover" />
              ) : (
                <span className="font-bold text-[#a8abdb] text-base">{auth.user.email?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-bold text-white text-sm truncate">{auth.user.displayName || auth.user.email}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#9296c8]/15 border border-[#9296c8]/30 text-[#a8abdb] text-[10px] font-bold tracking-wider uppercase">
                  Admin
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Active
                </span>
              </div>
              <span className="text-slate-400 text-xs font-mono block truncate">{auth.user.email}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 sm:gap-6 border-b border-white/10 mb-10 overflow-x-auto scrollbar-hide text-sm sm:text-base font-semibold">
          <button
            onClick={() => setActiveTab('events')}
            className={`py-4 border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'events' ? 'border-[#a8abdb] text-[#a8abdb]' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span>Events & Posters</span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs">{events.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`py-4 border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'videos' ? 'border-[#a8abdb] text-[#a8abdb]' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span>Featured Videos</span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs">{videos.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('admins')}
            className={`py-4 border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'admins' ? 'border-[#a8abdb] text-[#a8abdb]' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span>Admin Whitelist</span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs">{admins.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'settings' ? 'border-[#a8abdb] text-[#a8abdb]' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            System Status
          </button>
        </div>

        {/* Notification Toast */}
        {statusMessage && (
          <div className="mb-6">
            <div className={`p-4 rounded-xl text-sm font-medium flex items-center justify-between ${
              statusMessage.isError ? 'bg-red-950/80 border border-red-500/40 text-red-200' : 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-200'
            }`}>
              <span>{statusMessage.text}</span>
              <button onClick={() => setStatusMessage(null)} className="opacity-70 hover:opacity-100 font-bold ml-4">✕</button>
            </div>
          </div>
        )}

        {/* ── TAB 1: EVENTS CMS ── */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0c0d23] border border-white/10 p-6 rounded-2xl">
              <div>
                <h2 className="text-xl font-bold text-white font-['Raleway']">Event Management</h2>
                <p className="text-slate-400 text-sm">Add, edit details, upload flyer posters to Supabase Storage, and remove events.</p>
              </div>
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
                    order_num: events.length + 1
                  });
                  setIsEventModalOpen(true);
                }}
                className="bg-[#9296c8] text-[#0f1128] hover:brightness-110 font-bold px-5 py-2.5 rounded-lg text-sm transition-all flex items-center gap-2 shadow-lg"
              >
                <span>Add New Event</span>
              </button>
            </div>

            {/* Event List Cards */}
            <div className="grid grid-cols-1 gap-6">
              {events.map((evt) => (
                <div key={evt.id} className="bg-[#0c0d23] border border-white/10 rounded-2xl p-6 flex flex-col lg:flex-row gap-6 items-start justify-between">
                  <div className="flex gap-6 items-start flex-1">
                    {/* Date Block */}
                    <div className="bg-[#0f1128] border border-white/10 rounded-xl p-4 text-center min-w-[90px]">
                      <span className="block text-xs font-bold uppercase text-[#9296c8]">{evt.month}</span>
                      <span className="block text-3xl font-light text-white">{evt.day}</span>
                      <span className="block text-[11px] text-slate-500">{evt.year || '2026'}</span>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-lg font-bold text-white">{evt.title}</h3>
                        {(evt.is_annual || evt.isAnnual) && (
                          <span className="px-2 py-0.5 bg-[#9296c8]/15 border border-[#9296c8]/30 text-[#a8abdb] text-xs rounded-md font-semibold">
                            Annual
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#a8abdb] italic">{evt.subtitle}</p>
                      <p className="text-slate-300 text-sm line-clamp-2">{evt.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
                        <span>{evt.highlights?.length || 0} Highlights</span>
                        <span>{evt.links?.length || 0} Action Links</span>
                        {(evt.poster_url || evt.posterUrl) && (
                          <span className="text-emerald-400 font-medium">Poster Uploaded</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Poster Thumbnail & Actions */}
                  <div className="flex sm:flex-row lg:flex-col items-end gap-4 w-full lg:w-auto justify-between border-t lg:border-t-0 pt-4 lg:pt-0 border-white/10">
                    {(evt.poster_url || evt.posterUrl) && (
                      <img
                        src={evt.poster_url || evt.posterUrl}
                        alt={evt.poster_alt || evt.title}
                        className="w-20 h-28 object-cover rounded-lg border border-white/20 shadow-md cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setSelectedPosterPreview(evt.poster_url || evt.posterUrl)}
                      />
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingEvent(evt);
                          setIsEventModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(evt.id, evt.poster_path || evt.posterPath)}
                        className="px-3 py-1.5 bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {events.length === 0 && !loadingData && (
                <div className="text-center py-12 text-slate-500 bg-[#0c0d23] rounded-2xl border border-white/10">
                  <p>No events found. Click "Add New Event" to create one.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 2: VIDEOS CMS ── */}
        {activeTab === 'videos' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0c0d23] border border-white/10 p-6 rounded-2xl">
              <div>
                <h2 className="text-xl font-bold text-white font-['Raleway']">Featured Videos CMS</h2>
                <p className="text-slate-400 text-sm">Manage YouTube workshops and challenge walkthroughs on the Resources page.</p>
              </div>
              <button
                onClick={() => {
                  setEditingVideo({ title: '', id: '', order_num: videos.length + 1 });
                  setIsVideoModalOpen(true);
                }}
                className="bg-[#9296c8] text-[#0f1128] hover:brightness-110 font-bold px-5 py-2.5 rounded-lg text-sm transition-all flex items-center gap-2 shadow-lg"
              >
                <span>Add Video</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((vid) => (
                <div key={vid.id} className="bg-[#0c0d23] border border-white/10 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between">
                  <div className="aspect-video bg-black/40 relative">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${vid.id}`}
                      title={vid.title}
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-white text-base">{vid.title}</h4>
                      <span className="text-[11px] px-2 py-0.5 bg-white/10 text-slate-300 rounded font-mono">#{vid.order_num || vid.order}</span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono">ID: {vid.id}</div>
                    <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                      <button
                        onClick={() => {
                          setEditingVideo(vid);
                          setIsVideoModalOpen(true);
                        }}
                        className="px-3 py-1 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteVideo(vid.id)}
                        className="px-3 py-1 bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 rounded text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 3: ADMIN WHITELIST ── */}
        {activeTab === 'admins' && (
          <div className="space-y-6">
            <div className="bg-[#0c0d23] border border-white/10 p-6 rounded-2xl space-y-4">
              <h2 className="text-xl font-bold text-white font-['Raleway']">Admin Whitelist Management</h2>
              <p className="text-slate-400 text-sm">Designate which Google account emails are authorized as administrators.</p>

              {/* Add Admin Form */}
              <form onSubmit={handleAddAdmin} className="flex flex-col sm:flex-row gap-3 pt-2">
                <input
                  type="email"
                  placeholder="e.g. officer@umd.edu or name@terpmail.umd.edu"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="flex-1 bg-[#0f1128] border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#a8abdb]"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#9296c8] text-[#0f1128] font-bold px-6 py-2.5 rounded-lg text-sm hover:brightness-110 transition-all whitespace-nowrap"
                >
                  Add Administrator
                </button>
              </form>
            </div>

            <div className="bg-[#0c0d23] border border-white/10 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#0f1128] border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-6">Email Address</th>
                    <th className="py-3 px-6">Role</th>
                    <th className="py-3 px-6">Added By</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {admins.map((adm) => {
                    const isCurrent = adm.email?.toLowerCase().trim() === auth.user.email?.toLowerCase().trim();
                    return (
                      <tr key={adm.email} className="hover:bg-white/[0.02]">
                        <td className="py-4 px-6 font-mono text-white flex items-center gap-2">
                          <span>{adm.email}</span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] rounded-full">
                              You
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-[#a8abdb] font-semibold uppercase text-xs">{adm.role || 'admin'}</td>
                        <td className="py-4 px-6 text-slate-400 text-xs font-mono">{adm.added_by || adm.addedBy || 'System'}</td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleRemoveAdmin(adm.email)}
                            disabled={isCurrent}
                            className={`px-3 py-1 rounded text-xs font-semibold ${
                              isCurrent ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30'
                            }`}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 4: SYSTEM STATUS ── */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-[#0c0d23] border border-white/10 p-6 rounded-2xl space-y-4">
              <h2 className="text-xl font-bold text-white font-['Raleway']">System Connection Status</h2>
              <p className="text-slate-400 text-sm">Verify Supabase database connectivity and Google Client ID configuration health.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="bg-[#0f1128] border border-white/10 p-4 rounded-xl space-y-1">
                  <span className="text-xs text-slate-400">Supabase Backend Status:</span>
                  <div className="text-sm font-semibold flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${isSbConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
                    {isSbConfigured ? 'Connected & Active' : 'Fallback / Local Mode'}
                  </div>
                </div>

                <div className="bg-[#0f1128] border border-white/10 p-4 rounded-xl space-y-1">
                  <span className="text-xs text-slate-400">Google Client ID:</span>
                  <div className="text-sm font-semibold flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${isConfigured ? 'bg-emerald-400' : 'bg-slate-500'}`}></span>
                    {isConfigured ? 'Valid Configuration' : 'Default / Missing'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── UNIFIED BOTTOM ACCOUNT & SIGN OUT SECTION ── */}
        <div className="mt-20 pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#0c0d23] border border-white/10 p-8 rounded-2xl shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-white font-bold text-base">Authenticated Admin Account</h4>
            <p className="text-slate-400 text-xs font-mono">
              Signed in as <span className="text-[#a8abdb]">{auth.user.email}</span> (Google Identity Services + Supabase)
            </p>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => navigateTo('home')}
              className="flex-1 sm:flex-none text-xs bg-white/5 hover:bg-white/10 text-slate-300 px-6 py-3 rounded-lg border border-white/10 transition-colors font-semibold"
            >
              Return to Site
            </button>
            <button
              onClick={() => auth.signOut()}
              className="flex-1 sm:flex-none text-xs bg-red-500/15 hover:bg-red-500/25 text-red-300 px-6 py-3 rounded-lg border border-red-500/30 transition-colors font-bold shadow-md"
            >
              Sign Out
            </button>
          </div>
        </div>

      </div>

      {/* ── EVENT ADD/EDIT MODAL ── */}
      {isEventModalOpen && editingEvent && (
        <EventFormModal
          event={editingEvent}
          onClose={() => {
            setIsEventModalOpen(false);
            setEditingEvent(null);
          }}
          onSave={handleSaveEvent}
        />
      )}

      {/* ── VIDEO ADD/EDIT MODAL ── */}
      {isVideoModalOpen && editingVideo && (
        <VideoFormModal
          video={editingVideo}
          onClose={() => {
            setIsVideoModalOpen(false);
            setEditingVideo(null);
          }}
          onSave={handleSaveVideo}
        />
      )}

      {/* ── POSTER PREVIEW MODAL ── */}
      {selectedPosterPreview && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in"
          onClick={() => setSelectedPosterPreview(null)}
        >
          <div className="max-w-xl max-h-[90vh] bg-[#0c0d23] border border-white/20 rounded-2xl overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <img src={selectedPosterPreview} alt="Poster preview" className="w-full h-auto max-h-[80vh] object-contain" />
            <button
              onClick={() => setSelectedPosterPreview(null)}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white rounded-full w-8 h-8 flex items-center justify-center font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Event Form Modal Subcomponent
 */
function EventFormModal({ event, onClose, onSave }) {
  const [formData, setFormData] = useState({
    ...event,
    highlights: Array.isArray(event.highlights) ? event.highlights : [],
    links: Array.isArray(event.links) ? event.links : []
  });
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreviewUrl, setPosterPreviewUrl] = useState(event.poster_url || event.posterUrl || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleHighlightChange = (idx, value) => {
    const newHighlights = [...formData.highlights];
    newHighlights[idx] = value;
    setFormData({ ...formData, highlights: newHighlights });
  };

  const addHighlight = () => {
    setFormData({ ...formData, highlights: [...formData.highlights, ''] });
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
    setFormData({ ...formData, links: [...formData.links, { label: '', url: '', primary: false }] });
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
    const cleanedHighlights = (formData.highlights || []).filter(h => typeof h === 'string' && h.trim() !== '');
    const cleanedLinks = (formData.links || []).filter(l => l.label && l.label.trim() !== '' && l.url && l.url.trim() !== '');

    await onSave({
      ...formData,
      highlights: cleanedHighlights,
      links: cleanedLinks
    }, posterFile);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-[#0c0d23] border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl space-y-6">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <h3 className="text-xl font-bold text-white font-['Raleway']">
            {formData.id && !formData.id.startsWith('default_') ? 'Edit Event' : 'Add New Event'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {/* Date Row */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Month</label>
              <input
                type="text"
                placeholder="e.g. Sept"
                value={formData.month || ''}
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
                value={formData.day || ''}
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
                value={formData.year || '2026'}
                onChange={e => setFormData({ ...formData, year: e.target.value })}
                className="w-full bg-[#0f1128] border border-white/20 rounded-lg p-2.5 text-white"
              />
            </div>
          </div>

          {/* Title & Subtitle */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Event Title</label>
            <input
              type="text"
              placeholder="e.g. Quantum Leap Career Nexus"
              value={formData.title || ''}
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
              value={formData.subtitle || ''}
              onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full bg-[#0f1128] border border-white/20 rounded-lg p-2.5 text-white"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              rows="3"
              placeholder="Detailed summary of the event..."
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#0f1128] border border-white/20 rounded-lg p-2.5 text-white"
              required
            ></textarea>
          </div>

          {/* Highlights Bullets */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Key Highlights (Bullet Points)</label>
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
                  <button type="button" onClick={() => removeHighlight(i)} className="text-red-400 hover:text-red-300 px-2">✕</button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addHighlight} className="text-xs text-[#a8abdb] hover:underline mt-2">+ Add Highlight Bullet</button>
          </div>

          {/* Links */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Action Buttons / Links</label>
            <div className="space-y-2">
              {formData.links?.map((lnk, i) => (
                <div key={i} className="flex gap-2 items-center bg-[#0f1128] p-2 rounded-lg border border-white/10">
                  <input
                    type="text"
                    placeholder="Label (e.g. Register via Handshake)"
                    value={lnk.label || ''}
                    onChange={e => handleLinkChange(i, 'label', e.target.value)}
                    className="flex-1 bg-transparent border-b border-white/20 p-1 text-xs text-white"
                  />
                  <input
                    type="url"
                    placeholder="URL (https://...)"
                    value={lnk.url || ''}
                    onChange={e => handleLinkChange(i, 'url', e.target.value)}
                    className="flex-1 bg-transparent border-b border-white/20 p-1 text-xs text-white"
                  />
                  <label className="flex items-center gap-1 text-[11px] text-slate-400 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={Boolean(lnk.primary)}
                      onChange={e => handleLinkChange(i, 'primary', e.target.checked)}
                    />
                    Primary
                  </label>
                  <button type="button" onClick={() => removeLink(i)} className="text-red-400 px-2">✕</button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addLink} className="text-xs text-[#a8abdb] hover:underline mt-2">+ Add Action Link</button>
          </div>

          {/* Poster Upload Section */}
          <div className="pt-2 border-t border-white/10">
            <label className="block text-xs font-semibold text-slate-300 mb-2">Event Poster / Flyer Image (Optional)</label>
            <div className="flex gap-4 items-center">
              {posterPreviewUrl && (
                <img src={posterPreviewUrl} alt="Preview" className="w-16 h-20 object-cover rounded border border-white/20" />
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileSelect}
                  className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#9296c8]/20 file:text-[#a8abdb] hover:file:bg-[#9296c8]/30"
                />
                <span className="block text-[11px] text-slate-500 mt-1">PNG, JPG, or WebP up to 5MB (Supabase Storage)</span>
              </div>
              {posterPreviewUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setPosterFile(null);
                    setPosterPreviewUrl('');
                    setFormData({ ...formData, poster_url: '', poster_path: '', posterUrl: '', posterPath: '' });
                  }}
                  className="text-xs text-red-400 hover:underline"
                >
                  Remove Poster
                </button>
              )}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 font-semibold text-xs"
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
      </div>
    </div>
  );
}

/**
 * Video Form Modal Subcomponent
 */
function VideoFormModal({ video, onClose, onSave }) {
  const [title, setTitle] = useState(video.title || '');
  const [videoInput, setVideoInput] = useState(video.id || '');
  const [orderNum, setOrderNum] = useState(video.order_num || video.order || 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, id: videoInput, order_num: orderNum });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#0c0d23] border border-white/20 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <h3 className="text-lg font-bold text-white font-['Raleway']">
            {video.id ? 'Edit Video' : 'Add Featured Video'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Video Title</label>
            <input
              type="text"
              placeholder="e.g. QuEra Workshop 1"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-[#0f1128] border border-white/20 rounded-lg p-2.5 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">YouTube URL or Video ID</label>
            <input
              type="text"
              placeholder="e.g. https://youtu.be/agOdzgWTr-Y or agOdzgWTr-Y"
              value={videoInput}
              onChange={e => setVideoInput(e.target.value)}
              className="w-full bg-[#0f1128] border border-white/20 rounded-lg p-2.5 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Tab Order</label>
            <input
              type="number"
              min="1"
              value={orderNum}
              onChange={e => setOrderNum(e.target.value)}
              className="w-full bg-[#0f1128] border border-white/20 rounded-lg p-2.5 text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#9296c8] text-[#0f1128] font-bold text-xs hover:brightness-110"
            >
              Save Video
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
