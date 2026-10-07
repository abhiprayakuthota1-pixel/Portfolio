/**
 * main.js — Interactive Portfolio Controller & Renderer
 * Connects directly to PROFILE (js/profile.js).
 * NO video, NO audio, pure responsive client-side JavaScript.
 */

document.addEventListener('DOMContentLoaded', () => {
  initDocumentMeta();
  initScrollProgress();
  initNavigation();
  initHeroInteractions();
  initDeveloperIdCard();
  initSkillsPeriodicSystem();
  initProjectsShowcase();
  initCertifications();
  initEducationTimeline();
  initAchievements();
  initCodingProfiles();
  initDocumentHub();
  initContactInteractions();
  initScrollReveal();
  initSmoothScroll();
});

/* ============================================================
   1. DOCUMENT META
   ============================================================ */
function initDocumentMeta() {
  if (!window.PROFILE) return;
  document.title = PROFILE.meta?.pageTitle || `${PROFILE.name.full} — Portfolio`;
  const descTag = document.querySelector('meta[name="description"]');
  if (descTag && PROFILE.meta?.description) {
    descTag.setAttribute('content', PROFILE.meta.description);
  }
}

/* ============================================================
   2. SCROLL PROGRESS
   ============================================================ */
function initScrollProgress() {
  const fill = document.getElementById('scroll-progress-fill');
  if (!fill) return;

  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    fill.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* ============================================================
   3. NAVIGATION
   ============================================================ */
function initNavigation() {
  const header = document.getElementById('nav-header');
  const toggle = document.getElementById('nav-toggle');
  const overlay = document.getElementById('mobile-nav-overlay');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const navChatBtn = document.getElementById('nav-chat-btn');

  // Header scroll appearance
  const handleScroll = () => {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add('nav-scrolled');
    } else {
      header.classList.remove('nav-scrolled');
    }
    updateActiveSection();
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Active section spy
  function updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 120;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  // Mobile drawer toggle
  if (toggle && overlay) {
    const toggleMenu = (open) => {
      const isOpen = typeof open === 'boolean' ? open : !overlay.classList.contains('nav-open');
      overlay.classList.toggle('nav-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    toggle.addEventListener('click', () => toggleMenu());

    // Close on overlay links
    overlay.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('nav-open')) {
        toggleMenu(false);
      }
    });
  }

  // Nav Chat Button
  if (navChatBtn) {
    navChatBtn.addEventListener('click', () => {
      const chatFab = document.getElementById('chat-fab');
      if (chatFab) chatFab.click();
    });
  }
}

/* ============================================================
   4. HERO INTERACTIONS (Subtle Mouse Parallax & Tilt)
   ============================================================ */
function initHeroInteractions() {
  const container = document.getElementById('hero-frame-container');
  const frame = document.getElementById('hero-frame');
  if (!container || !frame) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (-y / rect.height) * 10;
    const rotateY = (x / rect.width) * 10;
    frame.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
  });

  container.addEventListener('mouseleave', () => {
    frame.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
}

/* ============================================================
   5. DEVELOPER ID CARD (3D Interactive Flip & Dynamic Data)
   ============================================================ */
function initDeveloperIdCard() {
  const card = document.getElementById('id-card-container');
  const flipPrompt = document.getElementById('id-flip-prompt');
  if (!card) return;

  const toggleFlip = () => {
    card.classList.toggle('is-flipped');
    const isFlipped = card.classList.contains('is-flipped');
    card.setAttribute('aria-pressed', String(isFlipped));
  };

  card.addEventListener('click', toggleFlip);
  if (flipPrompt) flipPrompt.addEventListener('click', toggleFlip);

  // Keyboard accessibility
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleFlip();
    }
  });

  // Dynamic back content
  const idStudentId = document.getElementById('id-card-roll');
  const idCgpa = document.getElementById('id-card-cgpa');
  const idDept = document.getElementById('id-card-dept');
  if (idStudentId) idStudentId.textContent = PROFILE.studentId || '25071A6673';
  if (idCgpa) idCgpa.textContent = `${PROFILE.cgpa} CGPA (Year 1)`;
  if (idDept) idDept.textContent = 'CSE – AI/ML';
}

/* ============================================================
   6. SKILLS — PERIODIC TABLE SYSTEM
   ============================================================ */
let activeCategory = 'all';

