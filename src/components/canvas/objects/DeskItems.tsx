"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Select } from "@react-three/postprocessing";
import { Object3D, type InstancedMesh } from "three";
import { funFacts, profile } from "@/data/portfolio";
import { layout } from "@/lib/hotspots";
import { createAboutTexture, createPhoneTexture } from "@/lib/textures";
import { sceneState, useStore } from "@/store/useStore";
import { Hotspot } from "../Hotspot";
import { useGlow } from "../useGlow";
import { DESK_TOP } from "./Desk";

/** Framed "about me" picture on the back wall. */
export function AboutFrame() {
  const initials = profile.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  const texture = useMemo(() => createAboutTexture(initials), [initials]);
  const glow = useGlow((s) => 0.1 + 0.2 * s.night * s.power);
  const { x, y, z } = layout.aboutFrame;

  return (
    <Hotspot id="about" position={[x, y, z]} labelPosition={[0, 0.62, 0.1]}>
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[1.06, 0.86, 0.04]} />
        <meshStandardMaterial color="#e7d3b5" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.042]}>
        <planeGeometry args={[0.92, 0.72]} />
        <meshStandardMaterial ref={glow} map={texture} emissiveMap={texture} emissive="#ffffff" />
      </mesh>
      {/* Small certificate below */}
      <group position={[0.75, -0.25, 0.015]}>
        <mesh>
          <boxGeometry args={[0.32, 0.24, 0.02]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh position={[0, 0, 0.011]}>
          <planeGeometry args={[0.27, 0.19]} />
          <meshStandardMaterial color="#fefce8" />
        </mesh>
        <mesh position={[0.07, -0.05, 0.013]}>
          <circleGeometry args={[0.025, 16]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>
    </Hotspot>
  );
}

/** Smartphone lying on the desk — opens the contact panel. */
export function Phone() {
  const texture = useMemo(() => createPhoneTexture(), []);
  const screen = useGlow((s) => 0.9 * s.power);
  const { x, z } = layout.phone;

  return (
    <Hotspot id="contact" position={[x, DESK_TOP, z]} labelPosition={[0, 0.25, 0]}>
      <group rotation-y={0.35}>
        <mesh position={[0, 0.006, 0]}>
          <boxGeometry args={[0.085, 0.012, 0.17]} />
          <meshStandardMaterial color="#0f0f14" roughness={0.3} metalness={0.4} />
        </mesh>
        <mesh position={[0, 0.0125, 0]} rotation-x={-Math.PI / 2} userData={{ noShadow: true }}>
          <planeGeometry args={[0.076, 0.158]} />
          <meshStandardMaterial ref={screen} map={texture} emissiveMap={texture} emissive="#ffffff" />
        </mesh>
      </group>
    </Hotspot>
  );
}

const STEAM_COUNT = 14;

/** Coffee mug easter egg: click for steam and a fun fact. */
export function Mug() {
  const [hovered, setHovered] = useState(false);
  const steam = useRef<InstancedMesh>(null);
  const phase = useStore((s) => s.phase);
  const active = useStore((s) => s.active);
  const interactive = phase === "ready" && active === null;
  const dummy = useMemo(() => new Object3D(), []);
  const { x, z } = layout.mug;

  useEffect(() => {
    if (!interactive || !hovered) return;
    document.body.style.cursor = "pointer";
    return () => {
      document.body.style.cursor = "";
    };
  }, [interactive, hovered]);

  useFrame(({ clock }, delta) => {
    sceneState.steam = Math.max(0, sceneState.steam - delta * 0.35);
    const t = clock.elapsedTime;
    const strength = 0.35 + sceneState.steam;
    for (let i = 0; i < STEAM_COUNT; i++) {
      const life = (t * (0.25 + sceneState.steam * 0.4) + i / STEAM_COUNT) % 1;
      dummy.position.set(
        Math.sin(life * 6 + i) * 0.02,
        0.11 + life * 0.3,
        Math.cos(life * 5 + i * 2) * 0.02,
      );
      const s = Math.sin(life * Math.PI) * 0.022 * strength;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      steam.current?.setMatrixAt(i, dummy.matrix);
    }
    if (steam.current) steam.current.instanceMatrix.needsUpdate = true;
  });

  const onClick = () => {
    if (!interactive) return;
    sceneState.steam = 1;
    const current = useStore.getState().fact;
    useStore.getState().setFact(current === null ? 0 : (current + 1) % funFacts.length);
  };

  return (
    <group position={[x, DESK_TOP, z]}>
      <Select enabled={hovered && interactive}>
        <group
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => setHovered(false)}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <mesh position={[0, 0.055, 0]}>
            <cylinderGeometry args={[0.048, 0.042, 0.11, 24]} />
            <meshStandardMaterial color="#f472b6" roughness={0.4} />
          </mesh>
          <mesh position={[0.05, 0.058, 0]}>
            <torusGeometry args={[0.028, 0.008, 8, 16]} />
            <meshStandardMaterial color="#f472b6" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.1, 0]} rotation-x={-Math.PI / 2}>
            <circleGeometry args={[0.042, 24]} />
            <meshStandardMaterial color="#3b2416" />
          </mesh>
        </group>
      </Select>
      <instancedMesh ref={steam} args={[undefined, undefined, STEAM_COUNT]} userData={{ noShadow: true }} raycast={() => null}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.45} roughness={1} />
      </instancedMesh>
    </group>
  );
}
