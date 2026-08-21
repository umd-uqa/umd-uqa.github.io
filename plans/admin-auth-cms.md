# Plan: Admin Authentication & Content Management System (CMS)

## Scope & Objective
Add secure Firebase Authentication (Google Sign-In), Firestore database, and Cloud Storage integration to UMD UQA static React site. Enable designated admin emails to manage featured videos on Resources page and fully manage events and posters (add new events, edit existing event details/posters, and delete/remove events) on Events page with inline controls and dedicated `#admin` dashboard. Maintain zero-build GitHub Pages architecture with CDN-loaded scripts, responsive Tailwind UI, and resilient offline fallback data.

### In Scope
1. **Zero-Build Firebase Integration**: Load Firebase v10 Compat SDK (App, Auth, Firestore, Storage) via CDN in `index.html`.
2. **Auth & Whitelist System**: Google Sign-In with email validation against Firestore `admin_emails` collection.
3. **Security Rules Spec**: Granular Firestore and Cloud Storage security rules enforcing server-side authorization on `request.auth.token.email`.
4. **Data Schema & Initial Seeding**: Schemas for `admin_emails`, `videos`, and `events`, with automatic fallback to existing hardcoded data.
5. **Full Event Lifecycle Management (Add, Edit, Remove/Delete)**: Complete CRUD controls allowing admins to create new events, update any event metadata (date, title, description, bullet highlights, registration links), upload/replace/remove poster flyer images, and permanently delete events with storage cleanup.
6. **Admin Dashboard (`#admin`)**: Dedicated route for centralized management of admin emails, videos, and full event/poster CRUD with live preview tables.
7. **Dynamic Resources CMS**: Inline "+ Add Video", edit, and delete actions on `Resources.js` for authenticated admins.
8. **Dynamic Events CMS & Poster Lightbox**: Poster image upload to Cloud Storage, click-to-enlarge lightbox modal, inline event/poster CRUD (Add / Edit / Delete buttons on event cards), and "Event Posters & Flyers" gallery on `Events.js`.
9. **Discreet Navbar/Footer Triggers**: Non-intrusive admin login/logout toggle and status badge in Navbar and Footer.
10. **Git Worktree Isolation**: Full task execution inside isolated worktree branch.

### Out of Scope
- Server-side Node.js/SSR backend or custom auth servers.
- Build tooling (Vite, Webpack, npm bundles) — site remains pure static HTML/Babel/CDN.
- Modifying static content on `About.js`, `Home.js`, `Contact.js`, or `Calendar.js`.
- Paid third-party CMS platforms (Sanity, Contentful, Strapi).

---

## Architecture & Data Specifications