function initSkillsPeriodicSystem() {
  const gridContainer = document.getElementById('skills-periodic-grid');
  const filterButtons = document.querySelectorAll('.skills-filter-btn');
  if (!gridContainer || !PROFILE.skillsData) return;

  // Render elements
  const renderElements = (category) => {
    gridContainer.innerHTML = '';
    const filtered = category === 'all' 
      ? PROFILE.skillsData 
      : PROFILE.skillsData.filter(s => s.category === category);

    filtered.forEach((skill, idx) => {
      const tile = document.createElement('button');
      tile.className = 'element-tile reveal';
      tile.style.transitionDelay = `${idx * 0.03}s`;
      tile.setAttribute('type', 'button');
      tile.setAttribute('aria-label', `Skill: ${skill.name} (${skill.categoryName})`);
      tile.dataset.symbol = skill.symbol;

      let dotClass = 'dot-tools';
      if (skill.category === 'programming') dotClass = 'dot-programming';
      else if (skill.category === 'core') dotClass = 'dot-core';

      tile.innerHTML = `
        <div class="element-top">
          <span class="element-num">${skill.number}</span>
          <span class="element-category-dot ${dotClass}" aria-hidden="true"></span>
        </div>
        <div class="element-symbol">${skill.symbol}</div>
        <div class="element-name" title="${skill.name}">${skill.name}</div>
      `;

      tile.addEventListener('click', () => {
        document.querySelectorAll('.element-tile').forEach(t => t.classList.remove('is-selected'));
        tile.classList.add('is-selected');
        updateSkillInspector(skill);
      });

      gridContainer.appendChild(tile);
    });

    // Select the first tile by default
    if (filtered.length > 0) {
      const firstTile = gridContainer.querySelector('.element-tile');
      if (firstTile) {
        firstTile.classList.add('is-selected');
        updateSkillInspector(filtered[0]);
      }
    }

    // Trigger reveal visibility for newly added items
    requestAnimationFrame(() => {
      gridContainer.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    });
  };

  // Filter click handling
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.category || 'all';
      renderElements(activeCategory);
    });
  });

  // Initial render
  renderElements('all');
}

function updateSkillInspector(skill) {
  const symbolEl = document.getElementById('inspector-symbol');
  const titleEl = document.getElementById('inspector-title');
  const categoryEl = document.getElementById('inspector-category');
  const bodyEl = document.getElementById('inspector-body');
  const tagsContainer = document.getElementById('inspector-tags');

  if (symbolEl) symbolEl.textContent = skill.symbol;
  if (titleEl) titleEl.textContent = skill.name;
  if (categoryEl) categoryEl.textContent = `${skill.categoryName} · Atomic No. ${skill.number}`;
  if (bodyEl) bodyEl.textContent = skill.description;

  if (tagsContainer) {
    tagsContainer.innerHTML = '';
    (skill.projects || []).forEach(proj => {
      const tag = document.createElement('span');
      tag.className = 'tag tag-accent';
      tag.textContent = proj;
      tagsContainer.appendChild(tag);
    });
  }
}

/* ============================================================
   7. PROJECTS SHOWCASE (IMMERSIVE WORK SECTION)
   ============================================================ */
