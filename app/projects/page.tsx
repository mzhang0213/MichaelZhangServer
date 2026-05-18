"use client"
import React, {useEffect, useRef, useState} from "react";
import {Background} from "@/app/resources/Background";
import BackgroundDim from "@/app/resources/BackgroundDim";
import Footer from "@/app/resources/Footer";
import Navbar from "@/app/resources/Navbar";
import {projects} from "@/app/projects";
import {technologies} from "@/app/technologies";
import type {ProjectType} from "@/app/page";
import "./projects.css";

function isMzhangDomain(url: string): boolean {
    if (!url) return false;
    try {
        const u = new URL(url);
        return u.hostname === "mzhang.dev" || u.hostname.endsWith(".mzhang.dev");
    } catch {
        return false;
    }
}

function ProjectPreview({project}: {project: ProjectType}) {
    if (project.preview) {
        return (
            <div className="concept-preview-img" style={{backgroundImage: `url(${project.preview})`}}/>
        );
    }
    if (isMzhangDomain(project.link.link)) {
        return (
            <div className="concept-preview-frame-wrap">
                <iframe
                    src={project.link.link}
                    className="concept-preview-iframe"
                    title={project.title}
                    loading="lazy"
                    sandbox="allow-same-origin allow-scripts"
                />
            </div>
        );
    }
    return (
        <div
            className="concept-preview-fallback"
            style={{background: project.color || "var(--theme-dark-blue)"}}
        >
            <img src={project.icon} alt={project.title}/>
        </div>
    );
}

function ConceptCard({project, onSelect}: {project: ProjectType, onSelect: (id: string) => void}) {
    return (
        <div className="concept-card" onClick={() => onSelect(project.id)}>
            <div className="concept-card-preview">
                <ProjectPreview project={project}/>
            </div>
            <div className="concept-card-title">{project.title}</div>
        </div>
    );
}

function TechList({project}: {project: ProjectType}) {
    return (
        <div className="info-tech-list">
            {project.technology.map(entry => {
                const t = technologies.find(x => x.id === entry.id);
                if (!t) return null;
                const customDesc = entry.description && entry.description.trim();
                const desc = customDesc || t.description;
                return (
                    <div
                        key={t.id}
                        className="info-tech-chip"
                        style={{backgroundColor: t.color}}
                    >
                        <img src={t.icon} alt={t.title}/>
                        <span>{t.title}</span>
                        {desc && (
                            <div className="info-tech-tooltip" role="tooltip">
                                <div className="info-tech-tooltip-title">{t.title}</div>
                                <div className="info-tech-tooltip-body">{desc}</div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function ProjectInfo({project}: {project: ProjectType}) {
    return (
        <div className="info-content" key={project.id}>
            <div className="info-header bubble">
                <div className="info-header-row">
                    <img src={project.icon} alt={project.title} className="info-header-icon"/>
                    <div className="info-header-text">
                        <h2 className="info-header-title">{project.title}</h2>
                        <p
                            className="info-header-desc"
                            dangerouslySetInnerHTML={{__html: project.description || "—"}}
                        />
                    </div>
                </div>
                <div className="info-header-links">
                    {project.link.link && (
                        <a
                            href={project.link.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="info-link-pill"
                        >
                            {project.link.title}
                            <img src="/icons/redirect.png" alt="" className="link-redirect-icon"/>
                        </a>
                    )}
                    {project.github && (
                        <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="info-link-pill info-link-github"
                        >
                            <img src="/icons/github.png" alt="github"/>
                            GitHub
                        </a>
                    )}
                </div>
                <TechList project={project}/>
            </div>

            <div className="info-bubble-stack">
                {project.sections && project.sections.length > 0 ? (
                    project.sections.map((s, i) => (
                        <div key={i} className="bubble info-bubble">
                            <h3 className="info-bubble-title">{s.title}</h3>
                            <p className="info-bubble-body" dangerouslySetInnerHTML={{__html: s.body}}/>
                        </div>
                    ))
                ) : (
                    <div className="bubble info-bubble info-bubble-placeholder">
                        <h3 className="info-bubble-title">Process & Notes</h3>
                        <p className="info-bubble-body">
                            More on this project's development process is coming soon —
                            architecture choices, what I'd do differently, and what I learned.
                        </p>
                    </div>
                )}
            </div>

            <div className="info-section">
                <h3 className="info-section-heading">Gallery</h3>
                {project.gallery && project.gallery.length > 0 ? (
                    <div className="info-gallery">
                        {project.gallery.map((g, i) => (
                            <figure key={i} className="info-gallery-item">
                                <img src={g.src} alt={g.caption || `${project.title} screenshot ${i + 1}`}/>
                                {g.caption && <figcaption>{g.caption}</figcaption>}
                            </figure>
                        ))}
                    </div>
                ) : (
                    <div className="info-empty">No screenshots yet — check back soon.</div>
                )}
            </div>

            <div className="info-section">
                <h3 className="info-section-heading">Timeline</h3>
                {project.timeline && project.timeline.length > 0 ? (
                    <ol className="info-timeline">
                        {project.timeline.map((t, i) => (
                            <li key={i} className="info-timeline-entry">
                                <div className="info-timeline-dot"/>
                                <div className="info-timeline-card bubble">
                                    <div className="info-timeline-date">{t.date}</div>
                                    <div className="info-timeline-label">{t.label}</div>
                                    {t.body && <div className="info-timeline-body">{t.body}</div>}
                                </div>
                            </li>
                        ))}
                    </ol>
                ) : (
                    <div className="info-empty">Timeline coming soon.</div>
                )}
            </div>
        </div>
    );
}

export default function ProjectsPage() {
    const [selectedId, setSelectedId] = useState<string>(projects[0]?.id ?? "");
    const infoPanelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.body.style.overflowX = "hidden";
    }, []);

    const onSelectFromGrid = (id: string) => {
        setSelectedId(id);
        requestAnimationFrame(() => {
            infoPanelRef.current?.scrollIntoView({behavior: "smooth", block: "start"});
        });
    };

    const selected = projects.find(p => p.id === selectedId) || projects[0];

    return (
        <>
            <Navbar customItems={null} alwaysShow={true}/>
            <Background/>
            <BackgroundDim/>

            <main className="projects-page">
                <header className="projects-hero">
                    <h1 className="projects-hero-title">Projects</h1>
                    <p className="projects-hero-sub">
                        A peek into what I&apos;ve been building — click a card to dive into the
                        full story.
                    </p>
                </header>

                <section id="concepts" className="concepts-section">
                    <div className="concepts-grid">
                        {projects.map(p => (
                            <ConceptCard key={p.id} project={p} onSelect={onSelectFromGrid}/>
                        ))}
                    </div>
                </section>

                <section id="projectInfo" className="info-section-wrap" ref={infoPanelRef}>
                    <div className="info-selector-strip" role="tablist" aria-label="Select project">
                        {projects.map(p => (
                            <button
                                key={p.id}
                                type="button"
                                role="tab"
                                aria-selected={p.id === selectedId}
                                className={`info-selector-chip${p.id === selectedId ? " is-active" : ""}`}
                                onClick={() => setSelectedId(p.id)}
                                title={p.title}
                            >
                                <img src={p.icon} alt="" aria-hidden="true"/>
                                <span>{p.title}</span>
                            </button>
                        ))}
                    </div>

                    {selected && <ProjectInfo project={selected}/>}
                </section>
            </main>

            <Footer customItems={null}/>
        </>
    );
}