### 1. Data Schemas

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
  "description": "A career fair and professional development event...",
  "highlights": [
    "Networking with quantum industry professionals and recruiters",
    "Workshops focused on internship and job placement"
  ],
  "links": [
    { "label": "Register via Handshake", "url": "https://go.umd.edu/QLCNregister", "primary": true },
    { "label": "Register without Handshake", "url": "https://go.umd.edu/attendQLCN", "primary": false }
  ],
  "posterUrl": "https://firebasestorage.googleapis.com/v0/b/.../posters/qlcn_2026.png",
  "posterAlt": "QLCN 2026 Official Event Poster",
  "isAnnual": true,
  "order": 1,
  "createdAt": "2026-08-20T18:00:00Z",
  "updatedAt": "2026-08-20T18:00:00Z"
}
```

---

### 2. Firebase Security Rules

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

    // Public read for content, write only for verified admins
    match /admin_emails/{email} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }

    match /videos/{videoId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }

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
  - Run `git worktree add ../worktree-admin-auth-cms -b feature/admin-auth-cms`
  - Navigate to `../worktree-admin-auth-cms`
- **Acceptance Criteria**:
  - `git worktree list` confirms `../worktree-admin-auth-cms` on branch `feature/admin-auth-cms`.
- **Tests**:
  - *Happy*: Worktree directory exists and is clean git working tree.
  - *Error*: Fails gracefully if worktree path or branch already exists.

---

### T1: Firebase SDK script integration in `index.html`
- **Deps**: T0
- **Est. Time**: 10 min
- **Files**:
  - `index.html`
- **Action**:
  - Caveman: Add Firebase compat CDN scripts before Babel script tags. Add `firebase-config.js`, `auth.js`, `Admin.js` script inclusions.
  - Add CDN script tags in `<head>` or before custom components:
    ```html
    <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-storage-compat.js"></script>
    ```
  - Add application script references in load order:
    ```html
    <script type="text/babel" src="./firebase-config.js"></script>
    <script type="text/babel" src="./auth.js"></script>
    <script type="text/babel" src="./Admin.js"></script>
    ```
- **Acceptance Criteria**:
  - `window.firebase` is defined when page loads.
  - Scripts load in correct order without syntax or 404 network errors.
- **Tests**:
  - *Happy*: Open browser console, verify `typeof window.firebase === 'object'`.
  - *Edge*: Slow network loads scripts sequentially without race condition errors.
  - *Error*: Console surfaces clear warning if CDN script fails to fetch.

---

### T2: Firebase initialization & config module (`firebase-config.js`)
- **Deps**: T1
- **Est. Time**: 15 min
- **Files**:
  - `firebase-config.js`
- **Action**:
  - Caveman: Make `firebase-config.js`. Initialize Firebase app, Firestore, Auth, Storage on `window`. Provide fallback mock config if unconfigured.
  - Define `window.UQA_FIREBASE_CONFIG` object with Firebase project keys (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId).
  - Initialize instances:
    ```javascript
    if (!window.firebase.apps.length) {
      window.firebase.initializeApp(window.UQA_FIREBASE_CONFIG);
    }
    window.uqaAuth = window.firebase.auth();
    window.uqaDb = window.firebase.firestore();
    window.uqaStorage = window.firebase.storage();
    ```
  - Include helper method `window.isFirebaseConfigured()` to verify non-empty API keys before network calls.
- **Acceptance Criteria**:
  - `window.uqaAuth`, `window.uqaDb`, and `window.uqaStorage` initialized and attached to global scope.
  - Helper functions handle unconfigured or dummy keys gracefully without crash.
- **Tests**:
  - *Happy*: Valid config initializes Firebase services without error.
  - *Edge*: Incomplete config logs helpful warning and disables cloud persistence gracefully.
  - *Error*: Corrupted config object caught in try/catch with fallback error banner.

---

### T3: Auth state manager & Google sign-in service (`auth.js`)
- **Deps**: T2
- **Est. Time**: 20 min
- **Files**:
  - `auth.js`
- **Action**:
  - Caveman: Make `auth.js`. Handle Google popup login, logout, user session state, and admin whitelist verification against `admin_emails`.
  - Export `window.UQAAuth` service with methods:
    - `signInWithGoogle()`: Trigger `new firebase.auth.GoogleAuthProvider()` popup.
    - `signOut()`: Trigger `window.uqaAuth.signOut()`.
    - `checkAdminStatus(email)`: Query Firestore `admin_emails/{email.toLowerCase()}` to verify `role === 'admin'`.
    - `onAuthStateChange(callback)`: Listen to `window.uqaAuth.onAuthStateChanged`, verify email whitelist, and emit `{ user, isAdmin, isLoading }`.
    - `useUQAAuth()`: React custom hook for state binding across components.
- **Acceptance Criteria**:
  - Google Sign-In popup opens and captures authenticated user email.
  - Whitelist check correctly identifies authorized admin vs standard non-admin Google user.
  - Auth state persists across browser tab navigation and page reloads.
- **Tests**:
  - *Happy*: Admin email (e.g. whitelist doc exists) logs in -> `isAdmin: true`.
  - *Edge*: Non-whitelisted Google user logs in -> `user` object populated, but `isAdmin: false` with notice.
  - *Error*: User closes Google auth popup before completing -> catch error without crashing app.

---

### T4: Firestore & Storage rules and seed data script
- **Deps**: T2, T3
- **Est. Time**: 20 min
- **Files**:
  - `firestore.rules`
  - `storage.rules`
  - `seed-data.js`
- **Action**:
  - Caveman: Create security rules files. Create seed script `seed-data.js` containing initial videos and events to migrate hardcoded data to Firestore on demand.
  - Write `firestore.rules` enforcing read-all, admin-only write on `/videos`, `/events`, and `/admin_emails`.
  - Write `storage.rules` enforcing 5MB max, image-only validation on `/posters/{fileName}`.
  - In `seed-data.js`, export `window.seedInitialData(db)` to populate initial 3 videos and QLCN event into Firestore if collections are empty.
- **Acceptance Criteria**:
  - Security rules syntax passes Firebase CLI linter rules check.
  - Seed function safely checks if collection has documents before writing to avoid duplicate overwrite.
- **Tests**:
  - *Happy*: Seeding empty database writes initial video and event records.
  - *Edge*: Running seed script twice does not create duplicate entries.
  - *Error*: Non-admin running seed script fails with Firestore permission denied error.

---

### T5: Dedicated Admin Dashboard Component (`Admin.js`) & Route (`App.js`)
- **Deps**: T3, T4
- **Est. Time**: 30 min
- **Files**:
  - `Admin.js`
  - `App.js`
- **Action**:
  - Caveman: Create `Admin.js` for `#admin` route. Show login card for guests, full CMS dashboard for authorized admins, access denied alert for non-admin users.
  - Wire `#admin` route in `App.js`:
    ```jsx
    {currentPage === 'admin' && window.Admin && <window.Admin navigateTo={navigateTo} />}
    ```
  - Implement Admin Dashboard sections:
    1. **Header & Auth Status**: Logged in user info, avatar, role badge, Logout button.
    2. **Admin Whitelist Manager**: List admin emails, add new admin email input form, remove admin button (prevent self-deletion).
    3. **Video Manager**: Table of videos with title, YouTube ID, order; "Add Video" form modal; edit inline; delete with confirmation dialog.
    4. **Full Events & Posters Lifecycle Manager**:
       - **Event Table / Card Grid**: Display all active events with Date, Title, Subtitle, Highlights count, and Poster thumbnail.
       - **Add Event Workflow**: Modal form with fields: `title`, `subtitle`, `month` (e.g. Sept), `day` (e.g. 15), `year`, `description`, dynamic list editor for `highlights` (add/remove bullet points), dynamic list editor for `links` (label, URL, primary toggle), `isAnnual` flag, and optional poster image file upload (uploading to Cloud Storage).
       - **Edit Event Workflow**: "Edit" button opens pre-filled modal with existing values. Allows updating any text fields, modifying highlights/links, replacing existing poster with new file upload, or detaching/removing poster image while keeping the event.
       - **Delete Event Workflow**: "Delete / Take Away Event" button triggers confirmation dialog ("Are you sure you want to delete this event?"). Upon confirmation, deletes event document from Firestore and automatically deletes associated poster image file from Cloud Storage if one was uploaded.
    5. **Database Sync / Seed Button**: "Seed Initial Hardcoded Data" trigger button.
