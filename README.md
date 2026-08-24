# UMD Undergraduate Quantum Association (UMD UQA)

Official website for the University of Maryland Undergraduate Quantum Association (hosted at [umd-uqa.github.io](https://umd-uqa.github.io)).

---

## 🚀 Architecture Overview

- **Zero-Build Architecture**: Runs entirely via CDN-loaded React 18, Babel Standalone, and Tailwind CSS without Node.js bundlers.
- **Authentication**: Pure Google Identity Services (GIS) button and One Tap bridged into Firebase Authentication (v10 Compat).
- **Content Management System (CMS)**: 
  - **Events & Flyers**: Full CRUD for club events and high-res poster uploads stored in Firebase Cloud Storage with Lightbox preview.
  - **Featured Videos**: Tab-based YouTube video management on the Resources page.
  - **Admin Whitelist**: Role-based access control checking Firestore `/admin_emails/{email}`.
- **Resilient Fallback**: Public pages automatically fall back to built-in static content if offline or before Firebase is configured.

---

## 🛠️ Local Development & Testing

Run a simple local HTTP server from the repository root:

```bash
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000) in your browser.

- **Guest Portal**: `http://localhost:8000/#auth`
- **Admin CMS**: `http://localhost:8000/#admin`
- **Events & Posters**: `http://localhost:8000/#events`
- **Featured Resources**: `http://localhost:8000/#resources`

---

## ⚙️ Backend & Firebase Setup Guide

### 1. Google Cloud Console (OAuth 2.0 Web Client ID)
1. Go to the [Google Cloud Credentials Console](https://console.cloud.google.com/apis/credentials).
2. Create an **OAuth 2.0 Client ID** (Application type: **Web application**).
3. Under **Authorized JavaScript origins**, add:
   - `http://localhost:8000`
   - `http://127.0.0.1:8000`
   - `https://umd-uqa.github.io`
4. Paste the Client ID into `google-auth-config.js`.

### 2. Firebase Console Configuration
1. Create a project named `umd-uqa-web` at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** > **Google** sign-in provider.
3. Enable **Firestore Database** (Production mode) and publish rules from `firestore.rules`.
4. Enable **Cloud Storage** bucket and publish rules from `storage.rules`.
5. Under **Project Settings** > **General** > **Your apps**, register a Web App `</>` and paste the configuration keys into `firebase-config.js`.

### 3. Adding the First Administrator
In Firestore Console:
1. Create a collection called `admin_emails`.
2. Create a document with Document ID equal to your lowercase email (e.g. `lead@umd.edu`).
3. Set fields:
   ```json
   {
     "email": "lead@umd.edu",
     "role": "admin",
     "addedBy": "bootstrap",
     "createdAt": "2026-08-24T00:00:00Z"
   }
   ```
4. Sign in with that Google account to access `#admin` and manage events, videos, posters, and other administrators!
