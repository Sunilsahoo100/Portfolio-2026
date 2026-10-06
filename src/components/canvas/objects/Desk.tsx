"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Object3D, Quaternion, Vector3, type InstancedMesh, type MeshStandardMaterial } from "three";
import { sceneState } from "@/store/useStore";
import { LAMP_LIGHT_POSITION } from "../Lights";
import { useGlow } from "../useGlow";

const WOOD = "#c79a6b";
const DARK = "#1e1e24";
export const DESK_TOP = 0.78;

/** Desk with drawers, keyboard, mouse and an articulated desk lamp. */
export function Desk() {
  return (
    <group>
      {/* Top and side panels */}
      <mesh position={[0.2, DESK_TOP - 0.025, -2.45]}>
        <boxGeometry args={[2.3, 0.05, 1.0]} />
        <meshStandardMaterial color={WOOD} roughness={0.6} />
      </mesh>
      {[-0.88, 1.28].map((x) => (
        <mesh key={x} position={[x, (DESK_TOP - 0.05) / 2, -2.45]}>
          <boxGeometry args={[0.05, DESK_TOP - 0.05, 0.92]} />
          <meshStandardMaterial color={WOOD} roughness={0.6} />
        </mesh>
      ))}
      {/* Drawer unit */}
      <mesh position={[0.98, 0.4, -2.47]}>
        <boxGeometry args={[0.55, 0.62, 0.85]} />
        <meshStandardMaterial color="#b88a5e" roughness={0.6} />
      </mesh>
      {[0.56, 0.36, 0.16].map((y) => (
        <group key={y}>
          <mesh position={[0.98, y, -2.04]}>
            <boxGeometry args={[0.5, 0.17, 0.01]} />
            <meshStandardMaterial color="#d4a979" roughness={0.6} />
          </mesh>
          <mesh position={[0.98, y, -2.03]}>
            <boxGeometry args={[0.14, 0.02, 0.02]} />
            <meshStandardMaterial color={DARK} metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
      ))}
      <Keyboard />
      {/* Mouse pad and mouse */}
      <mesh position={[0.66, DESK_TOP + 0.002, -2.2]}>
        <boxGeometry args={[0.3, 0.004, 0.24]} />
        <meshStandardMaterial color="#111827" roughness={0.9} />
      </mesh>
      <mesh position={[0.66, DESK_TOP + 0.018, -2.18]} scale={[0.55, 0.32, 1]}>
        <sphereGeometry args={[0.055, 16, 12]} />
        <meshStandardMaterial color="#e5e7eb" roughness={0.4} />
      </mesh>
      {/* Notebook + pen */}
      <mesh position={[-0.62, DESK_TOP + 0.008, -2.3]} rotation-y={0.25}>
        <boxGeometry args={[0.2, 0.016, 0.27]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.8} />
      </mesh>
      <mesh position={[-0.59, DESK_TOP + 0.022, -2.28]} rotation={[0, 0.6, Math.PI / 2]}>
        <cylinderGeometry args={[0.005, 0.005, 0.15, 8]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <Lamp />
    </group>
  );
}

function Keyboard() {
  const keys = useRef<InstancedMesh>(null);
  const cols = 15;
  const rows = 4;
  const glow = useRef<MeshStandardMaterial>(null);

  useLayoutEffect(() => {
    const dummy = new Object3D();
    let i = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dummy.position.set(0.2 - 0.21 + c * 0.03, DESK_TOP + 0.03, -2.25 + r * 0.032);
        dummy.updateMatrix();
        keys.current!.setMatrixAt(i++, dummy.matrix);
      }
    }
    keys.current!.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame(({ clock }) => {
    if (!glow.current) return;
    glow.current.emissive.setHSL((clock.elapsedTime * 0.08 + 0.5) % 1, 0.9, 0.55);
    glow.current.emissiveIntensity = 2.5 * sceneState.night * sceneState.power;
  });

  return (
    <group>
      <mesh position={[0.2, DESK_TOP + 0.012, -2.2]}>
        <boxGeometry args={[0.48, 0.022, 0.15]} />
        <meshStandardMaterial color={DARK} roughness={0.5} />
      </mesh>
      {/* RGB underglow */}
      <mesh position={[0.2, DESK_TOP + 0.003, -2.2]} userData={{ noShadow: true }}>
        <boxGeometry args={[0.49, 0.006, 0.16]} />
        <meshStandardMaterial ref={glow} color="#000" toneMapped={false} />
      </mesh>
      <instancedMesh ref={keys} args={[undefined, undefined, rows * cols]}>
        <boxGeometry args={[0.025, 0.012, 0.026]} />
        <meshStandardMaterial color="#2d2d36" roughness={0.6} />
      </instancedMesh>
    </group>
  );
}

/** Cylinder spanning two points — used for the lamp arms. */
function Segment({ from, to, radius }: { from: Vector3; to: Vector3; radius: number }) {
  const { position, quaternion, length } = useMemo(() => {
    const dir = to.clone().sub(from);
    return {
      position: from.clone().add(to).multiplyScalar(0.5),
      quaternion: new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), dir.clone().normalize()),
      length: dir.length(),
    };
  }, [from, to]);
  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[radius, radius, length, 12]} />
      <meshStandardMaterial color={DARK} metalness={0.5} roughness={0.35} />
    </mesh>
  );
}

function Lamp() {
  const [hx, hy, hz] = LAMP_LIGHT_POSITION;
  const base = useMemo(() => new Vector3(-0.85, DESK_TOP + 0.02, -2.65), []);
  const elbow = useMemo(() => new Vector3(-0.82, 1.32, -2.68), []);
  const head = useMemo(() => new Vector3(hx, hy + 0.08, hz), [hx, hy, hz]);
  const bulb = useGlow((s) => s.power * (2 + 2 * s.night));

  return (
    <group>
      <mesh position={[base.x, DESK_TOP + 0.012, base.z]}>
        <cylinderGeometry args={[0.09, 0.1, 0.024, 24]} />
        <meshStandardMaterial color={DARK} metalness={0.5} roughness={0.35} />
      </mesh>
      <Segment from={base} to={elbow} radius={0.012} />
      <Segment from={elbow} to={head} radius={0.012} />
      <mesh position={elbow}>
        <sphereGeometry args={[0.022, 12, 12]} />
        <meshStandardMaterial color="#2dd4bf" />
      </mesh>
      {/* Shade (open cone pointing down at the desk) */}
      <mesh position={[hx, hy + 0.04, hz]} rotation={[0.35, 0, -0.35]}>
        <coneGeometry args={[0.1, 0.13, 24, 1, true]} />
        <meshStandardMaterial color="#2dd4bf" side={2} roughness={0.4} />
      </mesh>
      <mesh position={[hx, hy, hz]} userData={{ noShadow: true }}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial ref={bulb} color="#fff" emissive="#ffcf8a" toneMapped={false} />
      </mesh>
    </group>
  );
}
