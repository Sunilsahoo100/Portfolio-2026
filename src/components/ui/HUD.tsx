"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { funFacts } from "@/data/portfolio";
import { useStore } from "@/store/useStore";

/** Top-right controls, back button, Esc handling and the mug's fun-fact toast. */
export function HUD() {
  const phase = useStore((s) => s.phase);
  const active = useStore((s) => s.active);
  const theme = useStore((s) => s.theme);
  const fact = useStore((s) => s.fact);
  const setActive = useStore((s) => s.setActive);
  const toggleTheme = useStore((s) => s.toggleTheme);
  const setView = useStore((s) => s.setView);
  const setFact = useStore((s) => s.setFact);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setActive]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    if (fact === null) return;
    const id = setTimeout(() => setFact(null), 4500);
    return () => clearTimeout(id);
  }, [fact, setFact]);

  if (phase === "loading") return null;

  return (
    <>
      <div className="hud-top">
        <button
          type="button"
          className="hud-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "night" ? "day" : "night"} mode`}
          title={`Switch to ${theme === "night" ? "day" : "night"} mode`}
        >
          {theme === "night" ? "☀︎" : "☾"}
        </button>
        <button type="button" className="hud-btn hud-btn-text" onClick={() => setView("classic")}>
          Classic view
        </button>
      </div>

      <AnimatePresence>
        {active && (
          <motion.button
            type="button"
            className="hud-back"
            onClick={() => setActive(null)}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
          >
            ← Back to room <kbd>Esc</kbd>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {fact !== null && (
          <motion.div
            key={fact}
            className="toast"
            role="status"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
          >
            <span aria-hidden>☕</span> {funFacts[fact]}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
