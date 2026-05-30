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
  State: string;
  Status: string;
  Ports?: DockerPortRaw[];
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
    const cpuLoad = os.loadavg(); // [1 min, 5 min, 15 min]
    const osUptime = os.uptime();
    const osPlatform = os.platform();
    const cpuCount = os.cpus().length;

    // 2. Gather Docker Engine Containers Metrics via Unix socket
    const rawContainers = await queryDockerAPI('/containers/json?all=1') as DockerContainerRaw[] | null;
    
    let containersList = [];
    if (Array.isArray(rawContainers)) {
      containersList = rawContainers.map((container: DockerContainerRaw) => ({
        id: container.Id.substring(0, 12),
        name: container.Names[0]?.replace(/^\//, '') || 'unknown',
        image: container.Image,
        state: container.State,
        status: container.Status,
        ports: container.Ports?.map((p: DockerPortRaw) => `${p.PublicPort || p.PrivatePort}->${p.PrivatePort}`) || [],
      }));
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