- **Acceptance Criteria**:
  - Accessing `index.html#admin` renders Admin component.
  - Unauthenticated users see Google Sign-In prompt.
  - Authenticated non-admins see "Access Restricted: You are not on the administrator whitelist" alert.
  - Authorized admins can perform all CRUD operations (Add, Edit, Delete) on events, videos, and emails with immediate UI feedback.
- **Tests**:
  - *Happy*: Admin creates new event with poster -> edits its title and date -> deletes event -> Firestore & Storage update cleanly.
  - *Edge*: Admin tries to delete their own email -> UI disables button and prevents lockout.
  - *Error*: Network timeout during upload shows error alert with retry button.

---

### T6: Dynamic Resources CMS & Inline Admin Controls (`Resources.js`)
- **Deps**: T3, T5
- **Est. Time**: 25 min
- **Files**:
  - `Resources.js`
- **Action**:
  - Caveman: Update `Resources.js` to fetch videos from Firestore `videos` collection with hardcoded fallback. If `isAdmin`, show inline "+ Add Video", edit, and delete buttons.
  - Add state `videos`, `loading`, `error` with `useEffect` subscribing to Firestore `onSnapshot` (or `getDocs`).
  - Fallback: If Firestore returns 0 items or throws offline error, fallback to default `videoResources` array seamlessly.
  - Add inline Admin Controls (rendered conditionally when `isAdmin === true`):
    - "+ Add Video" button next to "Featured Videos" heading.
    - "Edit" and "Delete" icons on active video tab tabs.
    - Quick Modal for creating/editing video (Title, YouTube Video ID / URL parser).
- **Acceptance Criteria**:
  - Public visitors see video player and tabs loaded from Firestore (or fallback).
  - Admin sees inline edit/add controls; adding a video updates the tab list in real-time.
  - Fallback data displays without error if user is offline or Firebase is disabled.
- **Tests**:
  - *Happy*: Admin clicks "+ Add Video", enters title and YouTube ID -> new tab appears and plays.
  - *Edge*: User inputs full YouTube URL (`https://www.youtube.com/watch?v=xyz`) -> regex parses raw ID `xyz`.
  - *Error*: Deleting active video safely sets active tab index to 0 without out-of-bounds crash.

