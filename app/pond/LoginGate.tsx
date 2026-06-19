"use client";

import { useEffect, useState } from "react";

// Floating pond-styled password window. Shows only when POND_PASSWORD is set on
// the server and the visitor isn't authed yet; calls onAuthed() once unlocked
// (or immediately if no password is required).
export default function LoginGate({ onAuthed }: { onAuthed: () => void }) {
    const [state, setState] = useState<"checking" | "needed" | "ok">("checking");
    const [pw, setPw] = useState("");
    const [err, setErr] = useState("");
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        let cancelled = false;
        fetch("/pond/api/auth")
            .then((r) => r.json())
            .then((d) => {
                if (cancelled) return;
                if (!d.required || d.authed) {
                    setState("ok");
                    onAuthed();
                } else {
                    setState("needed");
                }
            })
            .catch(() => {
                if (!cancelled) setState("needed");
            });
        return () => {
            cancelled = true;
        };
    }, [onAuthed]);

    if (state !== "needed") return null;

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setBusy(true);
        setErr("");
        try {
            const r = await fetch("/pond/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: pw }),
            });
            if (r.ok) {
                setState("ok");
                onAuthed();
            } else {
                setErr("that's not it — try again");
            }
        } catch {
            setErr("couldn't reach the pond");
        }
        setBusy(false);
    };

    return (
        <div className="pond-gate-backdrop">
            <form className="pond-gate" onSubmit={submit}>
                <div className="pond-gate-icon">🪷</div>
                <div className="pond-gate-title">the pond is private</div>
                <div className="pond-gate-sub">enter the password to dive in</div>
                <input
                    type="password"
                    autoFocus
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    placeholder="password"
                />
                {err && <div className="pond-gate-err">{err}</div>}
                <button className="pond-btn" disabled={busy || !pw} type="submit">
                    {busy ? "checking…" : "enter"}
                </button>
            </form>
        </div>
    );
}
