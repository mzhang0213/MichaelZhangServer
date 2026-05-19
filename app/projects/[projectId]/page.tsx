"use client"
import React, {useEffect, useRef} from "react";
import Link from "next/link";
import {useParams, useRouter} from "next/navigation";
import {Background} from "@/app/resources/Background";
import BackgroundDim from "@/app/resources/BackgroundDim";
import Footer from "@/app/resources/Footer";
import Navbar from "@/app/resources/Navbar";
import {projects} from "@/app/projects";
import {technologies} from "@/app/technologies";
import type {ProjectType} from "@/app/page";
import "../projects.css";

function TechChip({entry}: {
    entry: ProjectType["technology"][number],
}) {
    const chipRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const t = technologies.find(x => x.id === entry.id);
    if (!t) return null;

    const customDesc = entry.description && entry.description.trim();
    const desc = customDesc || t.description;

    const handleEnter = () => {
        const chip = chipRef.current;
        const tip = tooltipRef.current;
        if (!chip || !tip) return;
        // offsetWidth ignores transforms — gives us the true layout width
        // even while the tooltip is currently scaled to 0.
        const tipWidth = tip.offsetWidth;
        const chipRect = chip.getBoundingClientRect();
        const chipCenterX = chipRect.left + chipRect.width / 2;
        const margin = 8;
        const leftEdge = chipCenterX - tipWidth / 2;
        const rightEdge = chipCenterX + tipWidth / 2;
        let shift = 0;
        if (rightEdge > window.innerWidth - margin) {
            shift = window.innerWidth - margin - rightEdge;
        }
        if (leftEdge + shift < margin) {
            shift = margin - leftEdge;
        }
        tip.style.setProperty("--tooltip-shift", `${shift}px`);
    };

    return (
        <div
            ref={chipRef}
            className="info-tech-chip"
            style={{backgroundColor: t.color}}
            onMouseEnter={handleEnter}
            onFocus={handleEnter}
        >
            <img src={t.icon} alt={t.title}/>
            <span>{t.title}</span>
            {desc && (
                <div ref={tooltipRef} className="info-tech-tooltip" role="tooltip">
                    <div className="info-tech-tooltip-title">{t.title}</div>
                    <div className="info-tech-tooltip-body">{desc}</div>
                </div>
            )}
        </div>
    );
}

function TechList({project}: {project: ProjectType}) {
    return (
        <div className="info-tech-list">
            {project.technology.map(entry => (
                <TechChip key={entry.id} entry={entry}/>
            ))}
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
                            More on this project&apos;s development process is coming soon —
                            architecture choices, what I&apos;d do differently, and what I learned.
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

export default function ProjectDetailPage() {
    const params = useParams<{projectId: string}>();
    const router = useRouter();
    const projectId = params?.projectId;
    const project = projects.find(p => p.id === projectId);

    useEffect(() => {
        document.body.style.overflowX = "hidden";
        document.body.classList.add("scrollbar-hide");
        return () => {
            document.body.classList.remove("scrollbar-hide");
        };
    }, []);

    return (
        <>
            <Navbar customItems={null} alwaysShow={true}/>
            <Background/>
            <BackgroundDim/>

            <main className="project-detail-page">
                <div className="project-detail-topbar">
                    <Link href="/projects" className="project-detail-back">
                        <span>←</span>
                        <span>All projects</span>
                    </Link>
                </div>

                <div className="info-selector-strip scrollbar-hide" role="tablist" aria-label="Switch project">
                    {projects.map(p => (
                        <button
                            key={p.id}
                            type="button"
                            role="tab"
                            aria-selected={p.id === projectId}
                            className={`info-selector-chip${p.id === projectId ? " is-active" : ""}`}
                            onClick={() => router.push(`/projects/${p.id}`)}
                            title={p.title}
                        >
                            <img src={p.icon} alt="" aria-hidden="true"/>
                            <span>{p.title}</span>
                        </button>
                    ))}
                </div>

                {project ? (
                    <ProjectInfo project={project}/>
                ) : (
                    <div className="info-empty">
                        Project not found. <Link href="/projects">Back to projects</Link>.
                    </div>
                )}
            </main>

            <Footer customItems={null}/>
        </>
    );
}
