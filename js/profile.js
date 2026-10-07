/**
 * profile.js — Single Source of Truth for Akuthota Abhipray's Portfolio.
 * Used across the website (main.js rendering, skill inspector, chatbot.js).
 * 
 * IMPORTANT CONSTRAINTS:
 * - Degree is strictly "CSE – AI/ML" (never "CSE – AIML & IoT")
 * - Seasonal Agriculture repository must use "Seasonal-Agriculture-Performance-Analysis-1"
 * - All documents reference stable project-relative asset paths.
 */

const PROFILE = {
  name: {
    full: "Akuthota Abhipray",
    short: "Abhipray",
    display: "AKUTHOTA ABHIPRAY",
    first: "AKUTHOTA",
    last: "ABHIPRAY",
  },

  role: "Computer Science Student · AI/ML",
  title: "Computer Science Student · AI/ML",
  tagline: "I build practical solutions through software, data, and intelligent systems.",
  
  bio: {
    intro: "I am a Computer Science student pursuing B.Tech in CSE – AI/ML at VNR Vignana Jyothi Institute of Engineering & Technology (VNR VJIET), Hyderabad.",
    body1: "I focus on developing practical, robust solutions across machine learning, exploratory data analysis, and software engineering. My work ranges from building multimodal early-warning systems for grain preservation to uncovering insights in real-world agricultural and automotive datasets.",
    body2: "Curious and detail-oriented, I combine algorithmic foundations in C, C++, and Python with modern development workflows. Currently in Year 1 with a 9.38 CGPA, I actively participate in hackathons, machine learning challenges, and technical symposiums.",
  },

  location: "Hyderabad, Telangana, India",
  studentId: "25071A6673",
  graduationYear: "2029",
  currentYear: "Year 1",
  cgpa: "9.38",

  contact: {
    email: "25071A6673@vnrvjiet.in",
    phone: "+91 72071 45235",
    phoneRaw: "7207145235",
    linkedin: "https://www.linkedin.com/in/akuthota-abhipray-38a91638b",
    github: "https://github.com/abhiprayakuthota1-pixel",
    leetcode: "https://leetcode.com/u/aDF0DRiCZl",
    codechef: "https://www.codechef.com",
    location: "Hyderabad, Telangana, India",
  },

  education: [
    {
      degree: "B.Tech in CSE – AI/ML",
      program: "Computer Science and Engineering – Artificial Intelligence & Machine Learning",
      institution: "VNR Vignana Jyothi Institute of Engineering & Technology (VNR VJIET)",
      short: "VNR VJIET",
      shortInstitution: "VNR VJIET",
      location: "Hyderabad, Telangana",
      period: "2025 – 2029",
      detail: "9.38 CGPA (Year 1)",
      cgpa: "9.38",
      current: true,
      notes: "Focusing on data structures, algorithms, mathematical foundations of machine learning, and systems programming.",
    },
    {
      degree: "Senior Secondary (Class XII)",
      program: "CBSE — Mathematics, Physics, Chemistry",
      institution: "Harvest Jr. College",
      shortInstitution: "Harvest Jr. College",
      location: "Hyderabad, Telangana",
      period: "2023 – 2025",
      detail: "89%",
      current: false,
      notes: "Completed Senior Secondary education with focus on science and mathematics.",
    },
    {
      degree: "Secondary (Class X)",
      program: "CBSE Curriculum",
      institution: "Harvest Public School",
      shortInstitution: "Harvest Public School",
      location: "Hyderabad, Telangana",
      period: "2022 – 2023",
      detail: "93.6%",
      current: false,
      notes: "Graduated with 93.6% distinction, establishing strong mathematical and analytical fundamentals.",
    },
  ],

  // Skills categorized with Periodic Table inspired metadata
  skillsData: [
    // Programming Languages
    {
      symbol: "Py",
      number: "01",
      name: "Python",
      category: "programming",
      categoryName: "Programming",
      description: "Primary language for ML, audio feature analysis, and data science workflows.",
      projects: ["GrainGuard AI", "Seasonal Agriculture", "Car Market Trends"],
    },
    {
      symbol: "C",
      number: "02",
      name: "C",
      category: "programming",
      categoryName: "Programming",
      description: "Low-level systems programming, memory management, and algorithmic problem solving.",
      projects: ["Core Problem Solving"],
    },
    {
      symbol: "C+",
      number: "03",
      name: "C++",
      category: "programming",
      categoryName: "Programming",
      description: "Object-oriented systems, high-performance data structures, and competitive coding.",
      projects: ["Competitive Programming"],
    },
    {
      symbol: "Js",
      number: "04",
      name: "JavaScript",
      category: "programming",
      categoryName: "Programming",
      description: "Modern ES6+ frontend development, interactive DOM rendering, and UI scripting.",
      projects: ["Portfolio Website", "Webcraft Workshop"],
    },
    {
      symbol: "H5",
      number: "05",
      name: "HTML",
      category: "programming",
      categoryName: "Programming",
      description: "Semantic HTML5 structure, accessibility (WCAG), and responsive layouts.",
      projects: ["Web Interfaces"],
    },
    {
      symbol: "Sq",
      number: "06",
      name: "SQL",
      category: "programming",
      categoryName: "Programming",
      description: "Relational database querying, structured data manipulation, and joins.",
      projects: ["Data Management"],
    },

    // Core Concepts
    {
      symbol: "Ds",
      number: "07",
      name: "Data Structures",
      category: "core",
      categoryName: "Core Concepts",
      description: "Arrays, linked lists, trees, graphs, sorting, searching, and algorithmic complexity.",
      projects: ["Competitive Programming", "Coursework"],
    },
    {
      symbol: "Oo",
      number: "08",
      name: "Object-Oriented Programming",
      category: "core",
      categoryName: "Core Concepts",
      description: "Encapsulation, inheritance, polymorphism, abstraction, and clean architecture.",
      projects: ["Software Architecture"],
    },
    {
      symbol: "Ml",
      number: "09",
      name: "Machine Learning",
      category: "core",
      categoryName: "Core Concepts",
      description: "Supervised learning, classification, Random Forest classifiers, feature engineering.",
      projects: ["GrainGuard AI", "AI WEEK Challenge"],
    },
    {
      symbol: "Da",
      number: "10",
      name: "Data Analysis",
      category: "core",
      categoryName: "Core Concepts",
      description: "Exploratory Data Analysis (EDA), statistical trends, hypothesis checking, and data cleansing.",
      projects: ["Seasonal Agriculture", "Car Market Trends"],
    },
    {
      symbol: "Fe",
      number: "11",
      name: "Frontend Development",
      category: "core",
      categoryName: "Core Concepts",
      description: "Responsive design, CSS grid/flexbox, state management, and modern user experiences.",
      projects: ["GrainGuard AI Dashboard", "Webcraft Workshop"],
    },

    // Tools & Technologies
    {
      symbol: "Gh",
      number: "12",
      name: "GitHub",
      category: "tools",
      categoryName: "Tools & Technologies",
      description: "Version control, branching workflows, collaborative open-source repositories.",
      projects: ["All Repositories"],
    },
    {
      symbol: "Vc",
      number: "13",
      name: "VS Code",
      category: "tools",
      categoryName: "Tools & Technologies",
      description: "Primary integrated development environment with extensions and terminal tooling.",
      projects: ["All Software Projects"],
    },
    {
      symbol: "Cl",
      number: "14",
      name: "Google Colab",
      category: "tools",
      categoryName: "Tools & Technologies",
      description: "Cloud-hosted GPU/CPU Jupyter notebooks for training models and data exploration.",
      projects: ["Machine Learning & EDA"],
    },
    {
      symbol: "Kg",
      number: "15",
      name: "Kaggle",
      category: "tools",
      categoryName: "Tools & Technologies",
      description: "Python certification, dataset exploration, community notebook competitions.",
      projects: ["Kaggle Python Certification"],
    },
    {
      symbol: "St",
      number: "16",
      name: "Streamlit",
      category: "tools",
      categoryName: "Tools & Technologies",
      description: "Rapid interactive dashboard framework for Python data science & ML deployment.",
      projects: ["GrainGuard AI"],
    },
    {
      symbol: "Pd",
      number: "17",
      name: "pandas",
      category: "tools",
      categoryName: "Tools & Technologies",
      description: "High-performance data frames, cleaning, grouping, aggregations, and tabular analysis.",
      projects: ["GrainGuard AI", "Seasonal Agriculture", "Car Market Trends"],
    },
    {
      symbol: "Np",
      number: "18",
      name: "NumPy",
      category: "tools",
      categoryName: "Tools & Technologies",
      description: "Multi-dimensional array computing, matrix operations, and vectorized math.",
      projects: ["GrainGuard AI", "Seasonal Agriculture", "Car Market Trends"],
    },
    {
      symbol: "Lb",
      number: "19",
      name: "Librosa",
      category: "tools",
      categoryName: "Tools & Technologies",
      description: "Audio and acoustic signal processing: MFCC extraction, spectrograms, waveforms.",
      projects: ["GrainGuard AI"],
    },
    {
      symbol: "Jn",
      number: "20",
      name: "Jupyter Notebook",
      category: "tools",
      categoryName: "Tools & Technologies",
      description: "Interactive computational notebook environment for reproducible data science.",
      projects: ["Seasonal Agriculture", "Car Market Trends"],
    },
  ],

  // Grouped skills for compatibility
  skills: {
    languages: ["C", "C++", "Python", "JavaScript", "HTML", "SQL"],
    concepts: ["Data Structures", "Object-Oriented Programming", "Frontend Development", "Data Analysis", "Machine Learning"],
    tools: [
      "GitHub",
      "VS Code",
      "Google Colab",
      "Kaggle",
      "Streamlit",
      "pandas",
      "NumPy",
      "Librosa",
      "Jupyter Notebook",
    ],
  },

  projects: [
    {
      id: "grainguard",
      index: "01",
      title: "GrainGuard AI",
      subtitle: "Multimodal Early-Warning Decision Support System",
      description:
        "A multimodal early-warning decision-support system for stored grain that combines acoustic activity, environmental deviation, and persistence into an explainable risk signal.",
      technologies: ["Python", "Random Forest", "Librosa", "Streamlit", "pandas", "NumPy", "Machine Learning"],
      highlights: [
        "Combines acoustic activity, environmental deviation, and persistence signals into one unified risk assessment.",
        "Acoustic inference pipeline extracting audio features with Librosa and evaluating them using a trained Random Forest model.",
        "Interactive Streamlit dashboard displaying risk metrics, waveform, spectrograms, and component breakdowns.",
        "Explainable weighted risk engine translating raw multi-sensor telemetry into clear preventive actions.",
      ],
      github: "https://github.com/abhiprayakuthota1-pixel/GrainGuard-AI",
      hasVisualAsset: true,
      assetImage: "assets/images/grainguard-comparison.webp",
      assetImagePng: "assets/images/grainguard-comparison.png",
      assetCaption: "GrainGuard AI — System Architecture & Acoustic Pipeline",
      conceptFlow: [
        { label: "Acoustic Activity", desc: "Sensor capture & Librosa audio feature extraction" },
        { label: "Machine Learning", desc: "Random Forest acoustic anomaly classifier" },
        { label: "Environmental Conditions", desc: "Temperature, moisture, and ambient deviation" },
        { label: "Persistence", desc: "Temporal signal tracking to filter false alarms" },
        { label: "Risk Signal", desc: "Explainable multi-tier early warning alert" },
      ],
      keywords: ["grain", "grainguard", "grain guard", "grain guard ai", "stored grain", "acoustic", "random forest", "librosa", "streamlit"],
    },
    {
      id: "agri-analysis",
      index: "02",
      title: "Seasonal Agriculture Performance Analysis",
      subtitle: "Exploratory Data Analysis & Seasonal Modeling",
      description:
        "A data analysis project focused on exploring agricultural performance, crop yield factors, and identifying operational patterns across seasonal cycles.",
      technologies: ["Python", "pandas", "NumPy", "Jupyter / Google Colab", "Data Visualization"],
      highlights: [
        "Analyzed multi-seasonal agricultural datasets to identify variance in performance indicators.",
        "Systematic data cleaning, missing-value imputation, and feature preparation pipelines.",
        "Exploratory data analysis (EDA) mapping seasonal cycles against agricultural yields.",
        "Synthesized findings through visual charts and tabular summaries for intuitive interpretation.",
      ],
      // Strictly using the required repository:
      github: "https://github.com/abhiprayakuthota1-pixel/Seasonal-Agriculture-Performance-Analysis-1",
      hasVisualAsset: false,
      conceptFlow: [
        { label: "Agricultural Data", desc: "Multi-parameter crop & climate observations" },
        { label: "Seasonal Patterns", desc: "Temporal variance across monsoon, winter, and summer cycles" },
        { label: "Analysis", desc: "Statistical distribution & feature correlation" },
        { label: "Insights", desc: "Actionable crop performance indicators" },
      ],
      keywords: ["agriculture", "seasonal", "farming", "crop", "agri", "agricultural performance", "yield", "seasonal patterns"],
    },
    {
      id: "car-market",
      index: "03",
      title: "Car Market Trends Analysis",
      subtitle: "Exploratory Vehicle Market Data Analysis",
      description:
        "A data analysis project exploring car market data from CarDekho and identifying relationships and trends in vehicle attributes, pricing, and mileage.",
      technologies: ["Python", "pandas", "NumPy", "Jupyter Notebook", "Data Visualization"],
      highlights: [
        "Performed exploratory analysis on CarDekho vehicle data to examine market pricing and fuel-type trends.",
        "Prepared and structured multi-variable vehicle records using Python-based data pipelines.",
        "Investigated correlations between age, odometer mileage, engine capacity, and depreciation.",
        "Communicated market insights through clear visual distributions and comparative tables.",
      ],
      github: "https://github.com/abhiprayakuthota1-pixel/Car-Market-Trends-Analysis",
      hasVisualAsset: false,
      conceptFlow: [
        { label: "Vehicle Data", desc: "Multi-attribute vehicle records from CarDekho" },
        { label: "Exploration", desc: "Data cleansing, distributions, and outlier handling" },
        { label: "Relationships", desc: "Depreciation correlation against age, fuel, & mileage" },
        { label: "Market Trends", desc: "Clear valuation patterns and pricing trends" },
      ],
      keywords: ["car", "vehicle", "market", "automobile", "auto", "car market", "trends", "cardekho"],
    },
  ],

  achievements: [
    { label: "CodeChef Rating", value: "840", type: "rating", detail: "Active participation in competitive programming contests" },
    { label: "Kaggle Python Certification", value: "Certified", type: "certification", detail: "Completed comprehensive Python programming course" },
    { label: "Vibe Coding Hackathon", value: "Participant", type: "hackathon", detail: "Built practical solutions during intensive coding sprint" },
    { label: "ML Challenge — AI WEEK", value: "Participant", type: "challenge", detail: "Tackled machine learning problem statements under AI WEEK" },
    { label: "AI Agents Workshop — CONVERGENCE 2K25", value: "Participant", type: "workshop", detail: "Hands-on workshop on autonomous AI agents at VNR VJIET" },
    { label: "Webcraft Workshop — CONVERGENCE 2K25", value: "Participant", type: "workshop", detail: "Modern frontend engineering and responsive design at VNR VJIET" },
  ],

  certifications: [
    {
      id: "kaggle-python",
      name: "Kaggle Python Certification",
      course: "Python Certificate of Completion",
      issuer: "Kaggle",
      date: "March 8, 2026",
      instructors: "Colin Morris (Kaggle Instructor), Alexis Cook (Head of Kaggle Learn)",
      description:
        "Successfully completed Kaggle's comprehensive Python curriculum covering language syntax, variables, functions, booleans, conditionals, lists, loops, strings, dictionaries, and external libraries.",
      file: "assets/certificates/Kaggle-Python.pdf",
      previewImage: "assets/images/kaggle-python-cert.webp",
      type: "certification",
      badge: "Verified Certification",
    },
    {
      id: "ai-agents-workshop",
      name: "AI Agents Workshop",
      course: "Certificate of Participation",
      issuer: "CONVERGENCE 2K25 · VNR VJIET",
      date: "February 2025",
      description:
        "Participated in hands-on technical workshop exploring autonomous AI agents, multi-agent coordination, prompt workflows, and practical applications in software systems at VNR VJIET's annual technical symposium.",
      file: "assets/certificates/AI-Agents-Workshop.pdf",
      type: "workshop",
      badge: "Technical Workshop",
    },
    {
      id: "webcraft-workshop",
      name: "Webcraft Workshop",
      course: "Certificate of Participation",
      issuer: "CONVERGENCE 2K25 · VNR VJIET",
      date: "February 2025",
      description:
        "Participated in modern web development workshop focused on front-end architecture, modern CSS techniques, responsive layouts, and interactive user interface development at VNR VJIET.",
      file: "assets/certificates/Webcraft-Workshop.pdf",
      type: "workshop",
      badge: "Technical Workshop",
    },
  ],

  codingProfiles: [
    {
      platform: "GitHub",
      username: "abhiprayakuthota1-pixel",
      url: "https://github.com/abhiprayakuthota1-pixel",
      description: "Open-source projects, machine learning models, and data analysis repositories",
      badge: "Primary Code Host",
      metric: "Active Repositories",
    },
    {
      platform: "LeetCode",
      username: "aDF0DRiCZl",
      url: "https://leetcode.com/u/aDF0DRiCZl",
      description: "Data structures, algorithmic problem solving, and competitive coding practice",
      badge: "Problem Solving",
      metric: "Active Practice",
    },
    {
      platform: "CodeChef",
      username: "Rating: 840",
      url: "https://www.codechef.com",
      description: "Competitive programming contests, algorithm optimization, and problem challenges",
      badge: "Contest Platform",
      metric: "Rating: 840",
    },
  ],

  resume: {
    path: "assets/resume.pdf",
    downloadName: "Akuthota_Abhipray_Resume.pdf",
    label: "Akuthota Abhipray — Resume (PDF)",
    lastUpdated: "October 2026",
    summary: "B.Tech CSE – AI/ML student at VNR VJIET (9.38 CGPA). Skilled in Python, C, C++, JavaScript, ML, Librosa, Streamlit, and Data Analysis.",
  },

  meta: {
    pageTitle: "Akuthota Abhipray — Creative Developer & AI/ML Engineer",
    description: "Personal portfolio of Akuthota Abhipray — B.Tech CSE – AI/ML student at VNR VJIET, Hyderabad. Practical solutions through software, data, and intelligent systems.",
  },
};

// Freeze object in non-production to ensure single source of truth integrity
if (typeof Object.freeze === 'function') {
  Object.freeze(PROFILE.contact);
  Object.freeze(PROFILE.name);
}
