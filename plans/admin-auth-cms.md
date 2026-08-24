# Plan: Admin Authentication & Content Management System (CMS)

## Scope & Objective
Bridge existing Google Identity Services (GIS `gsi/client`) with Firebase Authentication (v10 Compat), Firestore database, and Cloud Storage to provide a complete zero-build Content Management System (CMS) for the UMD UQA static React website. 

Allow designated administrators (verified against a Firestore `admin_emails` whitelist) to manage featured videos on the Resources page, fully manage events and posters (create events, edit details, upload/replace/delete poster images, and remove events) on the Events page with inline controls and a dedicated `#admin` dashboard. Maintain zero-build GitHub Pages architecture with CDN-loaded scripts, responsive Tailwind UI, and resilient offline fallback data.

### In Scope
1. **GIS to Firebase Auth Bridge**: Bridge Google Identity Services ID token (`response.credential`) into Firebase Auth via `firebase.auth.GoogleAuthProvider.credential(idToken)` and `signInWithCredential()`, enabling seamless sign-in through official Google button while issuing Firebase auth tokens for Firestore and Cloud Storage.
2. **Zero-Build Firebase Integration**: Load Firebase v10 Compat SDK (App, Auth, Firestore, Storage) via CDN in `index.html` alongside existing GIS SDK.
3. **Admin Whitelist & Session Management**: Validate authenticated user email against Firestore `admin_emails` collection; expose reactive auth state (`user`, `isAdmin`, `isLoading`, `error`) via custom React hook `useUQAAuth`.
4. **Security Rules Spec**: Granular Firestore and Cloud Storage security rules enforcing server-side authorization on `request.auth.token.email`.
5. **Data Schema & Initial Seeding**: Structured schemas for `admin_emails`, `videos`, and `events`, with on-demand migration script (`seed-data.js`) and automated fallback to existing hardcoded data.
6. **Full Event Lifecycle Management (CRUD)**: Complete controls allowing admins to create new events, update any event metadata (date, title, subtitle, description, bullet highlights, registration links), upload/replace/remove poster flyer images in Cloud Storage, and delete events with automatic storage cleanup.
7. **Admin Dashboard (`#admin`)**: Dedicated route for centralized management of admin emails, videos, and full event/poster CRUD with live preview tables and seeding tools.
8. **Dynamic Resources CMS**: Inline "+ Add Video", edit, and delete actions on `Resources.js` for authenticated admins with fallback to hardcoded video list.
9. **Dynamic Events CMS & Poster Lightbox**: Poster image upload to Cloud Storage, click-to-enlarge lightbox modal, inline event/poster CRUD (Add / Edit / Delete buttons on event cards), and "Event Posters & Flyers" gallery on `Events.js`.
10. **Discreet Navbar & AuthPortal Alignment**: Update `AuthPortal.js`, `Navbar.js`, and footer to display Google auth profile, admin status badge, and direct shortcut to `#admin`.
11. **Git Worktree Isolation**: Full task execution inside isolated worktree branch with clean teardown.

### Out of Scope
- Server-side Node.js/SSR backend or custom server infrastructure.
- Build tooling (Vite, Webpack, npm bundles) — site remains pure static HTML/Babel/CDN.
- Modifying static content on `About.js`, `Home.js`, `Contact.js`, or `Calendar.js`.
- Paid third-party CMS platforms (Sanity, Contentful, Strapi).

---

## Architecture & Data Specifications

### 1. GIS ↔ Firebase Auth Bridge Flow

