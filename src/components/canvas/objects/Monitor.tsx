"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Mesh, MeshStandardMaterial } from "three";
import { layout, MOBILE_BREAKPOINT } from "@/lib/hotspots";
import { createCodeTexture } from "@/lib/textures";
import { sceneState, useStore } from "@/store/useStore";
import { ProjectsScreen } from "@/components/ui/ProjectsScreen";
import { Hotspot } from "../Hotspot";
import { useGlow } from "../useGlow";
import { DESK_TOP } from "./Desk";

/** Pixel size of the in-monitor projects UI; 1 px = 1 mm on the screen. */
const SCREEN_PX: [number, number] = [1040, 585];
const PX_PER_UNIT = SCREEN_PX[0] / layout.monitorScreenSize[0];

export function Monitor() {
  const texture = useMemo(() => createCodeTexture(), []);
  const screen = useRef<MeshStandardMaterial>(null);
  const cursor = useRef<Mesh>(null);
  const ambilight = useGlow((s) => 2.2 * s.night * s.power);
  const active = useStore((s) => s.active);
  const isMobile = useThree((s) => s.size.width < MOBILE_BREAKPOINT);
  const showProjects = active === "projects" && !isMobile;

  const [sw, sh] = layout.monitorScreenSize;
  const origin: [number, number, number] = [layout.monitorScreen.x, DESK_TOP, layout.monitorScreen.z];
  const screenY = layout.monitorScreen.y - DESK_TOP;

  useFrame(({ clock }, delta) => {
    if (screen.current) {
      // map and emissiveMap share one texture, so this scrolls both.
      screen.current.map!.offset.y -= delta * 0.025;
      screen.current.emissiveIntensity = 0.95 * sceneState.power * sceneState.monitor;
    }
    if (cursor.current) cursor.current.visible = sceneState.monitor > 0.5 && Math.floor(clock.elapsedTime * 2) % 2 === 0;
  });

  return (
    <Hotspot id="projects" position={origin} labelPosition={[0, screenY + sh / 2 + 0.16, 0]}>
      {/* Stand */}
      <mesh position={[0, 0.012, -0.04]}>
        <boxGeometry args={[0.34, 0.024, 0.22]} />
        <meshStandardMaterial color="#1e1e24" metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.2, -0.06]}>
        <boxGeometry args={[0.06, 0.36, 0.035]} />
        <meshStandardMaterial color="#1e1e24" metalness={0.5} roughness={0.35} />
      </mesh>
      {/* Bezel */}
      <mesh position={[0, screenY, -0.025]}>
        <boxGeometry args={[sw + 0.06, sh + 0.06, 0.04]} />
        <meshStandardMaterial color="#111116" roughness={0.4} />
      </mesh>
      {/* Night-time ambilight glowing on the wall behind the monitor */}
      <mesh position={[0, screenY, -0.05]} userData={{ noShadow: true }}>
        <boxGeometry args={[sw - 0.1, sh - 0.1, 0.01]} />
        <meshStandardMaterial ref={ambilight} color="#000" emissive="#8b5cf6" toneMapped={false} />
      </mesh>
      {/* Screen */}
      <mesh position={[0, screenY, layout.monitorScreen.z - origin[2]]} userData={{ noShadow: true }}>
        <planeGeometry args={[sw, sh]} />
        <meshStandardMaterial ref={screen} map={texture} emissiveMap={texture} emissive="#ffffff" roughness={0.3} />
      </mesh>
      <mesh
        ref={cursor}
        position={[-sw / 2 + 0.33, screenY - sh / 2 + 0.06, layout.monitorScreen.z - origin[2] + 0.001]}
        userData={{ noShadow: true }}
      >
        <planeGeometry args={[0.012, 0.028]} />
        <meshBasicMaterial color="#5eead4" toneMapped={false} />
      </mesh>

      {showProjects && (
        <Html
          transform
          position={[0, screenY, layout.monitorScreen.z - origin[2] + 0.002]}
          distanceFactor={400 / PX_PER_UNIT}
          zIndexRange={[10, 0]}
        >
          <div style={{ width: SCREEN_PX[0], height: SCREEN_PX[1] }}>
            <ProjectsScreen />
          </div>
        </Html>
      )}
    </Hotspot>
  );
}