---

### T7: Events CMS, Poster Lightbox & Inline Event Management (`Events.js`)
- **Deps**: T3, T5
- **Est. Time**: 30 min
- **Files**:
  - `Events.js`
- **Action**:
  - Caveman: Update `Events.js` to load events from Firestore with hardcoded fallback. Add Poster Lightbox modal. Add "Event Posters & Flyers Gallery" section. Add inline "+ Add Event", "Edit Event", and "Delete Event" controls for authenticated admins.
  - Implement **Lightbox Modal**:
    - State `selectedPoster` (url, alt, title).
    - Fullscreen overlay with dark backdrop blur, high-res poster display, close button (`Esc` key + backdrop click).
  - Implement **Poster Gallery Section**:
    - Grid layout displaying past and upcoming event poster thumbnails.
    - Hover zoom animation and "Click to Enlarge" preview indicator.
  - Implement **Inline Event Management Controls** (rendered when `isAdmin === true`):
    - **Header Action**: "+ Add New Event" button alongside section headers.
    - **Per-Card Inline Actions**:
      - "Edit Event" button on each event card (opens full edit modal to update text, dates, highlights, links, or upload/replace/remove poster).
      - "Delete Event" button on each event card with confirmation modal to remove/take away event and purge its poster from Cloud Storage.
    - **Event Form Modal**: Reusable component supporting both Create and Edit modes with real-time poster image preview, file upload progress bar, and field validation.
  - Fallback: Use existing `annualEvents` if Firestore is unreachable or offline.
- **Acceptance Criteria**:
  - Public visitors view events and poster gallery smoothly without edit/delete buttons visible.
  - Clicking any poster thumbnail opens full-resolution Lightbox modal.
  - Admins can add new events, edit any field of existing events, and take away/delete events with instant UI and Firestore sync.
  - Deleting an event that has an uploaded poster purges the image file from Cloud Storage to prevent storage leakage.
- **Tests**:
  - *Happy (Create & View)*: Admin creates event with poster -> event renders -> poster thumbnail opens in Lightbox.
  - *Happy (Edit)*: Admin edits event date from "Sept 15" to "Oct 20" and changes description -> changes reflect immediately on page.
  - *Happy (Delete / Take Away)*: Admin clicks "Delete Event" -> confirms -> event removed from UI and Firestore, poster removed from Storage.
  - *Edge (No Poster)*: Event created/edited without poster image renders clean text card without broken image.
  - *Error*: User uploads non-image file (.pdf/.exe) or file >5MB -> UI warns with validation error before upload.

---

### T8: Navbar & Footer Discreet Admin Triggers (`Navbar.js`, `App.js`)
- **Deps**: T3, T5
- **Est. Time**: 15 min
- **Files**:
  - `Navbar.js`
  - `App.js`
- **Action**:
  - Caveman: Add discreet admin login/status button in Navbar and Footer.
  - In `Navbar.js`:
    - Add subtle key/shield icon or small "Admin" link in right action area.
    - If logged in as admin, show small green indicator dot and user profile tooltip linking to `#admin`.
  - In `App.js` footer:
    - Add subtle "Admin Portal" link in footer copyright row (`#admin`).
  - Pass auth state from `App.js` down to `Navbar.js`.
- **Acceptance Criteria**:
  - Navbar maintains clean aesthetic without cluttering public visitor experience.
  - Clicking Admin link routes smoothly to `#admin`.
  - Logged-in admin status is visually indicated.
- **Tests**:
  - *Happy*: Clicking Admin button opens `#admin` dashboard.
  - *Edge*: On mobile screen widths, admin icon collapses into mobile-friendly layout.
  - *Error*: Token expiration updates UI status back to guest state.

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
- **Action**:
  - Caveman: Run local HTTP server. Test complete admin lifecycle: guest view -> Google sign-in -> add video -> upload event poster -> verify lightbox -> edit -> delete -> logout -> check offline fallback.
  - Step 1: Verify guest view (no admin buttons, posters click to enlarge, fallback data loads).
  - Step 2: Login as admin email -> verify `#admin`, Resources, and Events show CMS controls.
  - Step 3: Add new video -> check Firestore sync.
  - Step 4: Add event with poster image -> check Storage upload and Lightbox rendering.
  - Step 5: Simulate offline mode (DevTools Network -> Offline) -> verify site falls back to cached/hardcoded content gracefully.
  - Step 6: Verify console has zero React or Babel warnings.
