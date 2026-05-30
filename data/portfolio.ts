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

export const projects: Project[] = [
  {
    id: "audiosync",
    title: "AudioSync (Spotify Killer)",
    description: "A real-time acoustic & WAN time-synchronized music streaming client using NTP-like WebSocket offsets and BLE broadcasts.",
    longDescription: "A high-performance offline-first audio synchronization system. Features rapid acoustic consensus calibration using high-frequency microphone chirps to align multi-device playback down to sub-10ms offsets. Built-in BLE frame broadcast for offline party sync and local SQLite caches.",
    tech: ["Flutter/Dart", "WebSockets", "Bluetooth BLE", "Rust", "SQLite", "DSP (SoLoud)"],
    github: "https://github.com/TheInfamousTheta/AudioSync",
    demo: "https://demo.example.com/audiosync",
    stats: [
      { label: "Consensus Offset", value: "< 10ms" },
      { label: "Sync Medium", value: "BLE / WAN" },
      { label: "DSP Buffers", value: "Circular Mono" },
    ],
  },
  {
    id: "lexer",
    title: "Lexer & Tokenizer Engine",
    description: "A high-performance programming language lexer featuring state-machine based tokenization and AST generation.",
    longDescription: "A custom lexer supporting dynamic token mapping, string-to-token lexical conversions, and state-machine scanning. Built to generate abstract syntax trees (AST) with exceptional throughput, providing deep error boundary checks and native syntax highlighting structures.",
    tech: ["TypeScript", "Rust/WASM", "Lexing Systems", "Abstract Syntax Trees (AST)", "State Machines"],
    github: "https://github.com/TheInfamousTheta/Lexer-Tokenizer",
    demo: "https://demo.example.com/lexer",
    stats: [
      { label: "Throughput", value: "1.2 GB/s" },
      { label: "Token Types", value: "Dynamic Mapping" },
      { label: "Parser Depth", value: "Recursive" },
    ],
  },
  {
    id: "aetheric",
    title: "Aetheric Sound Streamer",
    description: "A professional real-time web audio streamer utilizing high-fidelity circular buffers and visualizers.",
    longDescription: "Constructed with low-latency Web Audio API nodes, circular sample buffers, and fast discrete Fourier transforms for high-fidelity interactive spectrum visualization. Seamlessly handles streaming fallback states.",
    tech: ["React/Next.js", "Web Audio API", "Web Workers", "Canvas API", "TypeScript"],
    github: "https://github.com/TheInfamousTheta/Aetheric-Audio-Streamer",
    demo: "https://demo.example.com/aetheric",
    stats: [
      { label: "Buffer Latency", value: "24ms" },
      { label: "FPS Render", value: "60fps Canvas" },
      { label: "Sample Rate", value: "48kHz" },
    ],
  },
];

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
