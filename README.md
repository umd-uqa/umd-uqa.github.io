# UMD Undergraduate Quantum Association (UMD UQA)

Official website for the University of Maryland Undergraduate Quantum Association (hosted at [umd-uqa.github.io](https://umd-uqa.github.io)).

---

## 🚀 Architecture Overview

- **Zero-Build Architecture**: Runs entirely via CDN-loaded React 18, Babel Standalone, and Tailwind CSS without Node.js bundlers.
- **Authentication**: Official Google Identity Services (GIS) button bridged into Supabase Auth.
- **Backend & Database**: 100% Free Supabase PostgreSQL Database (`events`, `videos`, `admin_emails`).
- **Flyer Storage**: Supabase Storage public bucket `posters` with instant CDN preview and Lightbox gallery.
- **Content Management System (CMS)**: 
  - **Events & Flyers**: Full CRUD for club events and high-res poster uploads with Lightbox preview.
  - **Featured Videos**: Tab-based YouTube video management on the Resources page.
  - **Admin Whitelist**: Role-based access control with PostgreSQL Row-Level Security (RLS).
- **Resilient Fallback**: Public pages automatically fall back to built-in static content if offline or before Supabase is configured.

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

## ⚙️ 100% Free Supabase Backend Setup Guide

### 1. Google Cloud Console (OAuth 2.0 Web Client ID)
1. Go to the [Google Cloud Credentials Console](https://console.cloud.google.com/apis/credentials).
2. Create an **OAuth 2.0 Client ID** (Application type: **Web application**).
3. Under **Authorized JavaScript origins**, add:
   - `http://localhost:8000`
   - `http://127.0.0.1:8000`
   - `https://umd-uqa.github.io`
4. Paste the Client ID into `google-auth-config.js`.

### 2. Supabase Free Project Configuration (No Credit Card Required)
1. Create a free account and project at [Supabase Console](https://supabase.com/).
2. Open the **SQL Editor** in your Supabase project dashboard.
3. Open `supabase-schema.sql` from this repository, paste the entire SQL content into the SQL Editor, and click **Run**.
   - This automatically creates the `admin_emails`, `events`, and `videos` tables, Row-Level Security policies, and the `posters` storage bucket.
4. Go to **Project Settings** > **API**.
5. Copy your **Project URL** and **anon public Key** and paste them into `supabase-config.js`:
   ```javascript
   window.UQA_SUPABASE_CONFIG = {
     url: "https://your-project.supabase.co",
     anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
   };
   ```

### 3. Authorized Admin Whitelist
The initial database schema pre-authorizes the 3 club administrators:
- `itskrithikmohan@gmail.com`
- `krithikm@terpmail.umd.edu`
- `umd.uqa@gmail.com`

Sign in with any of these accounts to manage events, posters, videos, and add/remove other administrator emails directly from `#admin`!