- **Acceptance Criteria**:
  - All happy path, edge case, and error handling tests pass.
  - Zero console errors or layout shift glitches across viewports (mobile, tablet, desktop).
- **Tests**:
  - *Happy*: Complete CRUD workflow for videos, events, posters, and admins succeeds.
  - *Edge*: Fast page switching during data fetch does not cause memory leaks or unmounted state warnings.
  - *Error*: Network disconnect gracefully displays fallback data with subtle offline badge.

---

### T10: Commit changes, documentation & worktree cleanup
- **Deps**: T9
- **Est. Time**: 10 min
- **Files**:
  - `README.md`
  - All modified codebase files
- **Action**:
  - Document Firebase setup instructions, environment config, and security rules deployment in `README.md`.
  - In worktree directory, stage and commit all changes:
    `git add . && git commit -m "feat(cms): add firebase auth, firestore cms, and poster storage management"`
  - Switch back to main repository root: `cd /home/bobjoe/IdeaProjects/umd-uqa.github.io`
  - Clean up worktree: `git worktree remove ../worktree-admin-auth-cms`
- **Acceptance Criteria**:
  - Commit exists on branch `feature/admin-auth-cms`.
  - Worktree directory removed cleanly.
  - `README.md` contains clear guide for configuring Firebase API keys and deploying security rules.
- **Tests**:
  - *Happy*: `git worktree list` confirms worktree cleaned up; branch is ready for pull request.

---

## Step-by-Step Firebase Project Configuration Guide

To activate the backend for this plan:
1. **Create Firebase Project**: Go to [Firebase Console](https://console.firebase.google.com/) and create a project named `umd-uqa-web`.
2. **Enable Google Authentication**:
   - Navigate to **Authentication** > **Sign-in method**.
   - Enable **Google** provider and configure support email.
3. **Create Firestore Database**:
   - Navigate to **Firestore Database** > **Create database** (Production mode).
   - In Firestore **Rules**, paste the contents of `firestore.rules` and click **Publish**.
4. **Create Cloud Storage Bucket**:
   - Navigate to **Storage** > **Get started**.
   - In Storage **Rules**, paste the contents of `storage.rules` and click **Publish**.
5. **Add Initial Admin Whitelist**:
   - In Firestore, create collection `admin_emails`.
   - Create document with ID = your Google email (e.g. `yourname@umd.edu`) with fields `{ email: "yourname@umd.edu", role: "admin", createdAt: request.time }`.
6. **Register Web App & Copy Config**:
   - Project Settings > General > **Your apps** > Web app `</>`.
   - Copy Firebase config object and paste into `firebase-config.js`.

---

## Test Strategy
- **Authentication & Authorization**: Verify Google Sign-In, token exchange, and Firestore email whitelist lookup. Test non-whitelisted user rejection.
- **CMS Operations (CRUD)**: Validate creation, inline editing, and deletion of video entries and event records.
- **Image Storage & Lightbox**: Test poster upload (JPEG/PNG/WebP), size limit check (<5MB), Cloud Storage URL generation, and Lightbox open/close interactions (`Esc`, click outside).
- **Zero-Build Compatibility**: Ensure all JSX and CDN libraries compile cleanly via Babel standalone in modern browsers.
- **Offline & Fallback Resilience**: Test site behavior under simulated offline conditions or missing Firebase keys to guarantee zero disruption for public visitors.

---

## Risks & Mitigation

| Risk | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **API Keys Exposed in Client Code** | Low / Info | Firebase web API keys identify project, not grant admin rights. Security is strictly enforced by Firestore/Storage server-side security rules matching `request.auth.token.email` against `admin_emails`. |
| **Unauthorized Write / Delete Attempts** | High | Firestore and Storage security rules reject all non-admin writes at database/storage layer even if client UI is manipulated. |
| **Firebase CDN or Network Failure** | Medium | Hardcoded default data remains embedded in `Resources.js` and `Events.js` as fallback if Firestore fetch fails or times out. |
| **Large Poster Image Uploads Slowing Site** | Medium | Client-side file size validation (<5MB), image compression check, and Cloud Storage security rule enforcement. |
| **Admin Lockout** | Medium | UI prevents deleting currently logged-in admin email from whitelist table; initial admin can always be updated directly in Firebase Console. |
