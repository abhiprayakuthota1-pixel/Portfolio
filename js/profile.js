/**
 * profile.js — Single source of truth for all personal data.
 * Used by main.js (rendering) and chatbot.js (responses).
 * DO NOT duplicate profile information elsewhere.
 */

const PROFILE = {
  name: {
    full: "Akuthota Abhipray",
    short: "Abhipray",
    display: "AKUTHOTA ABHIPRAY",
    first: "AKUTHOTA",
    last: "ABHIPRAY",
  },

  title: "Computer Science Student | AI/ML ",

  tagline: "I build practical solutions through software, data, and intelligent systems.",

  location: "Hyderabad, Telangana, India",

  contact: {
    email: "25071A6673@vnrvjiet.in",
    phone: "7207145235",
    linkedin: "https://www.linkedin.com/in/akuthota-abhipray-38a91638b",
    github: "https://github.com/abhiprayakuthota1-pixel",
    leetcode: "https://leetcode.com/u/aDF0DRiCZl",
  },

  about: `I'm a Computer Science student pursuing B.Tech in CSE – AI/ML at VNR Vignana Jyothi Institute of Engineering & Technology (VNR VJIET), Hyderabad. I'm interested in programming, data analysis, machine learning, software development, and intelligent systems.

I enjoy building practical, hands-on projects that solve real-world problems — whether through data exploration, machine learning, or building useful software tools. I'm currently in the early years of my degree and actively working on developing my technical skills and portfolio.`,

  education: [
    {
      degree: "B.Tech — CSE – AI/ML ",
      institution: "VNR Vignana Jyothi Institute of Engineering & Technology",
      short: "VNR VJIET",
      period: "2025 – 2029",
      detail: "9.38 CGPA (Year 1)",
      current: true,
    },
    {
      degree: "Senior Secondary (Class XII)",
      institution: "Harvest Junior College",
      period: "2023 – 2025",
      detail: "89%",
      current: false,
    },
    {
      degree: "Secondary (Class X)",
      institution: "Harvest Public School",
      period: "2022 – 2023",
      detail: "93.6%",
      current: false,
    },
  ],

  skills: {
    languages: ["C", "C++", "Python", "JavaScript", "HTML", "SQL"],
    concepts: ["Data Structures", "Object-Oriented Programming", "Frontend Development"],
    tools: [
      "GitHub",
      "VS Code",
      "Google Colab",
      "Kaggle",
      "Streamlit",
      "pandas",
      "NumPy",
      "Librosa",
      "Machine Learning",
      "Data Analysis",
    ],
  },

  projects: [
    {
      id: "grainguard",
      title: "GrainGuard AI",
      subtitle: "Early-Warning Decision Support System",
      description:
        "A multimodal early-warning decision-support system for stored grain that combines acoustic activity, environmental deviation, and persistence into an explainable risk signal.",
      technologies: ["Python", "Random Forest", "Librosa", "Streamlit", "pandas", "NumPy", "Machine Learning"],
      highlights: [
        "Combines acoustic, environmental, and persistence signals into one risk assessment.",
        "Uses a trained Random Forest model for acoustic inference.",
        "Uses Librosa for extracting audio features.",
        "Provides an interactive Streamlit dashboard.",
        "Uses a weighted risk engine to make the final risk signal explainable.",
      ],
      github: "https://github.com/abhiprayakuthota1-pixel/GrainGuard-AI",
      keywords: ["grain", "grainguard", "grain guard", "grain guard ai", "stored grain", "acoustic", "random forest"],
    },
    {
      id: "agri-analysis",
      title: "Seasonal Agriculture Performance Analysis",
      subtitle: "Data Analysis Project",
      description:
        "A data analysis project focused on exploring agricultural performance and identifying patterns across seasons.",
      technologies: ["Python", "pandas", "NumPy", "Jupyter / Google Colab", "Data Visualization"],
      highlights: [
        "Works with agricultural data for analysis.",
        "Performs data cleaning and preparation.",
        "Explores seasonal patterns and agricultural performance.",
        "Uses exploratory data analysis to understand relationships in the data.",
        "Presents findings through visual and tabular analysis.",
      ],
      github: "https://github.com/abhiprayakuthota1-pixel/Seasonal-Agriculture-Performance-Analysis",
      keywords: ["agriculture", "seasonal", "farming", "crop", "agri", "agricultural performance"],
    },
    {
      id: "car-market",
      title: "Car Market Trends Analysis",
      subtitle: "Data Analysis Project",
      description:
        "A data analysis project exploring car market data and identifying relationships and trends in vehicle information.",
      technologies: ["Python", "pandas", "NumPy", "Jupyter Notebook", "Data Visualization"],
      highlights: [
        "Uses car market data for analysis.",
        "Performs data preparation and exploration.",
        "Examines relationships between vehicle-related attributes.",
        "Uses exploratory data analysis to identify market patterns.",
        "Visualizes important trends and findings.",
      ],
      github: "https://github.com/abhiprayakuthota1-pixel/Car-Market-Trends-Analysis",
      keywords: ["car", "vehicle", "market", "automobile", "auto", "car market", "trends"],
    },
  ],

  achievements: [
    { label: "CodeChef Rating", value: "840", type: "rating" },
    { label: "Kaggle Python Certification", value: "Certified", type: "certification" },
    { label: "Vibe Coding Hackathon", value: "Participant", type: "participation" },
    { label: "ML Challenge — AI WEEK", value: "Participant", type: "participation" },
    {
      label: "AI Agents Workshop — CONVERGENCE 2K25, VNR VJIET",
      value: "Participant",
      type: "workshop",
    },
    {
      label: "Webcraft Workshop — CONVERGENCE 2K25, VNR VJIET",
      value: "Participant",
      type: "workshop",
    },
  ],

  certifications: [
    {
      name: "Kaggle Python Certification",
      issuer: "Kaggle",
      type: "certification",
      file: "assets/certificates/Kaggle-Python.pdf",
    },
    {
      name: "AI Agents Workshop",
      issuer: "CONVERGENCE 2K25, VNR VJIET",
      type: "workshop",
      file: "assets/certificates/AI-Agents-Workshop.pdf",
    },
    {
      name: "Webcraft Workshop",
      issuer: "CONVERGENCE 2K25, VNR VJIET",
      type: "workshop",
      file: "assets/certificates/Webcraft-Workshop.pdf",
    },
  ],

  codingProfiles: [
    {
      platform: "GitHub",
      username: "abhiprayakuthota1-pixel",
      url: "https://github.com/abhiprayakuthota1-pixel",
      description: "Open-source projects and code repositories",
    },
    {
      platform: "LeetCode",
      username: "aDF0DRiCZl",
      url: "https://leetcode.com/u/aDF0DRiCZl",
      description: "Competitive programming and problem solving",
    },
    {
      platform: "CodeChef",
      username: "Rating: 840",
      url: null,
      description: "Competitive programming — current rating 840",
    },
  ],

  resume: {
    path: "assets/resume.pdf",
    label: "Akuthota Abhipray — Resume",
  },

  meta: {
    pageTitle: "Akuthota Abhipray | Computer Science Student",
    description:
      "Portfolio of Akuthota Abhipray — B.Tech CSE AI/ML student at VNR VJIET, Hyderabad. Interested in software development, data analysis, and machine learning.",
  },
};
