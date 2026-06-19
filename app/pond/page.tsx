"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import JSZip from "jszip";
import PondScene from "./PondScene";
import SoundToggle from "./SoundToggle";
import LoginGate from "./LoginGate";
import "./pond.css";

type NoteTab = {
    id: string; // mongo _id
    content: string;
    savedContent: string;
    folder: string;
    loading: boolean;
    updatedAt?: string | null;
};

type NoteMeta = { id: string; title: string; createdAt?: string | null; updatedAt?: string | null };
type FolderGroup = { folder: string; notes: NoteMeta[] };

// Compact "last edited" label, e.g. "Jun 18, 2026" or "today 3:40 PM".
function formatDate(value?: string | null): string {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "";
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    if (sameDay) return "today " + d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

// Mirror of the server's titleFromContent (Windows-Notepad style). Notes are
// HTML, so turn block tags (open OR close) into newlines before stripping.
function titleFromContent(note: string): string {
    const text = (note ?? "")
        .replace(/<\/?(div|p|h[1-6]|li|blockquote|tr)[^>]*>/gi, "\n")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">");
    let first = text.split("\n").map((l) => l.trim()).find((l) => l.length > 0);
    if (!first) return "Untitled";
    first = first.replace(/^#{1,6}\s+/, "").replace(/[*_`~]/g, "").trim();
    if (!first) return "Untitled";
    return first.length > 40 ? first.slice(0, 40) + "…" : first;
}

// Stable color per folder name, so tabs/notes from the same folder share a hue.
function folderColor(folder: string): string {
    let h = 0;
    for (let i = 0; i < (folder || "").length; i++) h = (h * 31 + folder.charCodeAt(i)) % 360;
    return `hsl(${h} 62% 52%)`;
}

const HOME = "home";

export default function PondPage() {
    const [tabs, setTabs] = useState<NoteTab[]>([]);
    const [activeKey, setActiveKey] = useState<string>(HOME);
    const [home, setHome] = useState<FolderGroup[] | null>(null);
    const [status, setStatus] = useState("");
    const [expanded, setExpanded] = useState<Set<string>>(new Set()); // folders start collapsed
    const [dragOver, setDragOver] = useState<string | null>(null);
    const [codeView, setCodeView] = useState(false); // show raw HTML source + preview
    const [color, setColor] = useState("#1f6feb");
    const [fontSize, setFontSize] = useState(16);
    const [fmt, setFmt] = useState({ bold: false, italic: false, underline: false });
    const [authed, setAuthed] = useState(false);
    const editorRef = useRef<HTMLDivElement | null>(null); // wysiwyg contentEditable
    const textareaRef = useRef<HTMLTextAreaElement | null>(null); // code-view source
    const loadedRef = useRef<string>("");
    const savedRange = useRef<Range | null>(null); // editor selection, kept alive across toolbar clicks
    const restoredRef = useRef(false);

    // ---- preferences ----
    useEffect(() => {
        if (typeof window === "undefined") return;
        if (localStorage.getItem("pond-code") === "1") setCodeView(true);
        const fs = localStorage.getItem("pond-fontsize");
        if (fs) setFontSize(parseInt(fs, 10) || 16);
    }, []);
    useEffect(() => {
        if (typeof window !== "undefined") localStorage.setItem("pond-code", codeView ? "1" : "0");
    }, [codeView]);
    useEffect(() => {
        if (typeof window !== "undefined") localStorage.setItem("pond-fontsize", String(fontSize));
    }, [fontSize]);

    const toggleFolder = useCallback((folder: string) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(folder)) next.delete(folder);
            else next.add(folder);
            return next;
        });
    }, []);

    const loadHome = useCallback(async () => {
        try {
            const res = await fetch("/pond/api/notes");
            const data = await res.json();
            setHome(data.folders ?? []);
        } catch {
            setStatus("couldn't reach the pond…");
        }
    }, []);

    const handleAuthed = useCallback(() => setAuthed(true), []);

    useEffect(() => {
        if (authed) loadHome();
    }, [authed, loadHome]);

    const activeTab = tabs.find((t) => t.id === activeKey) ?? null;
    const dirty = activeTab ? activeTab.content !== activeTab.savedContent : false;

    const setActiveContent = useCallback(
        (html: string) => {
            setTabs((prev) => prev.map((t) => (t.id === activeKey ? { ...t, content: html } : t)));
        },
        [activeKey]
    );

    // ---- selection helpers (keep the editor's range alive when focus moves to a
    // toolbar button or the native color picker, so formatting still targets it) ----
    const saveSelection = useCallback(() => {
        const sel = window.getSelection();
        const el = editorRef.current;
        if (sel && sel.rangeCount && el && el.contains(sel.anchorNode)) {
            savedRange.current = sel.getRangeAt(0).cloneRange();
        }
    }, []);
    const restoreSelection = useCallback(() => {
        const el = editorRef.current;
        if (!el) return;
        el.focus();
        const range = savedRange.current;
        if (range) {
            const sel = window.getSelection();
            sel?.removeAllRanges();
            sel?.addRange(range);
        }
    }, []);
    const refreshFmt = useCallback(() => {
        if (codeView || activeKey === HOME) return;
        try {
            setFmt({
                bold: document.queryCommandState("bold"),
                italic: document.queryCommandState("italic"),
                underline: document.queryCommandState("underline"),
            });
        } catch {
            /* queryCommandState can throw if nothing focused */
        }
    }, [codeView, activeKey]);

    // Formatting. WYSIWYG uses the browser's native rich-text commands (apply to
    // selection OR toggle on for the next typed text). Source view wraps raw tags.
    const format = useCallback(
        (kind: "bold" | "italic" | "underline" | "color") => {
            if (activeKey === HOME) return;
            if (codeView) {
                const ta = textareaRef.current;
                if (!ta) return;
                const tags: Record<string, [string, string]> = {
                    bold: ["<b>", "</b>"],
                    italic: ["<i>", "</i>"],
                    underline: ["<u>", "</u>"],
                    color: [`<span style="color:${color}">`, "</span>"],
                };
                const [b, a] = tags[kind];
                const s = ta.selectionStart, e = ta.selectionEnd, v = ta.value;
                setActiveContent(v.slice(0, s) + b + v.slice(s, e) + a + v.slice(e));
                requestAnimationFrame(() => {
                    ta.focus();
                    ta.setSelectionRange(s + b.length, e + b.length);
                });
                return;
            }
            const el = editorRef.current;
            if (!el) return;
            restoreSelection(); // re-target the saved selection (esp. after color picker stole focus)
            if (kind === "color") {
                document.execCommand("styleWithCSS", false, "true");
                document.execCommand("foreColor", false, color);
            } else {
                document.execCommand(kind);
            }
            saveSelection();
            refreshFmt();
            setActiveContent(el.innerHTML);
        },
        [activeKey, codeView, color, setActiveContent, restoreSelection, saveSelection, refreshFmt]
    );

    // Load note HTML into the contentEditable when the note / mode / load-state
    // changes — never on plain keystrokes, so the caret never jumps.
    const editorSig = `${activeKey}|${codeView ? "code" : "wys"}|${activeTab?.loading ? "l" : "r"}`;
    useEffect(() => {
        // Leaving the editor (Home) or entering source view unmounts the editable
        // div — invalidate the guard so returning always reloads the content.
        if (activeKey === HOME || codeView) {
            loadedRef.current = activeKey === HOME ? "home" : editorSig;
            return;
        }
        const el = editorRef.current;
        if (!el || !activeTab || activeTab.loading) return;
        if (loadedRef.current !== editorSig) {
            el.innerHTML = activeTab.content || "";
            loadedRef.current = editorSig;
        }
    }, [editorSig, codeView, activeKey, activeTab]);

    const previewHtml =
        codeView && activeTab ? DOMPurify.sanitize(activeTab.content || "", { ADD_ATTR: ["style"] }) : "";

    const openNote = useCallback(
        async (id: string) => {
            setActiveKey(id);
            if (tabs.some((t) => t.id === id)) return; // already open → just focus
            setTabs((prev) => [
                ...prev,
                { id, content: "", savedContent: "", folder: "", loading: true },
            ]);
            try {
                const res = await fetch(`/pond/api/notes/${id}`);
                const data = await res.json();
                setTabs((prev) =>
                    prev.map((t) =>
                        t.id === id
                            ? { ...t, content: data.note ?? "", savedContent: data.note ?? "", folder: data.folder ?? "", loading: false, updatedAt: data.updatedAt ?? null }
                            : t
                    )
                );
            } catch {
                setStatus("failed to load that note");
            }
        },
        [tabs]
    );

    const newNote = useCallback(async () => {
        const existing = home?.map((g) => g.folder) ?? [];
        const folder =
            window.prompt(
                `Which pond (folder) for this note?${existing.length ? "\nexisting: " + existing.join(", ") : ""}`,
                existing[0] ?? "misc"
            ) ?? null;
        if (folder === null) return;
        try {
            const res = await fetch("/pond/api/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ folder: folder.trim() || "misc" }),
            });
            const data = await res.json();
            setTabs((prev) => [
                ...prev,
                { id: data.id, content: "", savedContent: "", folder: data.folder, loading: false, updatedAt: data.updatedAt ?? null },
            ]);
            setActiveKey(data.id);
            loadHome();
        } catch {
            setStatus("failed to create note");
        }
    }, [home, loadHome]);

    const saveTab = useCallback(async (id: string) => {
        const tab = tabs.find((t) => t.id === id);
        if (!tab || tab.content === tab.savedContent) return;
        const content = tab.content;
        setStatus("saving…");
        try {
            const res = await fetch(`/pond/api/notes/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ note: content }),
            });
            const data = await res.json().catch(() => ({}));
            setTabs((prev) => prev.map((t) => (t.id === id ? { ...t, savedContent: content, updatedAt: data.updatedAt ?? t.updatedAt } : t)));
            setStatus("saved ✓");
            loadHome();
        } catch {
            setStatus("save failed");
        }
    }, [tabs, loadHome]);

    const closeTab = useCallback(
        (id: string) => {
            const tab = tabs.find((t) => t.id === id);
            if (tab && tab.content !== tab.savedContent) {
                if (!window.confirm("This note has unsaved changes. Close anyway?")) return;
            }
            setTabs((prev) => {
                const idx = prev.findIndex((t) => t.id === id);
                const next = prev.filter((t) => t.id !== id);
                if (activeKey === id) {
                    const fallback = next[idx] ?? next[idx - 1];
                    setActiveKey(fallback ? fallback.id : HOME);
                }
                return next;
            });
        },
        [tabs, activeKey]
    );

    const reorderTabs = useCallback((fromId: string, toId: string) => {
        if (fromId === toId) return;
        setTabs((prev) => {
            const arr = [...prev];
            const fi = arr.findIndex((t) => t.id === fromId);
            const ti = arr.findIndex((t) => t.id === toId);
            if (fi < 0 || ti < 0) return prev;
            const [moved] = arr.splice(fi, 1);
            arr.splice(ti, 0, moved);
            return arr;
        });
    }, []);

    const deleteNote = useCallback(
        async (id: string) => {
            if (!window.confirm("Delete this note for good?")) return;
            try {
                await fetch(`/pond/api/notes/${id}`, { method: "DELETE" });
                setTabs((prev) => prev.filter((t) => t.id !== id));
                if (activeKey === id) setActiveKey(HOME);
                loadHome();
            } catch {
                setStatus("delete failed");
            }
        },
        [activeKey, loadHome]
    );

    const deleteFolder = useCallback(
        async (folder: string) => {
            if (!window.confirm(`Delete the "${folder}" pond and ALL its notes?`)) return;
            try {
                await fetch(`/pond/api/folders/${encodeURIComponent(folder)}`, { method: "DELETE" });
                setTabs((prev) => prev.filter((t) => t.folder !== folder));
                loadHome();
            } catch {
                setStatus("delete failed");
            }
        },
        [loadHome]
    );

    const moveNote = useCallback(
        async (id: string, fromFolder: string, toFolder: string) => {
            if (!id || fromFolder === toFolder) return;
            setHome((prev) => {
                if (!prev) return prev;
                let moved: NoteMeta | undefined;
                const stripped = prev.map((g) => {
                    if (g.folder !== fromFolder) return g;
                    moved = g.notes.find((n) => n.id === id);
                    return { ...g, notes: g.notes.filter((n) => n.id !== id) };
                });
                if (!moved) return prev;
                const target = stripped.find((g) => g.folder === toFolder);
                const next = target
                    ? stripped.map((g) => (g.folder === toFolder ? { ...g, notes: [...g.notes, moved!] } : g))
                    : [...stripped, { folder: toFolder, notes: [moved] }];
                return next.filter((g) => g.notes.length > 0).sort((a, b) => a.folder.localeCompare(b.folder));
            });
            setTabs((prev) => prev.map((t) => (t.id === id ? { ...t, folder: toFolder } : t)));
            try {
                await fetch(`/pond/api/notes/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ folder: toFolder }),
                });
                loadHome();
            } catch {
                setStatus("move failed");
                loadHome();
            }
        },
        [loadHome]
    );

    const exportBackup = useCallback(async () => {
        try {
            setStatus("building backup…");
            const res = await fetch("/pond/api/backup");
            const data = await res.json();
            const zip = new JSZip();
            const safe = (s: string) => (s || "untitled").replace(/[\\/:*?"<>|\n\r]/g, "_").slice(0, 80);
            (data.folders ?? []).forEach((g: { folder: string; notes: { title: string; note: string }[] }) => {
                const dir = zip.folder(safe(g.folder)) ?? zip;
                const used: Record<string, number> = {};
                g.notes.forEach((n) => {
                    let name = safe(n.title);
                    used[name] = (used[name] || 0) + 1;
                    if (used[name] > 1) name += `-${used[name]}`;
                    dir.file(`${name}.html`, n.note || "");
                });
            });
            const blob = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "pond-backup.zip";
            a.click();
            URL.revokeObjectURL(url);
            setStatus(`backup downloaded ✓ (${data.count ?? 0} notes)`);
        } catch {
            setStatus("backup failed");
        }
    }, []);

    // ---- restore open tabs once authed, then keep them persisted ----
    useEffect(() => {
        if (!authed || restoredRef.current) return;
        const raw = typeof window !== "undefined" ? localStorage.getItem("pond-tabs") : null;
        if (!raw) {
            restoredRef.current = true;
            return;
        }
        let parsed: { ids?: string[]; active?: string };
        try {
            parsed = JSON.parse(raw);
        } catch {
            restoredRef.current = true;
            return;
        }
        const ids = parsed.ids ?? [];
        const active = parsed.active ?? HOME;
        if (!ids.length) {
            restoredRef.current = true;
            return;
        }
        let cancelled = false;
        (async () => {
            const loaded = await Promise.all(
                ids.map(async (id): Promise<NoteTab | null> => {
                    try {
                        const r = await fetch(`/pond/api/notes/${id}`);
                        if (!r.ok) return null;
                        const d = await r.json();
                        return { id, content: d.note ?? "", savedContent: d.note ?? "", folder: d.folder ?? "", loading: false, updatedAt: d.updatedAt ?? null };
                    } catch {
                        return null;
                    }
                })
            );
            if (cancelled) return;
            const valid = loaded.filter((t): t is NoteTab => t !== null);
            setTabs(valid);
            if (active === HOME || valid.some((t) => t.id === active)) setActiveKey(active);
            restoredRef.current = true;
        })();
        return () => {
            cancelled = true;
        };
    }, [authed]);

    useEffect(() => {
        if (!restoredRef.current || typeof window === "undefined") return;
        localStorage.setItem("pond-tabs", JSON.stringify({ ids: tabs.map((t) => t.id), active: activeKey }));
    }, [tabs, activeKey]);

    // ---- shortcuts: Ctrl/Cmd+S save, Ctrl/Cmd+B/I/U format ----
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (!(e.metaKey || e.ctrlKey)) return;
            const k = e.key.toLowerCase();
            if (k === "s") {
                e.preventDefault();
                if (activeKey !== HOME) saveTab(activeKey);
            } else if (activeKey !== HOME && (k === "b" || k === "i" || k === "u")) {
                e.preventDefault();
                format(k === "b" ? "bold" : k === "i" ? "italic" : "underline");
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [activeKey, saveTab, format]);

    return (
        <div className="pond-root">
            <PondScene />
            <LoginGate onAuthed={handleAuthed} />

            <div className="pond-app">
                {/* tab bar: scrollable tabs + a fixed sound toggle */}
                <div className="pond-tabbar">
                    <div className="pond-tabs-scroll">
                        <div
                            className={`pond-tab home ${activeKey === HOME ? "active" : ""}`}
                            onClick={() => setActiveKey(HOME)}
                            title="Home"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 11.5 12 4l9 7.5" />
                                <path d="M5 10v9h14v-9" />
                            </svg>
                        </div>

                        {tabs.map((t) => {
                            const tabDirty = t.content !== t.savedContent;
                            return (
                                <div
                                    key={t.id}
                                    className={`pond-tab ${activeKey === t.id ? "active" : ""}`}
                                    onClick={() => setActiveKey(t.id)}
                                    title={`${t.folder ? t.folder + " / " : ""}${titleFromContent(t.content)}`}
                                    draggable
                                    onDragStart={(e) => e.dataTransfer.setData("tab-id", t.id)}
                                    onDragOver={(e) => {
                                        if (e.dataTransfer.types.includes("tab-id")) e.preventDefault();
                                    }}
                                    onDrop={(e) => {
                                        const from = e.dataTransfer.getData("tab-id");
                                        if (from) {
                                            e.preventDefault();
                                            reorderTabs(from, t.id);
                                        }
                                    }}
                                >
                                    <span className="folder-dot" style={{ background: folderColor(t.folder) }} title={t.folder} />
                                    <span className="pond-tab-title">
                                        {t.loading ? "…" : titleFromContent(t.content)}
                                    </span>
                                    <span
                                        className="pond-tab-affordance"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            closeTab(t.id);
                                        }}
                                        title="Close"
                                    >
                                        {tabDirty ? (
                                            <>
                                                <span className="dot">●</span>
                                                <span className="x when-dirty">✕</span>
                                            </>
                                        ) : (
                                            <span className="x">✕</span>
                                        )}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <SoundToggle />
                </div>

                {/* panel: home or editor */}
                {activeKey === HOME ? (
                    <div className="pond-panel pond-home">
                        <div className="pond-greeting">welcome to the pond 🪷</div>
                        <div className="pond-sub">a calm place to jot things down. your notes float here.</div>

                        <div className="pond-home-actions">
                            <button className="pond-btn" onClick={newNote}>
                                + new note
                            </button>
                            <button className="pond-btn ghost" onClick={loadHome}>
                                ↻ refresh
                            </button>
                            <button className="pond-btn ghost" onClick={exportBackup}>
                                ⬇ export backup
                            </button>
                        </div>

                        {home === null ? (
                            <div className="pond-empty">loading the pond…</div>
                        ) : home.length === 0 ? (
                            <div className="pond-empty">no notes yet — create your first one above.</div>
                        ) : (
                            home.map((g) => {
                                const isOpen = expanded.has(g.folder);
                                return (
                                    <div
                                        className={`pond-folder ${dragOver === g.folder ? "drag-over" : ""}`}
                                        key={g.folder}
                                        onDragOver={(e) => {
                                            if (!e.dataTransfer.types.includes("note-id")) return;
                                            e.preventDefault();
                                            if (dragOver !== g.folder) setDragOver(g.folder);
                                        }}
                                        onDragLeave={(e) => {
                                            if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(null);
                                        }}
                                        onDrop={(e) => {
                                            const id = e.dataTransfer.getData("note-id");
                                            if (!id) return;
                                            e.preventDefault();
                                            setDragOver(null);
                                            moveNote(id, e.dataTransfer.getData("note-folder"), g.folder);
                                        }}
                                    >
                                        <div className="pond-folder-head" onClick={() => toggleFolder(g.folder)}>
                                            <span className={`chev ${isOpen ? "open" : ""}`}>▶</span>
                                            <span className="folder-dot" style={{ background: folderColor(g.folder) }} />
                                            <span>{g.folder}</span>
                                            <span className="count">({g.notes.length})</span>
                                            <button
                                                className="pond-folder-del"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteFolder(g.folder);
                                                }}
                                            >
                                                delete pond
                                            </button>
                                        </div>
                                        {isOpen &&
                                            g.notes.map((n) => (
                                                <div
                                                    className="pond-note-row"
                                                    key={n.id}
                                                    draggable
                                                    onDragStart={(e) => {
                                                        e.dataTransfer.setData("note-id", n.id);
                                                        e.dataTransfer.setData("note-folder", g.folder);
                                                        e.dataTransfer.effectAllowed = "move";
                                                    }}
                                                    onClick={() => openNote(n.id)}
                                                >
                                                    <span style={{ opacity: 0.6 }}>🍃</span>
                                                    <span className="title">{n.title || "Untitled"}</span>
                                                    {(n.updatedAt || n.createdAt) && (
                                                        <span className="note-date">{formatDate(n.updatedAt || n.createdAt)}</span>
                                                    )}
                                                    <button
                                                        className="del"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteNote(n.id);
                                                        }}
                                                    >
                                                        delete
                                                    </button>
                                                </div>
                                            ))}
                                    </div>
                                );
                            })
                        )}
                    </div>
                ) : (
                    <div className="pond-panel">
                        <div className="pond-toolbar">
                            <button className="pond-btn" disabled={!dirty} onClick={() => saveTab(activeKey)}>
                                {dirty ? "save" : "saved"}
                            </button>
                            <span className="pond-status">{status}</span>

                            {/* formatting — buttons darken when active for the current selection */}
                            <button className={`fmt-btn ${fmt.bold ? "active" : ""}`} title="Bold (⌘/Ctrl+B)" onMouseDown={(e) => e.preventDefault()} onClick={() => format("bold")}>
                                <b>B</b>
                            </button>
                            <button className={`fmt-btn ${fmt.italic ? "active" : ""}`} title="Italic (⌘/Ctrl+I)" onMouseDown={(e) => e.preventDefault()} onClick={() => format("italic")}>
                                <i>I</i>
                            </button>
                            <button className={`fmt-btn ${fmt.underline ? "active" : ""}`} title="Underline (⌘/Ctrl+U)" onMouseDown={(e) => e.preventDefault()} onClick={() => format("underline")}>
                                <u>U</u>
                            </button>

                            {/* font size */}
                            <select
                                className="pond-fontsize"
                                value={fontSize}
                                onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                                title="font size"
                            >
                                {[12, 14, 16, 18, 20, 24, 28, 32].map((s) => (
                                    <option key={s} value={s}>{s}px</option>
                                ))}
                            </select>

                            {/* code/source toggle: off = formatted (WYSIWYG), on = see the code */}
                            <label className="pond-switch" title="off: type formatted text · on: show the underlying code + preview">
                                <input type="checkbox" checked={codeView} onChange={(e) => setCodeView(e.target.checked)} />
                                <span className="track"><span className="thumb" /></span>
                                <span className="sw-label">{"</>"}</span>
                            </label>

                            <div className="spacer" />
                            {activeTab?.updatedAt && (
                                <span className="pond-status">edited {formatDate(activeTab.updatedAt)}</span>
                            )}

                            {/* color picker — left of folder name */}
                            <span className="color-ctrl" title="color selected / future text">
                                <button
                                    className="fmt-btn color-apply"
                                    style={{ color }}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => format("color")}
                                >
                                    A
                                </button>
                                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label="pick text color" />
                            </span>

                            <span className="pond-status folder-pill" style={{ textAlign: "right" }}>
                                {activeTab?.folder ? (
                                    <>
                                        <span className="folder-dot" style={{ background: folderColor(activeTab.folder) }} />
                                        {activeTab.folder}
                                    </>
                                ) : ""}
                            </span>
                        </div>

                        {codeView ? (
                            <div className="pond-editor split">
                                <textarea
                                    ref={textareaRef}
                                    className="pond-textarea code"
                                    placeholder={activeTab?.loading ? "loading…" : "<p>source code…</p>"}
                                    value={activeTab?.content ?? ""}
                                    disabled={activeTab?.loading}
                                    spellCheck={false}
                                    style={{ fontSize }}
                                    onChange={(e) => setActiveContent(e.target.value)}
                                />
                                <div className="pond-preview" style={{ fontSize }} dangerouslySetInnerHTML={{ __html: previewHtml }} />
                            </div>
                        ) : (
                            <div className="pond-editor">
                                <div
                                    ref={editorRef}
                                    className="pond-textarea wysiwyg"
                                    contentEditable={!activeTab?.loading}
                                    suppressContentEditableWarning
                                    style={{ fontSize }}
                                    data-placeholder={activeTab?.loading ? "loading…" : "start typing… the first line becomes the title"}
                                    onInput={(e) => setActiveContent((e.target as HTMLDivElement).innerHTML)}
                                    onKeyUp={() => { saveSelection(); refreshFmt(); }}
                                    onMouseUp={() => { saveSelection(); refreshFmt(); }}
                                    onBlur={saveSelection}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
