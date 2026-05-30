import { NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import path from 'path';

const RESUME_FILENAME = 'MichaelJZhang-RESUME.pdf';

export async function POST(req: Request) {
    const body = await req.json().catch(() => ({}));
    const password = typeof body?.password === 'string' ? body.password : '';

    const expected = process.env.RESUMES_PASSWORD;
    if (!expected) {
        return NextResponse.json({ error: 'RESUMES_PASSWORD not set on server' }, { status: 500 });
    }
    if (password !== expected) {
        return NextResponse.json({ error: 'wrong password' }, { status: 401 });
    }

    const dir = path.join(process.cwd(), 'public', '_resumes');
    const entries = await readdir(dir, { withFileTypes: true });
    const folders = entries.filter(e => e.isDirectory()).map(e => e.name).sort();

    const resumes = await Promise.all(folders.map(async (folder) => {
        const pdfPath = path.join(dir, folder, RESUME_FILENAME);
        try {
            const s = await stat(pdfPath);
            return { folder, url: `/_resumes/${folder}/${RESUME_FILENAME}`, sizeBytes: s.size, present: true };
        } catch {
            return { folder, url: `/_resumes/${folder}/${RESUME_FILENAME}`, sizeBytes: 0, present: false };
        }
    }));

    return NextResponse.json({ resumes });
}
