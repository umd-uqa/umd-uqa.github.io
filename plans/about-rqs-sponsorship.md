# Plan: About Page RQS Sponsorship Acknowledgment

## Scope & Objective
Add dedicated "SUPPORTED BY" sponsorship acknowledgment section to bottom of About page (`About.js`), acknowledging Institute for Robust Quantum Simulation (RQS) with external link.

### In Scope
- Add divider `<hr>` after "Why Join UQA?" section.
- Add `<section>` with heading "SUPPORTED BY" styled via Raleway uppercase badge format.
- Add copy "Supported by the Institute for Robust Quantum Simulation (RQS)" linking to `https://rqs.umd.edu/` with `target="_blank" rel="noopener noreferrer"`.
- Verify visual layout, responsive behavior, and Babel/React rendering in browser.

### Out of Scope
- Adding sponsor logos or images (not requested; text link only).
- Modifying other pages (`Home.js`, `Resources.js`, etc.).
- Adding backend or dynamic sponsor data loading.

---

## Tasks

### T0: Create isolated git worktree
- **Deps**: None
- **Est. Time**: 2 min
- **Files**: None
- **Action**:
  - Run `git worktree add ../worktree-rqs-sponsorship -b feature/rqs-sponsorship`
  - Navigate to `../worktree-rqs-sponsorship`
- **Acceptance Criteria**:
  - `git worktree list` shows `../worktree-rqs-sponsorship` on branch `feature/rqs-sponsorship`.
- **Tests**:
  - Happy: Worktree dir exists and is clean working directory.

---

### T1: Add Supported By section to `About.js`
- **Deps**: T0
- **Est. Time**: 10 min
- **Files**:
  - `About.js`
- **Action**:
  - In `About.js`, locate "WHY JOIN UQA?" section end (after line 93).
  - Add standard divider:
    ```jsx
    <hr className="border-none border-t border-white/10 mb-10" />
    ```
  - Add Supported By section:
    ```jsx
    {/* SUPPORTED BY SECTION */}
    <section className="mb-10">
      <h2 className="font-['Raleway'] text-[16px] font-bold tracking-[0.22em] uppercase text-[#9296c8] mb-8">
        Supported By
      </h2>
      <p className="text-[20px] text-[#f0f0f8]/80 leading-[1.9]">
        Supported by the{" "}
        <a
          href="https://rqs.umd.edu/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#a8abdb] border-b border-[#b0b3e0]/30 hover:border-[#b0b3e0] transition-colors"
        >
          Institute for Robust Quantum Simulation (RQS)
        </a>
        .
      </p>
    </section>
    ```
  - Ensure placement is above Weekly General Body Meetings callout banner.
- **Acceptance Criteria**:
  - Section exists with exact typography tokens: Raleway font, uppercase, tracking, color `#9296c8` on header, 20px `#f0f0f8]/80` body text, link styled with hover border transition.
  - Link has `target="_blank"` and `rel="noopener noreferrer"`.
- **Tests**:
  - Happy: `About.js` contains valid JSX matching structure of existing sections ("Who We Are", "What We Do").
  - Edge: JSX syntax valid for browser Babel standalone compiler (no unclosed tags, valid className props).

---

### T2: Browser verification and responsive testing
- **Deps**: T1
- **Est. Time**: 10 min
- **Files**:
  - `index.html`
  - `About.js`
- **Action**:
  - Start local test HTTP server (e.g., `python3 -m http.server 8000`).
  - Open page and navigate to About section.
  - Verify section header renders with correct font and uppercase tracking.
  - Verify link points to `https://rqs.umd.edu/` and opens in new tab securely.
  - Verify layout responsiveness across viewports: mobile (375px), tablet (768px), desktop (1400px+).
  - Check browser developer console for zero React/Babel runtime warnings or errors.
- **Acceptance Criteria**:
  - Page renders without compilation or console errors.
  - Section visually aligns with existing About page theme and spacing rhythm.
- **Tests**:
  - Happy: Clicking RQS link opens `https://rqs.umd.edu/` in new tab.
  - Edge: Viewport resize from mobile to ultra-wide maintains padding and legible line wrapping.
  - Error: Verify no 404s or uncaught exceptions in console.

---

### T3: Commit changes & cleanup git worktree
- **Deps**: T2
- **Est. Time**: 5 min
- **Files**:
  - `About.js`
- **Action**:
  - In worktree directory, stage and commit changes:
    `git add About.js && git commit -m "feat(about): add RQS sponsorship acknowledgment section"`
  - Switch back to main project directory: `cd /home/bobjoe/IdeaProjects/umd-uqa.github.io`
  - Remove worktree: `git worktree remove ../worktree-rqs-sponsorship`
- **Acceptance Criteria**:
  - Branch `feature/rqs-sponsorship` contains commit.
  - Worktree directory `../worktree-rqs-sponsorship` removed cleanly.
- **Tests**:
  - Happy: `git worktree list` confirms worktree cleaned up.

---

## Test Strategy
- **Static JSX Validation**: Verify Babel standalone compiles `About.js` without runtime syntax errors.
- **Visual Inspection**: Ensure font sizes (16px label, 20px text), letter tracking (0.22em), colors (`#9296c8`, `#a8abdb`), and dividers (`border-white/10`) align with existing design system.
- **Functional Link Test**: Verify RQS link destination and new tab behavior (`target="_blank"` with `rel="noopener noreferrer"`).
- **Responsive Inspection**: Test mobile breakpoint (<768px) and max container width (1400px).

---

## Risks & Mitigation
- **Risk**: Stale browser cache or Babel standalone compilation lag.
  - *Mitigation*: Hard refresh browser and inspect console during T2 verification.
- **Risk**: External link missing security attributes.
  - *Mitigation*: Explicitly include `rel="noopener noreferrer"` alongside `target="_blank"`.
