"use client";

import { Bloom, EffectComposer, Outline, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";

/** Bloom on glowing parts, a hover outline for hotspots, and a soft vignette. High quality only. */
export function Effects() {
  return (
    <EffectComposer multisampling={4} autoClear={false}>
      <Outline visibleEdgeColor={0x5eead4} hiddenEdgeColor={0x5eead4} edgeStrength={6} blur xRay={false} />
      <Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.2} intensity={0.9} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <Vignette offset={0.25} darkness={0.55} />
    </EffectComposer>
  );
}
