/**
 * UMD UQA Google Authentication Configuration
 * 
 * To obtain your free Google OAuth 2.0 Web Client ID:
 * 1. Go to Google Cloud Console: https://console.cloud.google.com/apis/credentials
 * 2. Create OAuth 2.0 Client ID (Application Type: Web application)
 * 3. Add Authorized JavaScript Origins: http://localhost:8000, http://127.0.0.1:8000, https://umd-uqa.github.io
 * 4. Paste your Client ID below.
 */
window.UQA_GOOGLE_CLIENT_ID = "998330975634-611hfe3fmsgokccgr913v7md908cdidv.apps.googleusercontent.com";

/**
 * Check if a valid Google OAuth Client ID has been configured
 */
window.isGoogleAuthConfigured = function() {
  const cid = window.UQA_GOOGLE_CLIENT_ID;
  return Boolean(
    cid &&
    cid !== "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com" &&
    cid.includes(".apps.googleusercontent.com")
  );
};
