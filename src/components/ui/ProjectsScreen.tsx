"use client";

import { useState } from "react";
import { profile, projects } from "@/data/portfolio";
import { useStore } from "@/store/useStore";

const fileName = (title: string) => `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.tsx`;

/** Code-editor style project browser rendered on the 3D monitor (desktop). */
export function ProjectsScreen() {
  const [index, setIndex] = useState(0);
  const setActive = useStore((s) => s.setActive);
  const project = projects[index];

  return (
    <div className="ide" role="region" aria-label="Projects">
      <header className="ide-bar">
        <span className="ide-lights" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="ide-title">
          ~/projects — {profile.firstName.toLowerCase()}@portfolio
        </span>
        <button type="button" className="ide-close" onClick={() => setActive(null)} aria-label="Close projects">
          ×
        </button>
      </header>
      <div className="ide-body">
        <nav className="ide-explorer" aria-label="Project list">
          <p className="ide-heading">Explorer</p>
          {projects.map((p, i) => (
            <button
              key={p.title}
              type="button"
              className={i === index ? "is-active" : ""}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              style={{ "--accent": p.accent } as React.CSSProperties}
            >
              <span aria-hidden>◆</span> {fileName(p.title)}
            </button>
          ))}
        </nav>
        <article key={project.title} className="ide-editor" style={{ "--accent": project.accent } as React.CSSProperties}>
          <p className="ide-tab">{fileName(project.title)}</p>
          <p className="ide-comment">{"// "}{project.tagline}</p>
          <h3>{project.title}</h3>
          <p className="ide-desc">{project.description}</p>
          <p className="ide-code">
            <span className="k">const</span> stack = [
            {project.tech.map((t, i) => (
              <span key={t}>
                <span className="s">&apos;{t}&apos;</span>
                {i < project.tech.length - 1 ? ", " : ""}
              </span>
            ))}
            ];
          </p>
          <div className="ide-links">
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer">
                View code ↗
              </a>
            )}
            {project.live && (
              <a href={project.live} target="_blank" rel="noreferrer" className="primary">
                Live demo ↗
              </a>
            )}
          </div>
          <p className="ide-terminal">
            <span>$</span> npm run deploy <em>✓ shipped</em>
          </p>
        </article>
      </div>
    </div>
  );
}
