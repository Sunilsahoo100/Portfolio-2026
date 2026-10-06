"use client";

import { useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { PerspectiveCamera, Vector3 } from "three";
import { computeView, introPosition } from "@/lib/hotspots";
import { useStore } from "@/store/useStore";

const up = new Vector3(0, 1, 0);
const desired = new Vector3();
const right = new Vector3();
const camUp = new Vector3();
const forward = new Vector3();

/** Flies the camera between the overview and each hotspot, with mouse parallax in the overview. */
export function CameraRig({ reducedMotion }: { reducedMotion: boolean }) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const width = useThree((s) => s.size.width);
  const height = useThree((s) => s.size.height);
  const active = useStore((s) => s.active);
  const phase = useStore((s) => s.phase);
  const look = useMemo(() => new Vector3(-0.3, 1.2, -0.6), []);

  const view = useMemo(
    () => computeView(active, width, height, camera.fov),
    [active, width, height, camera.fov],
  );

  useFrame(({ pointer }, delta) => {
    if (phase === "loading") {
      camera.position.copy(introPosition);
      camera.lookAt(look);
      return;
    }

    desired.copy(view.position);
    if (active === null && phase === "ready" && !reducedMotion) {
      forward.subVectors(view.target, view.position).normalize();
      right.crossVectors(forward, up).normalize();
      camUp.crossVectors(right, forward).normalize();
      desired.addScaledVector(right, pointer.x * 0.45).addScaledVector(camUp, pointer.y * 0.25);
    }

    const smooth = reducedMotion ? 0.05 : phase === "intro" ? 0.9 : 0.45;
    easing.damp3(camera.position, desired, smooth, delta);
    easing.damp3(look, view.target, smooth, delta);
    camera.lookAt(look);
  });

  return null;
}
