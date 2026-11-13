# Downeast Ice Cream Factory website

The redesigned site for downeasticecreamfactory.com. Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 and Motion.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production build
```

## Pages

| Route | Purpose |
|---|---|
| `/` | Hero with live open/closed badge, both shops, "More cream, less air", favorite flavors, Factory Shop, wholesale |
| `/flavors` | Searchable, filterable flavor wall (61 ice creams) plus soft serve, sherbet, sorbet and vegan |
| `/sundaes` | Specialty sundaes, parfaits, banana split, Nor'Easter |
| `/visit` | Both shops with maps, directions, season, FAQ |
| `/story` | Since 1979, small batch, the Factory, Super Premium |
| `/wholesale` | Wholesale program and inquiry form |
| `/contact` | Contact form |

Old WordPress URLs (`/contact-us`, `/gallery`, `/author/...`) redirect permanently (see `next.config.ts`).

## Editing content (no CMS yet)

All business content lives in `src/content/`:

- `site.ts`: name, phone, social links, **both addresses**, **season and hours**, navigation.
- `flavors.ts`: every flavor, its description, browsing families, scoop colors, and "Taste of Maine" / favorite flags.
- `sundaes.ts`: sundaes and parfaits.

When the shop needs to update flavors or hours without a developer, move these files into a CMS (Sanity is the recommendation). The file shapes are written to map directly onto CMS documents.

### Season and hours

`season` in `src/content/site.ts` drives the open/closed badge, footer, Visit page and FAQ:

- `openMonth` / `closeMonth`: currently May–October 2027 (confirmed by the owner).
- `hoursLabel` / `dailyOpenHour` / `dailyCloseHour`: "Daily, 12 – 9 pm", **taken from the old site and not yet confirmed for 2027**.
- `hoursConfirmed: false`: while false, the badge shows "Open for the season" instead of "Open now / Closed right now". Set it to `true` once the hours are confirmed.

The badge is computed in the visitor's browser using Boothbay Harbor time (America/New_York).

## Contact and wholesale forms

`src/app/api/inquiry/route.ts` validates the form, blocks simple bots with a honeypot field, and emails the shop through [Resend](https://resend.com) when these environment variables are set:

```
RESEND_API_KEY=...
INQUIRY_TO=owner@example.com
INQUIRY_FROM="Downeast Website <web@downeasticecreamfactory.com>"
```

Without them, the form tells visitors to call (207) 315-6670. Nothing is sent anywhere.

## Design system

Tokens are in `src/app/globals.css` (`@theme`): harbor navy, cream, blueberry, strawberry, mint, waffle and buoy red (calls to action only). Display font: Fraunces (soft/wonky axes). Body font: Figtree.

Reusable pieces: `components/ui.tsx` (buttons, wave divider, page hero), `Scoop.tsx` (SVG scoop and logo mark), `Reveal.tsx` (scroll reveal), `StatusBadge.tsx`, `LocationCard.tsx`, `FlavorWall.tsx`, `InquiryForm.tsx`.

All animation respects the visitor's "reduce motion" setting.

## 3D hero cone

The homepage cone is real-time 3D (Three.js + React Three Fiber), built entirely in code, so there are no model or texture files to download.

| File | What it does |
|---|---|
| `components/three/geometry.ts` | Cone, rolled rim, hand-scooped scoop shapes and the drip (sizes in `SCOOPS`, `CONE_H`) |
| `components/three/materials.ts` | Ice-cream shader (swirls, fruit pieces, specks, grain) and baked waffle shader |
| `components/three/coneFlavors.ts` | Colors per flavor. Swapping a flavor only changes shader values, with no rebuild |
| `components/three/HarborCone.tsx` | Idle float/sway (8 s loop) and ~8° tilt toward the pointer or finger |
| `components/three/ConeScene.tsx` | Camera, studio lights, reflections, tone mapping |
| `components/home/ConeHero.tsx` | Loading strategy and fallbacks (below) |

How it loads:
1. `public/images/harbor-cone-3d.jpg` (a still of the same model, same camera) is in the HTML. It's the first paint, what search engines and link previews see, and the fallback.
2. When the page is idle, the 3D code (~1 MB, ~280 KB compressed) downloads and the live cone cross-fades in after it has drawn.
3. The still image stays in place for visitors who ask for reduced motion or use data saver, for devices with under 4 GB of memory or fewer than 4 CPU cores, when WebGL2 isn't available, or if the graphics context is lost.
4. Rendering pauses while the hero is scrolled away or the tab is hidden. Phones get a lighter mesh and resolution.

### "Stack your cone" (Flavors page)

`components/flavors/StackYourCone.tsx` lets visitors pick a flavor for each scoop. The same 3D cone is reused: `lookFor()` in `coneFlavors.ts` turns any menu flavor's display colors and family into a 3D look (Blueberry, Strawberry and Vanilla are hand-tuned), so new menu flavors work automatically. A swap blends the colors and drops the scoop in with a squash (`HarborCone.tsx`, `SWAP_MS`).

- Desktop: 3D loads when the section nears the screen.
- Phones: a 2D SVG cone (`Cone2D.tsx`) with an opt-in "View in 3D".
- Reduced motion, data saver, weak devices, no WebGL2: 2D only.
- Only one 3D canvas per page (hero on Home, showcase on Flavors).
- Keep `coneFlavors.ts` free of `three` imports, because the Flavors page loads it up front.

The waffle grid has no seam at the back because the cone's radius is `CONE_H / sqrt(15)`: its unrolled dough sector is exactly 90°, which a square grid tiles cleanly. If you change the cone's proportions, keep that ratio or the seam returns.

**Changing the look:** after editing geometry, materials or flavors, re-capture the still so the cross-fade stays seamless. Open `/?cone-still` (the pose is frozen), screenshot the cone box on a cream background, and save it over `public/images/harbor-cone-3d.jpg`.

Earlier art-direction work: a private Spline file (link in `previews/NOTES.md`) and the standalone prototype in `harbor-cone-r3f/`.

## Still needed from the owner

- Confirm the 2027 daily hours (and exact opening/closing dates, if they're fixed).
- The official logo file (SVG or high-res PNG). The scoop mark in the header is a placeholder brand mark.
- Real photos (shops, Factory, cones) for the Story page and social sharing.
- Email address for form inquiries, plus approval to set up Resend (free tier).

## Deployment (Vercel)

- Live preview: https://downeast-ice-cream-website.vercel.app (Vercel project `downeast-ice-cream-website`).
- **Automatic:** every push to `main` on GitHub deploys to production. Pushes to other branches get their own preview URL.
- Vercel's **Root Directory is `site`**. For a manual deploy with the CLI, run `vercel deploy --prod` from the repository root, not from `site/`.
- Search engines are blocked until launch. At launch, add the environment variable `ALLOW_INDEXING=true` in Vercel (Production) and redeploy.
- Form email: add `RESEND_API_KEY`, `INQUIRY_TO` and `INQUIRY_FROM` in Vercel's environment variables (see "Contact and wholesale forms" above).
- Custom domain: not connected yet. `downeasticecreamfactory.com` still points to the old WordPress site.
- Plan: the free Hobby plan is for non-commercial use. Upgrade to Pro (or move hosts) before serving the business's real domain.