function initProjectsShowcase() {
  const container = document.getElementById('projects-showcase-container');
  if (!container || !PROFILE.projects) return;

  container.innerHTML = '';

  PROFILE.projects.forEach((proj) => {
    const article = document.createElement('article');
    article.className = 'project-item reveal';
    article.setAttribute('aria-label', `Project: ${proj.title}`);

    // Highlights HTML
    const highlightsHtml = proj.highlights.map(h => `
      <li class="project-highlight-item">
        <span class="highlight-bullet" aria-hidden="true">→</span>
        <span>${h}</span>
      </li>
    `).join('');

    // Tech tags HTML
    const stackHtml = proj.technologies.map(t => `
      <span class="tag">${t}</span>
    `).join('');

    // Pipeline / Media representation
    let mediaHtml = '';
    if (proj.hasVisualAsset && proj.assetImage) {
      mediaHtml = `
        <div class="project-visual-frame">
          <picture>
            <source srcset="${proj.assetImage}" type="image/webp">
            <img 
              src="${proj.assetImagePng || proj.assetImage}" 
              alt="${proj.title} System Diagram" 
              class="project-asset-img"
              loading="lazy"
            />
          </picture>
          <div class="project-visual-caption">
            <span>${proj.assetCaption}</span>
            <span class="tag tag-highlight">Architecture Diagram</span>
          </div>
        </div>
      `;
    } else {
      // Illustrative UI representation
      const stepsHtml = proj.conceptFlow.map((step, idx) => `
        <div class="pipeline-step">
          <div class="step-left">
            <span class="step-num">0${idx + 1}</span>
            <span class="step-label">${step.label}</span>
          </div>
          <span class="step-desc">${step.desc}</span>
        </div>
        ${idx < proj.conceptFlow.length - 1 ? '<div class="pipeline-arrow" aria-hidden="true">↓</div>' : ''}
      `).join('');

      mediaHtml = `
        <div class="illustrative-ui-container">
          <div class="illustrative-header">
            <span class="illustrative-badge">Illustrative UI</span>
            <span class="illustrative-status">Process Dataflow</span>
          </div>
          <div class="illustrative-pipeline">
            ${stepsHtml}
          </div>
        </div>
      `;
    }

    article.innerHTML = `
      <div class="project-info-column">
        <p class="project-index">PROJ / ${proj.index}</p>
        <h3 class="project-heading">${proj.title}</h3>
        <p class="project-subheading">${proj.subtitle}</p>
        <p class="project-description">${proj.description}</p>
        
        <ul class="project-highlights-list">
          ${highlightsHtml}
        </ul>

        <div class="project-stack-wrap">
          ${stackHtml}
        </div>

        <div class="project-footer-actions">
          <a 
            href="${proj.github}" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="btn btn-primary"
            aria-label="View ${proj.title} on GitHub (opens in new tab)"
          >
            View on GitHub ↗
          </a>
        </div>
      </div>

      <div class="project-media-column">
        ${mediaHtml}
      </div>
    `;

    container.appendChild(article);
  });
}

/* ============================================================
   8. CERTIFICATIONS
   ============================================================ */
function initCertifications() {
  const container = document.getElementById('certifications-container');
  if (!container || !PROFILE.certifications) return;

  container.innerHTML = '';

  PROFILE.certifications.forEach(cert => {
    const card = document.createElement('div');
    card.className = 'cert-card-editorial reveal';

    card.innerHTML = `
      <div>
        <div class="cert-top-row">
          <span class="cert-type-pill">${cert.badge}</span>
          <span class="cert-date">${cert.date}</span>
        </div>
        <h3 class="cert-title">${cert.name}</h3>
        <p class="cert-issuer-badge">${cert.issuer}</p>
        <p class="cert-description">${cert.description}</p>
      </div>
      <div class="cert-actions">
        <a 
          href="${cert.file}" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="btn btn-secondary"
          aria-label="View ${cert.name} PDF certificate in new tab"
        >
          View Certificate ↗
        </a>
        <a 
          href="${cert.file}" 
          download 
          class="tag"
          aria-label="Download ${cert.name} PDF certificate"
        >
          Download PDF
        </a>
      </div>
    `;

    container.appendChild(card);
  });
}

/* ============================================================
   9. EDUCATION TIMELINE
   ============================================================ */
function initEducationTimeline() {
  const container = document.getElementById('education-timeline-container');
  if (!container || !PROFILE.education) return;

  container.innerHTML = '';

  PROFILE.education.forEach(edu => {
    const item = document.createElement('div');
    item.className = `edu-timeline-item reveal ${edu.current ? 'is-current' : ''}`;

    item.innerHTML = `
      <div class="edu-time-label">
        <span class="edu-period">${edu.period}</span>
      </div>
      <div class="edu-card">
        <div class="edu-degree-header">
          <h3 class="edu-degree-title">${edu.degree}</h3>
          ${edu.current ? '<span class="tag tag-highlight">Current Enrollment</span>' : ''}
        </div>
        <p class="edu-institution-name">${edu.institution}</p>
        <div class="edu-meta-strip">
          <span><strong>Performance:</strong> ${edu.detail}</span>
          <span><strong>Location:</strong> ${edu.location}</span>
        </div>
        <p class="edu-notes">${edu.notes}</p>
      </div>
    `;

    container.appendChild(item);
  });
}

/* ============================================================
   10. ACHIEVEMENTS
   ============================================================ */
