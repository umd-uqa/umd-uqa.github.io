const { useState, useEffect } = window.React || React;

// Designated primary administrator emails
window.UQA_INITIAL_ADMIN_EMAILS = [
  "krithikm@terpmail.umd.edu"
];

/**
 * UMD UQA Authentication Service
 * Manages Google Sign-In, Firebase Auth sessions, and admin email verification.
 */
window.UQAAuth = {
  _listeners: [],

  _state: {
    user: null,
    isAdmin: false,
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
   * Check if a given email is authorized as administrator
   */
  async checkAdminStatus(email) {
    if (!email) return false;
    const cleanEmail = email.toLowerCase().trim();

    // 1. Check permanent initial admin whitelist
    if (window.UQA_INITIAL_ADMIN_EMAILS.some(e => e.toLowerCase() === cleanEmail)) {
      return true;
    }

    // 2. Check cached admin whitelist in localStorage
    try {
      const cached = JSON.parse(localStorage.getItem('uqa_admin_emails_cache') || '[]');
      if (Array.isArray(cached) && cached.some(item => (typeof item === 'string' ? item : item.email || item.id).toLowerCase() === cleanEmail)) {
        return true;
      }
    } catch (e) {
      console.warn("Error reading admin emails cache:", e);
    }

    // 3. Check Firestore admin_emails collection if configured
    if (window.isFirebaseConfigured() && window.uqaDb) {
      try {
        const emailDoc = await window.uqaDb
          .collection('admin_emails')
          .doc(cleanEmail)
          .get();

        if (emailDoc.exists) {
          const data = emailDoc.data();
          return data.role === 'admin' || data.isAdmin === true || true;
        }
      } catch (err) {
        console.error("[UQA Auth] Error querying Firestore admin status:", err);
      }
    }

    return false;
  },

  /**
   * Sign in using Google OAuth Popup (or mock prompt in demo mode)
   */
  async signInWithGoogle() {
    this._emit({ isLoading: true, error: null });

    if (!window.isFirebaseConfigured() || !window.uqaAuth) {
      // Demo / Mock sign-in when Firebase API keys are not yet configured
      const mockEmail = window.prompt(
        "[Demo Mode] Enter your email to sign in as Administrator:",
        "krithikm@terpmail.umd.edu"
      );
      if (mockEmail) {
        const cleanEmail = mockEmail.trim().toLowerCase();
        const isAdmin = await this.checkAdminStatus(cleanEmail);
        localStorage.setItem('uqa_mock_user_email', cleanEmail);
        const mockUser = {
          displayName: cleanEmail.split('@')[0] + (isAdmin ? " (Admin)" : ""),
          email: cleanEmail,
          photoURL: "https://www.gravatar.com/avatar/?d=mp"
        };
        this._emit({
          user: mockUser,
          isAdmin,
          isLoading: false,
          error: null
        });
        return mockUser;
      }
      this._emit({ isLoading: false });
      return null;
    }

    try {
      const provider = new window.firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await window.uqaAuth.signInWithPopup(provider);
      const user = result.user;
      const isAdmin = await this.checkAdminStatus(user.email);

      this._emit({
        user: {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid
        },
        isAdmin,
        isLoading: false,
        error: null
      });
      return user;
    } catch (err) {
      console.error("[UQA Auth] Sign-in error:", err);
      this._emit({
        isLoading: false,
        error: err.message || "Failed to sign in with Google."
      });
      throw err;
    }
  },

  /**
   * Sign out current user
   */
  async signOut() {
    this._emit({ isLoading: true });
    localStorage.removeItem('uqa_mock_user_email');

    if (window.isFirebaseConfigured() && window.uqaAuth) {
      try {
        await window.uqaAuth.signOut();
      } catch (err) {
        console.error("[UQA Auth] Sign-out error:", err);
      }
    }

    this._emit({
      user: null,
      isAdmin: false,
      isLoading: false,
      error: null
    });
  }
};

// Initialize Firebase Auth listener on load
if (typeof window !== "undefined") {
  setTimeout(async () => {
    if (window.isFirebaseConfigured() && window.uqaAuth) {
      window.uqaAuth.onAuthStateChanged(async (firebaseUser) => {
        if (firebaseUser) {
          const isAdmin = await window.UQAAuth.checkAdminStatus(firebaseUser.email);
          window.UQAAuth._emit({
            user: {
              displayName: firebaseUser.displayName,
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL,
              uid: firebaseUser.uid
            },
            isAdmin,
            isLoading: false,
            error: null
          });
        } else {
          window.UQAAuth._emit({
            user: null,
            isAdmin: false,
            isLoading: false,
            error: null
          });
        }
      });
    } else {
      // Check stored user in localStorage
      const mockEmail = localStorage.getItem('uqa_mock_user_email') || "krithikm@terpmail.umd.edu";
      if (mockEmail) {
        const isAdmin = await window.UQAAuth.checkAdminStatus(mockEmail);
        window.UQAAuth._emit({
          user: {
            displayName: mockEmail.split('@')[0] + (isAdmin ? " (Admin)" : ""),
            email: mockEmail,
            photoURL: "https://www.gravatar.com/avatar/?d=mp"
          },
          isAdmin,
          isLoading: false
        });
      } else {
        window.UQAAuth._emit({
          user: null,
          isAdmin: false,
          isLoading: false
        });
      }
    }
  }, 100);
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
