/**
 * chatbot.js — Portfolio AI Assistant
 *
 * Architecture:
 *  - Rule-based NLP with scored intent detection
 *  - Pipeline: raw input → normalise → synonym expand → score all intents → pick winner
 *  - Specific project detection via keyword + dynamic tech/description search
 *  - All factual data sourced exclusively from PROFILE (profile.js)
 *  - No external API, no backend, works fully offline
 *  - getBotReply() is the single entry point — swap its body to call an LLM later
 *
 * Sections:
 *  1. Normalisation & text utilities
 *  2. Synonym expansion
 *  3. Intent definitions (signal sets)
 *  4. Scored intent matcher
 *  5. Project-specific matcher (keywords + tech + description search)
 *  6. Response generators (read from PROFILE only)
 *  7. getBotReply() — main entry point
 *  8. UI controller
 *  9. Init
 */

/* ============================================================
   GUARD
   ============================================================ */
if (typeof PROFILE === 'undefined') {
  console.error('[chatbot] PROFILE is not defined. Ensure profile.js loads before chatbot.js.');
}

/* ============================================================
   1. NORMALISATION & TEXT UTILITIES
   ============================================================ */

/**
 * Normalise raw input: lowercase, strip punctuation except apostrophes,
 * collapse whitespace.
 */
