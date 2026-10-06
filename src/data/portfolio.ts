// ─────────────────────────────────────────────────────────────────────────────
// All portfolio content lives here. Both the 3D room and the classic view read
// from this file, so this is the only place you need to edit text.
// ─────────────────────────────────────────────────────────────────────────────

export type SkillLevel = "Learning" | "Comfortable" | "Advanced" | "Expert";

export interface Skill {
  name: string;
  level: SkillLevel;
}

export interface SkillGroup {
  category: string;
  /** Book colour on the shelf (hex). */
  color: string;
  skills: Skill[];
}

export interface Project {
  title: string;
  tagline: string;
  description: string;
  tech: string[];
  github?: string;
  live?: string;
  /** Accent colour for the project card (hex). */
  accent: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  points: string[];
}

export const profile = {
  name: "Sunil Kumar Sahoo",
  firstName: "Sunil",
  role: "Software Engineer",
  headline: "I build scalable web apps and the cloud they run on.",
  location: "Bhubaneswar, India",
  bio: [
    "I'm a software engineer with 1.5+ years of experience designing, building and deploying scalable web applications with Angular, React, Node.js and AWS. I care about performance, clean architecture and premium user experiences.",
    "I studied Electrical Engineering at NIT Rourkela, hold AWS Solutions Architect and CKA certifications, and reached Specialist on Codeforces after solving 1000+ competitive programming problems.",
  ],
  email: "sunilksahoo100@gmail.com",
  /** Put your resume at /public/resume.pdf and set this to "/resume.pdf". */
  resumeUrl: null as string | null,
  socials: [
    { label: "GitHub", url: "https://github.com/Sunilsahoo100" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/your-username" }, // TODO: your LinkedIn
  ],
  siteUrl: "https://your-portfolio.vercel.app", // TODO: set after deploying
};

export const projects: Project[] = [
  {
    title: "Enterprise Cloud Migration Platform",
    tagline: "Multi-cloud infrastructure automation",
    description:
      "A cloud infrastructure automation suite for multi-cloud resource orchestration. Serverless pipelines replicate 50TB+ of data with zero downtime, IaC cut resource deployment latency by 35%, and custom dashboards track cost optimisation in real time.",
    tech: ["Node.js", "AWS Lambda", "Terraform", "React.js"],
    github: "https://github.com/Sunilsahoo100/Enterprise-Cloud-Migration-Platform",
    accent: "#2dd4bf",
  },
  {
    title: "API Rate Limiting Gateway",
    tagline: "Token-bucket API gateway",
    description:
      "A lightweight API gateway with per-user and per-API token-bucket rate limiting that handles 1M+ requests a day with minimal latency overhead. Redis holds distributed state, JWT verifies identity, and policies update live through Spring Cloud Config and an admin UI.",
    tech: ["Spring Boot", "Redis", "JWT", "Spring Cloud Config", "React.js"],
    github: "https://github.com/Sunilsahoo100/API-Rate-Limiting-Gateway",
    accent: "#a78bfa",
  },
  {
    title: "AI Travel Planner",
    tagline: "Gemini-powered trip itineraries",
    description:
      "Generates day-by-day travel itineraries with hotel and place recommendations using Google Gemini. Includes Google sign-in, destination autocomplete via Google Places, and saved trip history in Firebase.",
    tech: ["React", "Gemini AI", "Firebase", "Google Places", "Tailwind CSS"],
    github: "https://github.com/Sunilsahoo100/Travel-planner",
    live: "https://smart-journey-sepia.vercel.app",
    accent: "#f472b6",
  },
  {
    title: "Quote Master",
    tagline: "AI quote app for mobile",
    description:
      "A cross-platform mobile app for discovering and generating quotes with AI, with a feed, chat and profile screens. Backed by an Express API with JWT authentication and MongoDB.",
    tech: ["React Native", "Expo", "Express", "MongoDB", "JWT", "Gemini AI"],
    github: "https://github.com/Sunilsahoo100/Quote-Master-Frontend",
    accent: "#fbbf24",
  },
  {
    title: "LinkUp",
    tagline: "Share photos and videos by link",
    description:
      "Upload photos or videos and share them through generated links. React frontend, Django backend for uploads and link generation, MySQL storage, and Docker Compose for dev and prod environments.",
    tech: ["React", "Django", "MySQL", "Docker"],
    github: "https://github.com/Sunilsahoo100/LinkUp",
    accent: "#60a5fa",
  },
  {
    title: "Vehicle Stoppage Visualizer",
    tagline: "Find and map vehicle stoppages",
    description:
      "A React web app that parses GPS trip data from CSV, identifies where a vehicle stopped, and visualises the route and stoppages on Google Maps with clustered markers.",
    tech: ["React", "TypeScript", "Google Maps", "PapaParse"],
    github: "https://github.com/Sunilsahoo100/Vehicle_Stoppage_Identification-_and_Visualization",
    live: "https://vehicle-stoppage-identification-and-visualization-tau.vercel.app",
    accent: "#34d399",
  },
  {
    title: "Bill Manager",
    tagline: "Expense tracking and budgeting",
    description:
      "Track, filter and edit bills, visualise monthly spending with charts, and use a budget calculator to find the bills that fit a budget. State is managed with Redux and persisted locally.",
    tech: ["React", "Redux", "Chart.js", "Tailwind CSS"],
    github: "https://github.com/Sunilsahoo100/Bill-Management",
    live: "https://bill-management-wheat.vercel.app",
    accent: "#fb923c",
  },
  {
    title: "Sukoon",
    tagline: "Stress-relief web app (hackathon)",
    description:
      "Built for the Hackofiesta hackathon under the Healthcare theme: an installable PWA with audio, reading, yoga and talking therapy resources, plus offline support.",
    tech: ["HTML", "CSS", "JavaScript", "PWA"],
    github: "https://github.com/Sunilsahoo100/Sukoon",
    live: "https://sukoon-stress-free.netlify.app",
    accent: "#e879f9",
  },
];

export const skillGroups: SkillGroup[] = [
  {
    category: "Frontend",
    color: "#2dd4bf",
    skills: [
      { name: "Angular", level: "Advanced" },
      { name: "TypeScript", level: "Advanced" },
      { name: "React.js", level: "Advanced" },
      { name: "Next.js", level: "Comfortable" },
      { name: "Redux", level: "Comfortable" },
      { name: "Tailwind CSS", level: "Advanced" },
    ],
  },
  {
    category: "Backend",
    color: "#a78bfa",
    skills: [
      { name: "Spring Boot", level: "Comfortable" },
      { name: "Node.js", level: "Advanced" },
      { name: "Express", level: "Advanced" },
      { name: "Python", level: "Comfortable" },
      { name: "Django", level: "Comfortable" },
      { name: "GraphQL", level: "Comfortable" },
    ],
  },
  {
    category: "Cloud & Database",
    color: "#f472b6",
    skills: [
      { name: "AWS", level: "Advanced" },
      { name: "Docker", level: "Advanced" },
      { name: "Kubernetes", level: "Advanced" },
      { name: "PostgreSQL", level: "Comfortable" },
      { name: "MongoDB", level: "Comfortable" },
    ],
  },
];

export const experience: Experience[] = [
  {
    role: "Software Engineer",
    company: "EvA - Evolutionary Algorithms",
    period: "Mar 2025 — Present",
    points: [
      "Architected a micro-frontend architecture using Angular and Webpack Module Federation, improving load times by 40%.",
      "Mentored a team of 5 junior engineers, conducting code reviews and technical deep dives.",
      "Optimized CI/CD pipelines, reducing deployment times by 25% across multiple environments.",
    ],
  },
  {
    role: "Trainee Engineer (Intern)",
    company: "Qualibar",
    period: "May 2024 — Jul 2024",
    points: [
      "Designed and implemented scalable RESTful APIs that handled over 10k requests per second during peak sale events.",
      "Integrated automated testing suites exceeding 90% coverage for mission-critical payment services.",
      "Collaborated with cross-functional product and design teams to deliver seamless checkout flows.",
    ],
  },
];

export const education = {
  degree: "B.Tech in Electrical Engineering",
  school: "NIT Rourkela",
  period: "2021 — 2025",
};

/** Shown when someone clicks the coffee mug. */
export const funFacts = [
  "This room is built entirely in code — no 3D models were downloaded.",
  "Fueled by coffee: roughly 3 cups per deployed feature.",
  "Try the day/night switch in the top-right corner.",
  "Favourite keyboard shortcut: Ctrl + Shift + P.",
  "Every book on the shelf is a skill. Hover them!",
];
