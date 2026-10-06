"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { AnimatePresence, motion } from "motion/react";
import { profile } from "@/data/portfolio";
import { sceneState, useStore } from "@/store/useStore";

/** Runs the power-on timeline and shows the headline over the overview. */
export function Intro({ reducedMotion }: { reducedMotion: boolean }) {
  const phase = useStore((s) => s.phase);
  const active = useStore((s) => s.active);
  const setPhase = useStore((s) => s.setPhase);

  useEffect(() => {
    if (phase !== "intro") return;
    if (reducedMotion) {
      sceneState.monitor = 1;
      sceneState.power = 1;
      setPhase("ready");
      return;
    }
    // Monitor flickers on, then the room lights fade up while the camera dollies in.
    const tl = gsap.timeline({ onComplete: () => setPhase("ready") });
    tl.to(sceneState, { monitor: 0.8, duration: 0.06 })
      .to(sceneState, { monitor: 0.1, duration: 0.08 })
      .to(sceneState, { monitor: 1, duration: 0.05 })
      .to(sceneState, { monitor: 0.3, duration: 0.07 })
      .to(sceneState, { monitor: 1, duration: 0.1 })
      .to(sceneState, { power: 1, duration: 1.6, ease: "power2.inOut" }, "+=0.15")
      .to({}, { duration: 0.6 });
    return () => {
      tl.kill();
    };
  }, [phase, reducedMotion, setPhase]);

  const visible = phase !== "loading" && active === null;
  const tagline = profile.headline;

  return (
    <AnimatePresence>
      {visible && (
        <motion.header
          className="headline"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0, transition: { delay: reducedMotion ? 0 : 0.3, duration: 0.6 } }}
          exit={{ opacity: 0, y: -8, transition: { duration: 0.25 } }}
        >
          <p className="headline-hi">Hi, I&apos;m</p>
          <h1>{profile.name}</h1>
          <p className="headline-role">
            {profile.role} —{" "}
            <span aria-label={tagline}>
              {tagline.split("").map((ch, i) => (
                <motion.span
                  key={i}
                  aria-hidden
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: reducedMotion ? 0 : 0.8 + i * 0.035, duration: 0.01 }}
                >
                  {ch}
                </motion.span>
              ))}
            </span>
          </p>
          {phase === "ready" && (
            <motion.p className="headline-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              Click around the room to explore ✦
            </motion.p>
          )}
        </motion.header>
      )}
    </AnimatePresence>
  );
}
