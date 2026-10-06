"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { hotspots, MOBILE_BREAKPOINT, usesPanel } from "@/lib/hotspots";
import { useStore, type HotspotId } from "@/store/useStore";
import { AboutContent, ContactContent, ProjectsList, SkillsList } from "@/components/sections/Sections";

const CONTENT: Record<HotspotId, { title: string; body: React.ReactNode }> = {
  projects: { title: "Things I've built", body: <ProjectsList /> },
  skills: { title: "My toolbox", body: <SkillsList /> },
  about: { title: "About me", body: <AboutContent /> },
  contact: { title: "Let's talk", body: <ContactContent /> },
};

function useViewportWidth() {
  const [width, setWidth] = useState(() => window.innerWidth);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return width;
}

/** Side panel (desktop) or bottom sheet (mobile) with the active hotspot's content. */
export function Panel() {
  const active = useStore((s) => s.active);
  const width = useViewportWidth();
  const isMobile = width < MOBILE_BREAKPOINT;
  const open = active !== null && usesPanel(active, width);
  const heading = useRef<HTMLHeadingElement>(null);

  // Move focus into the panel so keyboard and screen-reader users land on the content.
  useEffect(() => {
    if (open) heading.current?.focus({ preventScroll: true });
  }, [open, active]);

  return (
    <AnimatePresence>
      {open && active && (
        <motion.aside
          key={active}
          className={isMobile ? "panel panel-sheet" : "panel panel-side"}
          aria-labelledby="panel-title"
          initial={isMobile ? { y: "100%" } : { x: "100%", opacity: 0 }}
          animate={isMobile ? { y: 0 } : { x: 0, opacity: 1 }}
          exit={isMobile ? { y: "100%" } : { x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 260, delay: 0.15 }}
        >
          <p className="panel-eyebrow">{hotspots[active].label}</p>
          <h2 id="panel-title" ref={heading} tabIndex={-1}>
            {CONTENT[active].title}
          </h2>
          {CONTENT[active].body}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
