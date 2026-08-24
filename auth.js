const { useState, useEffect } = window.React || React;

/**
 * UMD UQA Google Authentication Service
 * Manages Google Sign-In, Firebase session persistence, and user profile state.
 */
window.UQAAuth = {
  _listeners: [],

  _state: {
    user: null,
    isLoading: true,
    error: null
  },

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
   * Format Firebase Auth error codes into user-friendly messages
   */
  _formatErrorMessage(err) {
    if (!err) return "An unknown error occurred during sign-in.";
    const code = err.code || "";
    if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
      return "Sign-in popup was closed before completing authentication.";
    }
    if (code === "auth/popup-blocked") {
      return "Sign-in popup was blocked by your browser. Please enable popups for this site.";
    }
    if (code === "auth/unauthorized-domain") {
      return "Current domain is not authorized in Firebase Console (Authentication > Settings > Authorized domains).";
    }
    if (code === "auth/network-request-failed") {
      return "Network connection failed. Please check your internet connection.";
    }
    if (code === "auth/invalid-api-key") {
      return "Invalid Firebase API key in firebase-config.js.";
    }
    return err.message || "Failed to sign in with Google.";
  },

  /**
   * Sign in using Google OAuth Popup
   */
  async signInWithGoogle() {
    this._emit({ isLoading: true, error: null });

    if (!window.isFirebaseConfigured() || !window.uqaAuth) {
      const errMessage = "Firebase Authentication is not configured. Please update firebase-config.js with your project keys.";
      console.warn("[UQA Auth]", errMessage);
      this._emit({
        isLoading: false,
        error: errMessage
      });
      return null;
    }

    try {
      const provider = new window.firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await window.uqaAuth.signInWithPopup(provider);
      const fbUser = result.user;

      const userObj = {
        uid: fbUser.uid,
        displayName: fbUser.displayName || fbUser.email.split('@')[0],
        email: fbUser.email,
        photoURL: fbUser.photoURL || "https://www.gravatar.com/avatar/?d=mp"
      };

      this._emit({
        user: userObj,
        isLoading: false,
        error: null
      });

      return userObj;
    } catch (err) {
      console.error("[UQA Auth] Google sign-in error:", err);
      const friendlyError = this._formatErrorMessage(err);
      this._emit({
        isLoading: false,
        error: friendlyError
      });
      throw err;
    }
  },

  /**
   * Sign out current user
   */
  async signOut() {
    this._emit({ isLoading: true });

    if (window.isFirebaseConfigured() && window.uqaAuth) {
      try {
        await window.uqaAuth.signOut();
      } catch (err) {
        console.error("[UQA Auth] Sign-out error:", err);
      }
    }

    this._emit({
      user: null,
      isLoading: false,
      error: null
    });
  }
};

// Initialize Firebase Auth session persistence listener on load
if (typeof window !== "undefined") {
  setTimeout(() => {
    if (window.isFirebaseConfigured() && window.uqaAuth) {
      window.uqaAuth.onAuthStateChanged((firebaseUser) => {
        if (firebaseUser) {
          window.UQAAuth._emit({
            user: {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL || "https://www.gravatar.com/avatar/?d=mp"
            },
            isLoading: false,
            error: null
          });
        } else {
          window.UQAAuth._emit({
            user: null,
            isLoading: false,
            error: null
          });
        }
      });
    } else {
      // Unconfigured or guest mode
      window.UQAAuth._emit({
        user: null,
        isLoading: false,
        error: null
      });
    }
  }, 50);
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
    signInWithGoogle: () => window.UQAAuth.signInWithGoogle(),
    signOut: () => window.UQAAuth.signOut()
  };
};
