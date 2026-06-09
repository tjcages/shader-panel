# @tjcages/shader-dev

Drop-in dev panel for tweaking shader uniforms live.

- **Zero CSS framework** — ships its own scoped stylesheet (CSS variables; override anything).
- **Zero animation library** — pure CSS transitions, no `motion` / `framer-motion` peer dep.
- **One-line mount** + per-shader `registerShaderDev({ ... })` on hydrate.
- **Works with any shader** — raw WebGL, [`@paper-design/shaders`](https://github.com/paper-design/shaders), React Three Fiber, custom WebGL2, etc. The panel doesn't care what's behind your `onChange`.
- **TypeScript-first** — field schema is generic over your config type, so labels and keys stay in sync.

Toggle the panel with **⌘⇧`** (recommended — browsers rarely steal it), or **⌘⌥D** / **⌘⇧D** as fallbacks.

---

## Install

```sh
pnpm add @tjcages/shader-dev
# or
npm install @tjcages/shader-dev
```

Peer deps: `react >=18`, `react-dom >=18`. That's it.

## Two-step setup

### 1. Mount the root once

```tsx
// app/layout.tsx, or wherever your top-level UI lives
import { ShaderDevRoot } from "@tjcages/shader-dev"

export default function Layout({ children }) {
  return (
    <>
      {children}
      <ShaderDevRoot />
    </>
  )
}
```

Astro? Use a hydrated React island:

```astro
---
import { ShaderDevRoot } from "@tjcages/shader-dev"
---
<ShaderDevRoot client:load />
```

### 2. Register on the shader component

```tsx
import { useEffect, useState } from "react"
import { registerShaderDev } from "@tjcages/shader-dev"
import type { ShaderDevFieldDef } from "@tjcages/shader-dev"

type MyConfig = { speed: number; bgColor: string }

const DEFAULTS: MyConfig = { speed: 1.0, bgColor: "#ff5e1f" }

const FIELDS: ShaderDevFieldDef<MyConfig>[] = [
  { type: "section", title: "Animation" },
  { type: "slider", key: "speed", label: "Speed", min: 0, max: 2, step: 0.01 },
  { type: "section", title: "Color" },
  { type: "color", key: "bgColor", label: "Background" },
]

export function MyShader() {
  const [config, setConfig] = useState<MyConfig>(DEFAULTS)

  // registerShaderDev returns its unregister fn — use it as the effect cleanup.
  useEffect(() => {
    return registerShaderDev({
      id: "my-shader",
      title: "My shader",
      values: config,
      defaults: DEFAULTS,
      fields: FIELDS,
      onChange: setConfig,
    })
  }, [config])

  // ...render your shader, feed it `config`
}
```

That's the full contract. Whatever you do inside `onChange` — set Three.js uniforms, call `mount.setUniforms(...)`, update a `useFrame`-bound ref — is up to you.

**Multi-shader pages.** When two or more components call `registerShaderDev` at the same time, a small switcher appears next to the title so you can flip between them. Each registration is keyed by `id` — re-registering with the same id just replaces the entry.

**Per-section reset.** Hover any section header and a `↻` icon appears — clicking resets just that section's fields to their defaults. The bottom-of-panel "Reset to defaults" still resets everything.

**Edits persist across reloads.** The panel writes every change to `localStorage["shader-dev:<id>"]`. To hydrate on mount, use the helper as your `useState` initializer:

```tsx
import { loadPersistedShaderDevValues, registerShaderDev } from "@tjcages/shader-dev"

const [config, setConfig] = useState(() =>
  loadPersistedShaderDevValues("my-shader", DEFAULTS),
)
```

A small "● Edits saved locally" indicator surfaces at the bottom of the panel whenever current values differ from defaults. "Reset to defaults" wipes the storage entry too. Opt out by passing `persist: false` to `registerShaderDev`.

**Paste JSON.** Bottom-of-panel "Paste JSON" reveals a textarea — paste a config blob (e.g. one your collaborator copied via "Copy JSON") and hit Apply. Unknown keys are dropped; known keys merge into the current config.

## Production builds (zero panel weight)

When bundlers build with `NODE_ENV=production` (Astro `astro build`, Next `next build`, Vite `vite build`, etc.), `@tjcages/shader-dev` resolves to a tiny stub via package.json `exports` conditions:

| | Dev | Prod |
| --- | --- | --- |
| Bundle | ~63 KB | ~5.6 KB |
| `ShaderDevRoot` | full panel | `() => null` |
| `registerShaderDev` | real registry | no-op |
| `loadPersistedShaderDevValues` | reads localStorage | returns defaults |
| `createWebGLAdapter` / `createR3FAdapter` / `hexToRgb01` | full | **full** (still needed at runtime) |

The shader runtime keeps working — only the dev UI is gone. To force the full panel even in production (e.g. for a staging build), import from the `/dev` subpath:

```ts
import { ShaderDevRoot } from "@tjcages/shader-dev/dev"
```

## AI prompts rail

A "Quick actions" row at the top of every panel surfaces copy-pasteable AI prompts. These aren't one-liners — each is a senior-graphics-engineer brief (~2k chars) with a concrete checklist, specific techniques, and code patterns, so the receiving model has real guidance instead of vibes:

- **Improve visual quality** — color-space correctness, tone mapping (Reinhard/ACES), TPDF dithering, derivative-based edge AA, portable hashes, FBM/domain-warp, smootherstep easing
- **Optimize GPU performance** — classify the bottleneck first, then cut ALU / transcendentals, warp-divergent branches, `mediump` precision wins, dependent texture reads, and tiler/mobile pitfalls
- **Reduce shimmer / temporal aliasing** — prefilter high-frequency detail with `fwidth`, fade sub-Nyquist octaves, mip/anisotropy, specular roughness clamping (analytic before temporal)
- **Find runtime bugs & leaks** — GL disposal chains, context-loss handling, R3F uniform/`useFrame`/`setState` hot-path traps, and GLSL NaN/Inf + `mediump` overflow hazards
- **Expose missing parameters** — detect every uniform, exclude runtime-driven ones, infer field type + min/max/step, group into sections, keep config/DEFAULTS in sync
- **Switch to shader-dev adapters** — replace a hand-rolled `configToShaderUniforms` with `createWebGLAdapter` / `createR3FAdapter`

Click a row → preview the full prompt. Click the copy icon → it's on the clipboard, ready to paste into Claude / Cursor / Codex.

Customize per shader:

```ts
registerShaderDev({
  // ...
  prompts: [
    { id: "diff-from-figma", title: "Match the Figma frame", prompt: "..." },
    // Pass `[]` to hide the rail entirely.
  ],
})
```

Defaults are exported as `DEFAULT_SHADER_DEV_PROMPTS` — spread them into your own array to extend rather than replace.

---

## The single AI prompt

Copy and paste this into Claude / Cursor / your editor of choice to wire up an existing shader in one shot. It auto-detects the shader type and generates the three artifacts plus the registration hook.

> **Wire `<PATH_TO_SHADER_FILE>` into `@tjcages/shader-dev`.**
>
> 1. **Detect the shader type:**
>    - `ShaderMount` / `useShaderMount` from `@paper-design/shaders` → **paper-design**
>    - `Canvas` / `useFrame` / `useThree` from `@react-three/fiber` (or material `onBeforeCompile`) → **R3F**
>    - Raw `gl.useProgram` / `gl.uniform*` / fragment string passed to `WebGL2RenderingContext` → **raw WebGL**
>    - Anything else → **custom** (just call the user's existing uniform-set function inside `onChange`)
>
> 2. **Extract every tweakable parameter and pick the right field type:**
>    - Read the fragment / vertex source: every `uniform float`, `uniform vec2`, `uniform vec3` (color or otherwise), `uniform int`, `uniform bool` is a candidate.
>    - Read the JS side for the literal value currently passed for each uniform — use that as the default.
>    - Skip uniforms that are time, mouse, resolution, or otherwise driven by the runtime (`u_time`, `u_resolution`, `u_mouse`, etc.).
>    - **Field type picking:**
>      - Scalar `float` / `int` → `slider`
>      - `vec3` with a color-y name (`u_bg`, `u_*Color`, `u_tint`) → `color`
>      - `vec2` (direction, anchor, offset) → `vec2`
>      - `bool` → `toggle`
>      - `int` used as a mode/enum (`u_blendMode`, `u_quality`) → `select` with literal options
>    - For sliders / vec2: infer a reasonable `min` / `max` / `step` from the current value's magnitude (a value of `0.5` → `min: 0, max: 1, step: 0.01`; a value of `45` → `min: 0, max: 90, step: 1`). If the GLSL has a comment like `// range: 0..10`, honor it.
>    - Group related uniforms under `{ type: "section", title: "..." }` headers (Animation, Color, Geometry, Mouse, etc.) inferred from name prefixes (`bolt*` → "Lightning bolts", `bloom*` → "Bloom", etc.).
>
> 3. **Generate three files alongside the shader component:**
>    - `<name>-shader-config.ts` — exports `<NAME>_SHADER_DEFAULTS` (plain object) and the `<Name>ShaderConfig` type. Wrap `DEFAULTS` in `// @shader-config-start` / `// @shader-config-end` marker comments so `patchShaderConfigDefaults` can rewrite it from the dev panel.
>    - `<name>-shader-fields.ts` — exports `<NAME>_SHADER_DEV_FIELDS: ShaderDevFieldDef<<Name>ShaderConfig>[]` with one entry per tweakable uniform, grouped into sections.
>    - For **paper-design / raw WebGL**, prefer `createWebGLAdapter({ fields: FIELDS })` over a hand-rolled `configToShaderUniforms`. Only fall back to a hand-rolled function if uniform names don't follow the `u_${key}` convention and per-key overrides aren't enough.
>    - For **R3F**, prefer `createR3FAdapter({ uniforms, fields: FIELDS })` over hand-mutating each slot.
>
> 4. **Modify the shader component file:**
>    - Add `import { registerShaderDev } from "@tjcages/shader-dev"`.
>    - Replace any hardcoded config with `useState<<Name>ShaderConfig>(() => ({ ...<NAME>_SHADER_DEFAULTS }))`.
>    - Add the registration effect — return the result of `registerShaderDev` as the cleanup:
>      ```tsx
>      useEffect(() => {
>        return registerShaderDev({
>          id: "<name>",
>          title: "<Pretty name> shader",
>          values: config,
>          defaults: <NAME>_SHADER_DEFAULTS,
>          fields: <NAME>_SHADER_DEV_FIELDS,
>          onChange: setConfig,
>        })
>      }, [config])
>      ```
>    - Wire `config` to the shader runtime in a separate `useEffect([config])`:
>      - **paper-design / raw WebGL:** `mount.setUniforms(toUniforms(config))` where `toUniforms = createWebGLAdapter({ fields: FIELDS })`.
>      - **R3F:** `apply(config)` where `apply = useMemo(() => createR3FAdapter({ uniforms, fields: FIELDS }), [uniforms])`. Don't re-create the uniforms object per render.
>
> 5. **Do not** add Tailwind classes, motion imports, or extra dependencies. Do not change visual styling. Do not generate React 18-only or React 19-only syntax — match whatever the host project uses.
>
> Report what shader type you detected, which uniforms you found, and which (if any) you skipped as runtime-driven.

This prompt is deterministic enough that the same file produces the same three artifacts across runs. The result drops in cleanly behind a single `⌘⇧\`` toggle.

---

## Field schema

```ts
type ShaderDevFieldDef<T> =
  | { type: "section"; title: string }
  | { type: "slider"; key: keyof T; label: string; min: number; max: number; step: number }
  | { type: "color";  key: keyof T; label: string }                                          // value: "#rrggbb"
  | { type: "toggle"; key: keyof T; label: string }                                          // value: boolean
  | { type: "select"; key: keyof T; label: string; options: ReadonlyArray<{ value: string | number; label: string }> }
  | { type: "vec2";   key: keyof T; label: string; min: number; max: number; step: number; xLabel?: string; yLabel?: string } // value: [number, number]
```

`section` headers group fields visually and collapse independently. Fields without a preceding `section` end up under "Parameters". Color values are hex strings (`#RRGGBB`). Vec2 values are stored as `[x, y]` tuples and rendered as two coupled sliders.

## Adapters: skip the uniforms boilerplate

Hand-rolling a `configToShaderUniforms(config)` function for every shader gets old. The adapters generate one from your field schema:

```tsx
import { createWebGLAdapter } from "@tjcages/shader-dev"

const toUniforms = createWebGLAdapter<MyConfig>({
  fields: FIELDS,
  // optional — keys default to `u_${key}`
  mapping: { bgColor: "u_bg", speed: "u_t" },
})

useEffect(() => {
  mount.setUniforms(toUniforms(config))
}, [config])
```

For React Three Fiber, mutate uniform `.value` slots in place so the GPU sees changes without a recompile:

```tsx
import { createR3FAdapter } from "@tjcages/shader-dev"

const apply = useMemo(
  () => createR3FAdapter<MyConfig>({ uniforms, fields: FIELDS }),
  [uniforms],
)

useEffect(() => apply(config), [config, apply])
```

The R3F adapter calls `.set(hex)` on color slots and `.set(x, y)` on vec2 slots — works automatically with `THREE.Color` and `THREE.Vector2`. For other field types it assigns `.value` directly.

## Theming

The panel ships with light + dark variants that auto-switch based on `html.dark` and OS preference. Override any color globally with CSS variables on the scoped root:

```css
[data-shader-dev] {
  --sd-bg: rgba(20, 20, 20, 0.92);
  --sd-text: #f5f5f5;
  --sd-surface: rgba(255, 255, 255, 0.06);
  --sd-handle: #00ff95;
  /* see _styles.ts for the full list — 20+ tunables */
}
```

Force a theme per mount:

```tsx
<ShaderDevRoot defaultTheme="light" />
```

## Optional: write back to source

If you have a dev-only endpoint that can patch your config file, pass `onWriteConfig`:

```tsx
import { patchShaderConfigDefaults } from "@tjcages/shader-dev"

// On the server:
const next = patchShaderConfigDefaults(
  source,
  "MY_SHADER_DEFAULTS",
  JSON.stringify(values, null, 2),
)
```

Mark the defaults block in your config file with the recognized markers:

```ts
// @shader-config-start
export const MY_SHADER_DEFAULTS = {
  speed: 1.0,
  // ...
} as const
// @shader-config-end
```

Then point `registerShaderDev` at it:

```ts
registerShaderDev({
  // ...
  onWriteConfig: async (values) => {
    const res = await fetch("/api/dev/write-config", {
      method: "POST",
      body: JSON.stringify(values),
    })
    return res.json()
  },
  writeLabel: "Write to my-shader-config.ts",
})
```

## API reference

| Export | Purpose |
| --- | --- |
| `ShaderDevRoot` | Mount once in the layout. Owns the keyboard shortcut + renders the active shader's panel. |
| `registerShaderDev({ id, title, values, defaults, fields, onChange, onWriteConfig? })` | Returns an unregister fn — use it as your `useEffect` cleanup. Re-registering with the same `id` replaces the entry. |
| `unregisterShaderDev(id)` | Remove a registration explicitly. Rarely needed — prefer the return value of `registerShaderDev`. |
| `setActiveShaderDev(id)` / `getActiveShaderDev()` / `getShaderDevRegistrations()` | Multi-shader registry API — read or switch which shader the panel shows. |
| `createWebGLAdapter({ fields, mapping?, prefix?, colorAs?, toggleAs? })` | Returns `(config) => uniforms` for raw WebGL / `ShaderMount.setUniforms`. |
| `createR3FAdapter({ uniforms, fields, mapping?, prefix? })` | Returns `apply(config)` that mutates Three.js uniform `.value` slots in place. |
| `hexToRgb01(hex)` | `"#rrggbb"` → `[r, g, b]` in `[0, 1]`. Used internally by the WebGL adapter; exported for ad-hoc use. |
| `ShaderDevFieldDef<T>` | Field schema — discriminated union of `section` / `slider` / `color` / `toggle` / `select` / `vec2`. |
| `patchShaderConfigDefaults(source, exportName, json)` | Server helper that rewrites a defaults block between `@shader-config-start` / `@shader-config-end` markers. |
| `SHADER_DEV_CSS` / `SHADER_DEV_STYLE_ID` | Raw stylesheet + id for custom SSR injection (rare; the components inject automatically). |
| `ShaderDevPanel` / `ShaderDevFloatingPanel` | Low-level panel primitives if you want to render the panel directly without the registration system. |
| `ControlSlider` / `ControlColorInput` / `ControlSection` | Standalone control primitives — drop into your own UI if you don't want the floating panel. |

## License

MIT
