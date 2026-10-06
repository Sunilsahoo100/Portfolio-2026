import type { Quality } from "@/store/useStore";

/** Initial render quality guessed from the device; PerformanceMonitor can still lower it later. */
export function detectQuality(): Quality {
  const params = new URLSearchParams(window.location.search);
  const forced = params.get("quality");
  if (forced === "high" || forced === "low") return forced;

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const cores = navigator.hardwareConcurrency ?? 8;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  if ((coarse && window.innerWidth < 1024) || cores <= 4 || memory <= 4) return "low";
  return "high";
}

export function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
