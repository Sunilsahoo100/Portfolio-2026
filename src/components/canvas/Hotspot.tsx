"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Select } from "@react-three/postprocessing";
import { easing } from "maath";
import type { Group } from "three";
import { hotspots } from "@/lib/hotspots";
import { useStore, type HotspotId } from "@/store/useStore";

interface HotspotProps {
  id: HotspotId;
  /** Group origin; hover scaling happens around this point. */
  position: [number, number, number];
  /** Where the floating label chip sits, relative to the group. */
  labelPosition: [number, number, number];
  children: ReactNode;
}

/**
 * drei's <Html> mounts a separate React root. When the room is re-entered the scene renders inside
 * React DOM's commit, where creating/unmounting those roots races (labels vanish, removeChild errors),
 * so labels wait one frame before mounting.
 */
function useMountedAfterFrame() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  return mounted;
}

export function Hotspot({ id, position, labelPosition, children }: HotspotProps) {
  const group = useRef<Group>(null);
  const labelReady = useMountedAfterFrame();
  const [hovered, setHovered] = useState(false);
  const phase = useStore((s) => s.phase);
  const active = useStore((s) => s.active);
  const setActive = useStore((s) => s.setActive);
  const interactive = phase === "ready" && active === null;
  const highlighted = hovered && interactive;

  useEffect(() => {
    document.body.style.cursor = highlighted ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [highlighted]);

  useFrame((_, delta) => {
    if (!group.current) return;
    const s = highlighted ? 1.035 : 1;
    easing.damp3(group.current.scale, [s, s, s], 0.12, delta);
  });

  return (
    <group
      ref={group}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        if (!interactive) return;
        e.stopPropagation();
        setHovered(false);
        setActive(id);
      }}
    >
      <Select enabled={highlighted}>{children}</Select>
      {interactive && labelReady && (
        <Html position={labelPosition} center zIndexRange={[10, 0]}>
          <button
            type="button"
            className={`hotspot-chip ${highlighted ? "is-hovered" : ""}`}
            onClick={() => setActive(id)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setHovered(true)}
            onBlur={() => setHovered(false)}
          >
            <span className="hotspot-dot" aria-hidden />
            {hotspots[id].label}
          </button>
        </Html>
      )}
    </group>
  );
}
