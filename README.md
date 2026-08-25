# UMD Undergraduate Quantum Association (UQA)

The official website for the Undergraduate Quantum Association (UQA) at the University of Maryland, College Park.

This platform serves as the digital hub for quantum computing and quantum science undergraduates, providing event schedules, workshop recordings, speaker announcements, and community resources.

---

## Overview

- **Schedule & Events**: Showcases upcoming quantum career fairs, speaker panels, and workshops, with live Google Calendar synchronization and flyer galleries.
- **Resources**: Houses technical video workshops, challenge walkthroughs, and educational materials.
- **Community & Contact**: Connects students with club officers, meeting locations (Physics Toll Building), and the Discord community.
- **Officer CMS**: Allows authorized club administrators to add events, upload promotional flyers, and manage resources directly from the browser.

---

## Architecture

- **Frontend**: React 18, Babel Standalone, and Tailwind CSS loaded via CDN (zero-build architecture without Node.js bundlers).
- **Navigation**: Client-side hash routing (`#home`, `#about`, `#schedule`, `#resources`, `#contact`, `#admin`) with synchronous state transitions.
- **Backend & Storage**: Supabase PostgreSQL for structured event and video records, and Supabase Storage for poster images.
- **Authentication**: Google Identity Services (GIS) for role-based officer access control.

---

## Running Locally

To run the site locally, start an HTTP server in the project root:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000` in your web browser.

---

## Contributing

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/umd-uqa/umd-uqa.github.io.git
   cd umd-uqa.github.io
   ```

2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Development Guidelines**:
   - Maintain the zero-build setup by attaching components directly to `window`.
   - Ensure responsive design across desktop and mobile viewports using Tailwind CSS.

4. **Testing**:
   - Run a local HTTP server and verify changes across desktop and mobile browsers.

5. **Submit a Pull Request**:
   - Push your branch to GitHub and open a Pull Request describing your changes.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
