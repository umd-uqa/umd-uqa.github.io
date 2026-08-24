const { useState, useEffect } = window.React || React;

/**
 * Safe client-side Base64URL JWT Decoder for Google ID Tokens
 */
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("[UQA Auth] Failed to decode Google ID Token JWT:", e);
    return null;
  }
}

/**
 * UMD UQA Unified Authentication Service
 * Bridges Google Identity Services (GIS) with Firebase Auth (v10 Compat),
 * Firestore Whitelist Verification, and resilient offline fallback.
 */
window.UQAAuth = {
  _listeners: [],

  // Restore stored session from localStorage on startup
  _state: (function getInitialState() {
    try {
      const stored = localStorage.getItem('uqa_google_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          user: parsed,
          isAdmin: Boolean(parsed.isAdmin),
          isLoading: false,
          error: null
        };
      }
    } catch (e) {
      console.warn("[UQA Auth] Could not parse stored session:", e);
    }
    return {
      user: null,
      isAdmin: false,
      isLoading: false,
      error: null
    };
  })(),

  getState() {
    return this._state;
  },

  subscribe(callback) {
    this._listeners.push(callback);
    callback(this._state);
    return () => {
      this._listeners = this._listeners.filter(cb => cb !== callback);
    };
  },

  _emit(newState) {
    this._state = { ...this._state, ...newState };
    this._listeners.forEach(cb => cb(this._state));
  },

  /**
   * Verify if email is in the Firestore admin_emails whitelist
   */
  async checkAdminStatus(email) {
    if (!email) return false;
    const cleanEmail = email.toLowerCase().trim();

    // Check Firestore if configured and online
    if (window.isFirebaseConfigured && window.isFirebaseConfigured() && window.uqaDb) {
      try {
        const doc = await window.uqaDb.collection('admin_emails').doc(cleanEmail).get();
        if (doc.exists && doc.data()?.role === 'admin') {
          return true;
        }
      } catch (err) {
        console.warn("[UQA Auth] Firestore whitelist query error (unauthenticated or offline):", err);
      }
    }

    // Default fallback admin check for local/offline testing
    const localAdmins = [
      'itskrithikmohan@gmail.com',
      'krithikm@terpmail.umd.edu',
      'umd.uqa@gmail.com'
    ];
    if (localAdmins.includes(cleanEmail)) {
      return true;
    }

    return false;
  },

  /**
   * Handle Google Credential Response from GIS SDK
   * Bridges GIS ID Token into Firebase Auth
   */
  async _handleCredentialResponse(response) {
    if (!response || !response.credential) {
      this._emit({ error: "No credential received from Google Sign-In.", isLoading: false });
      return;
    }

    this._emit({ isLoading: true, error: null });

    try {
      let userObj = null;
      let isAdmin = false;

      // 1. If Firebase Auth is configured, exchange GIS ID Token with Firebase
      if (window.isFirebaseConfigured && window.isFirebaseConfigured() && window.uqaAuth && window.firebase?.auth?.GoogleAuthProvider) {
        try {
          const credential = window.firebase.auth.GoogleAuthProvider.credential(response.credential);
          const userCredential = await window.uqaAuth.signInWithCredential(credential);
          const fbUser = userCredential.user;

          userObj = {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || fbUser.email.split('@')[0],
            photoURL: fbUser.photoURL || "https://www.gravatar.com/avatar/?d=mp"
          };

          isAdmin = await this.checkAdminStatus(userObj.email);
        } catch (fbErr) {
          console.warn("[UQA Auth] Firebase credential sign-in warning:", fbErr);
          // Fall back to direct JWT decode if Firebase token exchange threw an issue
        }
      }

      // 2. Fallback to direct client-side JWT decode if userObj not created above
      if (!userObj) {
        const payload = parseJwt(response.credential);
        if (!payload || !payload.email) {
          throw new Error("Failed to decode Google profile information from token.");
        }

        userObj = {
          uid: payload.sub,
          email: payload.email,
          displayName: payload.name || payload.email.split('@')[0],
          photoURL: payload.picture || "https://www.gravatar.com/avatar/?d=mp"
        };

        isAdmin = await this.checkAdminStatus(userObj.email);
      }

      const storedPayload = { ...userObj, isAdmin };
      try {
        localStorage.setItem('uqa_google_user', JSON.stringify(storedPayload));
      } catch (e) {
        console.warn("[UQA Auth] Failed to save session to localStorage:", e);
      }

      this._emit({
        user: userObj,
        isAdmin: isAdmin,
        isLoading: false,
        error: null
      });

      console.log(`[UQA Auth] Authenticated user: ${userObj.email} (Admin: ${isAdmin})`);
    } catch (err) {
      console.error("[UQA Auth] Authentication error:", err);
      this._emit({
        error: err.message || "Failed to complete authentication.",
        isLoading: false
      });
    }
  },

  /**
   * Initialize Google Identity Services SDK
   */
  initGIS(retryCount = 0) {
    if (typeof window.google === "undefined" || !window.google.accounts || !window.google.accounts.id) {
      if (retryCount < 25) {
        setTimeout(() => this.initGIS(retryCount + 1), 100);
      } else {
        console.warn("[UQA Auth] Google Identity Services SDK failed to load. Check ad-blockers or network.");
      }
      return;
    }

    if (window.isGoogleAuthConfigured && window.isGoogleAuthConfigured()) {
      try {
        window.google.accounts.id.initialize({
          client_id: window.UQA_GOOGLE_CLIENT_ID,
          callback: this._handleCredentialResponse.bind(this),
          auto_select: false,
          cancel_on_tap_outside: true
        });
        console.log("[UQA Auth] Google Identity Services initialized.");
      } catch (err) {
        console.error("[UQA Auth] Error initializing GIS:", err);
      }
    }
  },

  /**
   * Render Official Google Sign-In Button into DOM element
   */
  renderButton(element, options = {}) {
    if (!element) return;
    if (typeof window.google === "undefined" || !window.google.accounts || !window.google.accounts.id) {
      setTimeout(() => this.renderButton(element, options), 100);
      return;
    }

    if (window.isGoogleAuthConfigured && window.isGoogleAuthConfigured()) {
      try {
        window.google.accounts.id.initialize({
          client_id: window.UQA_GOOGLE_CLIENT_ID,
          callback: this._handleCredentialResponse.bind(this),
          auto_select: false
        });

        window.google.accounts.id.renderButton(element, {
          theme: options.theme || "filled_blue",
          size: options.size || "large",
          text: options.text || "signin_with",
          shape: options.shape || "rectangular",
          logo_alignment: options.logo_alignment || "left",
          width: options.width || "300"
        });
      } catch (err) {
        console.error("[UQA Auth] Error rendering Google button:", err);
      }
    }
  },

  /**
   * Sign Out
   */
  async signOut() {
    this._emit({ isLoading: true });

    // Firebase Auth sign out
    if (window.uqaAuth) {
      try {
        await window.uqaAuth.signOut();
      } catch (e) {
        console.warn("[UQA Auth] Firebase sign out error:", e);
      }
    }

    // GIS auto-select disable
    if (window.google?.accounts?.id?.disableAutoSelect) {
      try {
        window.google.accounts.id.disableAutoSelect();
      } catch (e) {
        console.warn("[UQA Auth] Error disabling GIS auto-select:", e);
      }
    }

    // Clear local storage
    try {
      localStorage.removeItem('uqa_google_user');
    } catch (e) {
      console.warn("[UQA Auth] Error removing local session:", e);
    }

    this._emit({
      user: null,
      isAdmin: false,
      isLoading: false,
      error: null
    });
  }
};

