/**
 * UMD UQA Initial Database Seed Utility
 * Provides on-demand initial data migration for Firestore.
 */
window.UQA_SEED_DATA = {
  videos: [
    { id: "agOdzgWTr-Y", title: "QuEra Workshop 1", order: 1 },
    { id: "i_MKOCxInOQ", title: "QuEra Quantum Challenge Walkthrough", order: 2 },
    { id: "xEa3WIzgxDQ", title: "QuEra Workshop 2", order: 3 }
  ],
  events: [
    {
      title: "Quantum Leap Career Nexus",
      subtitle: "QLCN 2026 · University of Maryland",
      month: "Sept",
      day: "15",
      year: "2026",
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
  ],
  admins: [
    { email: "itskrithikmohan@gmail.com", role: "admin", addedBy: "system_init" },
    { email: "krithikm@terpmail.umd.edu", role: "admin", addedBy: "system_init" },
    { email: "umd.uqa@gmail.com", role: "admin", addedBy: "system_init" }
  ]
};

/**
 * Seed initial videos, events, and admin emails into Firestore
 * Only populates if collections are empty.
 */
window.seedInitialData = async function(db) {
  const targetDb = db || window.uqaDb;
  if (!targetDb) {
    throw new Error("Firestore database instance is not available.");
  }

  const results = {
    videosSeeded: 0,
    eventsSeeded: 0,
    adminsSeeded: 0,
    messages: []
  };

  try {
    // 1. Seed Videos
    const videosSnap = await targetDb.collection('videos').limit(1).get();
    if (videosSnap.empty) {
      for (const video of window.UQA_SEED_DATA.videos) {
        await targetDb.collection('videos').doc(video.id).set({
          ...video,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        results.videosSeeded++;
      }
      results.messages.push(`Seeded ${results.videosSeeded} initial videos.`);
    } else {
      results.messages.push("Videos collection already contains records; skipped video seeding.");
    }

    // 2. Seed Events
    const eventsSnap = await targetDb.collection('events').limit(1).get();
    if (eventsSnap.empty) {
      for (const event of window.UQA_SEED_DATA.events) {
        await targetDb.collection('events').add({
          ...event,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        results.eventsSeeded++;
      }
      results.messages.push(`Seeded ${results.eventsSeeded} initial events.`);
    } else {
      results.messages.push("Events collection already contains records; skipped event seeding.");
    }

    // 3. Seed Admins
    const adminsSnap = await targetDb.collection('admin_emails').limit(1).get();
    if (adminsSnap.empty) {
      for (const admin of window.UQA_SEED_DATA.admins) {
        await targetDb.collection('admin_emails').doc(admin.email.toLowerCase().trim()).set({
          ...admin,
          createdAt: new Date().toISOString()
        });
        results.adminsSeeded++;
      }
      results.messages.push(`Seeded ${results.adminsSeeded} initial admin emails.`);
    } else {
      results.messages.push("Admin emails collection already contains records; skipped admin seeding.");
    }

    return results;
  } catch (err) {
    console.error("[UQA Seed Data] Seeding error:", err);
    throw err;
  }
};
