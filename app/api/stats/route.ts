import { NextResponse } from 'next/server';
import http from 'http';
import os from 'os';

// Secure endpoint check
const VALID_PASSWORD = 'KaUsTuBh2006';

interface DockerPortRaw {
  IP?: string;
  PrivatePort: number;
  PublicPort?: number;
  Type: string;
}

interface DockerContainerRaw {
  Id: string;
  Names: string[];
  Image: string;
  ImageID: string;
  State: string;
  Status: string;
  Ports?: DockerPortRaw[];
}

interface DockerImageRaw {
  Id: string;
  RepoTags: string[] | null;
  Size: number;
}

interface DockerStatsRaw {
  cpu_stats?: {
    cpu_usage?: {
      total_usage: number;
    };
    system_cpu_usage?: number;
    online_cpus?: number;
  };
  precpu_stats?: {
    cpu_usage?: {
      total_usage: number;
    };
    system_cpu_usage?: number;
  };
  memory_stats?: {
    usage?: number;
    limit?: number;
  };
}

// Helper to query Docker Engine API via Unix Socket
function queryDockerAPI(path: string): Promise<unknown> {
  return new Promise((resolve) => {
    const options = {
      socketPath: '/var/run/docker.sock',
      path: path,
      method: 'GET',
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve(null);
        }
      });
    });

    req.on('error', () => {
      resolve(null); // Return null if Docker socket is not accessible
    });

    req.end();
  });
}

// Helper to format bytes
function formatBytes(bytes: number): string {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    // Password verification
    if (password !== VALID_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized credentials' }, { status: 401 });
    }

    // 1. Gather Host OS Metrics
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const cpuLoad = os.loadavg();
    const osUptime = os.uptime();
    const osPlatform = os.platform();
    const cpuCount = os.cpus().length;

    // 2. Gather Docker Engine Metrics in parallel
    const [rawContainers, rawImages] = await Promise.all([
      queryDockerAPI('/containers/json?all=1'),
      queryDockerAPI('/images/json'),
    ]) as [DockerContainerRaw[] | null, DockerImageRaw[] | null];

    // Create an Image ID/Tag to Size map
    const imageSizeMap: Record<string, number> = {};
    if (Array.isArray(rawImages)) {
      rawImages.forEach((img) => {
        imageSizeMap[img.Id] = img.Size;
        if (img.RepoTags) {
          img.RepoTags.forEach((tag) => {
            imageSizeMap[tag] = img.Size;
          });
        }
      });
    }

    let containersList: {
      id: string;
      name: string;
      image: string;
      imageSize: string;
      state: string;
      status: string;
      cpu: string;
      memory: string;
      ports: string[];
    }[] = [];

    if (Array.isArray(rawContainers)) {
      // Query stats for running containers in parallel
      const statsPromises = rawContainers.map(async (container) => {
        if (container.State !== 'running') {
          return { id: container.Id, cpu: '0.0%', memory: '0 B / 0 B (0%)' };
        }

        const rawStats = await queryDockerAPI(`/containers/${container.Id}/stats?stream=false`) as DockerStatsRaw | null;
        if (!rawStats) {
          return { id: container.Id, cpu: '0.0%', memory: '0 B / 0 B (0%)' };
        }

        // Calculate CPU % (Standard Docker stats formula)
        let cpuPercent = '0.0%';
        const cpuStats = rawStats.cpu_stats;
        const precpuStats = rawStats.precpu_stats;
        if (
          cpuStats && 
          precpuStats && 
          cpuStats.cpu_usage && 
          precpuStats.cpu_usage && 
          cpuStats.system_cpu_usage && 
          precpuStats.system_cpu_usage
        ) {
          const cpuDelta = cpuStats.cpu_usage.total_usage - precpuStats.cpu_usage.total_usage;
          const systemDelta = cpuStats.system_cpu_usage - precpuStats.system_cpu_usage;
          const onlineCpus = cpuStats.online_cpus || 1;
          if (systemDelta > 0 && cpuDelta > 0) {
            cpuPercent = ((cpuDelta / systemDelta) * onlineCpus * 100).toFixed(1) + '%';
          }
        }

        // Calculate Memory %
        let memoryFormatted = '0 B / 0 B (0%)';
        const memStats = rawStats.memory_stats;
        if (memStats && memStats.usage) {
          const memUsage = memStats.usage;
          const memLimit = memStats.limit || 1;
          const memPercent = ((memUsage / memLimit) * 100).toFixed(1);
          memoryFormatted = `${formatBytes(memUsage)} / ${formatBytes(memLimit)} (${memPercent}%)`;
        }

        return { id: container.Id, cpu: cpuPercent, memory: memoryFormatted };
      });

      const statsList = await Promise.all(statsPromises);
      const statsMap = Object.fromEntries(statsList.map((s) => [s.id, s]));

      containersList = rawContainers.map((container) => {
        const size = imageSizeMap[container.ImageID] || imageSizeMap[container.Image] || 0;
        const containerStats = statsMap[container.Id] || { cpu: '0.0%', memory: '0 B / 0 B (0%)' };

        return {
          id: container.Id.substring(0, 12),
          name: container.Names[0]?.replace(/^\//, '') || 'unknown',
          image: container.Image,
          imageSize: formatBytes(size),
          state: container.State,
          status: container.Status,
          cpu: containerStats.cpu,
          memory: containerStats.memory,
          ports: container.Ports?.map((p) => `${p.PublicPort || p.PrivatePort}->${p.PrivatePort}`) || [],
        };
      });
    }

    return NextResponse.json({
      success: true,
      system: {
        platform: osPlatform,
        cpuCount: cpuCount,
        cpuLoad1Min: cpuLoad[0],
        memory: {
          total: totalMem,
          used: usedMem,
          free: freeMem,
          percentage: ((usedMem / totalMem) * 100).toFixed(1),
        },
        uptime: osUptime,
      },
      docker: {
        active: rawContainers !== null,
        containersCount: containersList.length,
        containers: containersList,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
