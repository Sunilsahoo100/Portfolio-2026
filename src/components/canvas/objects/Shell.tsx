"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, type Group, type MeshStandardMaterial } from "three";
import { createPosterTexture } from "@/lib/textures";
import { sceneState } from "@/store/useStore";
import { useGlow } from "../useGlow";

const WALL = "#ece3d6";
const WALL_H = 3.4;
// Window opening in the left wall (z/y centre and size).
const WIN = { z: 1.0, y: 1.8, w: 1.5, h: 1.3 };

/** Floor, walls with a real window opening, rug, poster, clock and LED strips. */
export function Shell() {
  return (
    <group>
      {/* Floor slab */}
      <mesh position={[-0.1, -0.125, -0.1]}>
        <boxGeometry args={[6.2, 0.25, 6.2]} />
        <meshStandardMaterial color="#9a6a4b" roughness={0.75} />
      </mesh>
      {/* Floor planks */}
      {Array.from({ length: 10 }, (_, i) => (
        <mesh key={i} position={[-2.7 + i * 0.6, 0.002, -0.1]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[0.012, 6.2]} />
          <meshStandardMaterial color="#7a4f36" />
        </mesh>
      ))}

      {/* Back wall */}
      <mesh position={[-0.1, WALL_H / 2, -3.1]}>
        <boxGeometry args={[6.2, WALL_H, 0.2]} />
        <meshStandardMaterial color={WALL} roughness={0.95} />
      </mesh>
      <LeftWall />

      {/* Baseboards */}
      <mesh position={[0, 0.05, -2.985]}>
        <boxGeometry args={[6, 0.1, 0.03]} />
        <meshStandardMaterial color="#d6c7b2" />
      </mesh>
      <mesh position={[-2.985, 0.05, 0]}>
        <boxGeometry args={[0.03, 0.1, 6]} />
        <meshStandardMaterial color="#d6c7b2" />
      </mesh>

      {/* Rug */}
      <mesh position={[0.3, 0.006, -1.3]}>
        <cylinderGeometry args={[1.45, 1.45, 0.012, 48]} />
        <meshStandardMaterial color="#1f4f5a" roughness={1} />
      </mesh>
      <mesh position={[0.3, 0.008, -1.3]}>
        <cylinderGeometry args={[1.15, 1.15, 0.012, 48]} />
        <meshStandardMaterial color="#2a6b72" roughness={1} />
      </mesh>

      <Poster />
      <Clock />
      <LedStrip position={[0, 3.3, -2.975]} length={6} rotation={0} />
      <LedStrip position={[-2.975, 3.3, 0]} length={6} rotation={Math.PI / 2} />
    </group>
  );
}

function LeftWall() {
  const x = -3.1;
  const zMin = -3;
  const zMax = 3;
  const left = WIN.z - WIN.w / 2;
  const right = WIN.z + WIN.w / 2;
  const bottom = WIN.y - WIN.h / 2;
  const top = WIN.y + WIN.h / 2;
  const mat = <meshStandardMaterial color={WALL} roughness={0.95} />;
  return (
    <group>
      {/* Pieces around the window opening, so sunlight really comes through it. */}
      <mesh position={[x, WALL_H / 2, (zMin + left) / 2]}>
        <boxGeometry args={[0.2, WALL_H, left - zMin]} />
        {mat}
      </mesh>
      <mesh position={[x, WALL_H / 2, (right + zMax) / 2]}>
        <boxGeometry args={[0.2, WALL_H, zMax - right]} />
        {mat}
      </mesh>
      <mesh position={[x, bottom / 2, WIN.z]}>
        <boxGeometry args={[0.2, bottom, WIN.w]} />
        {mat}
      </mesh>
      <mesh position={[x, (top + WALL_H) / 2, WIN.z]}>
        <boxGeometry args={[0.2, WALL_H - top, WIN.w]} />
        {mat}
      </mesh>
      <Window />
    </group>
  );
}

const SKY_DAY = new Color("#8ccfff");
const SKY_NIGHT = new Color("#0a1433");

