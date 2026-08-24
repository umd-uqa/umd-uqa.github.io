const { useState, useEffect, useRef } = window.React || React;

/**
 * AUTHENTICATION PORTAL COMPONENT
 * Pure Google Identity Services (GIS) Sign-In & User Profile Card (Zero Firebase).
 */
window.AuthPortal = function AuthPortal({ navigateTo }) {
  const auth = window.useUQAAuth ? window.useUQAAuth() : { user: null, isLoading: false, error: null };
  const [dismissedError, setDismissedError] = useState(false);
  const googleBtnRef = useRef(null);

  const isConfigured = window.isGoogleAuthConfigured ? window.isGoogleAuthConfigured() : false;

  // Mount official Google Sign-In button when unauthenticated and configured
  useEffect(() => {
    if (!auth.user && googleBtnRef.current && isConfigured && auth.renderButton) {
      auth.renderButton(googleBtnRef.current, {
        theme: "filled_blue",
        size: "large",
        text: "signin_with",
        shape: "rectangular",
        width: 300
      });
    }
  }, [auth.user, isConfigured]);

  // ----------------------------------------------------
  // GUEST / UNAUTHENTICATED VIEW
  // ----------------------------------------------------
  if (!auth.user) {
    return (
      <div className="min-h-screen bg-[#0f1128] text-[#f0f0f8] font-sans selection:bg-[#9296c8]/30 animate-fade-in flex items-center justify-center px-6 py-24">
        <div className="max-w-md w-full bg-[#0c0d23] border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl text-center">
          
          {/* Google Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#9296c8]/10 mb-6 border border-[#9296c8]/30">
            <svg className="w-8 h-8" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
          </div>

          <h1 className="font-['Raleway'] text-2xl md:text-3xl font-bold text-white mb-3">
            Sign In with Google
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8">
            Sign in with your Google account (<span className="text-slate-300">@gmail.com</span>, <span className="text-slate-300">@terpmail.umd.edu</span>, <span className="text-slate-300">@umd.edu</span>) to authenticate.
          </p>

          {/* Unconfigured Google Client ID Notice */}
          {!isConfigured && (
            <div className="mb-6 p-4 rounded-xl bg-[#9296c8]/10 border border-[#9296c8]/30 text-[#a8abdb] text-xs text-left leading-relaxed space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-white">
                <svg className="w-4 h-4 text-[#9296c8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Google OAuth Client ID Required
              </div>
              <p className="text-slate-300">
                To enable Google Sign-In, generate a free OAuth Web Client ID in the <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-white underline font-semibold">Google Cloud Console</a> and paste it into <span className="font-mono text-white">google-auth-config.js</span>.
              </p>
            </div>
          )}

          {/* Error Banner */}
          {auth.error && !dismissedError && (
            <div className="mb-6 p-4 rounded-xl bg-red-900/30 border border-red-500/40 text-red-200 text-xs flex items-start justify-between gap-3 text-left">
              <span>{auth.error}</span>
              <button
                onClick={() => setDismissedError(true)}
                className="opacity-70 hover:opacity-100 font-bold ml-2 text-sm leading-none"
              >
                ✕
              </button>
            </div>
          )}

          {/* Official Google Sign-In Button Container */}
          <div className="flex justify-center min-h-[44px]">
            <div ref={googleBtnRef} className="flex justify-center"></div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 text-xs text-slate-500">
            Powered by Google Identity Services (Direct Client OAuth)
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // AUTHENTICATED VIEW: USER PROFILE CARD
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-[#0f1128] text-[#f0f0f8] font-sans selection:bg-[#9296c8]/30 animate-fade-in flex items-center justify-center px-6 py-24">
      <div className="max-w-md w-full bg-[#0c0d23] border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl text-center space-y-6">
        
        {/* User Avatar */}
        <div className="mx-auto w-24 h-24 rounded-full bg-[#9296c8]/20 border-2 border-[#9296c8]/50 flex items-center justify-center overflow-hidden shadow-inner">
          {auth.user.photoURL ? (
            <img
              src={auth.user.photoURL}
              alt={auth.user.displayName || "User Avatar"}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <span className="font-bold text-[#a8abdb] text-3xl">
              {auth.user.displayName?.charAt(0)?.toUpperCase() || auth.user.email?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          )}
        </div>

        {/* User Info */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Google Authenticated
          </div>
          <h2 className="font-['Raleway'] text-2xl font-bold text-white mb-1">
            {auth.user.displayName || "Google User"}
          </h2>
          <p className="text-slate-300 font-mono text-sm break-all">
            {auth.user.email}
          </p>
        </div>

        {/* Metadata Details */}
        <div className="bg-[#0f1128] border border-white/10 rounded-xl p-4 text-left text-xs space-y-2">
          <div className="flex justify-between text-slate-400">
            <span>Provider:</span>
            <span className="font-semibold text-slate-200">Google Identity Services (GIS)</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>User ID (Sub):</span>
            <span className="font-mono text-slate-300 truncate max-w-[180px]">{auth.user.uid}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Session:</span>
            <span className="text-emerald-400 font-semibold">Active Client Session</span>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={() => auth.signOut()}
          className="w-full bg-red-500/15 hover:bg-red-500/25 text-red-300 font-bold py-3.5 px-6 rounded-lg border border-red-500/30 transition-all text-sm shadow-md"
        >
          Sign Out
        </button>

        {/* Navigation Shortcut */}
        {navigateTo && (
          <button
            onClick={() => navigateTo('home')}
            className="text-xs text-[#a8abdb] hover:underline pt-2 block mx-auto"
          >
            ← Return to Home
          </button>
        )}
      </div>
    </div>
  );
};