```
+-----------------------------------------------------------------------------------+
| Browser / User Action                                                             |
| 1. User clicks Official Google Sign-In Button rendered by GIS (gsi/client)        |
| 2. Google returns JWT ID Token (response.credential)                             |
+------------------------------------------+----------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
| auth.js (GIS to Firebase Auth Bridge)                                             |
| 3. const cred = firebase.auth.GoogleAuthProvider.credential(response.credential)  |
| 4. await window.uqaAuth.signInWithCredential(cred)                                |
| 5. Firebase Auth issues authenticated session for Firestore & Cloud Storage      |
+------------------------------------------+----------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
| Authorization & Whitelist Verification                                            |
| 6. Query Firestore: /admin_emails/{user.email.toLowerCase()}                      |
| 7. If doc exists and role === 'admin' -> isAdmin = true                           |
| 8. Emit state { user, isAdmin: true, isLoading: false } to React components       |
+-----------------------------------------------------------------------------------+
```

---

### 2. Data Schemas

#### Collection: `admin_emails`
- Document ID: Lowercase email address (e.g. `president@umduqa.org` or `lead@umd.edu`)
```json
{
  "email": "lead@umd.edu",
  "role": "admin",
  "addedBy": "founder@umd.edu",
  "createdAt": "2026-08-20T18:00:00Z"
}
```

#### Collection: `videos`
- Document ID: Auto-generated or YouTube ID
```json
{
  "id": "agOdzgWTr-Y",
  "title": "QuEra Workshop 1",
  "category": "Featured Videos",
  "order": 1,
  "createdAt": "2026-08-20T18:00:00Z",
  "updatedAt": "2026-08-20T18:00:00Z"
}
```

#### Collection: `events`
- Document ID: Auto-generated string
```json
{
  "title": "Quantum Leap Career Nexus",
  "subtitle": "QLCN 2026 · University of Maryland",
  "month": "Sept",
  "day": "15",
  "year": "2026",
  "description": "A career fair and professional development event bringing together quantum computing students, researchers, and industry professionals...",
  "highlights": [
    "Networking with quantum industry professionals and recruiters",
    "Workshops focused on internship and job placement",
    "Career development and mentorship opportunities for undergraduates"
  ],
  "links": [
    { "label": "Register via Handshake", "url": "https://go.umd.edu/QLCNregister", "primary": true },
    { "label": "Register without Handshake", "url": "https://go.umd.edu/attendQLCN", "primary": false }
  ],
  "posterUrl": "https://firebasestorage.googleapis.com/v0/b/.../posters/qlcn_2026.png",
  "posterPath": "posters/1724457600000_qlcn.png",
  "posterAlt": "QLCN 2026 Official Event Poster",
  "isAnnual": true,
  "order": 1,
  "createdAt": "2026-08-20T18:00:00Z",
  "updatedAt": "2026-08-20T18:00:00Z"
}
```

---

### 3. Firebase Security Rules

#### Firestore Rules (`firestore.rules`)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if authenticated user email is in admin whitelist
    function isAdmin() {
      return request.auth != null &&
        request.auth.token.email != null &&
        exists(/databases/$(database)/documents/admin_emails/$(request.auth.token.email.lower()));
    }

    // Admin whitelist collection: authenticated users can read; only admins can write
    match /admin_emails/{email} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }

    // Videos CMS: Public read, admin-only write
    match /videos/{videoId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }

    // Events CMS: Public read, admin-only write
    match /events/{eventId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
  }
}
```

#### Cloud Storage Rules (`storage.rules`)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isAdmin() {
      return request.auth != null &&
        request.auth.token.email != null &&
        firestore.exists(/databases/(default)/documents/admin_emails/$(request.auth.token.email.lower()));
    }

    match /posters/{fileName} {
      allow read: if true;
      allow write: if isAdmin()
        && request.resource.size < 5 * 1024 * 1024
        && request.resource.contentType.matches('image/(png|jpeg|jpg|webp|gif)');
      allow delete: if isAdmin();
    }
  }
}
```

---

## Tasks

### T0: Create isolated git worktree
- **Deps**: None
- **Est. Time**: 2 min
- **Files**: None
- **Action**:
  - Caveman: Run `git worktree add ../worktree-admin-auth-cms -b feature/admin-auth-cms`. Navigate to worktree directory.
  - Setup clean branch for implementation without dirtying main tree.
