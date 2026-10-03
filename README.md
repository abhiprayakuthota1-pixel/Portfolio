# Abhipray Portfolio

Personal portfolio website for **Akuthota Abhipray** — B.Tech CSE (AI/ML & IoT) student at VNR VJIET, Hyderabad.

---

## Overview

A professional, minimal, black-and-white portfolio website built with plain HTML, CSS, and vanilla JavaScript. No frameworks, no build tools, no backend — just open `index.html` in a browser and it works.

---

## Features

- **Editorial black & white design** — clean typography, generous whitespace, strong visual hierarchy
- **Fully responsive** — works on desktop (1440px+), laptop (1024px), tablet (768px), and mobile (375px+)
- **Dynamic rendering** — all personal data is stored in `js/profile.js` (single source of truth) and rendered into the page by `js/main.js`
- **Scroll reveal animations** — sections animate in as you scroll; respects `prefers-reduced-motion`
- **Responsive navigation** — sticky nav with hamburger menu on mobile, active link highlighting
- **All sections included:**
  - Hero with name, tagline, and CTA buttons
  - About with profile photo support (graceful fallback if photo not present)
  - Skills (Languages, Concepts, Tools & Technologies)
  - Projects (3 selected projects with highlights, tech stack, GitHub links)
  - Education timeline (B.Tech → Class XII → Class X)
  - Achievements & participation
  - Certifications & workshops
  - Coding profiles (GitHub, LeetCode, CodeChef)
  - Resume (view + download)
  - Contact (email, phone, LinkedIn, GitHub, location)
- **AI chat assistant** — floating chatbot button on every page

---

## Technologies Used

- HTML5 (semantic)
- CSS3 (custom properties, CSS Grid, Flexbox, responsive)
- Vanilla JavaScript (ES6+)
- Google Fonts: Inter + DM Serif Display

No npm, Node.js, React, or any build system required.

---

## Project Structure

```
portfolio/
│
├── index.html              # Main page — all sections
│
├── css/
│   └── style.css           # Complete design system & responsive styles
│
├── js/
│   ├── profile.js          # Single source of truth for all personal data
│   ├── main.js             # Dynamic rendering + nav + scroll + interactions
│   └── chatbot.js          # Rule-based chat assistant
│
├── assets/
│   ├── resume.pdf          # Place your resume PDF here
│   └── images/
│       └── profile.png     # Profile photo (PNG format)
│
├── README.md
└── .gitignore
```

---

## Chatbot

The portfolio includes a built-in rule-based chat assistant accessible via the floating button on the bottom-right of every page.

**How it works:**
- User input is normalised (lowercased, trimmed, punctuation removed)
- Intent is detected by matching against keyword groups
- Fuzzy project matching handles variations like "grain guard", "grainguard", "GrainGuard AI"
- All responses are generated from `PROFILE` data in `js/profile.js` — no information is invented
- If a question cannot be answered from the profile, it responds with a safe fallback message

**Supported intents:** greeting, about, skills, projects, specific project details, education, CGPA, achievements, certifications, GitHub, LeetCode, CodeChef, coding profiles, resume, contact, location, help, and unknown fallback.

**Future extensibility:** The `getBotReply(message)` function in `chatbot.js` is the single entry point. To connect an external LLM or API later, replace only that function body — the rest of the UI remains unchanged.

---

## How to Run Locally

1. Clone or download the repository.
2. Place your `resume.pdf` in `assets/resume.pdf`.
3. Place a profile photo at `assets/images/profile.png`.
4. Open `index.html` directly in any modern browser.

No server, no npm install, no build step required.

```
# If you prefer a local server (optional):
python -m http.server 8000
# Then visit http://localhost:8000
```

---

## GitHub Pages Deployment

This site is fully compatible with GitHub Pages.

1. Push the repository to GitHub.
2. Go to **Settings → Pages**.
3. Set the source to the `main` branch, root folder (`/`).
4. GitHub Pages will serve `index.html` automatically.

All asset paths are relative — no configuration needed.

---

## Projects Included

| Project | Description |
|---|---|
| **GrainGuard AI** | Multimodal early-warning decision-support system for stored grain using acoustic analysis, Random Forest, and Streamlit |
| **Seasonal Agriculture Performance Analysis** | Data analysis project exploring agricultural performance patterns across seasons |
| **Car Market Trends Analysis** | Data analysis project identifying relationships and trends in car market data |

---

## Assets

Both assets are present in the project:

| File | Path | Notes |
|---|---|---|
| Resume PDF | `assets/resume.pdf` | Present ✓ |
| Profile photo | `assets/images/profile.png` | Present ✓ |

---

## Contact

- **Email:** 25071A6673@vnrvjiet.in
- **LinkedIn:** [akuthota-abhipray](https://www.linkedin.com/in/akuthota-abhipray-38a91638b)
- **GitHub:** [abhiprayakuthota1-pixel](https://github.com/abhiprayakuthota1-pixel)
- **Location:** Hyderabad, Telangana, India
