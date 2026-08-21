# UMD Undergraduate Quantum Association (UMD UQA)

Official website for the University of Maryland Undergraduate Quantum Association (hosted at [umd-uqa.github.io](https://umd-uqa.github.io)).

---

## Features & Content Management System (CMS)

- **Client-Side Single Page Application**: Built with React 18, Tailwind CSS, and Babel Standalone.
- **Admin Authentication**: Google Sign-In with email validation against a Firestore `admin_emails` whitelist.
- **Dynamic Resources CMS**: Inline and dashboard controls to add, reorder, and remove featured YouTube workshop videos.
- **Dynamic Events & Poster CMS**: Full CRUD controls to create, edit, and delete/take away events with custom flyer/poster uploads to Cloud Storage, and full-resolution Lightbox viewer.
- **Resilient Fallback**: Site automatically displays built-in default content if offline or before Firebase is configured.

---

## Firebase Setup & Activation Guide

To connect your live Firebase project to the website:

### 1. Create Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/) and click **Add Project**.
2. Name the project `umd-uqa-web` (or any name you prefer).

### 2. Enable Google Authentication
1. In Firebase Console, go to **Build** > **Authentication** > **Get Started**.
2. Under **Sign-in method**, choose **Google**, enable it, select your project support email, and click **Save**.
3. Under **Settings** > **Authorized domains**, add your deployment domains (e.g. `umd-uqa.github.io` and `localhost`).

### 3. Set Up Cloud Firestore
1. Go to **Build** > **Firestore Database** > **Create database**.
2. Choose **Start in production mode** and pick your region.
3. Click the **Rules** tab, paste the contents of [`firestore.rules`](./firestore.rules), and click **Publish**.
4. In the **Data** tab, create a new collection named `admin_emails`. Add a document whose **Document ID** is your Google/UMD email (e.g. `president@umd.edu`), with fields:
   ```json
   {
     "email": "president@umd.edu",
     "role": "admin",
     "createdAt": "2026-08-20T18:00:00Z"
   }
   ```

### 4. Set Up Cloud Storage
1. Go to **Build** > **Storage** > **Get Started**.
2. Click the **Rules** tab, paste the contents of [`storage.rules`](./storage.rules), and click **Publish**.

### 5. Add API Keys to `firebase-config.js`
1. Go to **Project Settings** (gear icon) > **General** > **Your apps** > click the Web icon `</>`.
2. Register the app name (e.g. `UMD UQA Web`).
3. Copy the `firebaseConfig` object and paste it into [`firebase-config.js`](./firebase-config.js).

---

## Local Development & Testing

To run and test the website locally:

```bash
# Start a simple HTTP server in the repository root:
python3 -m http.server 8000

# Open your browser:
http://localhost:8000
```

- Navigate to `#admin` or click the **Login / Admin** button in the Navbar or Footer.
- In Demo mode (before Firebase keys are added), you can test the full UI, add videos, and manage events with mock local storage.