- **Acceptance Criteria**:
  - `git worktree list` shows `../worktree-admin-auth-cms` active on `feature/admin-auth-cms`.
- **Tests**:
  - *Happy*: Worktree folder created and on correct branch.
  - *Edge*: Worktree folder exists from prior aborted run -> handles cleanup or reuse.
  - *Error*: Git error handled if branch already exists.

---

### T1: Firebase SDK script integration in `index.html`
- **Deps**: T0
- **Est. Time**: 10 min
- **Files**:
  - `index.html`
- **Action**:
  - Caveman: Add Firebase v10 Compat CDN scripts to `index.html` alongside Google Identity Services SDK. Order scripts: Firebase SDKs -> `firebase-config.js` -> `google-auth-config.js` -> `auth.js` -> components -> `Admin.js` -> `App.js`.
  - Add Firebase CDN tags:
    ```html
    <!-- Firebase v10 Compat SDKs -->
    <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-storage-compat.js"></script>
    ```
  - Include `firebase-config.js`, `Admin.js`, and `seed-data.js` Babel script tags.
- **Acceptance Criteria**:
  - `window.firebase` object is defined on window before application scripts run.
  - No 404 or script order race condition errors in browser console.
- **Tests**:
  - *Happy*: Browser loads page; `typeof window.firebase === 'object'` and `typeof window.google === 'object'`.
  - *Edge*: Slow 3G network simulation loads scripts without missing dependency errors.
  - *Error*: CDN script loading failure logged with descriptive console warning.

---

### T2: Firebase initialization & config module (`firebase-config.js`)
- **Deps**: T1
- **Est. Time**: 15 min
- **Files**:
  - `firebase-config.js`
- **Action**:
  - Caveman: Create `firebase-config.js`. Setup `window.UQA_FIREBASE_CONFIG` object with Firebase project credentials. Initialize `window.uqaApp`, `window.uqaAuth`, `window.uqaDb`, `window.uqaStorage`. Add `window.isFirebaseConfigured()` validation helper.
  - Structure config object:
    ```javascript
    window.UQA_FIREBASE_CONFIG = {
      apiKey: "YOUR_FIREBASE_API_KEY",
      authDomain: "umd-uqa-web.firebaseapp.com",
      projectId: "umd-uqa-web",
      storageBucket: "umd-uqa-web.appspot.com",
      messagingSenderId: "998330975634",
      appId: "1:998330975634:web:..."
    };
    ```
  - Safe initialization check:
    ```javascript
    window.isFirebaseConfigured = function() {
      const cfg = window.UQA_FIREBASE_CONFIG;
      return Boolean(cfg && cfg.apiKey && !cfg.apiKey.includes("YOUR_FIREBASE_API_KEY"));
    };

    if (window.firebase && window.isFirebaseConfigured()) {
      if (!window.firebase.apps.length) {
        window.uqaApp = window.firebase.initializeApp(window.UQA_FIREBASE_CONFIG);
      }
      window.uqaAuth = window.firebase.auth();
      window.uqaDb = window.firebase.firestore();
      window.uqaStorage = window.firebase.storage();
    }
    ```
- **Acceptance Criteria**:
  - `window.uqaAuth`, `window.uqaDb`, and `window.uqaStorage` initialized when config is present.
  - Unconfigured dummy keys do not crash page; `isFirebaseConfigured()` returns false cleanly.
- **Tests**:
  - *Happy*: Valid config initializes Firebase services without exception.
  - *Edge*: Default placeholder config gracefully bypassed without crashing app.
  - *Error*: Malformed config caught in try/catch block with fallback console alert.

---

### T3: GIS ↔ Firebase Auth Bridge & Whitelist Service in `auth.js`
- **Deps**: T2
- **Est. Time**: 25 min
- **Files**:
  - `auth.js`
