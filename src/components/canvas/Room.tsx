"use client";

import { useLayoutEffect, useRef } from "react";
import type { Group, Mesh } from "three";
import { useStore } from "@/store/useStore";
import { Bookshelf } from "./objects/Bookshelf";
import { Desk } from "./objects/Desk";
import { AboutFrame, Mug, Phone } from "./objects/DeskItems";
import { Chair, Plant } from "./objects/Furniture";
import { Monitor } from "./objects/Monitor";
import { Shell } from "./objects/Shell";

export function Room() {
  const root = useRef<Group>(null);
  const shadows = useStore((s) => s.quality === "high");

  // Every mesh casts and receives shadows unless it opts out (glows, sky, screens).
  useLayoutEffect(() => {
    root.current?.traverse((obj) => {
      const mesh = obj as Mesh;
      if (!mesh.isMesh) return;
      const opted = Boolean(mesh.userData.noShadow);
      mesh.castShadow = shadows && !opted;
      mesh.receiveShadow = shadows && !opted;
    });
  }, [shadows]);

  return (
    <group ref={root}>
      <Shell />
      <Desk />
      <Monitor />
      <Bookshelf />
      <AboutFrame />
      <Phone />
      <Mug />
      <Chair />
      <Plant />
    </group>
  );
}
