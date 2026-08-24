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
 * UMD UQA Pure Google Identity Services (GIS) Auth Service
 * Direct browser-to-Google authentication with ZERO Firebase.
 */
window.UQAAuth = {
  _listeners: [],

  // Restore stored session from localStorage on startup
  _state: (function getInitialState() {
    try {
      const stored = localStorage.getItem('uqa_google_user');
      if (stored) {
        return {
          user: JSON.parse(stored),
          isLoading: false,
          error: null
        };
      }
    } catch (e) {
      console.warn("[UQA Auth] Could not parse stored session:", e);
    }
    return {
      user: null,
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
   * Handle Google Credential Response from GIS SDK
   */
  _handleCredentialResponse(response) {
    if (!response || !response.credential) {
      this._emit({ error: "No credential received from Google Sign-In.", isLoading: false });
      return;
    }

    const payload = parseJwt(response.credential);
    if (!payload || !payload.email) {
      this._emit({ error: "Failed to decode Google profile information.", isLoading: false });
      return;
    }

    const userObj = {
      uid: payload.sub,
      email: payload.email,
      displayName: payload.name || payload.email.split('@')[0],
      photoURL: payload.picture || "https://www.gravatar.com/avatar/?d=mp"
    };

    try {
      localStorage.setItem('uqa_google_user', JSON.stringify(userObj));
    } catch (e) {
      console.warn("[UQA Auth] Failed to save session to localStorage:", e);
    }

    this._emit({
      user: userObj,
      isLoading: false,
      error: null
    });
  },

  /**
   * Initialize Google Identity Services SDK
   */
  initGIS(retryCount = 0) {
    if (typeof window.google === "undefined" || !window.google.accounts || !window.google.accounts.id) {
      if (retryCount < 20) {
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
        console.log("[UQA Auth] Google Identity Services initialized successfully.");
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
        // Ensure initialized
        window.google.accounts.id.initialize({
          client_id: window.UQA_GOOGLE_CLIENT_ID,
          callback: this._handleCredentialResponse.bind(this),
          auto_select: false
        });

        window.google.accounts.id.renderButton(element, {
          theme: options.theme || "outline",
          size: options.size || "large",
          text: options.text || "signin_with",
          shape: options.shape || "rectangular",
          logo_alignment: options.logo_alignment || "left",
          width: options.width || "320"
        });
      } catch (err) {
        console.error("[UQA Auth] Error rendering Google button:", err);
      }
    }
  },

  /**
   * Sign Out
   */
  signOut() {
    try {
      localStorage.removeItem('uqa_google_user');
    } catch (e) {
      console.warn("[UQA Auth] Error removing session:", e);
    }

    if (window.google?.accounts?.id?.disableAutoSelect) {
      try {
        window.google.accounts.id.disableAutoSelect();
      } catch (e) {
        console.warn("[UQA Auth] Error disabling auto-select:", e);
      }
    }

    this._emit({
      user: null,
      isLoading: false,
      error: null
    });
  }
};

// Initialize GIS on load
if (typeof window !== "undefined") {
  window.UQAAuth.initGIS();
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
    renderButton: (el, opts) => window.UQAAuth.renderButton(el, opts)
  };
};
