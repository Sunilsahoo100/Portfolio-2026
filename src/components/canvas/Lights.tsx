"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import {
  Color,
  type AmbientLight,
  type DirectionalLight,
  type HemisphereLight,
  type PointLight,
} from "three";
import { sceneState, useStore } from "@/store/useStore";

const mix = (a: number, b: number, t: number) => a + (b - a) * t;

const DAY_BG = new Color("#e8dccb");
const NIGHT_BG = new Color("#06060f");
const SUN = new Color("#ffe2b8");
const MOON = new Color("#8fb4ff");
const SKY_DAY = new Color("#fff4e0");
const SKY_NIGHT = new Color("#4c4ca8");

/** Lamp head position, shared with the lamp mesh in Desk.tsx. */
export const LAMP_LIGHT_POSITION: [number, number, number] = [-0.62, 1.2, -2.42];

export function Lights() {
  const ambient = useRef<AmbientLight>(null);
  const hemi = useRef<HemisphereLight>(null);
  const sun = useRef<DirectionalLight>(null);
  const lamp = useRef<PointLight>(null);
  const screen = useRef<PointLight>(null);
  const neon = useRef<PointLight>(null);
  const background = useRef<Color>(null);
  const shadows = useStore((s) => s.quality === "high");

  useFrame((_, delta) => {
    const theme = useStore.getState().theme;
    easing.damp(sceneState, "night", theme === "night" ? 1 : 0, 0.5, delta);
    const n = sceneState.night;
    const p = sceneState.power;

    background.current!.lerpColors(DAY_BG, NIGHT_BG, n);

    ambient.current!.intensity = mix(0.55, 0.12, n) * mix(0.15, 1, p);
    hemi.current!.intensity = mix(0.9, 0.55, n) * mix(0.1, 1, p);
    hemi.current!.color.lerpColors(SKY_DAY, SKY_NIGHT, n);
    sun.current!.intensity = mix(2.6, 0.55, n) * p;
    sun.current!.color.lerpColors(SUN, MOON, n);
    lamp.current!.intensity = mix(1.0, 3.4, n) * p;
    screen.current!.intensity = mix(0.4, 2.2, n) * p * sceneState.monitor;
    neon.current!.intensity = 5 * n * p;
  });

  return (
    <>
      <color ref={background} attach="background" args={[NIGHT_BG]} />
      <ambientLight ref={ambient} />
      <hemisphereLight ref={hemi} groundColor="#3b2a20" />
      {/* Sunlight / moonlight through the window on the left wall. */}
      <directionalLight
        ref={sun}
        position={[-6, 5.5, 2.5]}
        castShadow={shadows}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-camera-near={1}
        shadow-camera-far={16}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      <pointLight ref={lamp} position={LAMP_LIGHT_POSITION} color="#ffb067" distance={4.5} decay={1.6} />
      <pointLight ref={screen} position={[0.2, 1.25, -2.1]} color="#7dd3fc" distance={2.6} decay={1.8} />
      <pointLight ref={neon} position={[0.2, 3.0, -2.6]} color="#a855f7" distance={5} decay={1.4} />
    </>
  );
}
