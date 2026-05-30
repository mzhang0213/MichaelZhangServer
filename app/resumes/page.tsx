'use client';

import { useState } from 'react';

type Resume = {
    folder: string;
    url: string;
    sizeBytes: number;
    present: boolean;
};

export default function ResumesAccessPage() {
    const [password, setPassword] = useState('');
    const [resumes, setResumes] = useState<Resume[] | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/resumes/api', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data?.error ?? `error ${res.status}`);
                setResumes(null);
            } else {
                setResumes(data.resumes ?? []);
            }
        } catch (err) {
            setError(String(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <main style={styles.main}>
            <h1 style={styles.h1}>resume access</h1>

            {resumes === null && (
                <form onSubmit={submit} style={styles.form}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="password"
                        autoFocus
                        style={styles.input}
                    />
                    <button type="submit" disabled={loading || !password} style={styles.button}>
                        {loading ? '...' : 'unlock'}
                    </button>
                </form>
            )}

            {error && <p style={styles.error}>{error}</p>}

            {resumes !== null && (
                <>
                    <p style={styles.meta}>
                        {resumes.length} folder{resumes.length === 1 ? '' : 's'} in /_resumes/
                    </p>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>folder</th>
                                <th style={styles.th}>file</th>
                                <th style={styles.th}>size</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resumes.map((r) => (
                                <tr key={r.folder}>
                                    <td style={styles.td}>{r.folder}</td>
                                    <td style={styles.td}>
                                        {r.present ? (
                                            <a href={r.url} target="_blank" rel="noreferrer">
                                                {r.url}
                                            </a>
                                        ) : (
                                            <span style={styles.missing}>missing</span>
                                        )}
                                    </td>
                                    <td style={styles.td}>{r.present ? formatBytes(r.sizeBytes) : '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={() => { setResumes(null); setPassword(''); }} style={styles.button}>
                        lock
                    </button>
                </>
            )}
        </main>
    );
}

function formatBytes(n: number) {
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

const styles: Record<string, React.CSSProperties> = {
    main: { maxWidth: 640, margin: '40px auto', padding: '0 16px', fontFamily: 'monospace' },
    h1: { fontSize: 20, marginBottom: 16 },
    form: { display: 'flex', gap: 8 },
    input: { flex: 1, padding: '6px 10px', border: '1px solid #888', borderRadius: 4 },
    button: { padding: '6px 14px', border: '1px solid #888', borderRadius: 4, cursor: 'pointer', background: '#f4f4f4' },
    meta: { color: '#555', marginBottom: 8 },
    table: { width: '100%', borderCollapse: 'collapse', marginBottom: 16 },
    th: { textAlign: 'left', borderBottom: '1px solid #888', padding: '6px 8px', fontWeight: 'bold' },
    td: { borderBottom: '1px solid #ddd', padding: '6px 8px', wordBreak: 'break-all' },
    error: { color: '#b00020', marginTop: 8 },
    missing: { color: '#b00020' },
};
