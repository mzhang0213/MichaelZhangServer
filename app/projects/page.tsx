"use client"
import React, {useEffect} from "react";
import Link from "next/link";
import {Background} from "@/app/resources/Background";
import BackgroundDim from "@/app/resources/BackgroundDim";
import Footer from "@/app/resources/Footer";
import Navbar from "@/app/resources/Navbar";
import {projects} from "@/app/projects";
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

function ConceptCard({project}: {project: ProjectType}) {
    return (
        <Link href={`/projects/${project.id}`} className="concept-card" prefetch>
            <div className="concept-card-preview">
                <ProjectPreview project={project}/>
            </div>
            <div className="concept-card-title">{project.title}</div>
        </Link>
    );
}

export default function ProjectsPage() {
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
                            <ConceptCard key={p.id} project={p}/>
                        ))}
                    </div>
                </section>
            </main>

            <Footer customItems={null}/>
        </>
    );
}
