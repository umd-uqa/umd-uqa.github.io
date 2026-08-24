/**
 * UMD UQA Firebase Configuration & Initialization
 * 
 * Replace placeholder values below with your Firebase Project Configuration
 * from the Firebase Console (Project Settings > General > Your apps > Web app).
 */
window.UQA_FIREBASE_CONFIG = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

/**
 * Check if Firebase credentials have been configured with valid keys
 */
window.isFirebaseConfigured = function() {
  const cfg = window.UQA_FIREBASE_CONFIG;
  return Boolean(
    cfg &&
    cfg.apiKey &&
    cfg.apiKey !== "YOUR_FIREBASE_API_KEY" &&
    cfg.projectId &&
    cfg.projectId !== "YOUR_PROJECT_ID"
  );
};

// Initialize Firebase App and Auth services if SDK and config are present
(function initFirebase() {
  if (typeof window.firebase === "undefined") {
    console.warn("[UQA Firebase] Firebase SDK scripts not loaded yet.");
    return;
  }

  if (window.isFirebaseConfigured()) {
    try {
      if (!window.firebase.apps.length) {
        window.firebase.initializeApp(window.UQA_FIREBASE_CONFIG);
      }
      window.uqaAuth = window.firebase.auth();
      console.log("[UQA Firebase] Firebase Auth initialized successfully.");
    } catch (err) {
      console.error("[UQA Firebase] Error initializing Firebase:", err);
    }
  } else {
    console.info("[UQA Firebase] Running in unconfigured client mode. Please configure firebase-config.js with valid Firebase credentials.");
  }
})();