- **Action**:
  - Caveman: Upgrade `auth.js`. In `_handleCredentialResponse(response)`, take Google ID Token `response.credential` and exchange via `firebase.auth.GoogleAuthProvider.credential(idToken)` and `window.uqaAuth.signInWithCredential()`. Check Firestore `admin_emails/{email.toLowerCase()}` for admin role. Update `useUQAAuth()` hook with `isAdmin`, `user`, `signOut()`, `renderButton()`.
  - Auth Flow Implementation:
    ```javascript
    async _handleCredentialResponse(response) {
      if (!response?.credential) {
        this._emit({ error: "No credential received from Google Sign-In.", isLoading: false });
        return;
      }
      this._emit({ isLoading: true, error: null });
      try {
        let firebaseUser = null;
        let isAdmin = false;

        // Bridge GIS ID Token with Firebase Auth if Firebase is configured
        if (window.isFirebaseConfigured && window.isFirebaseConfigured() && window.uqaAuth) {
          const credential = window.firebase.auth.GoogleAuthProvider.credential(response.credential);
          const userCredential = await window.uqaAuth.signInWithCredential(credential);
          firebaseUser = userCredential.user;

          // Check admin whitelist in Firestore
          isAdmin = await this.checkAdminStatus(firebaseUser.email);
        } else {
          // Fallback to local JWT decode if Firebase not yet wired
          const payload = parseJwt(response.credential);
          firebaseUser = {
            uid: payload.sub,
            email: payload.email,
            displayName: payload.name || payload.email.split('@')[0],
            photoURL: payload.picture
          };
        }

        const userState = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          photoURL: firebaseUser.photoURL || "https://www.gravatar.com/avatar/?d=mp"
        };

        localStorage.setItem('uqa_google_user', JSON.stringify(userState));
        this._emit({ user: userState, isAdmin, isLoading: false, error: null });
      } catch (err) {
        console.error("[UQA Auth] Error bridging GIS credential to Firebase:", err);
        this._emit({ error: err.message || "Failed to sign in with Firebase Auth.", isLoading: false });
      }
    }
    ```
  - Implement `checkAdminStatus(email)`:
    ```javascript
    async checkAdminStatus(email) {
      if (!email || !window.uqaDb) return false;
      try {
        const doc = await window.uqaDb.collection('admin_emails').doc(email.toLowerCase().trim()).get();
        return doc.exists && doc.data()?.role === 'admin';
      } catch (err) {
        console.warn("[UQA Auth] Whitelist check failed (likely unauthenticated or offline):", err);
        return false;
      }
    }
    ```
  - Implement `signOut()`: Signs out from `window.uqaAuth`, calls `google.accounts.id.disableAutoSelect()`, clears `localStorage`, emits `{ user: null, isAdmin: false }`.
  - Listen to `window.uqaAuth.onAuthStateChanged` to restore and sync session on reload.
- **Acceptance Criteria**:
  - GIS button click signs user into Firebase Auth without separate popups.
  - Whitelist check queries Firestore and accurately sets `isAdmin: true` for approved emails.
  - Non-whitelisted Google users remain authenticated (`user != null`) but `isAdmin === false`.
  - Sign out purges both Firebase session and local storage.
- **Tests**:
  - *Happy*: Admin email signs in via GIS -> Firebase Auth session established -> `isAdmin: true`.
  - *Edge*: Non-whitelisted Google user signs in -> `user` populated, `isAdmin: false`, access banner displayed.
  - *Error*: Network drop during Firebase token exchange displays friendly retry error.

---

### T4: Firestore & Cloud Storage security rules and seed script
- **Deps**: T2, T3
- **Est. Time**: 15 min
- **Files**:
  - `firestore.rules`
  - `storage.rules`
  - `seed-data.js`
