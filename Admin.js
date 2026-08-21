const { useState, useEffect } = window.React || React;

const DEFAULT_ADMIN_LIST = [
  { id: "krithikm@terpmail.umd.edu", email: "krithikm@terpmail.umd.edu", role: "admin" }
];

/**
 * Convert a File object to a Base64 Data URL (used for local/offline poster preview and persistence)
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * ADMIN PORTAL COMPONENT
 * Complete administrative dashboard for managing Videos, Events & Posters, and Admin Whitelist.
 */
window.Admin = function Admin({ navigateTo }) {
  const auth = window.useUQAAuth ? window.useUQAAuth() : { user: null, isAdmin: false, isLoading: false };
  const [activeTab, setActiveTab] = useState('events'); // 'events', 'videos', 'admins', 'settings'

  // Data states
  const [events, setEvents] = useState([]);
  const [videos, setVideos] = useState([]);
  const [adminEmails, setAdminEmails] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  // Modals
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [seedingStatus, setSeedingStatus] = useState(null);

  // Helper to extract YouTube video ID from URL or raw ID
  const extractYouTubeId = (input) => {
    if (!input) return '';
    const match = input.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : input.trim();
  };

  // Helper to save to local cache
  const saveEventsCache = (newEvents) => {
    try {
      localStorage.setItem('uqa_events_cache', JSON.stringify(newEvents));
    } catch (e) {
      console.warn("Storage quota or error saving events cache:", e);
    }
  };

  const saveVideosCache = (newVideos) => {
    try {
      localStorage.setItem('uqa_videos_cache', JSON.stringify(newVideos));
    } catch (e) {
      console.warn("Storage error saving videos cache:", e);
    }
  };

  const saveAdminEmailsCache = (newAdmins) => {
    try {
      localStorage.setItem('uqa_admin_emails_cache', JSON.stringify(newAdmins));
    } catch (e) {
      console.warn("Storage error saving admins cache:", e);
    }
  };

  // Fetch data (Firestore first, localStorage second, defaults third)
  const fetchData = async () => {
    if (!auth.isAdmin) return;
    setLoadingData(true);
    try {
      if (window.isFirebaseConfigured() && window.uqaDb) {
        const db = window.uqaDb;

        // Fetch events
        const eventsSnap = await db.collection('events').orderBy('order', 'asc').get().catch(() => db.collection('events').get());
        const fetchedEvents = eventsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (fetchedEvents.length > 0) {
          setEvents(fetchedEvents);
          saveEventsCache(fetchedEvents);
        } else {
          loadFromLocalCache();
        }

        // Fetch videos
        const videosSnap = await db.collection('videos').orderBy('order', 'asc').get().catch(() => db.collection('videos').get());
        const fetchedVideos = videosSnap.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
        if (fetchedVideos.length > 0) {
          setVideos(fetchedVideos);
          saveVideosCache(fetchedVideos);
        } else {
          loadFromLocalCache();
        }

        // Fetch admin emails
        const adminsSnap = await db.collection('admin_emails').get().catch(() => null);
        if (adminsSnap && !adminsSnap.empty) {
          const list = adminsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setAdminEmails(list);
          saveAdminEmailsCache(list);
        } else {
          setAdminEmails(DEFAULT_ADMIN_LIST);
          saveAdminEmailsCache(DEFAULT_ADMIN_LIST);
        }
      } else {
        loadFromLocalCache();
      }
    } catch (err) {
      console.error("[Admin] Error fetching data:", err);
      loadFromLocalCache();
    } finally {
      setLoadingData(false);
    }
  };

  const loadFromLocalCache = () => {
    // Load events
    try {
      const cachedEvents = localStorage.getItem('uqa_events_cache');
      if (cachedEvents) {
        setEvents(JSON.parse(cachedEvents));
      } else {
        const initial = (window.UQA_INITIAL_EVENTS || []).map((e, idx) => ({ ...e, id: 'init_' + idx }));
        setEvents(initial);
        saveEventsCache(initial);
      }
    } catch (e) {
      setEvents(window.UQA_INITIAL_EVENTS || []);
    }

    // Load videos
    try {
      const cachedVideos = localStorage.getItem('uqa_videos_cache');
      if (cachedVideos) {
        setVideos(JSON.parse(cachedVideos));
      } else {
        const initial = (window.UQA_INITIAL_VIDEOS || []).map((v, idx) => ({ ...v, docId: 'init_' + idx }));
        setVideos(initial);
        saveVideosCache(initial);
      }
    } catch (e) {
      setVideos(window.UQA_INITIAL_VIDEOS || []);
    }

    // Load admin emails
    try {
      const cachedAdmins = localStorage.getItem('uqa_admin_emails_cache');
      if (cachedAdmins) {
        setAdminEmails(JSON.parse(cachedAdmins));
      } else {
        setAdminEmails(DEFAULT_ADMIN_LIST);
        saveAdminEmailsCache(DEFAULT_ADMIN_LIST);
      }
    } catch (e) {
      setAdminEmails(DEFAULT_ADMIN_LIST);
    }
  };

  useEffect(() => {
    if (auth.isAdmin) {
      fetchData();
    }
  }, [auth.isAdmin]);

  const showMessage = (text, type = 'success') => {
    setActionMessage({ text, type });
    setTimeout(() => setActionMessage(null), 4000);
  };

  // ----------------------------------------------------
  // EVENT ACTIONS (Add, Edit, Delete, Poster Upload)
  // ----------------------------------------------------
  const handleSaveEvent = async (formData, posterFile) => {
    try {
      let finalPosterUrl = formData.posterUrl || '';

      // Upload file to Cloud Storage if available, else convert to Base64 for local persistence
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

      const eventPayload = {
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
        if (editingEvent && editingEvent.id && !editingEvent.id.startsWith('init_') && !editingEvent.id.startsWith('demo_') && editingEvent.id !== 'qlcn_2026') {
          await window.uqaDb.collection('events').doc(editingEvent.id).update(eventPayload);
        } else {
          eventPayload.createdAt = new Date().toISOString();
          const docRef = await window.uqaDb.collection('events').add(eventPayload);
          eventPayload.id = docRef.id;
        }
      }

      // Update local state and localStorage cache
      setEvents(prev => {
        let updated;
        if (editingEvent) {
          updated = prev.map(e => (e.id === editingEvent.id || e.docId === editingEvent.id) ? { ...eventPayload, id: editingEvent.id } : e);
        } else {
          const newId = eventPayload.id || 'evt_' + Date.now();
          updated = [...prev, { ...eventPayload, id: newId }];
        }
        saveEventsCache(updated);
        return updated;
      });

      showMessage('Event saved and changes persisted!');
      setEventModalOpen(false);
      setEditingEvent(null);
    } catch (err) {
      console.error("[Admin] Save event error:", err);
      showMessage('Failed to save event: ' + err.message, 'error');
    }
  };

  const handleDeleteEvent = async (event) => {
    if (!window.confirm(`Are you sure you want to delete and take away "${event.title}"?`)) {
      return;
    }

    try {
      if (window.isFirebaseConfigured() && window.uqaDb) {
        if (event.id && !event.id.startsWith('init_') && !event.id.startsWith('demo_') && event.id !== 'qlcn_2026') {
          await window.uqaDb.collection('events').doc(event.id).delete();
        }

        if (event.posterUrl && event.posterUrl.includes('firebasestorage.googleapis.com') && window.uqaStorage) {
          try {
            const fileRef = window.uqaStorage.refFromURL(event.posterUrl);
            await fileRef.delete();
          } catch (storageErr) {
            console.warn("[Admin] Storage file cleanup skipped:", storageErr);
          }
        }
      }

      setEvents(prev => {
        const updated = prev.filter(e => e.id !== event.id && e.title !== event.title);
        saveEventsCache(updated);
        return updated;
      });

      showMessage('Event removed successfully!');
    } catch (err) {
      console.error("[Admin] Delete event error:", err);
      showMessage('Failed to delete event: ' + err.message, 'error');
    }
  };

  // ----------------------------------------------------
  // VIDEO ACTIONS (Add, Edit, Delete)
  // ----------------------------------------------------
  const handleSaveVideo = async (formData) => {
    const rawId = extractYouTubeId(formData.id);
    if (!rawId) {
      showMessage('Please provide a valid YouTube video URL or ID.', 'error');
      return;
    }

    const videoPayload = {
      id: rawId,
      title: formData.title || 'Untitled Video',
      category: formData.category || 'Featured Videos',
      order: Number(formData.order) || (videos.length + 1),
      updatedAt: new Date().toISOString()
    };

    try {
      if (window.isFirebaseConfigured() && window.uqaDb) {
        const docRef = window.uqaDb.collection('videos').doc(rawId);
        await docRef.set(videoPayload, { merge: true });
      }

      setVideos(prev => {
        const filtered = prev.filter(v => v.id !== rawId && v.docId !== rawId);
        const updated = [...filtered, { ...videoPayload, docId: rawId }];
        saveVideosCache(updated);
        return updated;
      });

      showMessage('Video saved and changes persisted!');
      setVideoModalOpen(false);
      setEditingVideo(null);
    } catch (err) {
      console.error("[Admin] Save video error:", err);
      showMessage('Failed to save video: ' + err.message, 'error');
    }
  };

  const handleDeleteVideo = async (video) => {
    if (!window.confirm(`Are you sure you want to remove the video "${video.title}"?`)) {
      return;
    }

    try {
      if (window.isFirebaseConfigured() && window.uqaDb) {
        await window.uqaDb.collection('videos').doc(video.id || video.docId).delete();
      }

      setVideos(prev => {
        const updated = prev.filter(v => v.id !== video.id && v.docId !== video.docId && v.title !== video.title);
        saveVideosCache(updated);
        return updated;
      });

      showMessage('Video removed successfully!');
    } catch (err) {
      console.error("[Admin] Delete video error:", err);
      showMessage('Failed to delete video: ' + err.message, 'error');
    }
  };

  // ----------------------------------------------------
  // ADMIN WHITELIST ACTIONS (Add, Remove)
  // ----------------------------------------------------
  const handleAddAdminEmail = async (e) => {
    e.preventDefault();
    const cleanEmail = newAdminEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      showMessage('Please enter a valid email address.', 'error');
      return;
    }

    try {
      if (window.isFirebaseConfigured() && window.uqaDb) {
        await window.uqaDb.collection('admin_emails').doc(cleanEmail).set({
          email: cleanEmail,
          role: 'admin',
          addedBy: auth.user?.email || 'admin',
          createdAt: new Date().toISOString()
        });
      }

      setAdminEmails(prev => {
        if (prev.some(a => a.email.toLowerCase() === cleanEmail)) return prev;
        const updated = [...prev, { id: cleanEmail, email: cleanEmail, role: 'admin' }];
        saveAdminEmailsCache(updated);
        return updated;
      });

      showMessage(`Added ${cleanEmail} as administrator!`);
      setNewAdminEmail('');
    } catch (err) {
      console.error("[Admin] Add admin error:", err);
      showMessage('Failed to add admin email: ' + err.message, 'error');
    }
  };

  const handleRemoveAdminEmail = async (adminObj) => {
    const targetEmail = adminObj.email.toLowerCase();
    if (targetEmail === "krithikm@terpmail.umd.edu") {
      showMessage('Cannot remove the primary administrator account (krithikm@terpmail.umd.edu).', 'error');
      return;
    }

    if (targetEmail === auth.user?.email?.toLowerCase()) {
      showMessage('Cannot remove yourself from the admin whitelist.', 'error');
      return;
    }

    if (!window.confirm(`Are you sure you want to revoke admin permissions for ${adminObj.email}?`)) {
      return;
    }

    try {
      if (window.isFirebaseConfigured() && window.uqaDb) {
        await window.uqaDb.collection('admin_emails').doc(adminObj.id || targetEmail).delete();
      }

      setAdminEmails(prev => {
        const updated = prev.filter(a => a.email.toLowerCase() !== targetEmail);
        saveAdminEmailsCache(updated);
        return updated;
      });

      showMessage(`Revoked admin permissions for ${adminObj.email}`);
    } catch (err) {
      console.error("[Admin] Remove admin error:", err);
      showMessage('Failed to revoke admin: ' + err.message, 'error');
    }
  };

  // ----------------------------------------------------
  // INITIAL SEEDING UTILITY
  // ----------------------------------------------------
  const handleSeedDatabase = async () => {
    if (!window.confirm('Seed initial videos, events, and admins into Firestore?')) {
      return;
    }
    setSeedingStatus('Seeding database...');
    try {
      if (window.seedInitialData) {
        const res = await window.seedInitialData();
        setSeedingStatus(`Seeded ${res.adminsAdded || 0} admins, ${res.videosAdded} videos, and ${res.eventsAdded} events!`);
        fetchData();
      } else {
        setSeedingStatus('Seed utility not found.');
      }
    } catch (err) {
      setSeedingStatus('Seeding error: ' + err.message);
    }
    setTimeout(() => setSeedingStatus(null), 5000);
  };

  // ----------------------------------------------------
  // RENDER: GUEST / UNAUTHENTICATED
  // ----------------------------------------------------
  if (!auth.user) {
    return (
      <div className="min-h-screen bg-[#0f1128] text-[#f0f0f8] font-sans selection:bg-[#9296c8]/30 animate-fade-in flex items-center justify-center px-6 py-24">
        <div className="max-w-md w-full bg-[#0c0d23] border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#9296c8]/10 text-[#a8abdb] mb-6 border border-[#9296c8]/30">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          
          <h1 className="font-['Raleway'] text-2xl md:text-3xl font-bold text-white mb-3">
            Admin Portal
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8">
            Sign in with an authorized administrator Google or UMD account to manage videos, event posters, and site content.
          </p>

          {auth.error && (
            <div className="mb-6 p-4 rounded-lg bg-red-900/40 border border-red-500/40 text-red-200 text-sm">
              {auth.error}
            </div>
          )}

          <button
            onClick={() => auth.signInWithGoogle()}
            disabled={auth.isLoading}
            className="w-full flex items-center justify-center gap-3 bg-[#9296c8] text-[#0f1128] font-bold text-base py-3.5 px-6 rounded-lg hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-[#9296c8]/20 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            {auth.isLoading ? 'Signing In...' : 'Sign in with Google'}
          </button>

          <div className="mt-8 pt-6 border-t border-white/10 text-xs text-slate-500">
            Primary Admin: <span className="font-mono text-slate-400">krithikm@terpmail.umd.edu</span>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER: AUTHENTICATED BUT NOT ON ADMIN WHITELIST
  // ----------------------------------------------------
  if (auth.user && !auth.isAdmin) {
    return (
      <div className="min-h-screen bg-[#0f1128] text-[#f0f0f8] font-sans selection:bg-[#9296c8]/30 animate-fade-in flex items-center justify-center px-6 py-24">
        <div className="max-w-md w-full bg-[#0c0d23] border border-amber-500/30 rounded-2xl p-8 text-center shadow-2xl">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-500/10 text-amber-400 mb-5 border border-amber-500/30">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="font-['Raleway'] text-xl font-bold text-white mb-2">Access Restricted</h2>
          <p className="text-slate-300 text-sm mb-4 leading-relaxed">
            Signed in as <span className="font-mono text-[#a8abdb] font-semibold">{auth.user.email}</span>.
          </p>
          <p className="text-slate-400 text-xs mb-8">
            This account is not designated on the UMD UQA administrator whitelist. Please contact <span className="text-white font-mono">krithikm@terpmail.umd.edu</span> to be granted access.
          </p>

          <button
            onClick={() => auth.signOut()}
            className="w-full bg-white/10 hover:bg-white/15 text-white font-semibold py-3 px-6 rounded-lg transition-all text-sm"
          >
            Sign Out / Switch Account
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER: AUTHORIZED ADMIN DASHBOARD
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-[#0f1128] text-[#f0f0f8] font-sans selection:bg-[#9296c8]/30 animate-fade-in pb-24">
      {/* Top Admin Header */}
      <div className="bg-[#0c0d23] border-b border-white/10 sticky top-[52px] z-40 backdrop-blur-md bg-opacity-95">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-full bg-[#9296c8]/20 border border-[#9296c8]/40 flex items-center justify-center overflow-hidden">
              {auth.user?.photoURL ? (
                <img src={auth.user.photoURL} alt="Admin Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="font-bold text-[#a8abdb] text-lg">{auth.user?.email?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Raleway'] text-base md:text-lg font-bold text-white">
                  {auth.user?.displayName || 'Administrator'}
                </span>
                <span className="bg-[#9296c8]/20 border border-[#9296c8]/50 text-[#a8abdb] text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Admin
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">{auth.user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo && navigateTo('resources')}
              className="bg-white/5 hover:bg-white/10 text-[#a8abdb] text-xs md:text-sm font-semibold px-4 py-2 rounded-lg border border-white/10 transition-colors"
            >
              View Resources Page →
            </button>
            <button
              onClick={() => navigateTo && navigateTo('events')}
              className="bg-white/5 hover:bg-white/10 text-[#a8abdb] text-xs md:text-sm font-semibold px-4 py-2 rounded-lg border border-white/10 transition-colors"
            >
              View Events Page →
            </button>
            <button
              onClick={() => auth.signOut()}
              className="bg-red-500/15 hover:bg-red-500/25 text-red-300 text-xs md:text-sm font-semibold px-4 py-2 rounded-lg border border-red-500/30 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10">
        {/* Action Flash Notification */}
        {actionMessage && (
          <div className={`mb-8 p-4 rounded-xl border flex items-center justify-between ${
            actionMessage.type === 'error'
              ? 'bg-red-900/40 border-red-500/50 text-red-200'
              : 'bg-emerald-900/40 border-emerald-500/50 text-emerald-200'
          }`}>
            <span>{actionMessage.text}</span>
            <button onClick={() => setActionMessage(null)} className="opacity-70 hover:opacity-100 font-bold ml-4">✕</button>
          </div>
        )}

        {/* Dashboard Navigation Tabs */}
        <div className="flex gap-2 border-b border-white/10 mb-10 overflow-x-auto">
          {[
            { id: 'events', label: 'Events & Posters CMS', count: events.length },
            { id: 'videos', label: 'Featured Videos CMS', count: videos.length },
            { id: 'admins', label: 'Admin Whitelist', count: adminEmails.length },
            { id: 'settings', label: 'Database & Sync' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`font-['Raleway'] text-base md:text-lg font-bold px-6 py-4 border-b-2 transition-all whitespace-nowrap flex items-center gap-2.5 ${
                activeTab === tab.id
                  ? 'text-[#a8abdb] border-[#a8abdb] bg-white/[0.02]'
                  : 'text-slate-400 border-transparent hover:text-white'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="text-xs bg-white/10 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ============================================================ */}
        {/* TAB 1: EVENTS & POSTERS CMS                                  */}
        {/* ============================================================ */}
        {activeTab === 'events' && (
          <div>
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <div>
                <h2 className="font-['Raleway'] text-2xl font-bold text-white">Manage Events & Posters</h2>
                <p className="text-slate-400 text-sm mt-1">Add new events, edit details and dates, upload poster flyers, or remove events. Changes are saved automatically.</p>
              </div>
              <button
                onClick={() => { setEditingEvent(null); setEventModalOpen(true); }}
                className="bg-[#9296c8] text-[#0f1128] font-bold px-6 py-3 rounded-lg hover:brightness-110 transition-all flex items-center gap-2 text-sm shadow-lg shadow-[#9296c8]/20"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                + Add New Event
              </button>
            </div>

            {loadingData ? (
              <div className="py-16 text-center text-slate-400 animate-pulse">Loading events...</div>
            ) : events.length === 0 ? (
              <div className="bg-[#0c0d23] border border-white/10 rounded-xl p-12 text-center text-slate-400">
                <p className="text-lg font-semibold text-white mb-2">No events found in database.</p>
                <button
                  onClick={handleSeedDatabase}
                  className="bg-white/10 hover:bg-white/15 text-[#a8abdb] text-sm px-6 py-2.5 rounded-lg border border-white/10"
                >
                  Seed Default Events
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {events.map((evt) => (
                  <div key={evt.id || evt.title} className="bg-[#0c0d23] border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start justify-between group hover:border-[#9296c8]/40 transition-colors">
                    <div className="flex gap-6 items-start flex-grow">
                      {/* Date Badge */}
                      <div className="flex-shrink-0 bg-[#0f1128] border border-white/10 rounded-xl p-3 text-center min-w-[75px]">
                        <div className="text-[12px] font-bold uppercase tracking-wider text-[#9296c8]">{evt.month}</div>
                        <div className="text-2xl font-light text-white leading-none mt-1">{evt.day}</div>
                      </div>

                      {/* Poster Thumbnail */}
                      {evt.posterUrl ? (
                        <div className="flex-shrink-0 w-24 h-32 bg-[#0f1128] rounded-lg overflow-hidden border border-white/10 group-hover:border-[#9296c8]/50 transition-all">
                          <img src={evt.posterUrl} alt={evt.posterAlt || evt.title} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 w-24 h-32 bg-[#0f1128] rounded-lg border border-dashed border-white/10 flex items-center justify-center text-center p-2 text-[11px] text-slate-500">
                          No Poster
                        </div>
                      )}

                      {/* Content */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-['Raleway'] text-xl font-bold text-white">{evt.title}</h3>
                          {evt.isAnnual && (
                            <span className="bg-[#9296c8]/15 text-[#a8abdb] text-[11px] font-semibold px-2.5 py-0.5 rounded border border-[#9296c8]/30">
                              Annual
                            </span>
                          )}
                        </div>
                        {evt.subtitle && <p className="text-sm text-[#a8abdb] italic">{evt.subtitle}</p>}
                        <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed max-w-3xl">{evt.description}</p>
                        
                        <div className="flex flex-wrap gap-2 pt-2">
                          {evt.highlights && evt.highlights.length > 0 && (
                            <span className="text-xs text-slate-400 bg-white/5 px-2.5 py-1 rounded">
                              {evt.highlights.length} bullet highlights
                            </span>
                          )}
                          {evt.links && evt.links.length > 0 && (
                            <span className="text-xs text-slate-400 bg-white/5 px-2.5 py-1 rounded">
                              {evt.links.length} action links
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-3 flex-shrink-0 self-end md:self-center">
                      <button
                        onClick={() => { setEditingEvent(evt); setEventModalOpen(true); }}
                        className="bg-white/5 hover:bg-white/10 text-[#a8abdb] text-xs font-bold px-4 py-2.5 rounded-lg border border-white/10 transition-colors flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(evt)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-bold px-4 py-2.5 rounded-lg border border-red-500/25 transition-colors flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: FEATURED VIDEOS CMS                                   */}
        {/* ============================================================ */}
        {activeTab === 'videos' && (
          <div>
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <div>
                <h2 className="font-['Raleway'] text-2xl font-bold text-white">Manage Featured Videos</h2>
                <p className="text-slate-400 text-sm mt-1">Add YouTube videos to the Resources video player, change order, or remove videos.</p>
              </div>
              <button
                onClick={() => { setEditingVideo(null); setVideoModalOpen(true); }}
                className="bg-[#9296c8] text-[#0f1128] font-bold px-6 py-3 rounded-lg hover:brightness-110 transition-all flex items-center gap-2 text-sm shadow-lg shadow-[#9296c8]/20"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                + Add Video
              </button>
            </div>

            {loadingData ? (
              <div className="py-16 text-center text-slate-400 animate-pulse">Loading videos...</div>
            ) : videos.length === 0 ? (
              <div className="bg-[#0c0d23] border border-white/10 rounded-xl p-12 text-center text-slate-400">
                <p className="text-lg font-semibold text-white mb-2">No videos configured in database.</p>
                <button
                  onClick={handleSeedDatabase}
                  className="bg-white/10 hover:bg-white/15 text-[#a8abdb] text-sm px-6 py-2.5 rounded-lg border border-white/10"
                >
                  Seed Default Videos
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((vid, idx) => (
                  <div key={vid.id || idx} className="bg-[#0c0d23] border border-white/10 rounded-2xl overflow-hidden group hover:border-[#9296c8]/40 transition-all">
                    {/* YouTube Thumbnail Preview */}
                    <div className="relative aspect-video bg-black/60 overflow-hidden">
                      <img
                        src={`https://img.youtube.com/vi/${vid.id}/hqdefault.jpg`}
                        alt={vid.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/640x360?text=Quantum+Video'; }}
                      />
                      <div className="absolute top-3 left-3 bg-[#0f1128]/80 backdrop-blur-md px-2.5 py-1 rounded text-xs font-mono font-bold text-[#a8abdb] border border-white/10">
                        #{vid.order || idx + 1}
                      </div>
                    </div>

                    <div className="p-5 space-y-4">
                      <div>
                        <div className="text-[11px] uppercase font-bold tracking-wider text-[#9296c8] mb-1">{vid.category || 'Featured'}</div>
                        <h4 className="font-['Raleway'] font-bold text-lg text-white line-clamp-1">{vid.title}</h4>
                        <p className="text-xs font-mono text-slate-400 mt-1">ID: {vid.id}</p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-white/10">
                        <a
                          href={`https://www.youtube.com/watch?v=${vid.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-[#a8abdb] hover:underline"
                        >
                          Watch on YouTube ↗
                        </a>
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setEditingVideo(vid); setVideoModalOpen(true); }}
                            className="bg-white/5 hover:bg-white/10 text-[#a8abdb] text-xs font-semibold px-3 py-1.5 rounded border border-white/10 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteVideo(vid)}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-semibold px-3 py-1.5 rounded border border-red-500/20 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: ADMIN WHITELIST MANAGER                               */}
        {/* ============================================================ */}
        {activeTab === 'admins' && (
          <div className="max-w-4xl">
            <div className="mb-8">
              <h2 className="font-['Raleway'] text-2xl font-bold text-white">Administrator Email Whitelist</h2>
              <p className="text-slate-400 text-sm mt-1">
                Designate which Google or UMD email accounts have administrative privileges.
              </p>
            </div>

            {/* Add Admin Form */}
            <form onSubmit={handleAddAdminEmail} className="bg-[#0c0d23] border border-white/10 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                required
                placeholder="Enter officer email (e.g. officer@umd.edu)"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                className="flex-grow bg-[#0f1128] border border-white/15 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#9296c8] transition-colors text-sm"
              />
              <button
                type="submit"
                className="bg-[#9296c8] text-[#0f1128] font-bold px-6 py-3 rounded-lg hover:brightness-110 transition-all text-sm whitespace-nowrap"
              >
                + Add Administrator
              </button>
            </form>

            {/* Admin List */}
            <div className="bg-[#0c0d23] border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-white/10 bg-white/[0.02] text-xs font-bold uppercase tracking-wider text-slate-400">
                Current Authorized Administrators
              </div>
              <div className="divide-y divide-white/10">
                {adminEmails.map((admin) => (
                  <div key={admin.id || admin.email} className="p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#9296c8]/20 flex items-center justify-center text-xs font-bold text-[#a8abdb]">
                        {admin.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-mono text-sm text-white">{admin.email}</div>
                        <div className="text-[11px] text-slate-500">
                          {admin.email.toLowerCase() === "krithikm@terpmail.umd.edu" ? "Primary Administrator (Permanent)" : "Administrator"}
                        </div>
                      </div>
                    </div>

                    {admin.email.toLowerCase() === "krithikm@terpmail.umd.edu" ? (
                      <span className="text-xs text-[#a8abdb] bg-[#9296c8]/15 px-3 py-1 rounded-full border border-[#9296c8]/30 font-semibold">
                        Primary Admin
                      </span>
                    ) : admin.email.toLowerCase() === auth.user?.email?.toLowerCase() ? (
                      <span className="text-xs text-slate-300 bg-white/10 px-3 py-1 rounded-full border border-white/15">
                        Current Session
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRemoveAdminEmail(admin)}
                        className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1.5 rounded transition-colors"
                      >
                        Revoke Access
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: SETTINGS & FIREBASE STATUS                            */}
        {/* ============================================================ */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl space-y-8">
            <div className="bg-[#0c0d23] border border-white/10 rounded-2xl p-8 space-y-6">
              <h2 className="font-['Raleway'] text-2xl font-bold text-white">Data Storage & Connection Status</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#0f1128] border border-white/10 rounded-xl p-5">
                  <div className="text-xs font-bold uppercase text-slate-400 mb-1">Storage Mode</div>
                  <div className="text-lg font-bold flex items-center gap-2">
                    {window.isFirebaseConfigured() ? (
                      <span className="text-emerald-400 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Cloud Firestore & Storage
                      </span>
                    ) : (
                      <span className="text-emerald-400 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                        Local Persistent Storage Active
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-[#0f1128] border border-white/10 rounded-xl p-5">
                  <div className="text-xs font-bold uppercase text-slate-400 mb-1">Authenticated Account</div>
                  <div className="text-sm font-mono text-white truncate">{auth.user?.email}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-white text-base">Migrate / Seed Initial Site Data</h4>
                  <p className="text-slate-400 text-xs mt-1">Populates Firestore with initial admins, workshop videos, and events.</p>
                </div>
                <button
                  onClick={handleSeedDatabase}
                  className="bg-[#9296c8] text-[#0f1128] font-bold text-xs px-5 py-2.5 rounded-lg hover:brightness-110 transition-all whitespace-nowrap"
                >
                  Run Seed Script
                </button>
              </div>

              {seedingStatus && (
                <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-[#a8abdb]">
                  {seedingStatus}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD / EDIT EVENT FORM */}
      {eventModalOpen && (
        <EventFormModal
          event={editingEvent}
          onClose={() => { setEventModalOpen(false); setEditingEvent(null); }}
          onSave={handleSaveEvent}
        />
      )}

      {/* MODAL: ADD / EDIT VIDEO FORM */}
      {videoModalOpen && (
        <VideoFormModal
          video={editingVideo}
          onClose={() => { setVideoModalOpen(false); setEditingVideo(null); }}
          onSave={handleSaveVideo}
        />
      )}
    </div>
  );
};

/**
 * Subcomponent: Event Create / Edit Modal
 */
function EventFormModal({ event, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    subtitle: event?.subtitle || '',
    month: event?.month || 'Sept',
    day: event?.day || '15',
    year: event?.year || '2026',
    description: event?.description || '',
    highlights: event?.highlights ? [...event.highlights] : [''],
    links: event?.links ? [...event.links] : [{ label: 'Register', url: '', primary: true }],
    posterUrl: event?.posterUrl || '',
    posterAlt: event?.posterAlt || '',
    isAnnual: event?.isAnnual !== undefined ? event.isAnnual : true,
    order: event?.order || 1
  });

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

  const handleHighlightChange = (index, value) => {
    const next = [...formData.highlights];
    next[index] = value;
    setFormData({ ...formData, highlights: next });
  };

  const addHighlight = () => {
    setFormData({ ...formData, highlights: [...formData.highlights, ''] });
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
    setFormData({ ...formData, links: [...formData.links, { label: 'Learn More', url: '', primary: false }] });
  };

  const removeLink = (index) => {
    setFormData({ ...formData, links: formData.links.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const cleanHighlights = formData.highlights.filter(h => h.trim().length > 0);
      const cleanLinks = formData.links.filter(l => l.url.trim().length > 0);
      await onSave({ ...formData, highlights: cleanHighlights, links: cleanLinks }, posterFile);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0c0d23] border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="font-['Raleway'] text-2xl font-bold text-white">
            {event ? 'Edit Event Details' : 'Create New Event'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl font-bold leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Event Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Quantum Leap Career Nexus"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-[#0f1128] border border-white/15 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#9296c8] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Subtitle / Location</label>
              <input
                type="text"
                placeholder="e.g. QLCN 2026 · University of Maryland"
                value={formData.subtitle}
                onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full bg-[#0f1128] border border-white/15 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#9296c8] text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Month *</label>
              <input
                type="text"
                required
                placeholder="Sept"
                value={formData.month}
                onChange={e => setFormData({ ...formData, month: e.target.value })}
                className="w-full bg-[#0f1128] border border-white/15 rounded-lg px-4 py-2.5 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Day *</label>
              <input
                type="text"
                required
                placeholder="15"
                value={formData.day}
                onChange={e => setFormData({ ...formData, day: e.target.value })}
                className="w-full bg-[#0f1128] border border-white/15 rounded-lg px-4 py-2.5 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Year</label>
              <input
                type="text"
                placeholder="2026"
                value={formData.year}
                onChange={e => setFormData({ ...formData, year: e.target.value })}
                className="w-full bg-[#0f1128] border border-white/15 rounded-lg px-4 py-2.5 text-white text-sm"
              />
            </div>
          </div>

          {/* Poster Upload Section */}
          <div className="p-4 bg-[#0f1128] border border-white/10 rounded-xl space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#a8abdb]">Event Flyer / Poster Image</label>
            <div className="flex items-center gap-4">
              {previewUrl ? (
                <div className="w-16 h-20 bg-black/40 rounded border border-white/20 overflow-hidden relative group">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setPosterFile(null); setPreviewUrl(''); setFormData({ ...formData, posterUrl: '' }); }}
                    className="absolute inset-0 bg-red-900/80 text-white text-xs opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
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
                  className="text-xs text-slate-300 file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#9296c8]/20 file:text-[#a8abdb] hover:file:bg-[#9296c8]/30"
                />
                <p className="text-[11px] text-slate-400">PNG, JPG, WebP up to 5MB.</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Description *</label>
            <textarea
              rows={4}
              required
              placeholder="Detailed overview of the event, speakers, and venue..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#0f1128] border border-white/15 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#9296c8] text-sm leading-relaxed"
            />
          </div>

          {/* Highlights */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Key Highlights / Bullets</label>
              <button type="button" onClick={addHighlight} className="text-xs text-[#a8abdb] hover:underline font-semibold">+ Add Point</button>
            </div>
            {formData.highlights.map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Networking with quantum industry leaders"
                  value={item}
                  onChange={e => handleHighlightChange(idx, e.target.value)}
                  className="flex-grow bg-[#0f1128] border border-white/15 rounded-lg px-3 py-2 text-white text-xs"
                />
                <button type="button" onClick={() => removeHighlight(idx)} className="text-red-400 hover:text-red-300 px-2">✕</button>
              </div>
            ))}
          </div>

          {/* Action Links */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Action Links / Buttons</label>
              <button type="button" onClick={addLink} className="text-xs text-[#a8abdb] hover:underline font-semibold">+ Add Link</button>
            </div>
            {formData.links.map((link, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Label (e.g. Register)"
                  value={link.label}
                  onChange={e => handleLinkChange(idx, 'label', e.target.value)}
                  className="w-1/3 bg-[#0f1128] border border-white/15 rounded-lg px-3 py-2 text-white text-xs"
                />
                <input
                  type="url"
                  placeholder="https://..."
                  value={link.url}
                  onChange={e => handleLinkChange(idx, 'url', e.target.value)}
                  className="flex-grow bg-[#0f1128] border border-white/15 rounded-lg px-3 py-2 text-white text-xs"
                />
                <button type="button" onClick={() => removeLink(idx)} className="text-red-400 hover:text-red-300 px-2">✕</button>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg text-slate-400 hover:text-white text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#9296c8] text-[#0f1128] font-bold px-6 py-2.5 rounded-lg hover:brightness-110 transition-all text-sm disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? 'Saving Event...' : (event ? 'Save Changes' : 'Create Event')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * Subcomponent: Video Create / Edit Modal
 */
function VideoFormModal({ video, onClose, onSave }) {
  const [formData, setFormData] = useState({
    id: video?.id || '',
    title: video?.title || '',
    category: video?.category || 'Featured Videos',
    order: video?.order || 1
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0c0d23] border border-white/20 rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="font-['Raleway'] text-2xl font-bold text-white">
            {video ? 'Edit Featured Video' : 'Add Featured Video'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl font-bold leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Video Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. QuEra Quantum Challenge Walkthrough"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-[#0f1128] border border-white/15 rounded-lg px-4 py-2.5 text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">YouTube Video ID or URL *</label>
            <input
              type="text"
              required
              placeholder="e.g. agOdzgWTr-Y or https://youtu.be/..."
              value={formData.id}
              onChange={e => setFormData({ ...formData, id: e.target.value })}
              className="w-full bg-[#0f1128] border border-white/15 rounded-lg px-4 py-2.5 text-white text-sm font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1">Accepts full YouTube URLs or 11-character video IDs.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Category</label>
              <input
                type="text"
                placeholder="Featured Videos"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#0f1128] border border-white/15 rounded-lg px-4 py-2.5 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Display Order</label>
              <input
                type="number"
                min="1"
                value={formData.order}
                onChange={e => setFormData({ ...formData, order: e.target.value })}
                className="w-full bg-[#0f1128] border border-white/15 rounded-lg px-4 py-2.5 text-white text-sm"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg text-slate-400 hover:text-white text-sm">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#9296c8] text-[#0f1128] font-bold px-6 py-2.5 rounded-lg hover:brightness-110 transition-all text-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Video'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
