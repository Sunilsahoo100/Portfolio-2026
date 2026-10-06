import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from "three";

/** Resolves a next/font CSS variable (its family name is hashed) for canvas use. */
function font(variable: string, fallback: string): string {
  const family = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return family ? `${family}, ${fallback}` : fallback;
}
const mono = () => font("--font-jetbrains", "ui-monospace, monospace");
const sans = () => font("--font-space-grotesk", "ui-sans-serif, system-ui, sans-serif");

/** Canvas text only uses web fonts that are already loaded, so load them first. */
export async function loadTextureFonts(): Promise<void> {
  const specs = [`700 32px ${sans()}`, `500 32px ${sans()}`, `600 32px ${mono()}`, `500 32px ${mono()}`];
  await Promise.allSettled(specs.map((spec) => document.fonts.load(spec)));
}

function makeTexture(
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D) => void,
): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  draw(canvas.getContext("2d")!);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

// Syntax-highlighted pseudo code, repeated vertically so it can scroll forever.
const CODE: [string, string][][] = [
  [["const ", "#c084fc"], ["developer", "#e2e8f0"], [" = {", "#94a3b8"]],
  [["  name: ", "#7dd3fc"], ["'Sunil'", "#86efac"], [",", "#94a3b8"]],
  [["  loves: ", "#7dd3fc"], ["['web', '3d', 'coffee']", "#86efac"], [",", "#94a3b8"]],
  [["  shipping: ", "#7dd3fc"], ["true", "#fb923c"], [",", "#94a3b8"]],
  [["};", "#94a3b8"]],
  [["", "#000"]],
  [["async function ", "#c084fc"], ["build", "#fde047"], ["(idea) {", "#94a3b8"]],
  [["  const ", "#c084fc"], ["plan", "#e2e8f0"], [" = await ", "#c084fc"], ["think", "#fde047"], ["(idea);", "#94a3b8"]],
  [["  const ", "#c084fc"], ["code", "#e2e8f0"], [" = ", "#c084fc"], ["write", "#fde047"], ["(plan);", "#94a3b8"]],
  [["  await ", "#c084fc"], ["test", "#fde047"], ["(code);", "#94a3b8"]],
  [["  return ", "#c084fc"], ["deploy", "#fde047"], ["(code);", "#94a3b8"], ["  // 🚀", "#64748b"]],
  [["}", "#94a3b8"]],
  [["", "#000"]],
  [["// TODO: build something amazing", "#64748b"]],
  [["while ", "#c084fc"], ["(", "#94a3b8"], ["curious", "#e2e8f0"], [") ", "#94a3b8"], ["learn", "#fde047"], ["();", "#94a3b8"]],
  [["", "#000"]],
  [["export default ", "#c084fc"], ["developer", "#e2e8f0"], [";", "#94a3b8"]],
  [["", "#000"]],
];

export function createCodeTexture(): CanvasTexture {
  const w = 1024;
  const h = 1024;
  const texture = makeTexture(w, h, (ctx) => {
    ctx.fillStyle = "#0b1020";
    ctx.fillRect(0, 0, w, h);
    const lineH = h / CODE.length;
    ctx.font = `500 ${Math.round(lineH * 0.5)}px ${mono()}`;
    ctx.textBaseline = "middle";
    CODE.forEach((tokens, i) => {
      const y = i * lineH + lineH / 2;
      ctx.fillStyle = "#334155";
      ctx.fillText(String(i + 1).padStart(2, " "), 24, y);
      let x = 110;
      for (const [text, color] of tokens) {
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
        x += ctx.measureText(text).width;
      }
    });
  });
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(1, 0.55);
  return texture;
}

export function createSpineTexture(label: string, color: string): CanvasTexture {
  const w = 64;
  const h = 320;
  return makeTexture(w, h, (ctx) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, h);
    // Decorative bands near the top and bottom of the spine.
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(0, 18, w, 6);
    ctx.fillRect(0, h - 24, w, 6);
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = "#0b1020";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    let size = 30;
    ctx.font = `700 ${size}px ${sans()}`;
    while (ctx.measureText(label).width > h - 70 && size > 12) {
      size -= 1;
      ctx.font = `700 ${size}px ${sans()}`;
    }
    ctx.fillText(label, 0, 2);
    ctx.restore();
  });
}

export function createAboutTexture(initials: string): CanvasTexture {
  const w = 512;
  const h = 400;
  return makeTexture(w * 2, h * 2, (ctx) => {
    ctx.scale(2, 2);
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#1e1b4b");
    g.addColorStop(1, "#0f766e");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.beginPath();
    ctx.arc(w / 2, 165, 95, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fill();
    ctx.strokeStyle = "#5eead4";
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.fillStyle = "#f8fafc";
    ctx.font = `700 84px ${sans()}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(initials, w / 2, 170);
    ctx.font = `600 34px ${mono()}`;
    ctx.fillStyle = "#5eead4";
    ctx.fillText("about_me.md", w / 2, 330);
  });
}

export function createPosterTexture(): CanvasTexture {
  const w = 360;
  const h = 512;
  return makeTexture(w, h, (ctx) => {
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#f472b6";
    ctx.lineWidth = 8;
    ctx.strokeRect(22, 22, w - 44, h - 44);
    ctx.fillStyle = "#f472b6";
    ctx.font = `700 120px ${mono()}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("</>", w / 2, 190);
    ctx.fillStyle = "#f8fafc";
    ctx.font = `700 54px ${sans()}`;
    ctx.fillText("SHIP IT.", w / 2, 340);
    ctx.fillStyle = "#94a3b8";
    ctx.font = `500 22px ${mono()}`;
    ctx.fillText("git push origin main", w / 2, 410);
  });
}

export function createPhoneTexture(): CanvasTexture {
  const w = 256;
  const h = 512;
  return makeTexture(w, h, (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#312e81");
    g.addColorStop(1, "#0f766e");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#f8fafc";
    ctx.textAlign = "center";
    ctx.font = `600 64px ${sans()}`;
    ctx.fillText("09:41", w / 2, 130);
    ctx.font = `500 22px ${sans()}`;
    ctx.fillText("1 new message", w / 2, 175);
    // Notification card
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.beginPath();
    ctx.roundRect(22, 255, w - 44, 115, 22);
    ctx.fill();
    ctx.fillStyle = "#f8fafc";
    ctx.textAlign = "left";
    ctx.font = `700 22px ${sans()}`;
    ctx.fillText("Let's work", 42, 293);
    ctx.fillText("together!", 42, 320);
    ctx.font = `400 17px ${sans()}`;
    ctx.fillText("Tap to get in touch →", 42, 347);
  });
}