- **Action**:
  - Caveman: Create `firestore.rules`, `storage.rules`, and `seed-data.js`. Enforce read-all and admin-only write on Firestore collections and Cloud Storage poster bucket. Write one-click seed migration script.
  - Add `firestore.rules` checking `exists(/databases/$(database)/documents/admin_emails/$(request.auth.token.email.lower()))`.
  - Add `storage.rules` checking 5MB limit, image mime type, and admin authorization.
  - In `seed-data.js`, create `window.seedInitialData(db)` to populate initial 3 YouTube videos and 1 QLCN event into Firestore if collections are empty.
- **Acceptance Criteria**:
  - Security rules syntax matches Firebase v2 rules standard.
  - `seedInitialData` safely populates missing collections without duplicating existing records.
- **Tests**:
  - *Happy*: Seed function runs on empty Firestore instance and seeds initial records.
  - *Edge*: Seed function called when records exist does not overwrite or duplicate.
  - *Error*: Unauthorized caller attempting write gets Firebase `permission-denied` error.

---

### T5: Dedicated Admin Dashboard Component (`Admin.js`) & Route (`App.js`)
- **Deps**: T3, T4
- **Est. Time**: 30 min
- **Files**:
  - `Admin.js`
  - `App.js`
- **Action**:
  - Caveman: Create `Admin.js` for `#admin` route. Show login card for guests, access restricted alert for non-admins, full CMS for verified admins. Wire `#admin` in `App.js`.
  - In `App.js`, render `window.Admin` when `currentPage === 'admin'`.
  - Implement Admin Dashboard sections in `Admin.js`:
    1. **Header & Auth Status**: Profile avatar, email, active session badge, "Sign Out" button, and "+ Return to Site" button.
    2. **Admin Whitelist Manager**:
       - Live table of documents from `admin_emails` (email, role, addedBy, createdAt).
       - "Add Admin" modal/input form (email, role).
       - "Remove Admin" button with safeguard preventing current logged-in admin from deleting themselves.
    3. **Featured Video Manager**:
       - Table of videos from `videos` collection (Title, YouTube ID, Order).
       - "Add Video" form modal (Title, YouTube URL/ID parser, Order).
       - Inline Edit and Delete buttons with confirmation prompt.
    4. **Events & Posters Lifecycle Manager**:
       - Table / Grid of events from `events` collection with Poster thumbnail preview.
       - **Add Event Workflow**: Modal form with fields: `title`, `subtitle`, `month`, `day`, `year`, `description`, dynamic highlights array editor, dynamic links array editor, `isAnnual` checkbox, and Poster file upload picker.
       - **Poster Upload Engine**: Uploads selected image file to Cloud Storage `/posters/${Date.now()}_${file.name}`, tracks upload progress, saves `posterUrl` and `posterPath` on event doc.
       - **Edit Event Workflow**: Pre-populates all event fields; allows updating text, highlights, links; allows replacing poster image with new file, or removing poster without deleting event.
       - **Delete Event Workflow**: Triggers confirmation dialog; on confirm, deletes Firestore document and deletes poster from Cloud Storage via `posterPath` if present.
    5. **Database Seed Utility**: "Seed Initial Hardcoded Data" button for first-time setup.
- **Acceptance Criteria**:
  - Navigating to `#admin` renders Admin dashboard.
  - Unauthenticated visitors see Google Sign-In prompt.
  - Non-admin Google users see "Access Restricted: Whitelist Required" message.
  - Verified admins can perform complete CRUD for events, posters, videos, and whitelist entries.
- **Tests**:
  - *Happy (Event CRUD)*: Admin creates event with poster -> edits title/date -> deletes event (storage poster deleted) -> all states clean.
  - *Happy (Whitelist)*: Admin adds new email `officer@umd.edu` -> document created in `admin_emails`.
  - *Edge*: Admin tries to delete their own email -> UI disables action with warning banner.
  - *Error*: File upload of 10MB PDF triggers client-side validation error before network call.

---

### T6: Dynamic Resources CMS with Inline Admin Controls (`Resources.js`)
- **Deps**: T3, T5
- **Est. Time**: 25 min
- **Files**:
  - `Resources.js`
