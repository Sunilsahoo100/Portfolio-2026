import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { MeshStandardMaterial } from "three";
import { sceneState } from "@/store/useStore";

/**
 * Drives a material's emissive intensity from the shared scene state each frame
 * (power-on intro, day/night blend) without re-rendering React.
 */
export function useGlow(compute: (s: typeof sceneState, time: number) => number) {
  const ref = useRef<MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.emissiveIntensity = compute(sceneState, clock.elapsedTime);
  });
  return ref;
}
