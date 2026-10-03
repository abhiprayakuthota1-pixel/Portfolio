/**
 * main.js — Portfolio rendering and interactions.
 * Reads from PROFILE (js/profile.js) to render all dynamic sections.
 * Handles: nav, scroll reveal, skills, projects, education,
 *          achievements, certifications, coding profiles, footer year.
 */

/* ============================================================
   UTILITIES
   ============================================================ */

/**
 * Create an element with optional class, attributes, and inner HTML.
 * Named makeEl to avoid any accidental shadowing.
 * @param {string} tag
 * @param {Object} options - { className, attrs, html, text }
 * @returns {HTMLElement}
 */
function makeEl(tag, options = {}) {
  const elem = document.createElement(tag);
  if (options.className) elem.className = options.className;
  if (options.html)      elem.innerHTML = options.html;
  if (options.text)      elem.textContent = options.text;
  if (options.attrs) {
    Object.entries(options.attrs).forEach(([k, v]) => elem.setAttribute(k, v));
  }
  return elem;
}

/* ============================================================
   1. NAVIGATION
   ============================================================ */

function initNav() {
  const header  = document.getElementById('nav-header');
  const toggle  = document.getElementById('nav-toggle');
  const menu    = document.getElementById('nav-menu');
  const navLinks = menu ? menu.querySelectorAll('.nav-link') : [];

  if (!header || !toggle || !menu) return;

  // ---- Scroll: add shadow class ----
  const onScroll = () => {
    header.classList.toggle('nav-scrolled', window.scrollY > 10);
    updateActiveLink();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // ---- Hamburger toggle ----
  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    // Prevent body scroll when menu open on mobile
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation menu');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (
      menu.classList.contains('nav-open') &&
      !menu.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      menu.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // ---- "Chat with AI" nav button ----
  const navChatBtn = document.getElementById('nav-chat-btn');
  if (navChatBtn) {
    navChatBtn.addEventListener('click', () => {
      // Close mobile menu first
      menu.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      // Trigger chatbot open (chatbot.js sets up window, we just click FAB)
      const fab = document.getElementById('chat-fab');
      if (fab) fab.click();
    });
  }

  // ---- Active link highlighting ----
  function updateActiveLink() {
    const sections = document.querySelectorAll('main section[id]');
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= 80) currentId = sec.id;
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${currentId}`);
    });
  }
}

/* ============================================================
   2. SCROLL REVEAL
   ============================================================ */

function initScrollReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    // Make everything visible immediately
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(elem => observer.observe(elem));
}

/* ============================================================
   3. SKILLS RENDERING
   ============================================================ */

function renderSkills() {
  const container = document.getElementById('skills-grid');
  if (!container || !PROFILE.skills) return;

  const groups = [
    { label: 'Languages',           items: PROFILE.skills.languages },
    { label: 'Concepts',            items: PROFILE.skills.concepts  },
    { label: 'Tools & Technologies', items: PROFILE.skills.tools    },
  ];

  groups.forEach((group, index) => {
    const card = makeEl('div', {
      className: `skill-group reveal reveal-delay-${index + 1}`,
    });

    const labelEl = makeEl('p', {
      className: 'skill-group-label',
      text: group.label,
    });

    const tagsWrap = makeEl('div', { className: 'skill-tags' });

    group.items.forEach(skill => {
      const tag = makeEl('span', {
        className: 'skill-tag',
        text: skill,
      });
      tagsWrap.appendChild(tag);
    });

    card.appendChild(labelEl);
    card.appendChild(tagsWrap);
    container.appendChild(card);
  });

  // Re-observe newly created skill cards (they have the reveal class)
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  container.querySelectorAll('.reveal').forEach(el => skillObserver.observe(el));
}

/* ============================================================
   4. PROJECTS RENDERING
   ============================================================ */

function renderProjects() {
  const container = document.getElementById('projects-grid');
  if (!container || !PROFILE.projects) return;

  PROFILE.projects.forEach((project, index) => {
    const card = makeEl('article', {
      className: 'project-card',
      attrs: { 'aria-label': `Project: ${project.title}` },
    });

    // Number
    const num = makeEl('p', {
      className: 'project-number',
      text: `0${index + 1}`,
    });

    // Title
    const title = makeEl('h3', {
      className: 'project-title',
      text: project.title,
    });

    // Subtitle
    const subtitle = makeEl('p', {
      className: 'project-subtitle',
      text: project.subtitle,
    });

    // Description
    const desc = makeEl('p', {
      className: 'project-desc',
      text: project.description,
    });

    // Highlights
    const highlightsList = makeEl('ul', { className: 'project-highlights' });
    // Show up to 3 highlights to keep cards compact
    project.highlights.slice(0, 3).forEach(h => {
      const item = makeEl('li', {
        className: 'project-highlight',
        text: h,
      });
      highlightsList.appendChild(item);
    });

    // Technologies
    const techsWrap = makeEl('div', { className: 'project-techs' });
    project.technologies.forEach(tech => {
      const tag = makeEl('span', { className: 'project-tech', text: tech });
      techsWrap.appendChild(tag);
    });

    // Top section
    const top = makeEl('div', { className: 'project-card-top' });
    top.appendChild(num);
    top.appendChild(title);
    top.appendChild(subtitle);
    top.appendChild(desc);
    top.appendChild(highlightsList);
    top.appendChild(techsWrap);

    // Footer: GitHub link
    const footer = makeEl('div', { className: 'project-card-footer' });
    const ghLink = makeEl('a', {
      className: 'project-github-link',
      text: '↗ View on GitHub',
      attrs: {
        href: project.github,
        target: '_blank',
        rel: 'noopener noreferrer',
        'aria-label': `View ${project.title} on GitHub (opens in new tab)`,
      },
    });
    footer.appendChild(ghLink);

    card.appendChild(top);
    card.appendChild(footer);

    // Apply stagger delay via inline style — avoids race condition on in-viewport load.
    card.style.transitionDelay = `${index * 0.08}s`;

    container.appendChild(card);
  });

  // Single observer for all project cards.
  const projectObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Clear delay after entrance so hover transitions aren't delayed.
          entry.target.addEventListener('transitionend', () => {
            entry.target.style.transitionDelay = '';
          }, { once: true });
          projectObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  container.querySelectorAll('.project-card').forEach(card => projectObserver.observe(card));
}

/* ============================================================
   5. EDUCATION RENDERING
   ============================================================ */

function renderEducation() {
  const container = document.getElementById('education-timeline');
  if (!container || !PROFILE.education) return;

  PROFILE.education.forEach((edu, index) => {
    const item = makeEl('div', {
      className: `education-item${edu.current ? ' current' : ''}`,
    });

    // Period
    const period = makeEl('p', {
      className: 'education-period',
      text: edu.period,
    });

    // Degree + current badge
    const degreeWrap = makeEl('div', {});
    const degree = makeEl('h3', {
      className: 'education-degree',
    });
    degree.textContent = edu.degree;
    if (edu.current) {
      const badge = makeEl('span', {
        className: 'education-current-badge',
        text: 'Current',
        attrs: { 'aria-label': 'Currently enrolled' },
      });
      degree.appendChild(badge);
    }
    degreeWrap.appendChild(degree);

    // Institution
    const institution = makeEl('p', {
      className: 'education-institution',
      text: edu.institution,
    });

    // Detail (CGPA / percentage)
    const detail = makeEl('span', {
      className: 'education-detail',
      text: edu.detail,
    });

    item.appendChild(period);
    item.appendChild(degreeWrap);
    item.appendChild(institution);
    item.appendChild(detail);
    container.appendChild(item);

    // Stagger reveal via IntersectionObserver
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('is-visible');
            }, index * 120);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    obs.observe(item);
  });
}

/* ============================================================
   6. ACHIEVEMENTS RENDERING
   ============================================================ */

function renderAchievements() {
  const listContainer = document.getElementById('achievements-list');
  const certContainer = document.getElementById('certifications-list');

  // ---- Achievements ----
  if (listContainer && PROFILE.achievements) {
    PROFILE.achievements.forEach(item => {
      const li = makeEl('li', {
        className: 'achievement-item',
        attrs: { 'data-type': item.type },
      });

      const dot = makeEl('span', {
        className: 'achievement-type-dot',
        attrs: { 'aria-hidden': 'true' },
      });

      const textWrap = makeEl('div', {});
      const label = makeEl('p', { className: 'achievement-label', text: item.label });
      const value = makeEl('p', { className: 'achievement-value', text: item.value });
      textWrap.appendChild(label);
      textWrap.appendChild(value);

      li.appendChild(dot);
      li.appendChild(textWrap);
      listContainer.appendChild(li);
    });
  }

  // ---- Certifications ----
  if (certContainer && PROFILE.certifications) {
    PROFILE.certifications.forEach(cert => {
      const card = makeEl('div', { className: 'cert-card' });

      const name   = makeEl('p', { className: 'cert-name',   text: cert.name   });
      const issuer = makeEl('p', { className: 'cert-issuer', text: cert.issuer });

      card.appendChild(name);
      card.appendChild(issuer);

      // View Certificate link — only rendered when a file path is present in PROFILE
      if (cert.file) {
        const link = makeEl('a', {
          className: 'cert-link',
          text: 'View Certificate ↗',
          attrs: {
            href: cert.file,
            target: '_blank',
            rel: 'noopener noreferrer',
            'aria-label': `View ${cert.name} certificate (opens in new tab)`,
          },
        });
        card.appendChild(link);
      }

      certContainer.appendChild(card);
    });
  }
}

/* ============================================================
   7. CODING PROFILES RENDERING
   ============================================================ */

function renderProfiles() {
  const container = document.getElementById('profiles-grid');
  if (!container || !PROFILE.codingProfiles) return;

  PROFILE.codingProfiles.forEach((profile, index) => {
    const isLink = !!profile.url;

    const card = makeEl(isLink ? 'a' : 'div', {
      className: `profile-card${isLink ? '' : ' profile-card-static'}`,
    });

    if (isLink) {
      card.setAttribute('href', profile.url);
      card.setAttribute('target', '_blank');
      card.setAttribute('rel', 'noopener noreferrer');
      card.setAttribute(
        'aria-label',
        `Visit ${profile.platform} profile (opens in new tab)`
      );
    }

    const platformName = makeEl('p', {
      className: 'profile-platform-name',
      text: profile.platform,
    });

    const username = makeEl('p', {
      className: 'profile-username',
      text: profile.username,
    });

    const desc = makeEl('p', {
      className: 'profile-desc',
      text: profile.description,
    });

    card.appendChild(platformName);
    card.appendChild(username);
    card.appendChild(desc);

    if (isLink) {
      const visitLabel = makeEl('span', {
        className: 'profile-visit-label',
        text: 'Visit Profile →',
        attrs: { 'aria-hidden': 'true' },
      });
      card.appendChild(visitLabel);
    }

    // Apply stagger delay via inline style so transition is CSS-driven, not timer-driven.
    // This avoids the race where cards stay invisible if the section is already in the viewport.
    card.style.transitionDelay = `${index * 0.1}s`;

    container.appendChild(card);
  });

  // Single observer for all profile cards — no setTimeout race condition.
  const profileObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Clear the stagger delay after it plays so hover transitions aren't delayed.
          entry.target.addEventListener('transitionend', () => {
            entry.target.style.transitionDelay = '';
          }, { once: true });
          profileObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  container.querySelectorAll('.profile-card').forEach(card => profileObserver.observe(card));
}

/* ============================================================
   8. ABOUT PHOTO — graceful handling
   ============================================================ */

function initAboutPhoto() {
  const frame = document.getElementById('about-photo-frame');
  if (!frame) return;

  // Try to load a profile image from assets/images/
  // Supports both .jpg and .png — checks png first since that's the actual file.
  const imgSrc = 'assets/images/profile.png';
  const img = new Image();

  img.onload = () => {
    // Image exists — replace placeholder with the real photo
    frame.innerHTML = '';
    img.alt = `${PROFILE.name.full} — profile photo`;
    img.className = 'about-profile-img';
    frame.appendChild(img);
  };

  img.onerror = () => {
    // Image not available — keep the initials placeholder (already in HTML)
  };

  img.src = imgSrc;
}

/* ============================================================
   9. FOOTER YEAR
   ============================================================ */

function setFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ============================================================
   10. SMOOTH SCROLL for anchor links
       (Polyfill for browsers that don't support CSS scroll-behavior)
   ============================================================ */

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();

      const navHeight = document.getElementById('nav-header')?.offsetHeight || 64;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ============================================================
   11. DOCUMENT META (from PROFILE)
   ============================================================ */

function setDocumentMeta() {
  if (!PROFILE.meta) return;
  document.title = PROFILE.meta.pageTitle;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', PROFILE.meta.description);
}

/* ============================================================
   12. INIT — run everything on DOMContentLoaded
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  setDocumentMeta();
  initNav();
  initScrollReveal();
  renderSkills();
  renderProjects();
  renderEducation();
  renderAchievements();
  renderProfiles();
  initAboutPhoto();
  setFooterYear();
  initSmoothScroll();
});
