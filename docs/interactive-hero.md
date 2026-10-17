# Interactive Grind&Glory hero

The hero follows `updated hero section.png`: a cream background, original centered brand artwork, two text columns, and a realtime 3D character. Existing sections, inventory, routes, and marketplace links are retained.

## Run and verify

```sh
npm install
npm run dev
npm run lint
npm run build
npx playwright test tests/mascot.spec.ts tests/landing.spec.ts tests/motion.spec.ts
```

On PowerShell with script execution disabled, use `npm.cmd` and `npx.cmd`. The development server is at http://localhost:3000. Run a server before Playwright; tests use installed Microsoft Edge by default.

## Files and configuration

- `components/sections/hero.tsx` and `hero.module.css`: responsive composition and restrained CSS entrance animations.
- `components/hero/`: original brand lockup, section navigation, locally served platform logos, and decorations.
- `components/three/mascot/mascot-viewport.jsx`: responsive rendering, client-only scene loading, image fallback, visibility tracking, and cursor input. Below 768px, only a static image renders; the Three.js runtime stays unloaded. Desktop has no play/pause button.
- `mascot-scene.jsx`: orthographic framing, procedural studio reflections, lighting, contact shadows, and capped device pixel ratio.
- `mascot-character.jsx`: damped pointer tracking, breathing, idle motion, blinks, and crown settling through refs without per-frame React updates.
- `mascot-body.jsx`, `mascot-mask.jsx`, `mascot-eyes.jsx`, `mascot-crown.jsx`, and `mascot-geometry.js`: reusable procedural meshes. The mask follows the body's curved surface; the crown is traced from the supplied brand mark, including the diamond cutout.
- `mascot-config.js`: palette, body proportions, motion settings, and render quality.
- `soft-glow.jsx` and `mascot-config.js`'s `illumination` settings: local lavender halos, emissive eye crescents, the faceted crown gem, and light spill. These use depth-tested meshes and small point lights with no full-screen bloom pass. Responsive floor lighting pairs a broad lavender pool with a tighter contact shadow.
- `scripts/prepare-hero-brand.mjs`: regenerates the transparent hero mark and wordmark from original local artwork.
- `public/images/mascot/mobile-mascot.webp`: transparent static render of the actual 3D mascot, retaining its gem, eye glow, and materials.
- `scripts/render-mobile-mascot.mjs`: recaptures that asset from the running desktop scene after character changes. Run `node scripts/render-mobile-mascot.mjs` with the development server open.

Mobile uses the static WebP without a WebGL canvas or animation loop. Desktop reduced motion renders a still 3D character. Desktop rendering stops when the mascot leaves the viewport or the tab is hidden. GPU failure falls back to the same static artwork. With JavaScript disabled, the mascot image, logo, copy, and section navigation remain available.

The header appears after scrolling past the hero. The mobile hero uses direct navigation links below the mascot, with no hamburger button. Navigation targets existing `#accounts`, `#about`, `#process`, and `#contact` sections. Contact currently leads to the existing marketplace CTA; no new contact address or social URL has been invented.

## Fidelity limits

The body, mask, eyes, studio reflections, and crown depth are procedural interpretations of the reference, rather than a supplied production character model. The crown outline and displayed logo lettering derive from the original brand assets. The reference's offline-rendered reflections are approximated with a lightweight realtime studio setup, with no external HDRI or model download.

The retired gradient/controller and cycling hero headline tests are replaced by mascot coverage. Lower-section motion and general landing tests remain in place.
