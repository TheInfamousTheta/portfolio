'use client';

import { useState, useEffect, useCallback } from 'react';
import { ShieldAlert, ShieldCheck, Lock, ArrowLeft, Edit, Trash2, Save, X, Cpu, ExternalLink, Activity } from 'lucide-react';
import Link from 'next/link';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

interface ProjectStat {
  label: string;
  value: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  tech: string[];
  github?: string;
  demo?: string;
  stats?: ProjectStat[];
}

export default function ProjectManager() {
  // Use lazy state initialization to prevent synchronous setState inside useEffect
  const [password, setPassword] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('dashboard_token') || '';
    }
    return '';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !!sessionStorage.getItem('dashboard_token');
    }
    return false;
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form states
  const [formId, setFormId] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formLongDescription, setFormLongDescription] = useState('');
  const [formTech, setFormTech] = useState('');
  const [formGithub, setFormGithub] = useState('');
  const [formDemo, setFormDemo] = useState('');
  
  // Custom stats states (up to 3 stats)
  const [stat1Label, setStat1Label] = useState('');
  const [stat1Value, setStat1Value] = useState('');
  const [stat2Label, setStat2Label] = useState('');
  const [stat2Value, setStat2Value] = useState('');
  const [stat3Label, setStat3Label] = useState('');
  const [stat3Value, setStat3Value] = useState('');

  // Authenticate user
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/projects', { method: 'GET' });
      const data = await res.json();

      if (res.ok && password === 'KaUsTuBh2006') {
        setIsAuthenticated(true);
        setProjects(data.projects);
        sessionStorage.setItem('dashboard_token', password);
      } else {
        setError('Access Denied: Invalid passcode');
      }
    } catch {
      setError('Connection failure: Unable to reach endpoint');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch projects list
  const loadProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (res.ok && data.success) {
        setProjects(data.projects);
      }
    } catch {
      console.error('Failed to load projects');
    }
  }, []);

  // Set up loading triggers
  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        loadProjects();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, loadProjects]);

  // Log out / Lock
  const handleLock = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('dashboard_token');
    }
    setPassword('');
    setIsAuthenticated(false);
    setProjects([]);
  };

  // Populate form for editing
  const startEdit = (proj: Project) => {
    setEditingProject(proj);
    setFormId(proj.id);
    setFormTitle(proj.title);
    setFormDescription(proj.description);
    setFormLongDescription(proj.longDescription || '');
    setFormTech(proj.tech.join(', '));
    setFormGithub(proj.github || '');
    setFormDemo(proj.demo || '');
    
    // Populate stats
    setStat1Label(proj.stats?.[0]?.label || '');
    setStat1Value(proj.stats?.[0]?.value || '');
    setStat2Label(proj.stats?.[1]?.label || '');
    setStat2Value(proj.stats?.[1]?.value || '');
    setStat3Label(proj.stats?.[2]?.label || '');
    setStat3Value(proj.stats?.[2]?.value || '');
  };

  // Reset form states
  const clearForm = () => {
    setEditingProject(null);
    setFormId('');
    setFormTitle('');
    setFormDescription('');
    setFormLongDescription('');
    setFormTech('');
    setFormGithub('');
    setFormDemo('');
    setStat1Label('');
    setStat1Value('');
    setStat2Label('');
    setStat2Value('');
    setStat3Label('');
    setStat3Value('');
  };

  // Save project (Create or Update)
  const saveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const techArray = formTech
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const statsArray: ProjectStat[] = [];
    if (stat1Label.trim() && stat1Value.trim()) {
      statsArray.push({ label: stat1Label.trim(), value: stat1Value.trim() });
    }
    if (stat2Label.trim() && stat2Value.trim()) {
      statsArray.push({ label: stat2Label.trim(), value: stat2Value.trim() });
    }
    if (stat3Label.trim() && stat3Value.trim()) {
      statsArray.push({ label: stat3Label.trim(), value: stat3Value.trim() });
    }

    const payloadProject: Project = {
      id: formId.trim() || formTitle.trim().toLowerCase().replace(/\s+/g, '-'),
      title: formTitle.trim(),
      description: formDescription.trim(),
      longDescription: formLongDescription.trim() || undefined,
      tech: techArray,
      github: formGithub.trim() || undefined, // Optional field
      demo: formDemo.trim() || undefined,     // Optional field
      stats: statsArray.length > 0 ? statsArray : undefined,
    };

    let updatedProjectsList: Project[] = [];
    if (editingProject) {
      // Edit: Replace existing project by ID
      updatedProjectsList = projects.map((p) => (p.id === editingProject.id ? payloadProject : p));
    } else {
      // Add: Append new project
      if (projects.some((p) => p.id === payloadProject.id)) {
        alert('Error: Project with this ID already exists!');
        setIsLoading(false);
        return;
      }
      updatedProjectsList = [...projects, payloadProject];
    }

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, projects: updatedProjectsList }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setProjects(data.projects);
        clearForm();
      } else {
        alert(data.error || 'Failed to update database');
      }
    } catch {
      alert('Network failure');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete project
  const deleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    setIsLoading(true);

    const updatedProjectsList = projects.filter((p) => p.id !== id);

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, projects: updatedProjectsList }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setProjects(data.projects);
        if (editingProject?.id === id) {
          clearForm();
        }
      } else {
        alert(data.error || 'Failed to delete project');
      }
    } catch {
      alert('Network failure');
    } finally {
      setIsLoading(false);
    }
  };

  // Render Password Prompt (Terminal style)
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 text-zinc-50 font-mono">
        <div className="w-full max-w-md overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl">
          {/* Header Bar */}
          <div className="flex items-center gap-1.5 border-b border-zinc-800 bg-zinc-950 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-500/80"></span>
            <span className="h-3 w-3 rounded-full bg-yellow-500/80"></span>
            <span className="h-3 w-3 rounded-full bg-emerald-500/80"></span>
            <span className="ml-2 text-xs text-zinc-500 uppercase tracking-widest">project_db_auth.sh</span>
          </div>

          {/* Form Content */}
          <form onSubmit={handleLogin} className="p-6">
            <div className="flex items-center gap-2.5 text-zinc-400 mb-6 text-sm">
              <ShieldAlert className="h-5 w-5 text-red-500 animate-pulse" />
              <span>Authentication required to modify portfolio JSON structures.</span>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs uppercase text-zinc-500 tracking-wider mb-2">ACCESS PASSWORD</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-emerald-500">$</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2.5 pl-8 pr-4 text-emerald-400 placeholder-zinc-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs text-red-400 mb-6">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 py-3 font-semibold text-white transition-colors disabled:bg-emerald-800"
            >
              {isLoading ? 'Decrypting tokens...' : 'Authenticate core'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono px-4 py-8">
      <div className="mx-auto max-w-6xl">
        
        {/* Header Dashboard Nav */}
        <div className="flex flex-col gap-4 border-b border-zinc-800 pb-6 mb-8 md:flex-row md:items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link
                href="/dashboard"
                className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 border border-zinc-800 rounded bg-zinc-900 px-2 py-1"
              >
                <ArrowLeft className="h-3 w-3" />
                {"Metrics Monitor"}
              </Link>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <h1 className="text-xl font-bold tracking-tight text-white">Project Struct Manager</h1>
              </div>
            </div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest">
              {"SECURED DB LOG // MIGRATED JSON SOURCE // persistence active"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLock}
              className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-colors"
            >
              <Lock className="h-3.5 w-3.5" />
              Lock Console
            </button>
          </div>
        </div>

        {/* WORKSPACE PANELS */}
        <div className="grid gap-8 lg:grid-cols-5">
          
          {/* LEFT PANEL: Form Editor (3/5 width) */}
          <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900 p-6 self-start">
            <h2 className="text-sm font-bold text-white mb-6 uppercase tracking-wider border-b border-zinc-800 pb-3 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-emerald-500" />
              {editingProject ? 'Modify Struct' : 'Compile New Struct'}
            </h2>

            <form onSubmit={saveProject} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-zinc-400 uppercase tracking-wider mb-1.5">Project ID (unique lowercase slug)</label>
                <input
                  type="text"
                  value={formId}
                  onChange={(e) => setFormId(e.target.value)}
                  placeholder="e.g. spotify-killer"
                  disabled={!!editingProject}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2.5 px-3 text-zinc-300 placeholder-zinc-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-zinc-400 uppercase tracking-wider mb-1.5">Project Title</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. AudioSync"
                  required
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2.5 px-3 text-zinc-300 placeholder-zinc-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 uppercase tracking-wider mb-1.5">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={formTech}
                  onChange={(e) => setFormTech(e.target.value)}
                  placeholder="TypeScript, Rust, Next.js"
                  required
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2.5 px-3 text-zinc-300 placeholder-zinc-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div>
                  <label className="block text-zinc-400 uppercase tracking-wider mb-1.5">GitHub Repository Link {"(Optional)"}</label>
                  <input
                    type="url"
                    value={formGithub}
                    onChange={(e) => setFormGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2.5 px-3 text-zinc-300 placeholder-zinc-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 uppercase tracking-wider mb-1.5">Live Deployed Link {"(Optional)"}</label>
                  <input
                    type="url"
                    value={formDemo}
                    onChange={(e) => setFormDemo(e.target.value)}
                    placeholder="https://demo.example.com"
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2.5 px-3 text-zinc-300 placeholder-zinc-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 uppercase tracking-wider mb-1.5">Short Description</label>
                <input
                  type="text"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Short one-line pitch..."
                  required
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2.5 px-3 text-zinc-300 placeholder-zinc-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 uppercase tracking-wider mb-1.5">Detailed Description</label>
                <textarea
                  value={formLongDescription}
                  onChange={(e) => setFormLongDescription(e.target.value)}
                  placeholder="Multi-line full technical breakdown..."
                  rows={4}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2.5 px-3 text-zinc-300 placeholder-zinc-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>

              {/* Custom Metrics inputs */}
              <div className="border-t border-zinc-800 pt-4 space-y-3">
                <label className="block text-zinc-500 uppercase tracking-wider font-bold">Custom Statistics Grid (Max 3)</label>
                
                <div className="grid gap-2 grid-cols-2">
                  <input
                    type="text"
                    value={stat1Label}
                    onChange={(e) => setStat1Label(e.target.value)}
                    placeholder="Stat 1 Label (e.g. Latency)"
                    className="rounded-lg border border-zinc-850 bg-zinc-950 py-2 px-2 text-zinc-300 placeholder-zinc-750 outline-none"
                  />
                  <input
                    type="text"
                    value={stat1Value}
                    onChange={(e) => setStat1Value(e.target.value)}
                    placeholder="Stat 1 Value (e.g. 24ms)"
                    className="rounded-lg border border-zinc-850 bg-zinc-950 py-2 px-2 text-zinc-300 placeholder-zinc-750 outline-none animate-pulse-slow"
                  />
                </div>

                <div className="grid gap-2 grid-cols-2">
                  <input
                    type="text"
                    value={stat2Label}
                    onChange={(e) => setStat2Label(e.target.value)}
                    placeholder="Stat 2 Label (e.g. Throughput)"
                    className="rounded-lg border border-zinc-850 bg-zinc-950 py-2 px-2 text-zinc-300 placeholder-zinc-750 outline-none"
                  />
                  <input
                    type="text"
                    value={stat2Value}
                    onChange={(e) => setStat2Value(e.target.value)}
                    placeholder="Stat 2 Value (e.g. 1.2 GB/s)"
                    className="rounded-lg border border-zinc-850 bg-zinc-950 py-2 px-2 text-zinc-300 placeholder-zinc-750 outline-none"
                  />
                </div>

                <div className="grid gap-2 grid-cols-2">
                  <input
                    type="text"
                    value={stat3Label}
                    onChange={(e) => setStat3Label(e.target.value)}
                    placeholder="Stat 3 Label (e.g. Sample Rate)"
                    className="rounded-lg border border-zinc-850 bg-zinc-950 py-2 px-2 text-zinc-300 placeholder-zinc-750 outline-none"
                  />
                  <input
                    type="text"
                    value={stat3Value}
                    onChange={(e) => setStat3Value(e.target.value)}
                    placeholder="Stat 3 Value (e.g. 48kHz)"
                    className="rounded-lg border border-zinc-850 bg-zinc-950 py-2 px-2 text-zinc-300 placeholder-zinc-750 outline-none"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 border-t border-zinc-800 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 py-2.5 font-bold text-white transition-colors disabled:bg-emerald-800"
                >
                  <Save className="h-4 w-4" />
                  {editingProject ? 'Compile Changes' : 'Write to Database'}
                </button>
                
                {(editingProject || formTitle || formDescription) && (
                  <button
                    type="button"
                    onClick={clearForm}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 px-4 py-2.5 font-bold text-zinc-400 hover:text-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Reset
                  </button>
                )}
              </div>

            </form>
          </div>

          {/* RIGHT PANEL: List of projects (3/5 width) */}
          <div className="lg:col-span-3 rounded-xl border border-zinc-800 bg-zinc-900 p-6 self-start">
            <h2 className="text-sm font-bold text-white mb-6 uppercase tracking-wider border-b border-zinc-800 pb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-500" />
              {"Active JSON Struct Registry"}
            </h2>

            <div className="space-y-4">
              {projects.length === 0 ? (
                <div className="text-center py-10 text-zinc-550 border border-dashed border-zinc-850 rounded-lg">
                  No active projects compiled. Create one inside the editor!
                </div>
              ) : (
                projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-lg border border-zinc-850 bg-zinc-950 p-4 transition-all hover:border-zinc-750"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-zinc-500 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">
                            {proj.id}
                          </span>
                          <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                            {proj.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEdit(proj)}
                            className="flex h-7 w-7 items-center justify-center rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => deleteProject(proj.id)}
                            className="flex h-7 w-7 items-center justify-center rounded bg-red-950/20 hover:bg-red-950/50 border border-red-900/30 text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-zinc-400 mb-4">{proj.description}</p>

                      {/* Tech stack */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {proj.tech.map((tag) => (
                          <span
                            key={tag}
                            className="rounded bg-zinc-900 border border-zinc-850 px-1.5 py-0.5 text-[9px] text-zinc-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Optional Links visual checklist */}
                      <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-mono pt-2.5 border-t border-zinc-900/60">
                        <span className="flex items-center gap-1">
                          <GithubIcon className="h-3.5 w-3.5" />
                          {proj.github ? (
                            <span className="text-emerald-500">github linked</span>
                          ) : (
                            <span className="text-zinc-650">no repo</span>
                          )}
                        </span>
                        <span className="flex items-center gap-1">
                          <ExternalLink className="h-3.5 w-3.5" />
                          {proj.demo ? (
                            <span className="text-emerald-500">deployment linked</span>
                          ) : (
                            <span className="text-zinc-650">no deployment</span>
                          )}
                        </span>
                      </div>

                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