function initAchievements() {
  const container = document.getElementById('achievements-container');
  if (!container || !PROFILE.achievements) return;

  container.innerHTML = '';

  PROFILE.achievements.forEach(ach => {
    const card = document.createElement('div');
    card.className = 'achievement-card reveal';

    card.innerHTML = `
      <div class="achievement-card-top">
        <span class="achievement-type-badge">${ach.type}</span>
        <span class="achievement-val-badge">${ach.value}</span>
      </div>
      <h3 class="achievement-title">${ach.label}</h3>
      <p class="achievement-desc">${ach.detail}</p>
    `;

    container.appendChild(card);
  });
}

/* ============================================================
   11. CODING PROFILES
   ============================================================ */
function initCodingProfiles() {
  const container = document.getElementById('profiles-grid-container');
  if (!container || !PROFILE.codingProfiles) return;

  container.innerHTML = '';

  const getPlatformIcon = (platform) => {
    if (platform === 'GitHub') {
      return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>`;
    }
    if (platform === 'LeetCode') {
      return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8l4 4-4 4M8 8l-4 4 4 4"/></svg>`;
    }
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`;
  };

  PROFILE.codingProfiles.forEach(prof => {
    const card = document.createElement('div');
    card.className = 'profile-card-editorial reveal';

    card.innerHTML = `
      <div>
        <div class="profile-card-header">
          <div class="profile-brand-icon" aria-hidden="true">
            ${getPlatformIcon(prof.platform)}
          </div>
          <span class="tag">${prof.badge}</span>
        </div>
        <h3 class="profile-platform-title">${prof.platform}</h3>
        <p class="profile-username-tag">${prof.username}</p>
        <p class="profile-description-text">${prof.description}</p>
      </div>
      <div class="profile-card-footer">
        <span class="profile-metric-pill">${prof.metric}</span>
        ${prof.url ? `
          <a 
            href="${prof.url}" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="btn btn-secondary"
            aria-label="Visit ${prof.platform} profile (opens in new tab)"
          >
            Visit Profile ↗
          </a>
        ` : ''}
      </div>
    `;

    container.appendChild(card);
  });
}

/* ============================================================
   12. RESUME & DOCUMENT HUB
   ============================================================ */
function initDocumentHub() {
  const docList = document.getElementById('doc-hub-list');
  if (!docList) return;

  const docs = [
    {
      title: "Akuthota Abhipray — Resume",
      sub: "Authoritative Curriculum Vitae (PDF)",
      file: PROFILE.resume.path,
      type: "resume",
    },
    ...PROFILE.certifications.map(c => ({
      title: c.name,
      sub: `${c.issuer} · ${c.date}`,
      file: c.file,
      type: "certificate",
    }))
  ];

  docList.innerHTML = '';

  docs.forEach(doc => {
    const item = document.createElement('div');
    item.className = 'doc-hub-item';

    item.innerHTML = `
      <div>
        <p class="doc-item-title">${doc.title}</p>
        <p class="doc-item-sub">${doc.sub}</p>
      </div>
      <a 
        href="${doc.file}" 
        target="_blank" 
        rel="noopener noreferrer" 
        class="doc-item-link"
        aria-label="Open ${doc.title} in new tab"
      >
        Open ↗
      </a>
    `;

    docList.appendChild(item);
  });
}

/* ============================================================
   13. CONTACT INTERACTIONS (Copy Email with aria-live)
   ============================================================ */
function initContactInteractions() {
  const copyBtn = document.getElementById('copy-email-btn');
  const alertRegion = document.getElementById('copy-feedback-region');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    const email = PROFILE.contact.email;
    try {
      await navigator.clipboard.writeText(email);
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied ✓';
      copyBtn.classList.add('copied');
      if (alertRegion) alertRegion.textContent = 'Email address copied to clipboard.';

      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.classList.remove('copied');
        if (alertRegion) alertRegion.textContent = '';
      }, 2500);
    } catch (err) {
      // Fallback
      const input = document.createElement('input');
      input.value = email;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      copyBtn.textContent = 'Copied ✓';
      setTimeout(() => { copyBtn.textContent = 'Copy Email'; }, 2500);
    }
  });
}

/* ============================================================
   14. SCROLL REVEAL OBSERVER
   ============================================================ */
function initScrollReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ============================================================
   15. SMOOTH SCROLL FOR IN-PAGE ANCHORS
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
