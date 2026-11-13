# Downeast – Harbor Cone Hero

## In the Next.js site (2026-11-12, ~23:05)
- The site (`site/`, built by the main redesign session) already used the R3F cone. I applied the scoop-refinement pass to `site/src/components/three/`, keeping the site's own flavor color tuning.
- I re-captured the first-paint still `site/public/images/harbor-cone-3d.jpg` from the live model, so the change from still image to live 3D stays seamless.
- Checks: `tsc`, eslint and `next build` pass; the live homepage hero renders the refined cone.
- `site-hero-live.png` is the homepage at 1440×900 with the live cone. `site-hero-still.jpg` is the new still.
- Nothing is deployed or committed.
- Open issue: the site's drag-to-spin exposes the cone's back seam, where the waffle grid doesn't meet. The site session is fixing it.
- The user confirmed: keep the refined scoops. The pre-patch copies in the shared notes folder (`pre-patch-backup/`) are no longer needed.

## React Three Fiber prototype (2026-11-12): current best version
The code is in `harbor-cone-r3f/`; see its README. Run `npm run dev` there and open http://localhost:5174. It runs locally only and has not been deployed, published or committed.

| File | What it shows |
|---|---|
| `r3f-front.png` | Hero front view (azimuth −14°), motion frozen |
| `r3f-three-quarter.png` | Three-quarter view (azimuth −38°, elevation 12°) |
| `r3f-swap-strawberry-top.png` | Flavor swap: strawberry on top, blueberry in the middle; the drip follows the top flavor |
| `r3f-motion-frame.png` | A live frame with motion running (the cone mid-float/sway) |
| `r3f-back.png` | Back view (azimuth 150°): checks for seams; shows the cone's rolled seam |

### Scoop refinement pass (2026-11-12, later): current renders
- **Taller scoops** (vertical squash 0.84 → 0.93), with the stack respaced so they nest instead of sinking.
- **Curled, torn folds.** Each scoop now has a rolled sheet of cream: about three layers wrap around a roughly horizontal axis, with a crisp torn step on one side of each layer and a long smooth ramp on the other. The roll direction differs per scoop. This replaced most of the vertical drag ridges, which are now fine striations. The ragged lip has more high-frequency tearing.
- **Back-lit glow.** The cream brightens slightly and gains saturation at grazing edges (faked translucency), so silhouettes glow instead of going grey.
- **Blueberry flecks.** Piece size is now per flavor (`chunkFreq`). Blueberry uses small, numerous dark berry-skin flecks; strawberry keeps larger fruit pieces.
- **Drip.** It now starts beneath the surface as a wide flat sheet and rounds out only where it hangs, so it grows out of the cream.
- **Fixed during the pass:** the first curl version left a straight seam across the strawberry scoop (a non-whole number of layers per turn). It is now a whole number; the three-quarter and back views are clean.

**Remaining gaps:**
- The cone's back seam is visible only from behind, by design; it never reaches the hero framing.
- The curl layers are clearest on the vanilla and subtler on the smaller upper scoops.
- Real-device mobile frame rate and the pointer tilt are still unchecked.

All four are unedited headless-Chrome renders of the real page (1000×1250). The UI is hidden via `?snap`. The background glow is CSS.

**What improved over Spline**
- The scoops have per-pixel surface detail:
  - fine grain;
  - marbled ribbons;
  - strawberry pieces that read as fruit;
  - vanilla-bean specks;
  - a frosty sheen and a thin melt clearcoat.
- No more glued-on blobs.
- The waffle grid is crisp at any zoom, with darker toasted ridges, paler pockets and browning toward the tip. It is built on the unrolled cone like real rolled dough.
- The rim is a crimped rolled edge, darker on its outer lip.
- The studio lighting comes from a procedural environment (warm key softbox, cool harbor-blue rim strip), so there is real reflection on the gloss with no HDR download.
- The contact shadow is a soft navy-tinted card that tightens as the cone floats down. That is cheaper on mobile than a shadow render pass.
- Flavor swaps change shader values only, with no rebuild or recompile.

**Checked**
- `tsc` and `vite build` pass, with no console errors.
- Front, three-quarter and swap renders were reviewed by eye.
- The idle motion was confirmed: two frames a moment apart show the cone 16 px higher and rotated differently.

**Not checked**
- The pointer/touch tilt: it can't be driven in headless capture. The code listens to pointer and touch events on the window.
- Real-device mobile frame rate.
- How it looks inside the Next.js site.

