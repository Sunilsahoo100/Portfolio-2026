"use client";

import { useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerformanceMonitor, Stats } from "@react-three/drei";
import { Selection } from "@react-three/postprocessing";
import { introPosition } from "@/lib/hotspots";
import { loadTextureFonts } from "@/lib/textures";
import { useStore } from "@/store/useStore";
import { CameraRig } from "./CameraRig";
import { Effects } from "./Effects";
import { Lights } from "./Lights";
import { Room } from "./Room";

/** Tells the UI the scene is visible once the first frame has rendered. */
function ReadySignal() {
  const setSceneReady = useStore((s) => s.setSceneReady);
  useFrame(() => {
    if (!useStore.getState().sceneReady) setSceneReady(true);
  });
  return null;
}

export default function Experience({ reducedMotion }: { reducedMotion: boolean }) {
  const quality = useStore((s) => s.quality);
  const setQuality = useStore((s) => s.setQuality);
  const setSceneReady = useStore((s) => s.setSceneReady);
  const [fontsReady, setFontsReady] = useState(false);
  const [showStats] = useState(() => new URLSearchParams(window.location.search).has("perf"));
  const high = quality === "high";

  useEffect(() => {
    let cancelled = false;
    loadTextureFonts().then(() => !cancelled && setFontsReady(true));
    return () => {
      cancelled = true;
      setSceneReady(false);
    };
  }, [setSceneReady]);

  return (
    <div className="fixed inset-0">
      <Canvas
        shadows={high ? "percentage" : false}
        dpr={high ? [1, 2] : [1, 1.25]}
        gl={{ antialias: !high, powerPreference: "high-performance" }}
        camera={{ fov: 35, near: 0.1, far: 60, position: introPosition.toArray() }}
      >
        <PerformanceMonitor onDecline={() => setQuality("low")} />
        {fontsReady && (
          <Selection>
            <Lights />
            <Room />
            <CameraRig reducedMotion={reducedMotion} />
            {high && <Effects />}
            <ReadySignal />
          </Selection>
        )}
        {showStats && <Stats />}
      </Canvas>
    </div>
  );
}