// Initialize GIS on load
if (typeof window !== "undefined") {
  window.UQAAuth.initGIS();

  // Listen to Firebase Auth state changes if Firebase is active
  if (window.isFirebaseConfigured && window.isFirebaseConfigured() && window.uqaAuth) {
    window.uqaAuth.onAuthStateChanged(async (fbUser) => {
      if (fbUser) {
        const isAdmin = await window.UQAAuth.checkAdminStatus(fbUser.email);
        const userObj = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || fbUser.email.split('@')[0],
          photoURL: fbUser.photoURL || "https://www.gravatar.com/avatar/?d=mp"
        };
        try {
          localStorage.setItem('uqa_google_user', JSON.stringify({ ...userObj, isAdmin }));
        } catch (e) {}
        window.UQAAuth._emit({ user: userObj, isAdmin, isLoading: false });
      }
    });
  }
}

/**
 * Custom React Hook for consuming auth state
 */
window.useUQAAuth = function useUQAAuth() {
  const [authState, setAuthState] = useState(window.UQAAuth.getState());

  useEffect(() => {
    return window.UQAAuth.subscribe((state) => {
      setAuthState(state);
    });
  }, []);

  return {
    ...authState,
    signOut: () => window.UQAAuth.signOut(),
    renderButton: (el, opts) => window.UQAAuth.renderButton(el, opts),
    checkAdminStatus: (email) => window.UQAAuth.checkAdminStatus(email)
  };
};