**Still short of premium (honest view, after the refinement pass)**
1. Items 1–4 from the first R3F pass (dome shapes, subtle flecks, no glow, tube-like drip) have been addressed; see "Scoop refinement pass" above. A hand-sculpted Blender scoop would still beat procedural folds for close-ups.
5. About 92k vertices, generated on load (~100 ms). Fine for desktop; on mobile, lower the segment counts or pre-bake to a compressed GLB.
6. The flavor colors are placeholders; confirm with the client.

---

# Spline prototype (earlier, kept for art-direction reference)

**Editor link (private, not published):**
(private Spline file in the owner's Spline account; link not published)

Status: editable Spline 3D file. It has **not** been published, made public, exported or embedded.
Built 2026-11-12 with the Spline MCP tools (Free plan).

## Screenshots
| File | What it shows |
|---|---|
| `01-front-pass1.jpg` | Front view after the first pass. Shows its defects: hard offset shadow, stick-like drip, polka-dot inclusions. |
| `02-three-quarter-pass2.jpg` | Three-quarter view (azimuth −35°) after the geometry, drip and shadow fixes. |
| `03-final-hero-live.jpg` | Final framing (azimuth −15°, elevation 8°), captured from the live viewport after fixing the blueberry color. |

| `04-polish-pass3-live.jpg` | Polish pass 3, captured from the live viewport. Current state of the file. |

All four are unedited Spline renders.

### Polish pass 3 (follow-up "make it better")
- Scoop materials are rougher (0.46–0.52 instead of about 0.35) with lower reflectivity: creamier and less plastic.
- Colors are desaturated toward the brand palette: blueberry #5b3d77, strawberry #e8a6b4, vanilla #f2e4c8.
- The rim was rebuilt as a thicker rolled-dough torus (with a crimp ripple) tucked under the vanilla lip, in a darker toasted gold. The flat orange ring is gone.
- Added an HDRI studio environment ("Blue photo studio", background hidden, lighting 0.6) for reflections, and lowered the ambient to 0.55. The HDRI only renders on WebGPU; WebGL falls back to the flat lighting.
- Known nit: a small sliver of rim pokes out at the left edge of the vanilla scoop.
- What's still missing is the same as listed below: micro-detail, swirl-style inclusions, browning variation. These need Blender or R3F.

## Scene structure
```
HarborCone (group: the idle/tilt script drives this)
├─ Cone_Waffle               Mat_Waffle          custom mesh: waffle grid, raised in the geometry and textured (Tex_WaffleCell, bump)
├─ Cone_Rim                  Mat_ConeRim         rolled rim (wobbly torus)
├─ Scoop_Bottom              Mat_Vanilla         hand-scooped custom mesh: ridges, ruffled lip, tucked base
├─ Scoop_Bottom_Inclusions   Mat_Vanilla_Bits    vanilla-bean specks (one merged mesh)
├─ Scoop_Middle              Mat_Strawberry
├─ Scoop_Middle_Inclusions   Mat_Strawberry_Bits strawberry pieces
├─ Scoop_Top                 Mat_Blueberry
├─ Scoop_Top_Inclusions      Mat_Blueberry_Bits  blueberry skin flecks
└─ Drip_Top                  Mat_Blueberry       drip over the top scoop's lip, with a hanging bead
Light_Key   directional, warm white, casts the soft shadow (shadowRadius 26, size 3000)
Light_Rim   directional, cool blue #cfe0ff, from back right, no shadows
Light_Fill  directional, warm, low intensity, no shadows
Shadow_Catcher  invisible plane at y = −80 that shows only the contact shadow
Backdrop_Glow   unlit plane: radial harbor-navy glow fading into #FBF5EA (Tex_HarborGlow)
Background  #FBF5EA; ambient #fff3e2 at 0.7; ambient occlusion on
```
Approximate size: about 60k vertices in total. The only textures are two small canvas-drawn images (256 px and 512 px). Nothing is AI-generated.

## Motion (HTML layer: Code tab in the Spline editor)
A headless script (no visible UI) drives `HarborCone` with `spline.updateObject`:
- **Idle:** an 8 s loop of ±8 units float, ±10° yaw sway and a small roll wobble.
- **Pointer/touch tilt:** about 8° toward the cursor (pointer, touchstart and touchmove), smoothed, easing back to centre after 2.5 s without input.
- If the viewer has "reduce motion" turned on, the idle loop is switched off and only the tilt remains.
- **Not verified:** the motion has not been checked in Play mode with two timed captures. I didn't do that check because of the daily call limit. Open Preview in the editor to confirm it runs. Because the script positions the group from its saved transform, moving `HarborCone` in the editor also moves the motion's centre.

## How to swap a flavor
Each scoop has its own named shared material, so a swap means changing one material asset. Then every object linked to it updates, including the drip on the top scoop.
- **In the editor:** select `Scoop_Top` and pick a different material asset in the Material panel, or edit the colors of `Mat_Blueberry` itself. Do the same for `Scoop_Top_Inclusions` / `Mat_Blueberry_Bits`.
- **Through the MCP DSL:** this form worked:
  `updateMaterial('Mat_Blueberry', { layers: [{ type: 'light', category: 'physical', roughness: 0.34, metalness: 0 }, { type: 'color', color: '#64428a' }] })`.
  Layer entries need `type`. Patching a layer by `id` alone was rejected.
- **At runtime (website):** `spline.updateObject('Scoop_Top', { material: { color: '#…' } })`. For the R3F version, swap the material on the matching mesh name.
- **Gotcha:** `deleteMaterial` followed by `createMaterial` under the same name produced a **default grey** asset (#54545b). The scoop went charcoal until the asset was patched with `updateMaterial`. Also, `getMaterial` read back stale/default values right after the update, even though the render was correct. Check the render, not the read-back.

## What still falls short of "premium commercial product render"
Honest view: this is a solid art-direction blockout. It reads as a hand-scooped triple cone, but it is **not** at premium product-render quality yet.
1. **Scoop surfaces are too smooth and uniform.** Real scooped ice cream has torn, folded and grainy texture and scraped ridge curls. These scoops have soft procedural lumps and a ruffled lip, but no micro-detail and no subsurface "creaminess". The lip ruffle still reads a little like pie crust.
2. **The materials are plastic-glossy rather than frozen-creamy.** There is no subsurface scattering, no frost or matte bloom, and no melt sheen variation. The strawberry pink and blueberry violet are still a bit candy-saturated next to the brand palette.
3. **The inclusions are geometric blobs.** Blueberry flecks should be streaky swirls of dark skin in the cream, and strawberry pieces should be translucent fruit with seeds. At close range they read as glued-on pellets.
4. **The rolled rim reads as a flat orange ring** from the hero angle. It needs a real rolled-dough form with a darker toasted edge and texture continuity with the cone.
5. **The waffle cone is the strongest part.** Its color is slightly orange and uniform, and it lacks browning variation (darker at the tip and rim) and the irregular dough edges.
6. **Lighting is clean but generic.** There is no HDRI or studio reflections on the gloss, so the rim light gives little separation on the dark scoop. The contact shadow is soft but slightly dithered.
7. **The backdrop glow is a flat plane.** It shifts off-centre at wider orbit angles, so it is only correct near the front view, which is the hero framing.

## Recommended next refinements
- **To reach the quality bar, model and texture the scoops and cone in Blender**, not with more Spline procedural tweaks:
  - sculpt 2–3 scoop variants with real scooped folds;
  - bake normal and AO maps from high to low poly;
  - paint inclusion albedo into the texture instead of separate blobs;
  - use a real rolled rim;
  - export a draco/meshopt-compressed GLB, aiming for roughly 1–2 MB.
- **Ship it as React Three Fiber + GLB rather than the Spline runtime**, for mobile performance and so the cone can travel with scroll into the flavors section. That gives:
  - `MeshPhysicalMaterial` with sheen/transmission-style tricks for creaminess;
  - an HDRI environment for believable gloss;
  - `ContactShadows`;
  - material swaps keyed by flavor;
  - the same idle/tilt logic, which ports directly.
- Keep this Spline file as the art-direction reference for proportions, palette, lighting directions and motion values (8 s loop, 8° tilt, ±10° sway).
- Short-term Spline-only polish, if wanted:
  - lower the scoop saturation;
  - add a `noise` layer for grain;
  - add a subtle fresnel for a creamy edge;
  - darken the rim's toasted edge;
  - swap the backdrop plane for a camera-facing approach.

## Spline usage
- Plan: **Free**, daily limit **20 tool calls** (resets 2026-11-14 00:00 UTC). Started at 0 used.
- Calls this session: about **18 of 20**:
  - 1 profile;
  - 4 guide loads (3 authoring parts plus html-content);
  - 1 file creation;
  - 7 `run_code`, including one rejected `updateMaterial` call;
  - 1 HTML content;
  - 1 live screenshot.
- Polish pass 3 used the last 2 calls (1 `run_code`, 1 live screenshot). That's **about 20 of 20**: no Spline calls left until the reset.
