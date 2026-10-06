"use client";

import { useEffect, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { detectQuality, prefersReducedMotion, supportsWebGL } from "@/lib/device";
import { useStore } from "@/store/useStore";
import { ClassicView } from "./classic/ClassicView";
import { HUD } from "./ui/HUD";
import { Intro } from "./ui/Intro";
import { Loader } from "./ui/Loader";
import { Panel } from "./ui/Panel";

// Three.js needs the browser, so the 3D scene is never server-rendered.
const Experience = dynamic(() => import("./canvas/Experience"), { ssr: false });

interface ClientInfo {
  webgl: boolean;
  reducedMotion: boolean;
}

// Device capabilities, read once on the client. The server snapshot is null so
// hydration matches the server HTML, then React re-renders with the real values.
let clientInfo: ClientInfo | null = null;
const getClientInfo = () =>
  (clientInfo ??= { webgl: supportsWebGL(), reducedMotion: prefersReducedMotion() });
const subscribe = () => () => {};

export function PortfolioApp() {
  const view = useStore((s) => s.view);
  const initialized = useStore((s) => s.initialized);
  const init = useStore((s) => s.init);
  const setView = useStore((s) => s.setView);
  const client = useSyncExternalStore(subscribe, getClientInfo, () => null);

  useEffect(() => {
    if (!client || useStore.getState().initialized) return;
    const wantsClassic = new URLSearchParams(window.location.search).get("view") === "classic";
    init(detectQuality(), !client.webgl || wantsClassic ? "classic" : "3d");
  }, [client, init]);

  // Keep ?view=classic in the URL so the plain version can be shared directly.
  useEffect(() => {
    if (!initialized) return;
    const url = new URL(window.location.href);
    if (view === "classic") url.searchParams.set("view", "classic");
    else url.searchParams.delete("view");
    window.history.replaceState(null, "", url);
    document.documentElement.dataset.view = view;
  }, [view, initialized]);

  const show3D = client !== null && initialized && view === "3d";

  return (
    <>
      <a href="#top" className="skip-link" onClick={() => setView("classic")}>
        Skip to the accessible classic version
      </a>
      {/* Server-rendered so the content is always in the HTML; hidden while the 3D room is shown. */}
      <div className="classic-wrap" hidden={view !== "classic"}>
        <ClassicView
          active={view === "classic"}
          canUse3D={client?.webgl ?? false}
          onEnter3D={() => {
            window.scrollTo(0, 0);
            setView("3d");
          }}
        />
      </div>
      {show3D && (
        <div className="stage">
          <Experience reducedMotion={client.reducedMotion} />
          <Intro reducedMotion={client.reducedMotion} />
          <Panel />
          <HUD />
          <Loader reducedMotion={client.reducedMotion} />
        </div>
      )}
    </>
  );
}