- **Action**:
  - Caveman: Update `Resources.js` to load videos from Firestore `videos` collection with hardcoded fallback. If `isAdmin === true`, show inline "+ Add Video", "Edit", and "Delete" buttons on video tabs.
  - Subscribe to Firestore `videos` collection ordered by `order` ascending using `onSnapshot` (or `getDocs`).
  - Fallback: If Firestore is empty, unconfigured, or offline, fallback to built-in `videoResources` array.
  - Add inline Admin Controls for verified admins:
    - "+ Add Video" button in "Featured Videos" section header.
    - "Edit" (pencil) and "Delete" (trash) buttons directly on active tab.
    - Quick Modal for creating/updating video (Title, YouTube URL parser to extract ID from `youtu.be/ID` or `youtube.com/watch?v=ID`).
- **Acceptance Criteria**:
  - Public visitors see video player and tabs smoothly loaded from Firestore (or fallback).
  - Admin sees inline edit/add buttons; changes in Firestore immediately update video player and tab list.
  - Fallback data displays without error if Firestore is unconfigured or offline.
- **Tests**:
  - *Happy*: Admin clicks "+ Add Video", pastes YouTube URL -> new video tab created and plays.
  - *Edge*: Deleting currently active video tab resets active index to 0 without out-of-bounds crash.
  - *Error*: Firestore offline error caught and falls back to hardcoded videos with subtle offline badge.

---

### T7: Dynamic Events CMS, Poster Lightbox & Inline Event CRUD (`Events.js`)
- **Deps**: T3, T5
- **Est. Time**: 30 min
- **Files**:
  - `Events.js`
- **Action**:
  - Caveman: Update `Events.js` to fetch events from Firestore `events` collection with hardcoded fallback. Implement Poster Lightbox modal. Add Poster Gallery section. Add inline "+ Add Event", "Edit Event", and "Delete Event" controls for verified admins.
  - Implement **Poster Lightbox Modal**:
    - State `selectedPoster` (`url`, `alt`, `title`).
    - Fullscreen overlay with dark backdrop blur, high-res poster view, download button, and close triggers (`Esc` key, backdrop click, close `✕` button).
  - Implement **Event Poster & Flyer Display**:
    - If event has `posterUrl`, render poster thumbnail on event card with "Click to Enlarge" badge opening Lightbox.
  - Implement **Inline Event Management Controls** (rendered only when `isAdmin === true`):
    - "+ Add New Event" button in "Upcoming Events" header.
    - "Edit" and "Delete" buttons on each event card.
    - Modal for adding/editing event details, bullet highlights, action links, and poster image upload.
    - Delete confirmation modal that deletes Firestore doc and purges poster file from Cloud Storage.
  - Fallback: If Firestore is empty or offline, fallback to hardcoded `annualEvents` array.
- **Acceptance Criteria**:
  - Public visitors view events with poster thumbnails and interactive Lightbox modal.
  - Admins can add, edit, and delete events directly on `Events.js` or via `#admin`.
  - Deleting an event with a poster removes the file from Cloud Storage.
  - Offline fallback preserves full public event listing.
- **Tests**:
  - *Happy (Lightbox)*: Clicking event poster opens high-resolution modal; pressing `Esc` closes it.
  - *Happy (Inline CRUD)*: Admin adds new event with poster -> card renders -> admin edits date -> card updates -> admin deletes event -> event and poster deleted.
  - *Edge (No Poster)*: Event without poster renders clean card layout without broken image container.
  - *Error*: Invalid image file type rejected before Cloud Storage upload.

---

### T8: Navbar & AuthPortal UI Alignment (`Navbar.js`, `AuthPortal.js`, `App.js`)
- **Deps**: T3, T5
- **Est. Time**: 15 min
- **Files**:
  - `Navbar.js`
  - `AuthPortal.js`
  - `App.js`
