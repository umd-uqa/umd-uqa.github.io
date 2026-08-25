/**
 * UMD UQA Supabase Client Configuration
 * 
 * Instructions to connect your 100% Free Supabase Project:
 * 1. Create a free project at https://supabase.com/ (No credit card required).
 * 2. Run `supabase-schema.sql` in the Supabase SQL Editor.
 * 3. Go to Project Settings -> API and copy your Project URL and Anon (public) Key.
 * 4. Paste them into `window.UQA_SUPABASE_CONFIG` below.
 */
window.UQA_SUPABASE_CONFIG = {
  url: "https://dpveemewzxkjwvsnbdqp.supabase.co",
  anonKey: "sb_publishable_6w6wM6F_fIHA5ZmL3J9LaQ_1Q_wi0QQ"
};

/**
 * Check if valid Supabase credentials have been configured
 */
window.isSupabaseConfigured = function() {
  const cfg = window.UQA_SUPABASE_CONFIG;
  return Boolean(
    cfg &&
    typeof cfg.url === "string" &&
    cfg.url.startsWith("https://") &&
    !cfg.url.includes("YOUR_SUPABASE_PROJECT_URL") &&
    typeof cfg.anonKey === "string" &&
    cfg.anonKey.trim() !== "" &&
    !cfg.anonKey.includes("YOUR_SUPABASE_ANON_KEY")
  );
};

// Global Supabase client instance
window.uqaSupabase = null;

try {
  if (typeof window.supabase !== "undefined" && window.isSupabaseConfigured()) {
    window.uqaSupabase = window.supabase.createClient(
      window.UQA_SUPABASE_CONFIG.url,
      window.UQA_SUPABASE_CONFIG.anonKey
    );
    console.log("[UQA Supabase] Initialized Supabase client successfully.");
  } else {
    console.info("[UQA Supabase] Running in local/offline fallback mode (Supabase credentials pending).");
  }
} catch (err) {
  console.warn("[UQA Supabase] Error initializing Supabase client:", err);
}
