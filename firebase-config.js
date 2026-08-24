/**
 * UMD UQA Firebase Configuration & Initialization
 * 
 * To obtain your free Firebase Project configuration:
 * 1. Go to Firebase Console: https://console.firebase.google.com/
 * 2. Create or select your project (e.g. umd-uqa-web)
 * 3. Add a Web App (</>) and copy the firebaseConfig credentials below.
 */
window.UQA_FIREBASE_CONFIG = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "umd-uqa-web.firebaseapp.com",
  projectId: "umd-uqa-web",
  storageBucket: "umd-uqa-web.appspot.com",
  messagingSenderId: "998330975634",
  appId: "1:998330975634:web:your_app_id"
};

/**
 * Check if a valid Firebase API Key has been configured
 */
window.isFirebaseConfigured = function() {
  const cfg = window.UQA_FIREBASE_CONFIG;
  return Boolean(
    cfg &&
    typeof cfg.apiKey === "string" &&
    cfg.apiKey.trim() !== "" &&
    cfg.apiKey !== "YOUR_FIREBASE_API_KEY" &&
    !cfg.apiKey.includes("YOUR_FIREBASE_API_KEY")
  );
};

// Global Firebase instances
window.uqaApp = null;
window.uqaAuth = null;
window.uqaDb = null;
window.uqaStorage = null;

// Initialize Firebase services if configured and SDK is present
try {
  if (typeof window.firebase !== "undefined" && window.isFirebaseConfigured()) {
    if (!window.firebase.apps || !window.firebase.apps.length) {
      window.uqaApp = window.firebase.initializeApp(window.UQA_FIREBASE_CONFIG);
    } else {
      window.uqaApp = window.firebase.app();
    }
    window.uqaAuth = window.firebase.auth();
    window.uqaDb = window.firebase.firestore();
    window.uqaStorage = window.firebase.storage();
    console.log("[UQA Firebase] Initialized Firebase services successfully.");
  } else {
    console.info("[UQA Firebase] Running in client fallback mode (Firebase credentials pending or unconfigured).");
  }
} catch (err) {
  console.warn("[UQA Firebase] Error initializing Firebase:", err);
}
