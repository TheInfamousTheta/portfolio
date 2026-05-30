import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProjectCard from '../components/ProjectCard';
import { personalDetails, projects, experiences } from '../data/portfolio';
import { Terminal, ArrowUpRight, Mail, Calendar, MapPin, Cpu, Database } from 'lucide-react';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 antialiased selection:bg-emerald-500 selection:text-white">
      
      {/* Sticky Header Nav */}
      <Navbar />

      <main className="flex-grow">
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="relative z-10 max-w-3xl">
              
              {/* Status Indicator */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs text-emerald-500 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                <span>Active Core: Offline-First & Parser Systems</span>
              </div>

              {/* Title */}
              <h1 className="font-mono text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-6">
                I build <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">low-latency</span> structures.
              </h1>

              {/* Sub-headline */}
              <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8 max-w-2xl">
                {personalDetails.bio} {personalDetails.detailedBio}
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-3 font-mono text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                >
                  <Cpu className="h-4 w-4" />
                  View Systems
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-5 py-3 font-mono text-sm font-semibold text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-black dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-white"
                >
                  <Mail className="h-4 w-4" />
                  Contact
                </a>
              </div>
            </div>

            {/* Subtle Terminal-inspired Background Grid */}
            <div className="absolute top-10 right-0 -z-10 hidden lg:block opacity-35 dark:opacity-20 pointer-events-none">
              <pre className="font-mono text-[10px] text-zinc-400 leading-normal select-none">
                {`// SYNTAX PARSER ROOT CHECK
[INIT] loading tokens...
TOKEN_TYPE: IDENTIFIER("PartySyncService")
TOKEN_TYPE: KEYWORD("class")
TOKEN_TYPE: BRACE_OPEN
  _serverClockOffset: 0
  _roundTripTime: 0
  _isAcousticSyncing: false

[CALIBRATING] consensus ping...
  tSelf: 17294729104
  tCross: 17294729148
  latency -> 22ms
  consensus offset calculated -> -14ms
  status: LOCKED

[COMPILING AST]
  └── Program
      └── ClassDeclaration (PartySyncService)
          ├── Field (wsChannel)
          └── Method (broadcastPlay)
              └── CallExpression (compensatedPlayback)`}
              </pre>
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="py-20 border-t border-zinc-200 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950/20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            
            {/* Section Header */}
            <div className="mb-12">
              <h2 className="font-mono text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Terminal className="h-5 w-5 text-emerald-500" />
                Featured Systems
              </h2>
              <p className="font-mono text-xs text-zinc-400 mt-1 uppercase tracking-widest">
                Source files / AST outputs / DSP controllers
              </p>
            </div>

            {/* Projects Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>

        {/* EXPERIENCE TIMELINE SECTION */}
        <section id="timeline" className="py-20 border-t border-zinc-200 dark:border-zinc-900">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            
            {/* Section Header */}
            <div className="mb-12">
              <h2 className="font-mono text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Database className="h-5 w-5 text-emerald-500" />
                Execution Log
              </h2>
              <p className="font-mono text-xs text-zinc-400 mt-1 uppercase tracking-widest">
                Professional history & compiler pipeline milestones
              </p>
            </div>

            {/* Timeline */}
            <div className="relative border-l border-zinc-200 dark:border-zinc-800 ml-4 md:ml-6 pl-6 md:pl-8 space-y-12">
              {experiences.map((exp, index) => (
                <div key={index} className="relative">
                  
                  {/* Timeline Node Dot */}
                  <span className="absolute -left-[31px] md:-left-[39px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white dark:bg-black border border-emerald-500/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  </span>

                  {/* Experience Card */}
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2">
                      <h3 className="font-mono text-lg font-bold text-zinc-900 dark:text-zinc-100">
                        {exp.role}
                      </h3>
                      <span className="text-zinc-400 font-mono text-sm">@ {exp.company}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{exp.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{personalDetails.location}</span>
                      </div>
                    </div>

                    {/* Timeline Points */}
                    <ul className="space-y-2 mb-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed list-disc list-outside pl-4">
                      {exp.points.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>

                    {/* Associated Technologies */}
                    {exp.techUsed && (
                      <div className="flex flex-wrap gap-1.5">
                        {exp.techUsed.map((tech) => (
                          <span
                            key={tech}
                            className="rounded bg-zinc-100 dark:bg-zinc-900/50 px-2 py-0.5 font-mono text-[9px] text-zinc-500 dark:text-zinc-400 border border-zinc-200/40 dark:border-zinc-800"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="py-20 border-t border-zinc-200 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950/20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            
            {/* Section Header */}
            <div className="mb-12">
              <h2 className="font-mono text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Cpu className="h-5 w-5 text-emerald-500" />
                Initialize Connection
              </h2>
              <p className="font-mono text-xs text-zinc-400 mt-1 uppercase tracking-widest">
                Port 80/443 handshake & raw mailbox routing
              </p>
            </div>

            {/* Terminal Mail Box */}
            <div className="max-w-2xl overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              
              {/* Terminal Window Header */}
              <div className="flex items-center gap-1.5 border-b border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
                <span className="h-3 w-3 rounded-full bg-red-400"></span>
                <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
                <span className="h-3 w-3 rounded-full bg-emerald-400"></span>
                <span className="ml-2 font-mono text-[10px] text-zinc-400 uppercase tracking-widest">shell_tunnel.sh</span>
              </div>

              {/* Terminal Window Body */}
              <div className="p-6 font-mono text-sm leading-relaxed">
                <p className="text-zinc-500 mb-1">// Route packets directly to Kaustubh's mailbox</p>
                <p className="mb-4">
                  <span className="text-emerald-500">$</span> ping -c 1 {personalDetails.email}
                </p>
                <p className="text-zinc-400 mb-6">
                  64 bytes from {personalDetails.email}: icmp_seq=1 ttl=64 time=4.20 ms <br />
                  --- connection handshake complete ---
                </p>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <a
                    href={`mailto:${personalDetails.email}`}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-5 py-3 font-mono text-xs font-bold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Mailto: {personalDetails.email}
                  </a>
                  
                  <div className="flex items-center gap-4 justify-center sm:justify-start">
                    <a
                      href={personalDetails.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                    >
                      <GithubIcon className="h-4 w-4" />
                      <span>GitHub</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                    <a
                      href={personalDetails.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                    >
                      <LinkedinIcon className="h-4 w-4" />
                      <span>LinkedIn</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
