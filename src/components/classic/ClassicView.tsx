"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { motion } from "motion/react";
import { profile, projects } from "@/data/portfolio";
import { AboutContent, ContactContent, ProjectCard, SkillsList } from "@/components/sections/Sections";

function Reveal({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="classic-section" aria-labelledby={`${id}-title`}>
      <Reveal>
        <h2 id={`${id}-title`} className="classic-h2">
          {title}
        </h2>
        {children}
      </Reveal>
    </section>
  );
}

/**
 * Plain, fast, accessible version of the portfolio. Also rendered (hidden) behind
 * the 3D view so search engines can read the content.
 */
export function ClassicView({
  active,
  canUse3D,
  onEnter3D,
}: {
  active: boolean;
  canUse3D: boolean;
  onEnter3D: () => void;
}) {
  useEffect(() => {
    if (!active || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, anchors: true });
    return () => lenis.destroy();
  }, [active]);

  return (
    <div className="classic">
      <nav className="classic-nav" aria-label="Sections">
        <a href="#top" className="classic-logo">
          {profile.firstName.toLowerCase()}
          <span>.dev</span>
        </a>
        <div>
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#contact">Contact</a>
          {canUse3D && (
            <button type="button" className="btn btn-primary btn-sm" onClick={onEnter3D}>
              Enter 3D room
            </button>
          )}
        </div>
      </nav>

      <main id="top" className="classic-main">
        <header className="classic-hero">
          <p className="headline-hi">Hi, I&apos;m</p>
          <h1>{profile.name}</h1>
          <p className="classic-tagline">
            {profile.role} — {profile.headline}
          </p>
          <div className="contact-row">
            <a className="btn btn-primary" href="#projects">
              See my work
            </a>
            <a className="btn" href="#contact">
              Get in touch
            </a>
          </div>
        </header>

        <Section id="about" title="About me">
          <AboutContent />
        </Section>

        <Section id="projects" title="Things I've built">
          <div className="grid">
            {projects.map((p) => (
              <ProjectCard key={p.title} project={p} />
            ))}
          </div>
        </Section>

        <Section id="skills" title="My toolbox">
          <SkillsList />
        </Section>

        <Section id="contact" title="Let's talk">
          <ContactContent />
        </Section>
      </main>

      <footer className="classic-footer">
        © {new Date().getFullYear()} {profile.name}. Built with Next.js & React Three Fiber.
      </footer>
    </div>
  );
}
