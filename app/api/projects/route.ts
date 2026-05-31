import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Secure credentials
const VALID_PASSWORD = 'KaUsTuBh2006';

// Paths
const getFilePath = () => path.join(process.cwd(), 'data', 'projects.json');

// Interface to validate incoming project structure
interface ProjectPayload {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  tech: string[];
  github?: string;
  demo?: string;
  stats?: { label: string; value: string }[];
}

export async function GET() {
  try {
    const filePath = getFilePath();
    const fileContent = await fs.readFile(filePath, 'utf8');
    const projectsList = JSON.parse(fileContent);
    return NextResponse.json({ success: true, projects: projectsList });
  } catch {
    // If the file doesn't exist, return empty array
    return NextResponse.json({ success: true, projects: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, projects } = body;

    // Credentials authorization
    if (password !== VALID_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized credentials' }, { status: 401 });
    }

    // Verify projects payload structure
    if (!Array.isArray(projects)) {
      return NextResponse.json({ error: 'Invalid projects list' }, { status: 400 });
    }

    interface RawProjectPayload {
      id?: unknown;
      title?: unknown;
      description?: unknown;
      longDescription?: unknown;
      tech?: unknown;
      github?: unknown;
      demo?: unknown;
      stats?: unknown;
    }

    interface RawStat {
      label?: unknown;
      value?: unknown;
    }

    // Sanitize and validate fields (e.g. github and demo are optional strings)
    const sanitizedProjects: ProjectPayload[] = projects.map((proj: RawProjectPayload) => {
      const techArray = Array.isArray(proj.tech) ? proj.tech : [];
      const statsArray = Array.isArray(proj.stats) ? proj.stats : [];

      return {
        id: String(proj.id || '').trim().toLowerCase().replace(/\s+/g, '-'),
        title: String(proj.title || '').trim(),
        description: String(proj.description || '').trim(),
        longDescription: proj.longDescription ? String(proj.longDescription).trim() : undefined,
        tech: techArray.map((t: unknown) => String(t).trim()).filter(Boolean),
        github: proj.github && String(proj.github).trim() ? String(proj.github).trim() : undefined,
        demo: proj.demo && String(proj.demo).trim() ? String(proj.demo).trim() : undefined,
        stats: statsArray
          .map((s: unknown) => {
            const statObj = s as RawStat;
            return {
              label: String(statObj?.label || '').trim(),
              value: String(statObj?.value || '').trim()
            };
          })
          .filter((s) => s.label && s.value)
      };
    });

    // Write to persistent JSON file on host VM
    const filePath = getFilePath();
    await fs.writeFile(filePath, JSON.stringify(sanitizedProjects, null, 2), 'utf8');

    return NextResponse.json({ success: true, projects: sanitizedProjects });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
