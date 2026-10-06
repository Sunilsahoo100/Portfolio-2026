# 3D Developer Room Portfolio

An interactive, low-poly developer room built entirely in code with Next.js and React Three Fiber.
Visitors click objects in the room to explore: the **monitor** (projects), the **bookshelf**
(skills, one book per skill), the **wall frame** (about + experience), the **phone** (contact),
and the **coffee mug** (easter egg). It includes a day/night switch and a fast, accessible
**classic view** (`?view=classic`).

## Edit your content

Everything you'd want to change lives in **`src/data/portfolio.ts`**: name, bio, email, socials,
projects, skills, experience, education and fun facts. Both the 3D room and the classic view
read from it.

- Resume: put `resume.pdf` in `public/` and set `resumeUrl: "/resume.pdf"`.
- After deploying, set `siteUrl` to your real URL (used for SEO, sitemap and share previews).

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Useful URL flags: `?perf` (FPS stats), `?quality=low|high` (force render quality),
`?view=classic` (open the classic view).

## Deploy (Vercel)

1. Push this repo to GitHub.
2. In Vercel, **Add New → Project**, import the repo and keep the defaults.
3. Every push to `main` redeploys automatically.

## How it's built

| Area | Where |
| --- | --- |
| Scene setup, quality, post-processing | `src/components/canvas/Experience.tsx`, `Effects.tsx` |
| Room objects (all made from primitives) | `src/components/canvas/objects/` |
| Camera flights and framing | `src/components/canvas/CameraRig.tsx`, `src/lib/hotspots.ts` |
| Day/night lighting | `src/components/canvas/Lights.tsx` |
| Canvas-drawn textures (code screen, book spines, posters) | `src/lib/textures.ts` |
| Overlay UI (loader, intro, HUD, panels) | `src/components/ui/` |
| Classic view + shared content blocks | `src/components/classic/`, `src/components/sections/` |

Stack: Next.js 16, React 19, TypeScript, Tailwind CSS 4, three.js, @react-three/fiber, drei,
@react-three/postprocessing, GSAP, Motion, Lenis and Zustand.
