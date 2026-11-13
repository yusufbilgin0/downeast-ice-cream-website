# Harbor Cone: React Three Fiber prototype

A procedural, code-only version of the Harbor Cone hero (Downeast Ice Cream Factory redesign). It has no model files and no external downloads at runtime.

```bash
npm install
npm run dev        # http://localhost:5174
```

The following URL options are for reviews and screenshots only:
- `?still`: freezes the motion.
- `?az=-38&el=12`: sets the camera angle in degrees.
- `?top=strawberry`: sets the starting top flavor.
- `?snap`: hides the UI.

## Files
| File | What it does |
|---|---|
| `src/HarborCone.tsx` | Drop-in component. Contains the idle motion (8 s loop: float, ±10° sway), the ~8° tilt toward the pointer or touch, and the soft contact shadow. Respects the "reduce motion" setting. Mesh names: `Cone_Waffle`, `Cone_Rim`, `Scoop_Top/Middle/Bottom`, `Drip_Top`. |
| `src/geometry.ts` | Procedural meshes. Scoops have scraped folds, a ragged lip and a tucked base. The cone grid is laid out on the unrolled cone, so cells stay the same size. Also builds the crimped rolled rim and a drip that runs over the lip. |
| `src/materials.ts` | Shader-extended `MeshPhysicalMaterial` / `MeshStandardMaterial`. Draws marbled ribbons, fruit and berry pieces, vanilla-bean specks, fine grain and crisp waffle ridges per pixel. Detail too small for a pixel fades out instead of shimmering. |
| `src/flavors.ts` | Flavor looks as data. **These are art-direction placeholders**; the client must confirm the flavor names and looks. |
| `src/App.tsx` | Demo page: camera, studio lights (procedural environment, no HDR download), and the top-scoop flavor switcher. |

## Swapping a flavor
Pass `flavors={{ top, middle, bottom }}`, or call `applyFlavor(material, FLAVORS.x)`. Only shader values change, so a swap needs no rebuild and no shader recompile. The drip shares the top scoop's material and follows it automatically.

## Moving to the Next.js site
- Add `'use client'` to the component and load it with `next/dynamic` and `ssr: false`.
- Pass a `still` prop driven by scroll position or visibility to pause it off-screen.
- The geometry is built once on mount, which takes about 100 ms on a laptop. It could be pre-baked to a GLB later.
