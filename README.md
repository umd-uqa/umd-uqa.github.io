# UMD Undergraduate Quantum Association (UMD UQA)

Official website for the University of Maryland Undergraduate Quantum Association (hosted at [umd-uqa.github.io](https://umd-uqa.github.io)).

---

## Features

- **Client-Side Single Page Application**: Built with React 18, Tailwind CSS, and Babel Standalone.
- **Pure Google Authentication**: Direct client-side Google Identity Services (GIS) OAuth 2.0 integration (zero Firebase backend required).
- **User Profile Management**: Authenticated users can view their Google avatar, name, and email profile card.
- **Calendar & Events**: Comprehensive list of upcoming, annual, and recurring UQA quantum events.
- **Resources & Learning Hub**: Interactive Quantum Coalition learning graph, video presentations, and study materials.
- **RQS Sponsorship**: Supported by the Institute for Robust Quantum Simulation (RQS).

---

## Google Authentication Setup Guide

Google Sign-In uses Google's official client-side Google Identity Services (GIS) library.

### 1. Generate Google OAuth 2.0 Client ID (Free, <1 minute)
1. Open the [Google Cloud Console Credentials Page](https://console.cloud.google.com/apis/credentials).
2. Click **Create Credentials** > **OAuth client ID**.
   *(If prompted to configure OAuth Consent Screen: select **External**, name it `UMD UQA`, and enter your support email)*.
3. Select **Application type**: **Web application**.
4. Set **Name**: `UMD UQA Web`.
5. Under **Authorized JavaScript origins**, add:
   - `http://localhost:8000`
   - `http://127.0.0.1:8000`
   - `https://umd-uqa.github.io`
6. Click **Create** and copy your **Client ID** (e.g. `123456789-abcdef.apps.googleusercontent.com`).

### 2. Configure `google-auth-config.js`
Open [`google-auth-config.js`](./google-auth-config.js) and paste your Client ID:
```javascript
window.UQA_GOOGLE_CLIENT_ID = "YOUR_CLIENT_ID.apps.googleusercontent.com";
```

---

## Local Development & Testing

To run and test the website locally:

```bash
# Start a simple HTTP server in the repository root:
python3 -m http.server 8000

# Open your browser:
http://localhost:8000
```
