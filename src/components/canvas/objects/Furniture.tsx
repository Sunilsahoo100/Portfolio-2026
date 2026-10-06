"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

const SEAT = "#2a2a35";
const METAL = "#9ca3af";

/** Office chair facing the desk. */
export function Chair() {
  return (
    <group position={[0.22, 0, -1.5]} rotation-y={0.3}>
      {/* Five-star base with casters */}
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <group key={i} rotation-y={a}>
            <mesh position={[0.15, 0.07, 0]}>
              <boxGeometry args={[0.3, 0.03, 0.04]} />
              <meshStandardMaterial color={SEAT} />
            </mesh>
            <mesh position={[0.29, 0.03, 0]}>
              <sphereGeometry args={[0.03, 10, 10]} />
              <meshStandardMaterial color="#111" />
            </mesh>
          </group>
        );
      })}
      <mesh position={[0, 0.27, 0]}>
        <cylinderGeometry args={[0.025, 0.03, 0.4, 12]} />
        <meshStandardMaterial color={METAL} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Seat */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.52, 0.08, 0.5]} />
        <meshStandardMaterial color={SEAT} roughness={0.8} />
      </mesh>
      {/* Back rest (away from the desk, on +z) */}
      <mesh position={[0, 0.62, 0.24]}>
        <boxGeometry args={[0.06, 0.2, 0.04]} />
        <meshStandardMaterial color={METAL} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.98, 0.27]} rotation-x={-0.08}>
        <boxGeometry args={[0.5, 0.6, 0.07]} />
        <meshStandardMaterial color={SEAT} roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.05, 0.235]} rotation-x={-0.08}>
        <boxGeometry args={[0.38, 0.4, 0.01]} />
        <meshStandardMaterial color="#2dd4bf" roughness={0.8} />
      </mesh>
      {/* Armrests */}
      {[-0.28, 0.28].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.62, 0.02]}>
            <boxGeometry args={[0.03, 0.2, 0.03]} />
            <meshStandardMaterial color={METAL} metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[x, 0.73, 0.02]}>
            <boxGeometry args={[0.07, 0.03, 0.3]} />
            <meshStandardMaterial color={SEAT} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Low-poly potted plant that sways gently. */
export function Plant() {
  const leaves = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!leaves.current) return;
    const t = clock.elapsedTime;
    leaves.current.rotation.z = Math.sin(t * 0.8) * 0.035;
    leaves.current.rotation.x = Math.cos(t * 0.6) * 0.025;
  });

  const blades = Array.from({ length: 9 }, (_, i) => {
    const a = (i / 9) * Math.PI * 2;
    const tilt = 0.35 + (i % 3) * 0.12;
    const height = 0.55 + (i % 4) * 0.08;
    return { a, tilt, height };
  });

  return (
    <group position={[2.35, 0, -2.45]}>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.22, 0.17, 0.44, 8]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.5} flatShading />
      </mesh>
      <mesh position={[0, 0.43, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.02, 8]} />
        <meshStandardMaterial color="#3f2a1d" />
      </mesh>
      <group ref={leaves} position={[0, 0.42, 0]}>
        {blades.map(({ a, tilt, height }, i) => (
          <group key={i} rotation={[0, a, tilt]}>
            <mesh position={[0, height / 2, 0]} scale={[0.09, height / 2, 0.03]}>
              <icosahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color={i % 2 ? "#22c55e" : "#16a34a"} flatShading roughness={0.7} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