function Window() {
  const skyMat = useRef<MeshStandardMaterial>(null);
  const moon = useGlow((s) => 2.2 * s.night);
  const night = useRef<Group>(null);
  const frame = "#f4efe6";

  // The camera looks through the window toward -z, so the sky extends that way.
  // Its top stays below the wall top so it never peeks over the wall.
  const sky = { y: 1.8, z: WIN.z - 0.6, w: 3.2, h: 2.2 };
  const starPositions = useMemo(
    () =>
      Array.from({ length: 34 }, (_, i) => [
        -3.55,
        sky.y - sky.h / 2 + 0.15 + ((i * 0.37) % 1) * (sky.h - 0.3),
        sky.z - sky.w / 2 + 0.15 + ((i * 0.61) % 1) * (sky.w - 0.3),
      ] as [number, number, number]),
    [sky.y, sky.z, sky.w, sky.h],
  );

  useFrame(() => {
    const n = sceneState.night;
    if (skyMat.current) {
      skyMat.current.emissive.lerpColors(SKY_DAY, SKY_NIGHT, n);
      skyMat.current.emissiveIntensity = 0.9 + 0.1 * n;
    }
    if (night.current) night.current.visible = n > 0.5;
  });

  const bar = (pos: [number, number, number], size: [number, number, number]) => (
    <mesh position={pos}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={frame} />
    </mesh>
  );

  return (
    <group>
      {/* Sky backdrop outside the window (never casts shadows). */}
      <mesh position={[-3.6, sky.y, sky.z]} rotation-y={Math.PI / 2} userData={{ noShadow: true }}>
        <planeGeometry args={[sky.w, sky.h]} />
        <meshStandardMaterial ref={skyMat} color="#000" />
      </mesh>
      {/* Moon and stars, only visible at night */}
      <group ref={night}>
        <mesh position={[-3.56, 1.72, 0.45]} rotation-y={Math.PI / 2} userData={{ noShadow: true }}>
          <circleGeometry args={[0.13, 32]} />
          <meshStandardMaterial ref={moon} color="#000" emissive="#fff3c4" toneMapped={false} />
        </mesh>
        {starPositions.map((p, i) => (
          <mesh key={i} position={p} rotation-y={Math.PI / 2} userData={{ noShadow: true }}>
            <circleGeometry args={[0.01 + (i % 3) * 0.004, 6]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>

      {/* Frame, cross bars and sill */}
      {bar([-3.0, WIN.y + WIN.h / 2, WIN.z], [0.24, 0.07, WIN.w + 0.07])}
      {bar([-3.0, WIN.y - WIN.h / 2, WIN.z], [0.24, 0.07, WIN.w + 0.07])}
      {bar([-3.0, WIN.y, WIN.z - WIN.w / 2], [0.24, WIN.h, 0.07])}
      {bar([-3.0, WIN.y, WIN.z + WIN.w / 2], [0.24, WIN.h, 0.07])}
      {bar([-3.08, WIN.y, WIN.z], [0.04, WIN.h, 0.04])}
      {bar([-3.08, WIN.y, WIN.z], [0.04, 0.04, WIN.w])}
      {bar([-2.92, WIN.y - WIN.h / 2 - 0.04, WIN.z], [0.22, 0.04, WIN.w + 0.25])}
    </group>
  );
}

function Poster() {
  const texture = useMemo(() => createPosterTexture(), []);
  const glow = useGlow((s) => 0.05 + 0.25 * s.night * s.power);
  return (
    <group position={[1.75, 2.05, -2.99]}>
      <mesh>
        <boxGeometry args={[0.72, 1.0, 0.03]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[0, 0, 0.017]}>
        <planeGeometry args={[0.64, 0.92]} />
        <meshStandardMaterial ref={glow} map={texture} emissiveMap={texture} emissive="#ffffff" />
      </mesh>
    </group>
  );
}

function Clock() {
  const hour = useRef<Group>(null);
  const minute = useRef<Group>(null);
  const second = useRef<Group>(null);

  useFrame(() => {
    const now = new Date();
    const s = now.getSeconds() + now.getMilliseconds() / 1000;
    const m = now.getMinutes() + s / 60;
    const h = (now.getHours() % 12) + m / 60;
    // The clock faces +x, so hands rotate around -x so they turn clockwise as seen from the room.
    if (second.current) second.current.rotation.x = -(s / 60) * Math.PI * 2;
    if (minute.current) minute.current.rotation.x = -(m / 60) * Math.PI * 2;
    if (hour.current) hour.current.rotation.x = -(h / 12) * Math.PI * 2;
  });

  const hand = (ref: React.RefObject<Group | null>, length: number, width: number, color: string, x: number) => (
    <group ref={ref} position={[x, 0, 0]}>
      <mesh position={[0, length / 2, 0]}>
        <boxGeometry args={[0.008, length, width]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );

  return (
    <group position={[-2.97, 2.8, -1.1]}>
      <mesh rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.22, 0.22, 0.04, 48]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[0.021, 0, 0]} rotation-y={Math.PI / 2}>
        <circleGeometry args={[0.19, 48]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} position={[0.024, Math.cos(a) * 0.16, -Math.sin(a) * 0.16]}>
            <boxGeometry args={[0.004, i % 3 === 0 ? 0.035 : 0.018, 0.01]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        );
      })}
      {hand(hour, 0.09, 0.016, "#0f172a", 0.026)}
      {hand(minute, 0.14, 0.01, "#0f172a", 0.03)}
      {hand(second, 0.15, 0.004, "#ef4444", 0.034)}
    </group>
  );
}

function LedStrip({
  position,
  length,
  rotation,
}: {
  position: [number, number, number];
  length: number;
  rotation: number;
}) {
  const ref = useRef<MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const hue = (clock.elapsedTime * 0.05) % 1;
    ref.current.emissive.setHSL(hue, 0.9, 0.55);
    ref.current.emissiveIntensity = 3.5 * sceneState.night * sceneState.power;
  });
  return (
    <mesh position={position} rotation-y={rotation} userData={{ noShadow: true }}>
      <boxGeometry args={[length, 0.025, 0.025]} />
      <meshStandardMaterial ref={ref} color="#cbc5bc" toneMapped={false} />
    </mesh>
  );
}
