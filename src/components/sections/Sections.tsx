"use client";

import { useState } from "react";
import { education, experience, profile, projects, skillGroups, type Project } from "@/data/portfolio";

/** Content blocks shared by the 3D panels and the classic view. */

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="card" style={{ "--accent": project.accent } as React.CSSProperties}>
      <p className="card-eyebrow">{project.tagline}</p>
      <h3 className="card-title">{project.title}</h3>
      <p className="card-body">{project.description}</p>
      <ul className="tags" aria-label="Tech stack">
        {project.tech.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <div className="card-links">
        {project.github && (
          <a href={project.github} target="_blank" rel="noreferrer">
            Code ↗
          </a>
        )}
        {project.live && (
          <a href={project.live} target="_blank" rel="noreferrer">
            Live demo ↗
          </a>
        )}
      </div>
    </article>
  );
}

export function ProjectsList() {
  return (
    <div className="stack">
      {projects.map((p) => (
        <ProjectCard key={p.title} project={p} />
      ))}
    </div>
  );
}

const LEVELS = ["Learning", "Comfortable", "Advanced", "Expert"];

export function SkillsList() {
  return (
    <div className="stack">
      {skillGroups.map((group) => (
        <section key={group.category}>
          <h3 className="group-title" style={{ color: group.color }}>
            {group.category}
          </h3>
          <ul className="skills">
            {group.skills.map((s) => (
              <li key={s.name}>
                <span>{s.name}</span>
                <span className="meter" aria-label={s.level} title={s.level}>
                  {LEVELS.map((l, i) => (
                    <i
                      key={l}
                      style={{ background: i <= LEVELS.indexOf(s.level) ? group.color : undefined }}
                    />
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function AboutContent() {
  return (
    <div className="stack">
      {profile.bio.map((p, i) => (
        <p key={i} className="lead">
          {p}
        </p>
      ))}
      <section>
        <h3 className="group-title">Experience</h3>
        <ol className="timeline">
          {experience.map((e) => (
            <li key={e.role + e.company}>
              <p className="timeline-period">{e.period}</p>
              <p className="timeline-role">
                {e.role} · <span>{e.company}</span>
              </p>
              <ul>
                {e.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            </li>
          ))}
          <li>
            <p className="timeline-period">{education.period}</p>
            <p className="timeline-role">
              {education.degree} · <span>{education.school}</span>
            </p>
          </li>
        </ol>
      </section>
    </div>
  );
}

export function ContactContent() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <div className="stack">
      <p className="lead">
        Have a project in mind, a role to fill, or just want to say hi? My inbox is always open.
      </p>
      <div className="contact-row">
        <a className="btn btn-primary" href={`mailto:${profile.email}`}>
          Say hello ✉
        </a>
        <button type="button" className="btn" onClick={copy}>
          {copied ? "Copied!" : "Copy email"}
        </button>
      </div>
      <ul className="socials">
        {profile.socials.map((s) => (
          <li key={s.label}>
            <a href={s.url} target="_blank" rel="noreferrer">
              {s.label} ↗
            </a>
          </li>
        ))}
        {profile.resumeUrl && (
          <li>
            <a href={profile.resumeUrl} target="_blank" rel="noreferrer">
              Resume (PDF) ↓
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}
