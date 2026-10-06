import { create } from "zustand";

export type HotspotId = "projects" | "skills" | "about" | "contact";
export type Phase = "loading" | "intro" | "ready";
export type Quality = "high" | "low";

interface State {
  /** False until the client has detected quality and the initial view. */
  initialized: boolean;
  view: "3d" | "classic";
  phase: Phase;
  /** True once the 3D scene has rendered its first frame. */
  sceneReady: boolean;
  active: HotspotId | null;
  theme: "day" | "night";
  quality: Quality;
  /** Index into funFacts, or null when the toast is hidden. */
  fact: number | null;
  init: (quality: Quality, view: State["view"]) => void;
  setView: (view: State["view"]) => void;
  setPhase: (phase: Phase) => void;
  setSceneReady: (ready: boolean) => void;
  setActive: (active: HotspotId | null) => void;
  toggleTheme: () => void;
  setQuality: (quality: Quality) => void;
  setFact: (fact: number | null) => void;
}

export const useStore = create<State>((set) => ({
  initialized: false,
  view: "3d",
  phase: "loading",
  sceneReady: false,
  active: null,
  theme: "night",
  quality: "high",
  fact: null,
  init: (quality, view) => set({ quality, view, initialized: true }),
  setView: (view) => set({ view, active: null }),
  setPhase: (phase) => set({ phase }),
  setSceneReady: (sceneReady) => set({ sceneReady }),
  setActive: (active) => set({ active }),
  toggleTheme: () => set((s) => ({ theme: s.theme === "day" ? "night" : "day" })),
  setQuality: (quality) => set({ quality }),
  setFact: (fact) => set({ fact }),
}));

/**
 * Values animated every frame (by GSAP or damping). Kept outside React so
 * tweening them never triggers re-renders; scene components read them in useFrame.
 */
export const sceneState = {
  /** 0 → room dark (before intro), 1 → powered on. */
  power: 0,
  /** 0 → day, 1 → night. Damped toward the store's theme. */
  night: 1,
  /** Monitor flicker multiplier during intro. */
  monitor: 0,
  /** Burst of steam from the mug (decays to 0). */
  steam: 0,
};
