import { Vector3 } from "three";
import type { HotspotId } from "@/store/useStore";

/** Room layout positions shared by the 3D objects and the camera (1 unit = 1 m). */
export const layout = {
  monitorScreen: new Vector3(0.2, 1.27, -2.555),
  monitorScreenSize: [1.04, 0.585] as const,
  bookshelf: new Vector3(-2.78, 0, -1.1),
  aboutFrame: new Vector3(-1.45, 2.05, -2.98),
  phone: new Vector3(-0.3, 0.795, -2.08),
  mug: new Vector3(0.98, 0.79, -2.25),
};

interface Focus {
  label: string;
  /** Point the camera looks at. */
  center: Vector3;
  /** Direction from the center toward the camera. */
  direction: Vector3;
  /** Optional override on small screens, where the bottom sheet pushes the camera lower. */
  directionMobile?: Vector3;
  /** World-space width/height that must fit in the visible area. */
  size: [number, number];
  /** Whether a content panel covers part of the screen ("mobile" = only on small screens). */
  panel: boolean | "mobile";
}

export const hotspots: Record<HotspotId, Focus> = {
  projects: {
    label: "Projects",
    center: layout.monitorScreen.clone(),
    direction: new Vector3(0, 0, 1),
    // Look down over the chair back on phones.
    directionMobile: new Vector3(0, 0.45, 1).normalize(),
    size: [1.04, 0.585],
    // Desktop shows projects on the monitor itself; phones get the panel instead.
    panel: "mobile",
  },
  skills: {
    label: "Skills",
    center: new Vector3(-2.75, 1.15, -1.1),
    direction: new Vector3(1, 0.3, 0.1).normalize(),
    directionMobile: new Vector3(1, 0.6, 0.1).normalize(),
    size: [1.75, 2.3],
    panel: true,
  },
  about: {
    label: "About",
    center: new Vector3(-1.3, 1.98, -2.98),
    direction: new Vector3(0.12, -0.05, 1).normalize(),
    size: [1.6, 1.0],
    panel: true,
  },
  contact: {
    label: "Contact",
    center: layout.phone.clone(),
    direction: new Vector3(0.25, 0.9, 1).normalize(),
    size: [1.2, 0.75],
    panel: true,
  },
};

const overview = {
  center: new Vector3(-0.3, 1.2, -0.6),
  direction: new Vector3(1, 0.72, 1).normalize(),
  size: [10.2, 7.8] as [number, number],
  sizeMobile: [7.4, 6.4] as [number, number],
  /** Screen-space nudge (fractions of the view) that leaves room for the headline. */
  shiftDesktop: [-0.11, -0.01] as [number, number],
  shiftMobile: [0, 0.1] as [number, number],
};

/** Starting camera position for the intro dolly. */
export const introPosition = new Vector3(14, 10, 14);

/** Desktop side panel width (px); must match the panel's CSS width. */
export const PANEL_WIDTH = 440;
/** Fraction of the viewport height used by the mobile bottom sheet. */
export const SHEET_FRACTION = 0.55;

export interface View {
  position: Vector3;
  target: Vector3;
}

const up = new Vector3(0, 1, 0);

export const MOBILE_BREAKPOINT = 768;

export function usesPanel(id: HotspotId | null, width: number): boolean {
  if (!id) return false;
  const { panel } = hotspots[id];
  return panel === true || (panel === "mobile" && width < MOBILE_BREAKPOINT);
}

/**
 * Camera placement that fits `focus` inside the part of the screen not covered
 * by the content panel, so the object is never hidden behind the UI.
 */
export function computeView(
  id: HotspotId | null,
  width: number,
  height: number,
  fovDeg: number,
): View {
  const focus = id ? hotspots[id] : null;
  const isMobile = width < MOBILE_BREAKPOINT;
  const center = focus?.center ?? overview.center;
  const direction = (isMobile && focus?.directionMobile) || focus?.direction || overview.direction;
  const [w, h] = focus?.size ?? (isMobile ? overview.sizeMobile : overview.size);

  const hasPanel = usesPanel(id, width);
  const availW = hasPanel && !isMobile ? width - PANEL_WIDTH : width;
  const availH = hasPanel && isMobile ? height * (1 - SHEET_FRACTION) : height;

  const tanHalf = Math.tan((fovDeg * Math.PI) / 360);
  const margin = focus ? 1.12 : 1.0;
  // Distance at which the object's height fits availH and its width fits availW.
  const distH = ((h / 2) * margin * height) / (availH * tanHalf);
  const distW = ((w / 2) * margin * height) / (availW * tanHalf);
  const distance = Math.max(distH, distW);

  const position = center.clone().addScaledVector(direction, distance);
  const target = center.clone();

  if (!focus) {
    // Pan the overview so the room sits clear of the headline in the top-left.
    const worldPerPx = (2 * distance * tanHalf) / height;
    const right = new Vector3().crossVectors(up, direction).normalize();
    const camUp = new Vector3().crossVectors(direction, right).normalize();
    const [sx, sy] = isMobile ? overview.shiftMobile : overview.shiftDesktop;
    const pan = right
      .multiplyScalar(sx * width * worldPerPx)
      .add(camUp.multiplyScalar(sy * height * worldPerPx));
    position.add(pan);
    target.add(pan);
  }

  if (hasPanel) {
    // Pan so the object sits in the middle of the uncovered area.
    const worldPerPx = (2 * distance * tanHalf) / height;
    const right = new Vector3().crossVectors(up, direction).normalize();
    const camUp = new Vector3().crossVectors(direction, right).normalize();
    const pan = isMobile
      ? camUp.multiplyScalar(-((height - availH) / 2) * worldPerPx)
      : right.multiplyScalar((PANEL_WIDTH / 2) * worldPerPx);
    position.add(pan);
    target.add(pan);
  }

  return { position, target };
}