function normalise(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s']/g, ' ')  // strip punctuation but keep apostrophes for contractions
    .replace(/'/g, '')           // then remove apostrophes (what's → whats)
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Remove common English stop-words that carry no semantic signal.
 * Keeps domain-relevant short words like 'cv', 'ai', 'ml'.
 */
const STOP_WORDS = new Set([
  'a','an','the','is','are','was','were','be','been','being',
  'have','has','had','do','does','did','will','would','could','should',
  'may','might','shall','can','i','me','my','we','our','you','your',
  'he','him','his','she','her','they','them','their','it','its',
  'this','that','these','those','what','which','who','whom','whose',
  'when','where','why','how','all','any','both','each','few','more',
  'most','other','some','such','no','not','only','same','so','than',
  'too','very','just','but','and','or','if','in','on','at','to',
  'for','of','with','by','from','about','into','through','during',
  'before','after','above','below','up','down','out','off','over',
  'under','again','then','once','here','there','tell','show','give',
  'see','let','make','know','get','find','look','want','please',
  'me','us','s','d','t','re','ve','ll','m',
]);

/**
 * Return the list of meaningful tokens from a normalised string,
 * with stop-words removed.
 */
function meaningfulTokens(norm) {
  return norm.split(' ').filter(t => t.length > 0 && !STOP_WORDS.has(t));
}

/**
 * Check whether haystack contains ANY of the needle phrases/words.
 * Supports multi-word needles via simple substring check.
 * Short needles (< 4 chars) use word-boundary matching to avoid
 * false positives like 'hi' matching inside 'github'.
 */
function hasAny(haystack, needles) {
  return needles.some(n => {
    if (n.length < 4) {
      // Use word-boundary regex for short tokens
      return new RegExp('\\b' + n + '\\b').test(haystack);
    }
    return haystack.includes(n);
  });
}

/**
 * Count how many needles are found in haystack.
 * Uses word-boundary matching for short needles.
 * Used for scoring.
 */
function countMatches(haystack, needles) {
  return needles.filter(n => {
    if (n.length < 4) {
      return new RegExp('\\b' + n + '\\b').test(haystack);
    }
    return haystack.includes(n);
  }).length;
}

/* ============================================================
   2. SYNONYM EXPANSION
   Rewrite common variants to canonical forms before matching.
   This handles things like "CV" → "resume", "github account" → "github".
   ============================================================ */

const SYNONYM_MAP = [
  // Resume / CV variants
  [/\bcv\b/g,                        'resume'],
  [/\bcurriculum vitae\b/g,          'resume'],
  [/\bmy resume\b/g,                 'resume'],
  [/\bdownload resume\b/g,           'resume'],
  [/\bdownload cv\b/g,               'resume'],
  [/\bview resume\b/g,               'resume'],
  [/\bsee resume\b/g,                'resume'],
  // GitHub variants
  [/\bgit hub\b/g,                   'github'],
  [/\bgithub account\b/g,            'github'],
  [/\bgithub page\b/g,               'github'],
  [/\bsource code\b/g,               'github'],
  [/\bcode repo\b/g,                 'github'],
  [/\brepositories\b/g,              'github'],
  [/\brepository\b/g,                'github'],
  [/\bfind his code\b/g,             'github'],
  [/\bwhere.*code\b/g,               'github code'],
  [/\bfind.*code\b/g,                'github code'],
  // LeetCode variants
  [/\bleet code\b/g,                 'leetcode'],
  // CodeChef variants
  [/\bcode chef\b/g,                 'codechef'],
  // Education variants
  [/\bb\.?tech\b/g,                  'btech'],
  [/\bvnrvjiet\b/g,                  'vnr'],
  [/\bvjiet\b/g,                     'vnr'],
  [/\buniversity\b/g,                'college'],
  [/\buni\b/g,                       'college'],
  [/\binstitution\b/g,               'college'],
  [/\bqualification\b/g,             'education'],
  [/\bdegree\b/g,                    'education degree'],
  // Skills variants
  [/\bprogramming languages?\b/g,    'languages skills'],
  [/\btech stack\b/g,                'skills technologies'],
  [/\btechnologies\b/g,              'technologies'],
  [/\babilities\b/g,                 'skills'],
  [/\bexpertise\b/g,                 'skills'],
  // Projects variants
  [/\bworked on\b/g,                 'built projects'],
  [/\bhas built\b/g,                 'built projects'],
  [/\bhas made\b/g,                  'built projects'],
  [/\bhas developed\b/g,             'developed projects'],
  [/\bhis work\b/g,                  'projects work'],
  [/\bhis projects\b/g,              'projects'],
  [/\bshow me\b/g,                   'show'],
  // Contact variants
  [/\breach out\b/g,                 'contact'],
  [/\bget in touch\b/g,              'contact'],
  [/\bmessage him\b/g,               'contact'],
  [/\bhow to contact\b/g,            'contact'],
  [/\bhow can i reach\b/g,           'contact reach'],
  [/\bcan i reach\b/g,               'contact reach'],
  [/\breach abhipray\b/g,            'contact reach'],
  [/\bhow can i contact\b/g,         'contact'],
  [/\bemail address\b/g,             'email contact'],
  [/\bphone number\b/g,              'phone contact'],
  // About variants
  [/\bwho is\b/g,                    'about who'],
  [/\bwhos\b/g,                      'about who'],
  [/\bintroduce\b/g,                 'about introduce'],
  [/\bintroduction\b/g,              'about'],
  [/\babout him\b/g,                 'about'],
  [/\btell me about abhipray\b/g,    'about'],
  // Interests variant
  [/\bareas of interest\b/g,         'interests'],
  [/\bpassions?\b/g,                 'interests'],
  // Achievements variants
  [/\baccomplishments?\b/g,          'achievements'],
  [/\bhackathons?\b/g,               'achievements hackathon'],
  [/\bcompetitions?\b/g,             'achievements competition'],
  [/\bparticipat/g,                  'achievements participated'],
  // CGPA / grades
  [/\bacademic performance\b/g,      'cgpa grades'],
  [/\bhow did he score\b/g,          'cgpa grades'],
  [/\bmarks\b/g,                     'cgpa grades'],
  [/\bpercentage\b/g,                'cgpa grades'],
  [/\bgpa\b/g,                       'cgpa'],
];

/**
 * Apply all synonym rewrites to an already-normalised string.
 * Returns an expanded string for use in matching.
 */
function expandSynonyms(norm) {
  let result = norm;
  for (const [pattern, replacement] of SYNONYM_MAP) {
    result = result.replace(pattern, replacement);
  }
  return result.replace(/\s+/g, ' ').trim();
}

/* ============================================================
   3. INTENT DEFINITIONS
   Each intent has:
     - id
     - keywords:  exact substring signals (any match scores +2)
     - phrases:   multi-word signals matched on expanded string (scores +3)
     - tokens:    single meaningful-word signals (scores +1)
   Higher total score wins. Minimum score of 1 required to fire an intent.
   ============================================================ */

const INTENT_DEFS = [
  {
    id: 'greeting',
    keywords: ['hello', 'hi', 'hey', 'howdy', 'greetings', 'hiya', 'sup', 'yo'],
    phrases:  ['good morning', 'good afternoon', 'good evening', 'whats up'],
    tokens:   [],
  },
  {
    id: 'thanks',
    keywords: ['thank', 'thanks', 'thx', 'ty', 'appreciate', 'cheers'],
    phrases:  ['thank you'],
    tokens:   [],
  },
  {
    id: 'bye',
    keywords: ['bye', 'goodbye', 'later', 'cya', 'farewell'],
    phrases:  ['see you', 'take care'],
    tokens:   [],
  },
  {
    id: 'about',
    keywords: ['abhipray', 'about', 'introduce', 'himself'],
    phrases:  ['who is', 'about who', 'about introduce', 'tell me about', 'who he is'],
    tokens:   [],
  },
  {
    id: 'skills',
    keywords: ['skill', 'skills', 'languages', 'technologies', 'tools', 'abilities', 'expertise'],
    phrases:  ['tech stack', 'languages skills', 'skills technologies', 'what can he code',
               'what does he know', 'what can he do', 'what tools', 'programming language'],
    tokens:   ['python', 'javascript', 'html', 'sql', 'coding', 'code', 'language'],
  },
  {
    id: 'projects',
    keywords: ['projects', 'project', 'built', 'developed', 'created', 'portfolio'],
    phrases:  ['built projects', 'developed projects', 'projects work', 'show projects',
               'his projects', 'what has he', 'what has abhipray', 'worked on',
               'has built', 'has developed', 'what did he build', 'what did he create'],
    tokens:   ['work', 'works', 'builds', 'makes'],
  },
  {
    id: 'education',
    keywords: ['education', 'college', 'studying', 'study', 'btech', 'vnr', 'academic',
               'school', 'degree'],
    phrases:  ['where does he study', 'what is he studying', 'what degree',
               'education degree', 'where he studies', 'which college', 'which university'],
    tokens:   ['class', 'year', 'semester'],
  },
  {
    id: 'cgpa',
    keywords: ['cgpa', 'grades', 'grade', 'score', 'result', 'marks', 'gpa'],
    phrases:  ['cgpa grades', 'academic score', 'how did he score', 'what is his cgpa',
               'what are his grades', 'what is his gpa'],
    tokens:   [],
  },
  {
    id: 'achievements',
    keywords: ['achievements', 'achievement', 'hackathon', 'competition', 'participated',
               'participation', 'convergence', 'webcraft', 'event', 'events'],
    phrases:  ['achievements participated', 'achievements hackathon', 'achievements competition',
               'vibe coding', 'ml challenge', 'ai week'],
    tokens:   ['workshops', 'contest', 'contests'],
  },
  {
    id: 'certifications',
    keywords: ['certification', 'certifications', 'certified', 'certificate', 'certificates', 'kaggle'],
    phrases:  ['python certification', 'kaggle python', 'certificate from'],
    tokens:   [],
  },
  {
    id: 'github',
    keywords: ['github'],
    phrases:  ['github profile', 'find his code', 'where is his code', 'his github',
               'show github', 'github account', 'source code', 'code repo',
               'find his github', 'where can i find', 'github code'],
    tokens:   ['repo', 'repos'],
  },
  {
    id: 'leetcode',
    keywords: ['leetcode'],
    phrases:  ['leetcode profile', 'his leetcode', 'show leetcode'],
    tokens:   [],
  },
  {
    id: 'codechef',
    keywords: ['codechef'],
    phrases:  ['codechef rating', 'his codechef', 'competitive rating', 'chef rating'],
    tokens:   ['rating'],
  },
  {
    id: 'profiles',
    keywords: ['profiles', 'profile', 'online', 'links'],
    phrases:  ['coding profiles', 'coding profile', 'online profiles', 'find him online',
               'where can i find him'],
    tokens:   [],
  },
  {
    id: 'resume',
    keywords: ['resume'],
    phrases:  ['his resume', 'see resume', 'view resume', 'download resume',
               'abhiprays resume', 'abhipray resume', 'where is his resume',
               'i want to see'],
    tokens:   [],
  },
  {
    id: 'contact',
    keywords: ['contact', 'email', 'phone', 'linkedin', 'reach'],
    phrases:  ['how can i contact', 'how can i reach', 'get in touch', 'reach abhipray',
               'contact him', 'message him', 'email contact', 'phone contact',
               'what is his email', 'what is his phone', 'how to reach', 'how to contact',
               'contact reach'],
    tokens:   [],
  },
  {
    id: 'location',
    keywords: ['location', 'hyderabad', 'india'],
    phrases:  ['where is he', 'where does he live', 'where is abhipray', 'where he lives',
               'which city', 'which country'],
    tokens:   ['city', 'based', 'lives', 'from'],
  },
  {
    id: 'interests',
    keywords: ['interests', 'interest', 'passionate', 'likes'],
    phrases:  ['areas of interest', 'what does he like', 'what is he interested in',
               'what are his interests'],
    tokens:   ['hobbies', 'passion'],
  },
  {
    id: 'help',
    keywords: ['help', 'commands', 'options', 'menu', 'guide', 'assist'],
    phrases:  ['what can you do', 'what can i ask', 'what do you know', 'how do i use'],
    tokens:   [],
  },
];

/* ============================================================
   4. SCORED INTENT MATCHER
   ============================================================ */

/**
 * Score a single intent against the expanded + raw-normalised input.
 * Scoring:
 *   phrase match  = +3  (most specific)
 *   keyword match = +2
 *   token match   = +1  (loose, single word)
 *
 * @param {Object} intentDef
 * @param {string} expanded  synonym-expanded normalised string
 * @param {string} norm      original normalised string
 * @returns {number}
 */
function scoreIntent(intentDef, expanded, norm) {
  let score = 0;
  score += countMatches(expanded, intentDef.phrases)  * 3;
  score += countMatches(expanded, intentDef.keywords) * 2;
  score += countMatches(norm,     intentDef.keywords) * 2; // double-dip on raw too
  score += countMatches(expanded, intentDef.tokens)   * 1;
  return score;
}

/**
 * Run all intents through the scorer and return the one with the highest
 * score. Requires a minimum score of 2 to avoid noise matching.
 * Returns 'unknown' if no intent clears the threshold.
 *
 * @param {string} norm      normalised input
 * @param {string} expanded  synonym-expanded normalised input
 * @returns {string}  intent id
 */
function detectIntent(norm, expanded) {
  let best     = { id: 'unknown', score: 0 };
  const MIN_SCORE = 2;

  for (const def of INTENT_DEFS) {
    const s = scoreIntent(def, expanded, norm);
    if (s > best.score) {
      best = { id: def.id, score: s };
    }
  }

  return best.score >= MIN_SCORE ? best.id : 'unknown';
}

/* ============================================================
   5. PROJECT-SPECIFIC MATCHER
   Checks in priority order:
     1. PROFILE.projects[].keywords  (explicit list in profile.js)
     2. Project technologies array   (e.g. "Librosa", "Streamlit")
     3. Project title words
     4. Project description words
   Returns the matched project or null.
   ============================================================ */

/**
 * Normalise a string for tech/description matching
 * (lowercase, no punctuation).
 */
function normForProject(str) {
  return str.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Try to match the user's input to a specific project.
 * @param {string} norm      normalised user input
 * @param {string} expanded  synonym-expanded input
 * @returns {Object|null}  matched PROFILE project or null
 */
function matchSpecificProject(norm, expanded) {
  // 1. Explicit keyword list on each project
  for (const project of PROFILE.projects) {
    if (project.keywords && project.keywords.some(kw => norm.includes(kw))) {
      return project;
    }
  }

  // 2. Technology name match — search dynamically in PROFILE.projects[].technologies
  //    This handles "which project uses Librosa?", "projects using Streamlit", etc.
  for (const project of PROFILE.projects) {
    for (const tech of project.technologies) {
      const techNorm = normForProject(tech);
      // Only match if tech name is at least 3 chars (avoids matching "c" etc.)
      if (techNorm.length >= 3 && norm.includes(techNorm)) {
        return project;
      }
    }
  }

  // 3. Project title words (split title into words, match any non-trivial word)
  for (const project of PROFILE.projects) {
    const titleWords = normForProject(project.title)
      .split(' ')
      .filter(w => w.length >= 4 && !STOP_WORDS.has(w));
    if (titleWords.some(w => norm.includes(w))) {
      return project;
    }
  }

  // 4. Description keyword scan — split description into meaningful words
  for (const project of PROFILE.projects) {
    const descWords = normForProject(project.description)
      .split(' ')
      .filter(w => w.length >= 5 && !STOP_WORDS.has(w));
    const userTokens = meaningfulTokens(norm).filter(w => w.length >= 5);
    if (userTokens.some(ut => descWords.includes(ut))) {
      return project;
    }
  }

  return null;
}

/**
 * Handle "which projects use X?" — a technology query that may match
 * multiple projects. Returns an array of matched projects.
 * @param {string} norm
 * @returns {Object[]}
 */
function matchProjectsByTech(norm) {
  // Only fires when the user is clearly asking about a technology
  const techQuerySignals = ['use', 'uses', 'using', 'built with', 'made with', 'which project'];
  if (!hasAny(norm, techQuerySignals)) return [];

  const matched = [];
  for (const project of PROFILE.projects) {
    for (const tech of project.technologies) {
      const techNorm = normForProject(tech);
      if (techNorm.length >= 3 && norm.includes(techNorm)) {
        if (!matched.includes(project)) matched.push(project);
        break;
      }
    }
  }
  return matched;
}

/* ============================================================
   6. RESPONSE GENERATORS
   All factual content read from PROFILE — nothing invented.
   ============================================================ */

const RESPONSES = {

  greeting() {
    const openers = ['Hi', 'Hello', 'Hey'];
    const g = openers[Math.floor(Math.random() * openers.length)];
    return `${g}! I'm Abhipray's portfolio assistant. Ask me about his projects, skills, education, resume, or coding profiles. What would you like to know?`;
  },

  thanks() {
    return "You're welcome! Feel free to ask anything else about Abhipray's portfolio.";
  },

  bye() {
    return "Goodbye! Thanks for visiting Abhipray's portfolio. 👋";
  },

  about() {
    const p = PROFILE;
    return (
      `<strong>${p.name.full}</strong> is a ${p.title} at ` +
      `${p.education[0].institution}, Hyderabad.\n\n` +
      `${p.tagline}\n\n` +
      `He's interested in programming, data analysis, machine learning, ` +
      `software development, and intelligent systems.`
    );
  },

  interests() {
    return (
      `Abhipray is interested in:\n\n` +
      `• Programming and software development\n` +
      `• Data analysis and data science\n` +
      `• Machine learning and intelligent systems\n` +
      `• Building practical tools that solve real-world problems`
    );
  },

  skills() {
    const s = PROFILE.skills;
    const fmt = arr => arr.join(', ');
    return (
      `Here's what Abhipray works with:\n\n` +
      `<strong>Languages:</strong> ${fmt(s.languages)}\n\n` +
      `<strong>Concepts:</strong> ${fmt(s.concepts)}\n\n` +
      `<strong>Tools &amp; Technologies:</strong> ${fmt(s.tools)}`
    );
  },

  projects() {
    const list = PROFILE.projects
      .map((p, i) => `${i + 1}. <strong>${p.title}</strong> — ${p.subtitle}`)
      .join('\n');
    return (
      `Abhipray has ${PROFILE.projects.length} selected projects:\n\n` +
      list +
      `\n\nAsk me about any specific project for more details!`
    );
  },

  specific_project(project) {
    const techs      = project.technologies.join(', ');
    const highlights = project.highlights.map(h => `• ${h}`).join('\n');
    return (
      `<strong>${project.title}</strong>\n` +
      `${project.subtitle}\n\n` +
      `${project.description}\n\n` +
      `<strong>Technologies:</strong> ${techs}\n\n` +
      `<strong>Key highlights:</strong>\n${highlights}\n\n` +
      `<a href="${project.github}" target="_blank" rel="noopener noreferrer">↗ View on GitHub</a>`
    );
  },

  multi_project(projects) {
    const list = projects
      .map(p => `• <strong>${p.title}</strong> — uses ${p.technologies.join(', ')}`)
      .join('\n');
    return (
      `${projects.length > 1 ? 'Multiple projects' : 'One project'} match${projects.length === 1 ? 'es' : ''} that:\n\n` +
      list +
      `\n\nAsk me about any of them for full details!`
    );
  },

  education() {
    const edu   = PROFILE.education;
    const lines = edu.map(e => (
      `<strong>${e.degree}</strong>\n` +
      `${e.institution} · ${e.period} · ${e.detail}` +
      (e.current ? ' <em>(Current)</em>' : '')
    )).join('\n\n');
    return `Abhipray's academic background:\n\n${lines}`;
  },

  cgpa() {
    const current = PROFILE.education.find(e => e.current);
    if (!current) return RESPONSES.education();
    return (
      `Abhipray is currently pursuing <strong>${current.degree}</strong> ` +
      `at ${current.institution}.\n\n` +
      `His current academic performance: <strong>${current.detail}</strong>`
    );
  },

  achievements() {
    const list = PROFILE.achievements
      .map(a => `• ${a.label} — ${a.value}`)
      .join('\n');
    return `Abhipray's achievements and participation:\n\n${list}`;
  },

  certifications() {
    const list = PROFILE.certifications
      .map(c => `• <strong>${c.name}</strong> — ${c.issuer}`)
      .join('\n');
    return `Abhipray's certifications and workshops:\n\n${list}`;
  },

  github() {
    const c       = PROFILE.contact;
    const repoList = PROFILE.projects
      .map(p => `• <a href="${p.github}" target="_blank" rel="noopener noreferrer">${p.title}</a>`)
      .join('\n');
    return (
      `Abhipray's GitHub profile:\n` +
      `<a href="${c.github}" target="_blank" rel="noopener noreferrer">${c.github}</a>\n\n` +
      `Project repositories:\n${repoList}`
    );
  },

  leetcode() {
    const url = PROFILE.contact.leetcode;
    return (
      `Abhipray's LeetCode profile:\n` +
      `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>\n\n` +
      `He uses LeetCode for competitive programming and problem solving practice.`
    );
  },

  codechef() {
    const rating = PROFILE.achievements.find(a => a.label === 'CodeChef Rating');
    return (
      `Abhipray's CodeChef rating: <strong>${rating ? rating.value : '840'}</strong>\n\n` +
      `He participates in CodeChef contests as part of competitive programming practice.`
    );
  },

  profiles() {
    const profs = PROFILE.codingProfiles;
    const lines = profs.map(p => {
      if (p.url) {
        return `• <strong>${p.platform}:</strong> <a href="${p.url}" target="_blank" rel="noopener noreferrer">${p.url}</a>`;
      }
      return `• <strong>${p.platform}:</strong> ${p.username}`;
    }).join('\n');
    return `Abhipray's online coding profiles:\n\n${lines}`;
  },

  resume() {
    return (
      `Abhipray's resume is available here:\n\n` +
      `<a href="assets/resume.pdf" target="_blank" rel="noopener noreferrer">↗ View Resume</a>  ·  ` +
      `<a href="assets/resume.pdf" download="Akuthota_Abhipray_Resume.pdf">⬇ Download Resume</a>`
    );
  },

  contact() {
    const c = PROFILE.contact;
    return (
      `Here's how to reach Abhipray:\n\n` +
      `📧 <strong>Email:</strong> <a href="mailto:${c.email}">${c.email}</a>\n` +
      `📞 <strong>Phone:</strong> ${c.phone}\n` +
      `🔗 <strong>LinkedIn:</strong> <a href="${c.linkedin}" target="_blank" rel="noopener noreferrer">akuthota-abhipray</a>\n` +
      `💻 <strong>GitHub:</strong> <a href="${c.github}" target="_blank" rel="noopener noreferrer">abhiprayakuthota1-pixel</a>`
    );
  },

  location() {
    return `Abhipray is based in <strong>${PROFILE.location}</strong>.`;
  },

  help() {
    return (
      `I can answer questions about Abhipray's portfolio! Try asking:\n\n` +
      `• <em>What projects has he worked on?</em>\n` +
      `• <em>Tell me about GrainGuard AI</em>\n` +
      `• <em>Which project uses Streamlit?</em>\n` +
      `• <em>What technologies does he know?</em>\n` +
      `• <em>What is his CGPA?</em>\n` +
      `• <em>Where does he study?</em>\n` +
      `• <em>What is his CodeChef rating?</em>\n` +
      `• <em>Show me his GitHub</em>\n` +
      `• <em>Can I see his resume?</em>\n` +
      `• <em>How can I contact him?</em>`
    );
  },

  unknown() {
    return (
      `I don't have that information in Abhipray's portfolio yet.\n\n` +
      `I can tell you about his <strong>projects</strong>, <strong>skills</strong>, ` +
      `<strong>education</strong>, <strong>resume</strong>, ` +
      `<strong>coding profiles</strong>, or <strong>contact details</strong>. ` +
      `Type <em>help</em> to see all options.`
    );
  },
};

/* ============================================================
   7. getBotReply() — MAIN ENTRY POINT
   Pipeline:
     raw → normalise → expandSynonyms
     → check tech-query multi-project match
     → check specific project match
     → score all intents → dispatch response
   @param {string} message  raw user input
   @returns {string}  HTML reply string
   ============================================================ */
function getBotReply(message) {
  if (!message || message.trim() === '') {
    return RESPONSES.help();
  }

  const norm     = normalise(message);
  const expanded = expandSynonyms(norm);

  // --- A. Technology-query: "which project uses Librosa?" ---
  // Check before specific-project so multi-match is handled cleanly.
  const techMatches = matchProjectsByTech(norm);
  if (techMatches.length > 1)  return RESPONSES.multi_project(techMatches);
  if (techMatches.length === 1) return RESPONSES.specific_project(techMatches[0]);

  // --- B. Specific project match ---
  const specificProject = matchSpecificProject(norm, expanded);
  if (specificProject) return RESPONSES.specific_project(specificProject);

  // --- C. Scored intent detection ---
  const intent  = detectIntent(norm, expanded);
  const handler = RESPONSES[intent];
  if (typeof handler === 'function') {
    return handler();
  }

  return RESPONSES.unknown();
}

/* ============================================================
   8. UI CONTROLLER
   (Unchanged from original — only the NLP layer above was reworked)
   ============================================================ */

const chatState = {
  isOpen: false,
  typingTimer: null,
};

let chatFab, chatWindow, chatMessages, chatInputForm,
    chatInput, chatSendBtn, chatCloseBtn, chatQuickReplies;

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function appendMessage(role, html) {
  const wrapper = document.createElement('div');
  wrapper.className = `chat-msg chat-msg--${role}`;

  const bubble = document.createElement('div');
  bubble.className = 'chat-msg-bubble';

  if (role === 'bot') {
    bubble.innerHTML = html.replace(/\n/g, '<br>');
  } else {
    bubble.textContent = html;
  }

  const timeEl = document.createElement('time');
  timeEl.className = 'chat-msg-time';
  timeEl.textContent = formatTime(new Date());
  timeEl.setAttribute('aria-label', `Sent at ${formatTime(new Date())}`);

  wrapper.appendChild(bubble);
  wrapper.appendChild(timeEl);
  chatMessages.appendChild(wrapper);
  scrollToBottom();
}

function showTyping() {
  removeTyping();
  const indicator = document.createElement('div');
  indicator.className = 'chat-typing';
  indicator.id = 'chat-typing-indicator';
  indicator.setAttribute('aria-label', 'Assistant is typing');
  indicator.innerHTML = `
    <span class="typing-dot" aria-hidden="true"></span>
    <span class="typing-dot" aria-hidden="true"></span>
    <span class="typing-dot" aria-hidden="true"></span>
  `;
  chatMessages.appendChild(indicator);
  scrollToBottom();
}

function removeTyping() {
  const existing = document.getElementById('chat-typing-indicator');
  if (existing) existing.remove();
}

function scrollToBottom() {
  if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
}

function openChat() {
  chatState.isOpen = true;
  chatWindow.classList.add('chat-window--open');
  chatFab.setAttribute('aria-expanded', 'true');
  chatFab.setAttribute('aria-label', 'Close chat assistant');
  const openIcon  = chatFab.querySelector('.chat-fab-open');
  const closeIcon = chatFab.querySelector('.chat-fab-close');
  if (openIcon)  openIcon.style.display  = 'none';
  if (closeIcon) closeIcon.style.display = '';
  setTimeout(() => chatInput && chatInput.focus(), 100);
  scrollToBottom();
}

function closeChat() {
  chatState.isOpen = false;
  chatWindow.classList.remove('chat-window--open');
  chatFab.setAttribute('aria-expanded', 'false');
  chatFab.setAttribute('aria-label', 'Open chat assistant');
  const openIcon  = chatFab.querySelector('.chat-fab-open');
  const closeIcon = chatFab.querySelector('.chat-fab-close');
  if (openIcon)  openIcon.style.display  = '';
  if (closeIcon) closeIcon.style.display = 'none';
}

function toggleChat() {
  chatState.isOpen ? closeChat() : openChat();
}

function handleUserMessage(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  appendMessage('user', trimmed);
  if (chatQuickReplies) chatQuickReplies.innerHTML = '';

  showTyping();
  const delay = Math.min(400 + trimmed.length * 8, 1200);

  chatState.typingTimer = setTimeout(() => {
    removeTyping();
    const reply = getBotReply(trimmed);
    appendMessage('bot', reply);
  }, delay);
}

function renderQuickReplies() {
  if (!chatQuickReplies) return;
  chatQuickReplies.innerHTML = '';

  const chips = [
    { label: 'Projects',  query: 'What projects has he worked on?' },
    { label: 'Skills',    query: 'What technologies does he know?' },
    { label: 'Resume',    query: 'Can I see his resume?'           },
    { label: 'GitHub',    query: 'Show me his GitHub'              },
    { label: 'Education', query: 'Where does he study?'            },
    { label: 'Contact',   query: 'How can I contact him?'          },
  ];

  chips.forEach(chip => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chat-quick-reply-btn';
    btn.textContent = chip.label;
    btn.setAttribute('aria-label', `Ask: ${chip.query}`);
    btn.addEventListener('click', () => handleUserMessage(chip.query));
    chatQuickReplies.appendChild(btn);
  });
}

/* ============================================================
   9. INIT
   ============================================================ */

function initChatbot() {
  chatFab          = document.getElementById('chat-fab');
  chatWindow       = document.getElementById('chat-window');
  chatMessages     = document.getElementById('chat-messages');
  chatInputForm    = document.getElementById('chat-input-form');
  chatInput        = document.getElementById('chat-input');
  chatSendBtn      = document.querySelector('.chat-send-btn');
  chatCloseBtn     = document.getElementById('chat-close-btn');
  chatQuickReplies = document.getElementById('chat-quick-replies');

  if (!chatFab || !chatWindow || !chatMessages || !chatInput) {
    console.warn('[chatbot] Required DOM elements not found. Chatbot disabled.');
    return;
  }

  chatFab.addEventListener('click', toggleChat);
  chatCloseBtn && chatCloseBtn.addEventListener('click', closeChat);

  chatInputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value;
    chatInput.value = '';
    handleUserMessage(text);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatState.isOpen) closeChat();
  });

  appendMessage(
    'bot',
    `Hi! I'm Abhipray's portfolio assistant. Ask me about his projects, skills, education, resume, or coding profiles.`
  );

  renderQuickReplies();
}

document.addEventListener('DOMContentLoaded', initChatbot);
