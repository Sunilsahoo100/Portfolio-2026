"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { easing } from "maath";
import { Color, MeshStandardMaterial, type Group } from "three";
import { skillGroups, type Skill } from "@/data/portfolio";
import { createSpineTexture } from "@/lib/textures";
import { useStore } from "@/store/useStore";
import { Hotspot } from "../Hotspot";

const WOOD = "#8b5e3c";
const DEPTH = 0.4;
const WIDTH = 1.7;
const HEIGHT = 2.2;
/** Shelf board heights (local y). Compartments between them hold one skill group each, top-down. */
const BOARDS = [0.04, 0.58, 1.12, 1.66, HEIGHT - 0.02];

/** Deterministic pseudo-random in [0, 1) so the books look the same on every load. */
const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

export function Bookshelf() {
  // Frontend on the top compartment (eye level), then backend, then tools.
  const compartments = skillGroups.slice(0, 3).map((group, i) => ({
    group,
    y: BOARDS[3 - i] + 0.02,
  }));

  return (
    <Hotspot id="skills" position={[-2.98 + DEPTH / 2, 0, -1.1]} labelPosition={[0.1, HEIGHT + 0.25, 0]}>
      {/* Carcass: back, sides, boards (local +x faces the room). */}
      <mesh position={[-DEPTH / 2 + 0.01, HEIGHT / 2, 0]}>
        <boxGeometry args={[0.02, HEIGHT, WIDTH]} />
        <meshStandardMaterial color="#6f4a2f" />
      </mesh>
      {[-WIDTH / 2, WIDTH / 2].map((z) => (
        <mesh key={z} position={[0, HEIGHT / 2, z]}>
          <boxGeometry args={[DEPTH, HEIGHT, 0.04]} />
          <meshStandardMaterial color={WOOD} roughness={0.7} />
        </mesh>
      ))}
      {BOARDS.map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <boxGeometry args={[DEPTH, 0.04, WIDTH]} />
          <meshStandardMaterial color={WOOD} roughness={0.7} />
        </mesh>
      ))}

      {compartments.map(({ group, y }, gi) => (
        <BookRow key={group.category} skills={group.skills} color={group.color} y={y} seed={gi * 31} />
      ))}

      {/* Bottom compartment: storage boxes */}
      {[-0.45, 0.05].map((z, i) => (
        <mesh key={z} position={[0.02, 0.29, z]}>
          <boxGeometry args={[0.32, 0.44, 0.44]} />
          <meshStandardMaterial color={i ? "#e2e8f0" : "#cbd5e1"} roughness={0.9} />
        </mesh>
      ))}
      {/* Top decor: trophy */}
      <group position={[0, HEIGHT, 0.45]}>
        <mesh position={[0, 0.03, 0]}>
          <boxGeometry args={[0.12, 0.06, 0.12]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh position={[0, 0.14, 0]}>
          <cylinderGeometry args={[0.07, 0.025, 0.16, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.25} />
        </mesh>
      </group>
      <mesh position={[0, HEIGHT + 0.1, -0.4]} rotation-y={0.4}>
        <boxGeometry args={[0.22, 0.2, 0.22]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
    </Hotspot>
  );
}

function BookRow({ skills, color, y, seed }: { skills: Skill[]; color: string; y: number; seed: number }) {
  const books = useMemo(() => {
    const list = [];
    let z = -WIDTH / 2 + 0.06;
    for (const [i, skill] of skills.entries()) {
      const thickness = 0.075 + rand(seed + i) * 0.035;
      const height = 0.36 + rand(seed + i + 7) * 0.1;
      const tint = new Color(color).offsetHSL(0, -0.1 + rand(seed + i + 3) * 0.15, -0.12 + rand(seed + i + 5) * 0.18);
      list.push({ skill, thickness, height, z: z + thickness / 2, color: `#${tint.getHexString()}` });
      z += thickness + 0.006;
    }
    return list;
  }, [skills, color, seed]);

  return (
    <group position={[0, y, 0]}>
      {books.map((b) => (
        <Book key={b.skill.name} {...b} />
      ))}
    </group>
  );
}

function Book({
  skill,
  thickness,
  height,
  z,
  color,
}: {
  skill: Skill;
  thickness: number;
  height: number;
  z: number;
  color: string;
}) {
  const ref = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const browsing = useStore((s) => s.active === "skills");
  const out = hovered && browsing;

  const materials = useMemo(() => {
    const spine = createSpineTexture(skill.name, color);
    const side = new MeshStandardMaterial({ color, roughness: 0.7 });
    const pages = new MeshStandardMaterial({ color: "#f5f0e6", roughness: 0.9 });
    // Box face order: +x (spine, facing the room), -x, +y, -y, +z, -z
    return [new MeshStandardMaterial({ map: spine, roughness: 0.6 }), side, pages, pages, side, side];
  }, [skill.name, color]);

  useFrame((_, delta) => {
    if (ref.current) easing.damp(ref.current.position, "x", out ? 0.12 : 0, 0.1, delta);
  });

  return (
    <group ref={ref}>
      <mesh
        position={[DEPTH / 2 - 0.14, height / 2, z]}
        material={materials}
        onPointerOver={(e) => {
          if (!browsing) return;
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "help";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "";
        }}
      >
        <boxGeometry args={[0.26, height, thickness]} />
      </mesh>
      {out && (
        <Html position={[DEPTH / 2 + 0.05, height + 0.06, z]} center zIndexRange={[10, 0]}>
          <div className="book-tip">
            <strong>{skill.name}</strong>
            <span>{skill.level}</span>
          </div>
        </Html>
      )}
    </group>
  );
}
