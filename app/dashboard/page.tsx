'use client';

import { useState, useEffect, useCallback } from 'react';
import { ShieldAlert, Cpu, HardDrive, Clock, Activity, ShieldCheck, Lock, RefreshCw } from 'lucide-react';

interface DockerContainer {
  id: string;
  name: string;
  image: string;
  state: string;
  status: string;
  ports: string[];
}

interface VMStats {
  success: boolean;
  system: {
    platform: string;
    cpuCount: number;
    cpuLoad1Min: number;
    memory: {
      total: number;
      used: number;
      free: number;
      percentage: string;
    };
    uptime: number;
  };
  docker: {
    active: boolean;
    containersCount: number;
    containers: DockerContainer[];
  };
}

export default function Dashboard() {
  // Use lazy state initialization to prevent calling setState inside useEffect
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
  const [stats, setStats] = useState<VMStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);

  // Authenticate user
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setStats(data);
        sessionStorage.setItem('dashboard_token', password);
      } else {
        setError(data.error || 'Access Denied: Invalid passcode');
      }
    } catch {
      setError('Connection failure: Unable to reach endpoint');
    } finally {
      setIsLoading(false);
    }
  };

  // Poll server for metrics wrapped in useCallback to keep dependencies stable
  const fetchMetrics = useCallback(async () => {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('dashboard_token') || password : password;
    if (!token) return;

    try {
      const res = await fetch('/api/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: token }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStats(data);
      }
    } catch {
      console.error('Failed to poll metrics');
    }
  }, [password]);

  // Set up polling intervals based on authentication state
  useEffect(() => {
    if (!isAuthenticated) return;

    fetchMetrics();
    setIsPolling(true);

    const interval = setInterval(() => {
      fetchMetrics();
    }, 3000);

    return () => {
      clearInterval(interval);
      setIsPolling(false);
    };
  }, [isAuthenticated, fetchMetrics]);

  // Log out / Lock dashboard
  const handleLock = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('dashboard_token');
    }
    setPassword('');
    setIsAuthenticated(false);
    setStats(null);
  };

  // Format memory helper
  const formatBytes = (bytes: number) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Format uptime helper
  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    const parts = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    parts.push(`${s}s`);
    return parts.join(' ');
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
            <span className="ml-2 text-xs text-zinc-500 uppercase tracking-widest">secure_handshake.sh</span>
          </div>

          {/* Form Content */}
          <form onSubmit={handleLogin} className="p-6">
            <div className="flex items-center gap-2.5 text-zinc-400 mb-6 text-sm">
              <ShieldAlert className="h-5 w-5 text-red-500 animate-pulse" />
              <span>Authentication required to query Azure-VM host socket.</span>
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
              {isLoading ? 'Decrypting tokens...' : 'Authenticate Core'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render main authenticated metrics dashboard
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono px-4 py-8">
      <div className="mx-auto max-w-6xl">
        
        {/* Header Dashboard Nav */}
        <div className="flex flex-col gap-4 border-b border-zinc-800 pb-6 mb-8 md:flex-row md:items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <h1 className="text-xl font-bold tracking-tight text-white">Azure VM Active Monitor</h1>
            </div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest">
              {"LOCKED SESSION // HOST: "}{stats?.system?.platform || 'linux'}{" // SOCKET ACTIVE: "}{stats?.docker?.active ? 'YES' : 'NO'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span>{isPolling ? 'Live Sync Active (3s)' : 'Offline'}</span>
            </div>

            <button
              onClick={fetchMetrics}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
            </button>

            <button
              onClick={handleLock}
              className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-colors"
            >
              <Lock className="h-3.5 w-3.5" />
              Lock Console
            </button>
          </div>
        </div>

        {/* METRICS WIDGETS SECTION */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          
          {/* CPU widget */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase text-zinc-400 tracking-wider">CPU Average Load</span>
              <Cpu className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold mb-2">
              {stats?.system?.cpuLoad1Min !== undefined ? (stats.system.cpuLoad1Min * 100).toFixed(1) : '0.0'}%
            </div>
            <div className="w-full bg-zinc-950 rounded-full h-1.5 mb-2 overflow-hidden border border-zinc-850">
              <div 
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (stats?.system?.cpuLoad1Min || 0) * 100)}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-zinc-500">
              {"CORES LOGICAL: "}{stats?.system?.cpuCount || 0}{" // LOAD 1-MIN AVG"}
            </span>
          </div>

          {/* Memory widget */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase text-zinc-400 tracking-wider">RAM Consumption</span>
              <HardDrive className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold mb-2">
              {stats?.system?.memory?.percentage || '0.0'}%
            </div>
            <div className="w-full bg-zinc-950 rounded-full h-1.5 mb-2 overflow-hidden border border-zinc-850">
              <div 
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${stats?.system?.memory?.percentage || 0}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-zinc-500">
              {"USED: "}{formatBytes(stats?.system?.memory?.used || 0)}{" // TOTAL: "}{formatBytes(stats?.system?.memory?.total || 0)}
            </span>
          </div>

          {/* Uptime widget */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase text-zinc-400 tracking-wider">System Uptime</span>
              <Clock className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold mb-2">
              {stats?.system?.uptime ? formatUptime(stats.system.uptime) : '00:00:00'}
            </div>
            <div className="h-1.5 mb-2 flex items-center">
              <span className="text-[10px] text-emerald-500">handshake active</span>
            </div>
            <span className="text-[10px] text-zinc-500">
              {"CORE TIMESTAMP: "}{new Date().toLocaleTimeString()}
            </span>
          </div>

        </div>

        {/* DOCKER MONITOR SECTION */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 overflow-hidden">
          
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-500" />
              <h2 className="text-md font-bold text-white">Docker Container Runtime Logs</h2>
            </div>
            <span className="text-xs text-zinc-500">
              {"CONTAINERS DETECTED: "}{stats?.docker?.containersCount || 0}
            </span>
          </div>

          {/* Fallback if docker socket not accessible */}
          {!stats?.docker?.active && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-center">
              <p className="text-sm text-red-400 font-semibold mb-1">Host Docker Socket Not Detected</p>
              <p className="text-xs text-zinc-500">
                Ensure `/var/run/docker.sock:/var/run/docker.sock` is mounted in docker-compose volumes and user permission is set.
              </p>
            </div>
          )}

          {/* Containers Table */}
          {stats?.docker?.active && stats?.docker?.containers && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Container</th>
                    <th className="pb-3 font-semibold">Image</th>
                    <th className="pb-3 font-semibold">State</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Ports</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {stats.docker.containers.map((container: DockerContainer) => (
                    <tr key={container.id} className="hover:bg-zinc-950/40">
                      <td className="py-3.5 font-bold text-white flex items-center gap-2">
                        <span className="text-[10px] text-zinc-500 bg-zinc-950 border border-zinc-800 px-1.5 py-0.5 rounded">
                          {container.id}
                        </span>
                        {container.name}
                      </td>
                      <td className="py-3.5 text-zinc-400 max-w-[200px] truncate">{container.image}</td>
                      <td className="py-3.5">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-semibold text-[10px] ${
                          container.state === 'running' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          <span className={`h-1 w-1 rounded-full ${container.state === 'running' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></span>
                          {container.state}
                        </span>
                      </td>
                      <td className="py-3.5 text-zinc-400">{container.status}</td>
                      <td className="py-3.5 text-right font-mono text-zinc-400">
                        {container.ports.length > 0 ? (
                          <div className="flex flex-col gap-0.5 items-end">
                            {container.ports.map((port: string, i: number) => (
                              <span key={i} className="text-[10px] bg-zinc-950 border border-zinc-850 px-1.5 py-0.5 rounded text-emerald-400 font-mono">
                                {port}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-zinc-600">none</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
