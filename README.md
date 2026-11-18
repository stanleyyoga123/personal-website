# Stanley Town

My personal website, built as a tiny explorable pixel town. Instead of scrolling a page, visitors walk a character around and step into buildings, each holding one part of my story as a Machine Learning Engineer.

Prefer the plain version? Press **Quick view** in the top bar, or open the site with `?view=resume`.

## The town

| Place | What's inside |
| --- | --- |
| 🏠 Stanley's Home | Summary and everyday toolkit |
| ✈️ tiket.com HQ | ML Engineer role (2022–2025), with headline numbers |
| 🤖 AI-Levate | AI Engineer freelance role (2026) |
| 🧪 Project Lab | Side projects: ESCI Search, IncidentBench, Jev Resume Screening, TikTekTo |
| ⚒️ Skills Forge | Skills, grouped by area |
| 🎓 University | University of Melbourne and Bandung Institute of Technology |
| 📚 Library | Publication (ICAICTA 2022) |
| ✉️ Mailbox | Email, LinkedIn, GitHub |

Visit all eight places to complete the quest, and pick up the 8 ⚡ GPU credits scattered around for fun facts. Progress is saved in the browser and can be reset from the Quests menu.

## Controls

| Action | Keyboard | Mouse / touch |
| --- | --- | --- |
| Move | WASD or arrow keys | Click a tile, or use the on-screen D-pad |
| Walk to a building | — | Click it, or pick it in the Quests menu |
| Interact / next page | E, Space or Enter | A button, or Next |
| Close a dialog | Esc | ✕ |

## Running locally

Requires Node.js 20.19+ or 22.12+ (Vite's minimum).

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check and build to dist/
npm run preview  # serve the production build
npm run lint     # oxlint
```

The build is a static site in `dist/`, so it can be hosted on Vercel, Netlify, GitHub Pages or any static host.

## Project layout

```
src/
  data/resume.ts       All site content; edit this to update the resume
  content/scripts.tsx  Dialog pages shown for each building
  game/map.ts          Tile map, buildings, coins, pathfinding
  game/useGame.ts      Movement loop and keyboard input
  game/sprites.ts      Pixel-art player frames
  components/          World, Player, HUD, DialogBox, QuickView, MobilePad
  lib/                 localStorage progress, text helpers
```

### Updating content

- **Resume text** lives in `src/data/resume.ts`. Wrap text in `**double asterisks**` to make it bold. Both the game and Quick view read from this file.
- **What each building says** is in `src/content/scripts.tsx`.
- **The map** is the `MAP_ROWS` grid in `src/game/map.ts` (`T` tree, `~` water, `#` path, `f` flowers, `.` grass). Buildings, their door tiles and the coins are defined below it.

### Social preview image

Link previews (LinkedIn, X, Slack, WhatsApp...) use the Open Graph tags in `index.html` and `public/og-image.png` (1200×630). The image is rendered from a dev-only page in `og/`, which isn't part of the production build. To regenerate it after changing the town or your details:

```bash
npm run dev   # note the port, e.g. 5173
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=1200,630 --virtual-time-budget=6000 \
  --screenshot=public/og-image.png http://localhost:5173/og/
```

Sites cache previews, so after changing the image, refresh it with LinkedIn's [Post Inspector](https://www.linkedin.com/post-inspector/) or Facebook's [Sharing Debugger](https://developers.facebook.com/tools/debug/).

## Built with

React 19, TypeScript and Vite. There's no game engine: the map is a CSS grid, the player is an SVG pixel sprite, and fonts come from Google Fonts (Press Start 2P, Pixelify Sans, Inter).
