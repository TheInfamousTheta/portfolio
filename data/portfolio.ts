export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  tech: string[];
  github?: string;
  demo?: string;
  stats?: { label: string; value: string }[];
}

export interface Experience {
  role: string;
  company: string;
  duration: string;
  points: string[];
  techUsed?: string[];
}

export interface PersonalDetails {
  name: string;
  role: string;
  location: string;
  bio: string;
  detailedBio: string;
  email: string;
  socials: {
    github: string;
    linkedin: string;
    twitter?: string;
  };
}

export const personalDetails: PersonalDetails = {
  name: "Kaustubh Goel",
  role: "Systems & Frontend Engineer",
  location: "India",
  bio: "Building low-latency compiler tooling, ultra-fast lexical parsers, and real-time offline-syncing audio architectures.",
  detailedBio: "I specialize in bridging the gap between low-level performance systems and responsive frontend applications. From implementing NTP-like acoustic time-sync protocols over WebSockets and Bluetooth Low Energy (BLE) to optimizing compiler lexer tokenizers for maximum throughput, I design software that is robust, fast, and completely offline-first.",
  email: "goelkaustubh2006@gmail.com",
  socials: {
    github: "https://github.com/TheInfamousTheta",
    linkedin: "https://www.linkedin.com/in/kaustubh-goel-8497a3313/",
  },
};

import projectsData from './projects.json';

export const projects: Project[] = projectsData as Project[];

export const experiences: Experience[] = [
  {
    role: "Lead Systems & Frontend Engineer",
    company: "Acoustic Networks & Streams",
    duration: "2024 - Present",
    points: [
      "Designed and implemented high-performance real-time audio synchronization protocols using BLE packet frames and NTP-like WebSocket delay estimation.",
      "Optimized frontend audio playbacks and DSP engines in distributed mobile/desktop structures, reaching consensus playback alignment in < 10ms.",
      "Engineered offline caching layers utilizing SQLite and local JSON indexes to allow full application usage under extreme network constraints.",
    ],
    techUsed: ["Flutter", "Dart", "TypeScript", "WebSockets", "BLE", "SQLite"],
  },
  {
    role: "Senior Compiler & Tooling Developer",
    company: "LexiTech Tooling Corp",
    duration: "2022 - 2024",
    points: [
      "Built a modular, highly extensible programming language lexer and tokenizer supporting custom token types, state-machine scanning, and strict parser boundaries.",
      "Integrated AST code generation tooling into active developer IDE environments, speeding up live type parsing and syntax coloring by 3.5x.",
      "Maintained modular React and Next.js developer dashboards displaying complex syntax-tree hierarchies in real time.",
    ],
    techUsed: ["TypeScript", "Rust/WASM", "Next.js", "AST", "React"],
  },
];
