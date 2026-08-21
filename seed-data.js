/**
 * UMD UQA Initial Seed Data & Migration Utility
 */
window.UQA_INITIAL_ADMINS = [
  {
    email: "krithikm@terpmail.umd.edu",
    role: "admin",
    notes: "Primary Administrator"
  }
];

window.UQA_INITIAL_VIDEOS = [
  {
    id: "agOdzgWTr-Y",
    title: "QuEra Workshop 1",
    category: "Featured Videos",
    order: 1
  },
  {
    id: "i_MKOCxInOQ",
    title: "QuEra Quantum Challenge Walkthrough",
    category: "Featured Videos",
    order: 2
  },
  {
    id: "xEa3WIzgxDQ",
    title: "QuEra Workshop 2",
    category: "Featured Videos",
    order: 3
  }
];

window.UQA_INITIAL_EVENTS = [
  {
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
    posterAlt: "Quantum Leap Career Nexus Event Poster",
    isAnnual: true,
    order: 1
  }
];

/**
 * Seed initial admins, videos, and events into Firestore
 */
window.seedInitialData = async function() {
  if (!window.isFirebaseConfigured() || !window.uqaDb) {
    throw new Error("Firebase Firestore is not configured or initialized.");
  }

  const db = window.uqaDb;
  const results = { adminsAdded: 0, videosAdded: 0, eventsAdded: 0 };

  // Seed initial admins
  for (const admin of window.UQA_INITIAL_ADMINS) {
    const adminRef = db.collection('admin_emails').doc(admin.email.toLowerCase());
    const doc = await adminRef.get();
    if (!doc.exists) {
      await adminRef.set({
        email: admin.email.toLowerCase(),
        role: "admin",
        createdAt: window.firebase.firestore.FieldValue.serverTimestamp()
      });
      results.adminsAdded++;
    }
  }

  // Seed videos
  const videosSnap = await db.collection('videos').get();
  if (videosSnap.empty) {
    for (const video of window.UQA_INITIAL_VIDEOS) {
      await db.collection('videos').doc(video.id).set({
        ...video,
        createdAt: window.firebase.firestore.FieldValue.serverTimestamp()
      });
      results.videosAdded++;
    }
  }

  // Seed events
  const eventsSnap = await db.collection('events').get();
  if (eventsSnap.empty) {
    for (const evt of window.UQA_INITIAL_EVENTS) {
      await db.collection('events').add({
        ...evt,
        createdAt: window.firebase.firestore.FieldValue.serverTimestamp()
      });
      results.eventsAdded++;
    }
  }

  return results;
};
