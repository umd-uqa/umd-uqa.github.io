const { useState, useEffect } = window.React || React;

/**
 * RESOURCES COMPONENT
 * Expanded layout: 1400px container width for maximum screen usage.
 * Typography: 20px body text and 16px labels to fill the wider space.
 * Dynamic CMS: Loads videos from Firestore with inline admin controls and resilient offline fallback.
 */
window.Resources = function Resources({ navigateTo }) {
  const auth = window.useUQAAuth ? window.useUQAAuth() : { user: null, isAdmin: false };
  const [activeTab, setActiveTab] = useState(0);

  // Default hardcoded fallback videos
  const defaultVideoResources = [
    { id: "agOdzgWTr-Y", title: "QuEra Workshop 1", order: 1 },
    { id: "i_MKOCxInOQ", title: "QuEra Quantum Challenge Walkthrough", order: 2 },
    { id: "xEa3WIzgxDQ", title: "QuEra Workshop 2", order: 3 }
  ];

  const [videos, setVideos] = useState(defaultVideoResources);
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [videoForm, setVideoForm] = useState({ title: '', id: '', order: 1 });

  // Load live Supabase videos if available
  const loadVideos = async () => {
    if (window.isSupabaseConfigured && window.isSupabaseConfigured() && window.uqaSupabase) {
      try {
        const { data, error } = await window.uqaSupabase
          .from('videos')
          .select('*')
          .order('order_num', { ascending: true });

        if (!error && data && data.length > 0) {
          setVideos(data);
        } else {
          setVideos(defaultVideoResources);
        }
      } catch (err) {
        console.warn("[Resources] Supabase videos load warning:", err);
        setVideos(defaultVideoResources);
      }
    } else {
      setVideos(defaultVideoResources);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  // Safe active video resolution
  const safeActiveIndex = activeTab >= videos.length ? 0 : activeTab;
  const currentVideo = videos[safeActiveIndex] || defaultVideoResources[0];

  const handleSaveInlineVideo = async (e) => {
    e.preventDefault();
    if (!videoForm.title || !videoForm.id) return;

    let cleanId = videoForm.id.trim();
    const match = cleanId.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match && match[1]) {
      cleanId = match[1];
    }

    const payload = {
      id: cleanId,
      title: videoForm.title.trim(),
      order_num: Number(videoForm.order) || (videos.length + 1),
      updated_at: new Date().toISOString()
    };

    if (window.uqaSupabase && window.isSupabaseConfigured() && auth.isAdmin) {
      try {
        const { error } = await window.uqaSupabase.from('videos').upsert(payload);
        if (error) throw error;
        setIsAddingVideo(false);
        setVideoForm({ title: '', id: '', order: 1 });
        loadVideos();
      } catch (err) {
        alert("Failed to save video: " + err.message);
      }
    } else {
      // Offline local preview
      setVideos([...videos, payload]);
      setIsAddingVideo(false);
      setVideoForm({ title: '', id: '', order: 1 });
    }
  };

  const handleDeleteInlineVideo = async (videoId) => {
    if (!confirm("Are you sure you want to remove this video?")) return;
    if (window.uqaSupabase && window.isSupabaseConfigured() && auth.isAdmin) {
      try {
        const { error } = await window.uqaSupabase.from('videos').delete().eq('id', videoId);
        if (error) throw error;
        if (activeTab >= videos.length - 1) {
          setActiveTab(Math.max(0, videos.length - 2));
        }
        loadVideos();
      } catch (err) {
        alert("Failed to delete video: " + err.message);
      }
    } else {
      setVideos(videos.filter(v => v.id !== videoId));
      setActiveTab(0);
    }
  };

  const uqaPresentations = [
    { title: "Intro to Quantum Computing", link: "https://docs.google.com/presentation/d/1bGQW5ZHiP69EGtNNrue6r17IT3a_Wy68/edit?usp=sharing", tag: "Intro" },
    { title: "Intro to Quantum Science & Tech", link: "https://docs.google.com/presentation/d/1L-pnUIX8-Oi_3yKMdaxhA9xWEE19dAAzyV7X0St_O4I/edit?usp=sharing", tag: "Intro" },
    { title: "CHSH Game", link: "https://docs.google.com/presentation/d/14-I5L8XVgem824K5SYbRdeYHeXoRQ_as/edit?usp=sharing", tag: "Specific Topics" },
    { title: "QuEra Intro", link: "https://docs.google.com/presentation/d/1owfEtq9Vm_r-tKQn5uNuWE_pLUlX9M-Aq-T-YQF_oNg/edit", tag: "Semester Relevant" }
  ];

  return (
      <div className="min-h-screen bg-[#0f1128] text-[#f0f0f8] font-sans selection:bg-[#9296c8]/30 animate-fade-in">

        {/* Container expanded to 1400px */}
        <div className="max-w-[1400px] mx-auto px-10 py-[120px] pb-[120px]">

          {/* Simplified Heading: Optimized for 1400px layout */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
            <h1 className="font-['Raleway'] text-[clamp(32px,5vw,48px)] font-semibold tracking-tight leading-[1.2] text-[#a8abdb]">
              UQA Resources
            </h1>
            {auth.isAdmin && (
              <span className="px-3 py-1 bg-[#9296c8]/15 border border-[#9296c8]/30 text-[#a8abdb] text-xs font-bold rounded-full uppercase tracking-wider">
                Admin Mode Active
              </span>
            )}
          </div>

          {/* ── SECTION 1: FEATURED VIDEOS ── */}
          <div className="mb-14">
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
              <div className="font-['Raleway'] text-[16px] font-bold tracking-[0.22em] uppercase text-[#9296c8]">
                Featured Videos
              </div>
              {auth.isAdmin && (
                <button
                  onClick={() => {
                    setVideoForm({ title: '', id: '', order: videos.length + 1 });
                    setIsAddingVideo(true);
                  }}
                  className="bg-[#9296c8] text-[#0f1128] font-bold px-4 py-1.5 rounded-md text-xs hover:brightness-110 transition-all flex items-center gap-1.5"
                >
                  <span>+ Add Video</span>
                </button>
              )}
            </div>

            {/* Video Tabs */}
            <div className="flex gap-0 border-b border-white/10 mb-10 overflow-x-auto scrollbar-hide items-center">
              {videos.map((video, i) => (
                <div key={video.id || i} className="flex items-center border-b-2 border-transparent">
                  <button
                    onClick={() => setActiveTab(i)}
                    className={`font-['Raleway'] text-[18px] font-medium px-8 py-4 border-b-2 transition-colors whitespace-nowrap
                      ${safeActiveIndex === i ? 'text-[#a8abdb] border-[#a8abdb]' : 'text-[#f0f0f8]/50 border-transparent hover:text-[#f0f0f8]'}
                    `}
                  >
                    {video.title}
                  </button>
                  {auth.isAdmin && safeActiveIndex === i && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteInlineVideo(video.id);
                      }}
                      title="Remove this video"
                      className="text-red-400 hover:text-red-300 px-2 text-xs font-semibold hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Video Player */}
            {currentVideo && (
              <div className="w-full aspect-video rounded-3xl overflow-hidden border border-white/10 bg-[#0c0d23] shadow-2xl">
                <iframe
                    width="100%" height="100%"
                    src={`https://www.youtube.com/embed/${currentVideo.id}`}
                    title={currentVideo.title}
                    frameBorder="0"
                    allowFullScreen
                ></iframe>
              </div>
            )}
          </div>

          {/* Inline Add Video Modal */}
          {isAddingVideo && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-[#0c0d23] border border-white/20 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <h3 className="text-lg font-bold text-white font-['Raleway']">Add Featured Video</h3>
                  <button onClick={() => setIsAddingVideo(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
                </div>
                <form onSubmit={handleSaveInlineVideo} className="space-y-4 text-sm">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
                    <input
                      type="text"
                      placeholder="e.g. QuEra Workshop 3"
                      value={videoForm.title}
                      onChange={e => setVideoForm({ ...videoForm, title: e.target.value })}
                      className="w-full bg-[#0f1128] border border-white/20 rounded-lg p-2.5 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">YouTube URL or ID</label>
                    <input
                      type="text"
                      placeholder="e.g. https://youtu.be/agOdzgWTr-Y"
                      value={videoForm.id}
                      onChange={e => setVideoForm({ ...videoForm, id: e.target.value })}
                      className="w-full bg-[#0f1128] border border-white/20 rounded-lg p-2.5 text-white"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setIsAddingVideo(false)}
                      className="px-4 py-2 rounded-lg border border-white/10 text-slate-300 text-xs"
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
          )}

          <hr className="border-none border-t border-white/10 mb-14" />

          {/* ── SECTION 2: UQA CREATED RESOURCES ── */}
          <div className="mb-14">
            <div className="font-['Raleway'] text-[16px] font-bold tracking-[0.22em] uppercase text-[#9296c8] mb-10">
              UQA Created Resources
            </div>
            <div className="flex flex-col">
              {uqaPresentations.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-8 border-t border-white/10 first:border-t-0 group">
                    <div>
                      <div className="font-['Raleway'] text-[14px] font-bold tracking-[0.14em] uppercase text-[#9296c8] mb-2">{item.tag}</div>
                      <div className="text-[20px] font-semibold text-white">{item.title}</div>
                    </div>
                    <a href={item.link} target="_blank" className="font-['Raleway'] text-[16px] font-semibold text-[#a8abdb] border-b border-[#a8abdb]/30 hover:border-[#a8abdb] transition-all whitespace-nowrap">
                      Open Slides →
                    </a>
                  </div>
              ))}
            </div>
          </div>

          {/* ── SECTION 3: LAUNCH BANNER ── */}
          <div className="mb-14 flex flex-col md:flex-row items-center justify-between gap-12 py-12 border-y border-white/10">
            <div>
              <h3 className="font-['Raleway'] text-[28px] font-semibold text-white mb-3">Quantum Coalition Learning Graph</h3>
              <p className="text-[#f0f0f8]/60 text-[20px] leading-relaxed max-w-4xl">The visual, interactive roadmap for learning quantum protocols, math prerequisites, and IBM course mappings.</p>
            </div>
            <a href="https://quantum-coalition-learning-resource.vercel.app/graph" target="_blank" className="bg-[#9296c8] text-[#0f1128] px-10 py-4 rounded-lg font-bold text-[15px] tracking-wide whitespace-nowrap hover:brightness-110 transition-all">
              Launch Graph →
            </a>
          </div>

          {/* ── SECTION 4: REPOSITORIES (4-COL GRID) ── */}
          <div className="mb-14">
            <div className="font-['Raleway'] text-[16px] font-bold tracking-[0.22em] uppercase text-[#9296c8] mb-10">
              Repositories & Community
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-12">
              {[
                { title: "QuEra Slack", link: "https://join.slack.com/t/querapublic/shared_invite/zt-1r86wjwxs-OcdmXqBOisO~AHISXTL80w", desc: "#umd-uqa · Mentors, Office Hours & Q&A" },
                { title: "Bloqade GitHub", link: "https://github.com/QuEraComputing/bloqade", desc: "Neutral atom computing" },
                { title: "Starter Tutorials", link: "https://github.com/QuEraComputing/quera-education", desc: "QuEra educational code" },
                { title: "Awesome Quantum Computing", link: "https://github.com/desireevl/awesome-quantum-computing", desc: "Huge repository of resources" }
              ].map((item, i) => (
                  <div key={i} className="pt-8 border-t border-white/10">
                    <h4 className="text-[18px] font-bold text-white mb-3">{item.title}</h4>
                    <p className="text-[#f0f0f8]/50 text-[15px] leading-relaxed mb-6">{item.desc}</p>
                    <a href={item.link} target="_blank" className="text-[#a8abdb] text-[14px] font-semibold border-b border-[#a8abdb]/30 hover:border-[#a8abdb] transition-all">Join →</a>
                  </div>
              ))}
            </div>
          </div>

          <hr className="border-none border-t border-white/10 mb-14" />

          {/* ── SECTION 5: BOTTOM GRID ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            <div>
              <div className="font-['Raleway'] text-[16px] font-bold tracking-[0.22em] uppercase text-[#9296c8] mb-10">Learning Platforms & Demos</div>
              <div className="flex flex-col">
                {[
                  { title: "IBM Quantum Learning", link: "https://quantum.cloud.ibm.com/learning/en" },
                  { title: "Pennylane (QML)", link: "https://pennylane.ai/qml/demonstrations" },
                  { title: "Neutral Atom / QuEra", link: "https://qbook.quera.com/" },
                  { title: "Qubit.guide", link: "https://qubit.guide/" }
                ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-6 border-t border-white/10 first:border-t-0">
                      <span className="text-[18px] text-white">{item.title}</span>
                      <a href={item.link} target="_blank" className="text-[#a8abdb] text-[15px] font-semibold border-b border-[#a8abdb]/30 hover:border-[#a8abdb] transition-all">Open →</a>
                    </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="font-['Raleway'] text-[16px] font-bold tracking-[0.22em] uppercase text-[#9296c8] mb-10">Textbooks & Notes</div>
              <div className="space-y-10">
                <div>
                  <h4 className="text-[18px] font-bold text-white mb-2">Quantum Computation and Information</h4>
                  <p className="text-[#f0f0f8]/50 text-[16px]">Nielsen and Chuang</p>
                </div>
                <div>
                  <h4 className="text-[18px] font-bold text-white mb-2">Quantum Physics (4th Edition)</h4>
                  <p className="text-[#f0f0f8]/50 text-[16px]">Griffiths and Schroeter</p>
                </div>
                <a href="https://www.lorentz.leidenuniv.nl/quantumcomputers/literature/preskill_1_to_6.pdf" target="_blank" className="text-[#a8abdb] text-[18px] font-semibold border-b border-[#a8abdb]/30 hover:border-[#a8abdb] inline-block">Preskill's Lecture Notes →</a>
              </div>

              <div className="mt-16 pt-8 border-t border-white/10">
                <a href="https://discord.gg/qtqcAjhRVP" target="_blank" className="text-[#a8abdb] text-[18px] font-semibold border-b border-[#a8abdb]/30 hover:border-[#a8abdb] transition-all">Open UQA Discord Channel →</a>
              </div>
            </div>
          </div>

        </div>
      </div>
  );
};
