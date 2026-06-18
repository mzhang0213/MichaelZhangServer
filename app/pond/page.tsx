"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import PondScene from "./PondScene";
import SoundToggle from "./SoundToggle";
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

// Mirror of the server's titleFromContent (Windows-Notepad style).
function titleFromContent(note: string): string {
    const first = note
        .split("\n")
        .map((l) => l.trim())
        .find((l) => l.length > 0);
    if (!first) return "Untitled";
    return first.length > 40 ? first.slice(0, 40) + "…" : first;
}

const HOME = "home";

export default function PondPage() {
    const [tabs, setTabs] = useState<NoteTab[]>([]);
    const [activeKey, setActiveKey] = useState<string>(HOME);
    const [home, setHome] = useState<FolderGroup[] | null>(null);
    const [status, setStatus] = useState("");
    const [expanded, setExpanded] = useState<Set<string>>(new Set()); // folders start collapsed
    const [dragOver, setDragOver] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

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

    useEffect(() => {
        loadHome();
    }, [loadHome]);

    const activeTab = tabs.find((t) => t.id === activeKey) ?? null;
    const dirty = activeTab ? activeTab.content !== activeTab.savedContent : false;

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
            // optimistic: move it in the home view right away
            setHome((prev) => {
                if (!prev) return prev;
                let moved: { id: string; title: string } | undefined;
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

    // Ctrl/Cmd+S saves the active note.
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
                e.preventDefault();
                if (activeKey !== HOME) saveTab(activeKey);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [activeKey, saveTab]);

    return (
        <div className="pond-root">
            <PondScene />

            <div className="pond-app">
                {/* tab bar */}
                <div className="pond-tabbar">
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
                                title={titleFromContent(t.content)}
                            >
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

                    <div style={{ flex: 1 }} />
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
                                        e.preventDefault();
                                        if (dragOver !== g.folder) setDragOver(g.folder);
                                    }}
                                    onDragLeave={(e) => {
                                        if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(null);
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setDragOver(null);
                                        const id = e.dataTransfer.getData("note-id");
                                        const from = e.dataTransfer.getData("note-folder");
                                        moveNote(id, from, g.folder);
                                    }}
                                >
                                    <div className="pond-folder-head" onClick={() => toggleFolder(g.folder)}>
                                        <span className={`chev ${isOpen ? "open" : ""}`}>▶</span>
                                        <span>🌿 {g.folder}</span>
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
                            <button
                                className="pond-btn"
                                disabled={!dirty}
                                onClick={() => saveTab(activeKey)}
                            >
                                {dirty ? "save" : "saved"}
                            </button>
                            <span className="pond-status">{status}</span>
                            <div className="spacer" />
                            {activeTab?.updatedAt && (
                                <span className="pond-status">edited {formatDate(activeTab.updatedAt)}</span>
                            )}
                            <span className="pond-status" style={{ textAlign: "right" }}>
                                {activeTab?.folder ? `🌿 ${activeTab.folder}` : ""}
                            </span>
                        </div>
                        <textarea
                            ref={textareaRef}
                            className="pond-textarea"
                            placeholder={activeTab?.loading ? "loading…" : "start typing… the first line becomes the title"}
                            value={activeTab?.content ?? ""}
                            disabled={activeTab?.loading}
                            onChange={(e) => {
                                const v = e.target.value;
                                setTabs((prev) =>
                                    prev.map((t) => (t.id === activeKey ? { ...t, content: v } : t))
                                );
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