- **Action**:
  - Caveman: Update `Navbar.js`, `AuthPortal.js`, and `App.js`. In Navbar, show admin badge and link to `#admin` when `isAdmin === true`. In `AuthPortal.js`, display admin role badge and "Go to Admin Dashboard" shortcut. In `App.js` footer, add subtle `#admin` link.
  - In `Navbar.js`:
    - Display user avatar, name, and if `isAdmin`, a golden shield / "Admin" badge linking to `#admin`.
  - In `AuthPortal.js`:
    - Show Google profile card. If `isAdmin`, display "Admin Authorized" badge with prominent button "Open Admin Dashboard (#admin)". If not admin, show "Standard Member (Read Only)" notice.
  - In `App.js` footer:
    - Add "Admin CMS" link next to "Sign In Portal" in footer copyright row.
- **Acceptance Criteria**:
  - Navbar indicates both Google authentication status and admin authorization.
  - `AuthPortal.js` provides clear routing to `#admin` for verified admins.
  - UI remains responsive and uncluttered on mobile and desktop viewports.
- **Tests**:
  - *Happy*: Admin user sees admin badge in Navbar; clicking takes them to `#admin`.
  - *Edge*: Non-admin user sees profile in `AuthPortal.js` without admin dashboard access link.
  - *Error*: Expired auth session gracefully reverts Navbar trigger back to "Sign In" state.

---

### T9: End-to-End Verification, Security Validation & Offline Fallback Testing
- **Deps**: T6, T7, T8
- **Est. Time**: 20 min
- **Files**:
  - `index.html`
  - `App.js`
  - `Navbar.js`
  - `Resources.js`
  - `Events.js`
  - `Admin.js`
  - `AuthPortal.js`
- **Action**:
  - Caveman: Launch local server. Test full admin workflow: guest view -> GIS sign-in -> Firebase Auth token issuance -> whitelist check -> add video -> add event with poster -> open Lightbox -> inline edit -> delete -> verify Storage purge -> sign out -> simulate offline fallback.
  - Step 1: Guest view check (no admin controls visible, posters enlarge in Lightbox, fallback data renders).
  - Step 2: Google Sign-in with non-admin email -> verify read-only access and whitelist restriction alert.
  - Step 3: Google Sign-in with admin email -> verify `#admin`, Resources, and Events unlock CMS controls.
  - Step 4: Video CRUD verification in Resources and `#admin`.
  - Step 5: Event CRUD and poster upload/delete verification in Events and `#admin`.
  - Step 6: Offline simulation (DevTools Offline) -> verify zero crashes, fallback data rendered.
  - Step 7: Console check for zero React key warnings or unhandled exceptions.
- **Acceptance Criteria**:
  - All happy path, edge case, and error handling tests pass.
  - Zero console errors or layout glitches across all device breakpoints.
- **Tests**:
  - *Happy*: End-to-end CRUD for videos, events, posters, and admins operates without errors.
  - *Edge*: Fast page switching during data operations causes no memory leaks or unmounted state errors.
  - *Error*: Disconnecting internet triggers offline fallback banner while keeping content accessible.

---

### T10: Commit changes, documentation & worktree cleanup
- **Deps**: T9
- **Est. Time**: 10 min
- **Files**:
  - `README.md`
  - All modified codebase files
- **Action**:
  - Caveman: Update `README.md` with Firebase configuration instructions, security rules deployment, and GIS setup guide. Commit all changes in worktree. Switch back to main root and remove worktree.
  - Stage and commit:
    ```bash
    git add .
    git commit -m "feat(cms): bridge google identity services with firebase auth, firestore cms, and storage poster management"
    ```
  - Cleanup worktree:
    ```bash
    cd /home/bobjoe/IdeaProjects/umd-uqa.github.io
    git worktree remove ../worktree-admin-auth-cms
    ```
