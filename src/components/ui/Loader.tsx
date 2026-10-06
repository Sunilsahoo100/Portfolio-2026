"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { profile } from "@/data/portfolio";
import { useStore } from "@/store/useStore";

const LINES = [
  "booting portfolio v1.0.0",
  "loading furniture.............ok",
  "brewing coffee................ok",
  "compiling shaders.............ok",
  `welcome, visitor — this is ${profile.firstName}'s room`,
];

/** Terminal-style boot screen; hands over to the intro once the scene is ready. */
export function Loader({ reducedMotion }: { reducedMotion: boolean }) {
  const phase = useStore((s) => s.phase);
  const sceneReady = useStore((s) => s.sceneReady);
  const setPhase = useStore((s) => s.setPhase);
  const [shown, setShown] = useState(reducedMotion ? LINES.length : 0);
  const bootDone = shown >= LINES.length;
  const progress = Math.round((Math.min(shown, LINES.length) / LINES.length) * (sceneReady ? 100 : 90));

  useEffect(() => {
    if (bootDone) return;
    const id = setTimeout(() => setShown((n) => n + 1), 320);
    return () => clearTimeout(id);
  }, [shown, bootDone]);

  useEffect(() => {
    if (phase !== "loading" || !bootDone || !sceneReady) return;
    const id = setTimeout(() => setPhase("intro"), reducedMotion ? 0 : 450);
    return () => clearTimeout(id);
  }, [phase, bootDone, sceneReady, setPhase, reducedMotion]);

  return (
    <AnimatePresence>
      {phase === "loading" && (
        <motion.div
          className="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8 } }}
          role="status"
          aria-live="polite"
        >
          <div className="loader-term">
            {LINES.slice(0, shown).map((line) => (
              <p key={line}>
                <span>&gt;</span> {line}
              </p>
            ))}
            <p className="loader-progress">
              <span>&gt;</span> {progress}%<i className="caret" aria-hidden />
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