- **Acceptance Criteria**:
  - Commit cleanly created on `feature/admin-auth-cms`.
  - Worktree directory removed; main repository clean.
  - `README.md` updated with comprehensive setup steps.
- **Tests**:
  - *Happy*: `git worktree list` confirms worktree cleanup; feature branch ready for merge/PR.

---

## Step-by-Step Firebase Project Configuration Guide

To activate the backend for this plan:
1. **Create Firebase Project**: Go to [Firebase Console](https://console.firebase.google.com/) and create project `umd-uqa-web` (or link existing Google Cloud project `998330975634`).
2. **Enable Google Authentication Provider**:
   - Navigate to **Authentication** > **Sign-in method**.
   - Enable **Google** provider, set project support email, and ensure Web Client ID matches `google-auth-config.js`.
3. **Create Firestore Database**:
   - Navigate to **Firestore Database** > **Create database** (Production mode).
   - In Firestore **Rules** tab, paste the contents of `firestore.rules` and click **Publish**.
4. **Create Cloud Storage Bucket**:
   - Navigate to **Storage** > **Get started**.
   - In Storage **Rules** tab, paste the contents of `storage.rules` and click **Publish**.
5. **Add Initial Admin Whitelist**:
   - In Firestore, create collection `admin_emails`.
   - Create document with ID = your Google email (e.g. `yourname@umd.edu`) with fields:
     ```json
     {
       "email": "yourname@umd.edu",
       "role": "admin",
       "addedBy": "system_bootstrap",
       "createdAt": "2026-08-24T00:00:00Z"
     }
     ```
6. **Register Web App & Copy Config**:
   - Project Settings > General > **Your apps** > Web app `</>`.
   - Copy Firebase config object and paste into `firebase-config.js`.

---

## Test Strategy
- **GIS ↔ Firebase Auth Bridging**: Verify Google One-Tap / button sign-in exchanges ID token with Firebase Auth via `signInWithCredential()`. Verify token issuance and session persistence.
- **Whitelist Authorization**: Validate Firestore document lookup for lowercase email. Ensure non-admin Google users cannot execute write operations.
- **CMS Operations (CRUD)**: Validate creation, inline editing, and deletion of video entries and event records across both `#admin` and public pages (`Resources.js`, `Events.js`).
- **Cloud Storage & Poster Lightbox**: Test image file uploads (<5MB, PNG/JPEG/WebP), URL storage, poster replacement, storage file deletion on event removal, and Lightbox open/close interactions (`Esc`, backdrop click).
- **Zero-Build & Fallback Resilience**: Verify standalone Babel compilation with zero build errors. Test offline mode to ensure public pages fall back seamlessly to hardcoded data.

---

## Risks & Mitigation

| Risk | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **Exposed Firebase API Keys in Client Code** | Low / Info | Firebase web API keys identify project, not authorize admin operations. Authorization is strictly enforced by Firestore and Storage server-side security rules matching `request.auth.token.email` against `admin_emails`. |
| **GIS ID Token Expiration** | Medium | Firebase Auth manages session refresh tokens automatically once credential exchange completes via `signInWithCredential()`. |
| **Unauthorized Write / Delete Attempts** | High | Firestore and Storage security rules reject all non-admin writes at database/storage layer even if client UI is manipulated. |
| **Firebase CDN or Network Failure** | Medium | Hardcoded default data remains embedded in `Resources.js` and `Events.js` as offline fallback if Firestore fetch fails or times out. |
| **Large Poster Image Uploads Slowing Site** | Medium | Client-side file size validation (<5MB), image type verification, and Cloud Storage security rules. |
| **Admin Lockout** | Medium | UI prevents deleting currently logged-in admin email from whitelist table; initial admin can always be configured directly in Firebase Console. |
| **Dangling Storage Files on Event Deletion** | Low | Event delete workflow explicitly triggers Cloud Storage `deleteObject` on associated `posterPath` before removing Firestore document. |
. |
