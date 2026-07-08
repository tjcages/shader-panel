export type PanelPrompt = {
  id: string
  title: string
  /** Short one-liner shown beneath the title in the preview. */
  description?: string
  /**
   * The full prompt text. Copy-pasteable as-is — no manual editing required.
   * The `{{shader}}` token is replaced with the active shader's name at
   * copy/preview time; files are referenced via project context so the
   * receiving editor (Cursor / Claude Code / Copilot) resolves them itself.
   */
  prompt: string
}

/**
 * Replace `{{shader}}` (and whitespace variants) with the active shader's
 * name. Falls back to a generic "shader" when no name is available.
 */
export function fillPanelPrompt(
  prompt: string,
  shaderName?: string,
): string {
  const name = shaderName?.trim() || "shader"
  return prompt.replace(/\{\{\s*shader\s*\}\}/g, name)
}

/**
 * Built-in AI prompts surfaced in the panel's "Quick actions" rail.
 * Each prompt is a copy-pasteable instruction for Claude / Cursor / Codex —
 * written as a senior-graphics-engineer brief, not a one-liner. They reference
 * files by project context (no paths to fill in) and name the active shader
 * automatically via the `{{shader}}` token.
 *
 * Override per-shader by passing `prompts` to `registerPanel`.
 */
export const DEFAULT_PANEL_PROMPTS: ReadonlyArray<PanelPrompt> = [
  {
    id: "improve-quality",
    title: "Improve visual quality",
    description: "Color space, tone mapping, dithering, AA, hash/noise, easing.",
    prompt: `Act as a senior graphics engineer. Find the {{shader}} in this project — its GLSL / fragment source — and propose concrete, high-impact changes to its visual quality. Work the list in priority order. For each change show an exact GLSL diff (before → after), one line on the visible difference, and any cost.

1. COLOR SPACE — the single most common quality bug.
   - Determine whether color math runs in sRGB or linear space. Blending, accumulation, bloom, and lighting are only correct in LINEAR space.
   - If colors are mixed/added in sRGB: linearize on read (fast \`c*c\`, or accurate \`pow(c, vec3(2.2))\`), do all math linear, then encode back at the very end with \`pow(color, vec3(1.0/2.2))\` or the accurate piecewise sRGB curve.
   - Check the renderer isn't ALSO encoding (e.g. three.js \`outputColorSpace\`) — double-encoding washes everything out.

2. TONE MAPPING — for any bright cores, bloom, or HDR-ish accumulation.
   - A bare \`clamp(c, 0.0, 1.0)\` hard-clips highlights to flat white and destroys hue. Tone-map before the sRGB encode.
   - Reinhard (cheap): \`c / (1.0 + c)\`. ACES filmic (better, ~6 mul/add): use the standard Narkowicz fit — keeps saturation in the highlights.

3. BANDING — visible 8-bit steps in smooth gradients / glows.
   - Add ordered or hash dither of about ±0.5/255 right before output: \`color += (hash12(gl_FragCoord.xy + uTime) - 0.5) / 255.0;\`
   - Triangular-PDF (TPDF) dither is cleanest; animate the noise per-frame so it's invisible.

4. EDGE ANTI-ALIASING — kill jaggies on SDF shapes and hard cutoffs.
   - Replace \`step(edge, x)\` and sharp comparisons with derivative-aware smoothstep: \`float w = fwidth(x); v = smoothstep(edge - w, edge + w, x);\`
   - For an SDF \`d\` (0 at the edge): \`float w = fwidth(d); mask = smoothstep(w, -w, d);\` — gives a ~1px screen-space feather at any resolution / zoom.

5. HASH & NOISE QUALITY.
   - \`fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453)\` is non-portable (sin precision varies per GPU) and shows diagonal banding. Swap for an integer/bit hash (Dave Hoskins hash12/hash22, or a PCG hash) — stable and artifact-free.
   - FBM: lacunarity ~2.0, gain ~0.5. Add domain warping (\`fbm(p + k*fbm(p))\`) for organic, non-griddy structure.

6. EASING — linear interpolations read mechanical.
   - Use smoothstep, or smootherstep \`t*t*t*(t*(t*6.0-15.0)+10.0)\` (C2-continuous → velocity-continuous motion). Apply to reveal/fade/pulse curves.

Constraints: do NOT rename uniforms, restructure the render pipeline, or break existing shader-panel field bindings. Report which items you applied and which you skipped, with reasons.`,
  },
  {
    id: "optimize-perf",
    title: "Optimize GPU performance",
    description: "Diagnose the bottleneck, then cut ALU / branch / precision cost.",
    prompt: `Act as a GPU performance engineer. Find the {{shader}} in this project (its GLSL source) and audit it for cost reductions that do NOT change the visual output (or change it imperceptibly). FIRST classify the likely bottleneck, then apply the matching fixes. For each finding: GLSL diff, expected saving, visual delta (none / negligible / minor), and how to verify.

STEP 0 — CLASSIFY THE BOTTLENECK
- Fragment ALU-bound: heavy math per pixel (loops, transcendentals, many octaves). Most common for fullscreen/background shaders.
- Texture/bandwidth-bound: many samples, dependent reads, large textures.
- Fill-rate / overdraw-bound: many transparent layers, large blended quads.
State which one this shader is and optimize that first.

ALU REDUCTION
- Hoist loop-invariant work out of \`for\` loops. Anything not depending on the loop index is computed once.
- Kill transcendentals in hot paths: \`pow(x, 2.0)\` → \`x*x\`; \`pow(x, 4.0)\` → \`x2=x*x; x2*x2\`. \`pow\`, \`exp\`, \`log\`, \`sin\`, \`cos\`, \`atan\`, \`acos\`, \`normalize\`, \`length\` (sqrt) are expensive — precompute, approximate, or bake into a LUT texture.
- Precompute constants the compiler can't fold (1.0/N, fixed ratios) and pass as uniforms or \`const\`.
- Move per-fragment work that's actually per-vertex into the vertex shader and let it interpolate (e.g. world-space ray setup, slow-varying gradients).

BRANCHING
- GPUs execute in warps/waves (32–64 lanes). A divergent branch runs BOTH sides for the whole warp. Replace cheap two-sided branches with \`mix()\`, \`step()\`, \`clamp()\`.
- Keep genuinely expensive branches only if they're coherent (all nearby pixels take the same path), e.g. a uniform-driven feature toggle.

PRECISION (big wins on mobile)
- Default heavy intermediate math and color to \`mediump\` (fp16) — often ~2× throughput on mobile GPUs. Keep \`highp\` only where it matters: positions, UV at large scale, and TIME ACCUMULATION.
- Watch mediump range (±65504, precision degrades well before that): a \`mediump\` time uniform visibly stutters/banding after a few minutes. Pass \`highp\` time, or feed \`mod(time, 1000.0)\`.

TEXTURES
- Avoid dependent texture reads (sample coord computed from a previous sample) inside loops — they defeat the texture cache.
- Collapse repeated samples of the same coordinate into one fetch.

MOBILE / TILER NOTES (PowerVR, Adreno, Mali)
- Avoid \`discard\` — it disables early-Z and tile hidden-surface removal and is often SLOWER than blending a zero alpha.
- Minimize varyings (each one costs bandwidth across the tile).
- Never read back the framebuffer mid-pass.

LOOPS
- Bounds should be compile-time constant so the compiler can unroll; dynamic upper bounds block unrolling on older targets. If quality scales, gate octave count behind a \`const\` or \`#define\`.

Report findings ranked by expected impact.`,
  },
  {
    id: "reduce-shimmer",
    title: "Reduce shimmer / temporal aliasing",
    description: "Stop crawling, sparkle, and flicker under motion and at distance.",
    prompt: `Act as a real-time rendering engineer. The {{shader}} in this project shimmers, sparkles, crawls, or flickers when it (or the camera) moves, or when detail is small on screen. Find its GLSL source, diagnose the temporal aliasing, and fix it. Show GLSL diffs and explain the mechanism for each.

ROOT CAUSE
Temporal aliasing happens when high-frequency detail (thin lines, sharp noise, fine patterns, specular highlights) is sampled at one point per pixel without prefiltering. As the signal slides under the pixel grid it beats against it → crawl/sparkle.

FIXES, in order of preference:
1. PREFILTER WITH DERIVATIVES (analytic AA)
   - For procedural patterns/lines, fade detail toward gray as it approaches the Nyquist limit. Use \`fwidth\` to measure how fast the function changes per pixel and \`smoothstep\` the contrast down: \`float w = fwidth(pattern); value = mix(0.5, value, clamp(1.0 - w*K, 0.0, 1.0));\` (or band-limit a tiled coordinate so cells smaller than a pixel converge to their average).
   - For stripes/grids: use the analytic filtered-pattern trick — integrate the pattern over the pixel footprint rather than point-sampling.

2. NOISE / FBM
   - Drop octaves whose feature size is below ~1px: compare octave frequency to \`1.0/fwidth(p)\` and fade the last octaves out instead of letting them alias. This both fixes shimmer AND saves ALU.

3. TEXTURE DETAIL
   - Ensure mipmaps exist and trilinear/anisotropic filtering is on. If sampling an explicit LOD, don't pin it to 0 in minified regions — let the GPU pick, or bias with \`textureGrad\`/\`textureLod\` using \`fwidth\`-derived LOD.

4. SPECULAR / HIGHLIGHTS
   - Tiny moving specular dots are aliasing. Clamp roughness to a screen-space-derivative-aware minimum (Toksvig / geometric-normal-AA style) so highlights can't get sub-pixel sharp.

5. TEMPORAL SMOOTHING (last resort, if single-frame prefilter isn't enough)
   - Add a small amount of per-frame jitter to the sampling and/or low-pass the value over time via a tiny exponential moving average, so residual sparkle averages out instead of strobing.

Constraint: prefer single-frame analytic prefiltering (#1–#4) over temporal accumulation (#5) — it's cheaper and has no ghosting. Report what was aliasing and which fix you used.`,
  },
  {
    id: "find-bugs",
    title: "Find runtime bugs & leaks",
    description: "Context loss, GL disposal, NaN/Inf, mediump overflow, render storms.",
    prompt: `Act as a senior WebGL/React-Three-Fiber engineer doing a defect review. Audit the {{shader}} setup in this project — the React component that mounts it and its GLSL source. Report every finding as \`file:line — issue — concrete fix\`, ranked by severity.

GPU RESOURCE LEAKS (high severity — they accumulate across mounts/HMR)
- Three.js: geometries, materials, textures, and render targets each need explicit \`.dispose()\` on unmount. Removing from the scene graph does NOT free GPU memory.
- Renderer: on teardown call \`renderer.dispose()\`, and \`renderer.forceContextLoss()\` if you created the context.
- Render targets / FBOs and any ping-pong buffers must be disposed; check resize handlers don't allocate a new target every event without freeing the old one.

WEBGL CONTEXT LOSS (common production crash)
- Missing \`webglcontextlost\` listener (must \`preventDefault()\`) and \`webglcontextrestored\` to recreate GL resources. Tab backgrounding / GPU reset will otherwise blank or freeze the canvas permanently.

REACT / R3F HOT-PATH BUGS
- \`uniforms\` object re-created on every render → material recompiles or loses state. It must be created once (useMemo/useRef) and have its \`.value\` slots mutated.
- \`useFrame\` reading React state/props directly → stale closure; route through a ref updated each render.
- \`setState\` (or anything causing a React re-render) called inside \`useFrame\` → a render every frame; catastrophic. Move to refs / imperative updates.
- RAF loops, ResizeObservers, and event listeners added without a matching cleanup in the effect's return.

GLSL NUMERICAL HAZARDS (cause NaN/Inf that spread to black or white pixels)
- Division without an epsilon guard: \`a / b\` where b can be 0 → use \`a / max(b, 1e-6)\`.
- \`normalize(v)\` when v can be the zero vector → guard length first.
- Domain errors: \`sqrt(x)\`/\`log(x)\`/\`pow(x, y)\` with x<0, \`acos\`/\`asin\` with |arg|>1 → clamp inputs.
- \`mediump\` overflow / precision loss: a time or accumulator value growing unbounded in \`mediump\` wraps or quantizes after minutes → use \`highp\` or feed \`mod(time, P)\`.
- Reading mip level / using \`fwidth\`/\`dFdx\` inside non-uniform control flow (an \`if\`/loop that differs per pixel) — derivatives are undefined there.
- Unbounded or potentially non-terminating loops (\`while\`, dynamic bound) that can hang the GPU.

For each: state the trigger condition (when it actually bites) and the minimal fix.`,
  },
  {
    id: "expose-missing",
    title: "Expose missing parameters",
    description: "Detect every uniform, add panel fields with smart ranges + sections.",
    prompt: `Wire every tweakable uniform of the {{shader}} in this project into its shader-panel field schema. Locate the GLSL source and the fields file (the \`ShaderDevFieldDef[]\` array) in the project.

1. PARSE — list every \`uniform\` declaration in the GLSL (vertex + fragment), with type and the JS-side literal currently passed for it (that literal is the default).

2. EXCLUDE runtime-driven uniforms — anything the app updates every frame, not the user: time, resolution, mouse/pointer, camera matrices, scroll, audio. These are NOT panel fields.

3. CROSS-REFERENCE with the existing fields array; only add what's missing. Never modify existing entries.

4. PICK THE FIELD TYPE per uniform:
   - scalar \`float\` / \`int\` → \`slider\`
   - \`vec3\`/\`vec4\` with a color-ish name (u_bg, *Color, tint, albedo) → \`color\`
   - \`vec2\` (direction, offset, anchor, scale-xy) → \`vec2\`
   - \`bool\` → \`toggle\`
   - \`int\` used as a mode/enum (blendMode, quality, variant) → \`select\` with explicit { value, label } options
   Honor any GLSL range hints in comments (e.g. \`// 0..10\`).

5. INFER min / max / step from the default's magnitude and meaning:
   - normalized factor (default ~0–1) → min 0, max 1, step 0.01
   - angle in radians → 0 .. 6.2832, step 0.01; in degrees → 0..360, step 1
   - pixel distance/radius → 0 .. ~4× default, step 1
   - speed/frequency → 0 .. ~4× default, fine step
   - counts → integer min/max, step 1
   Keep the current default comfortably inside the range (not at an endpoint).

6. GROUP into \`{ type: "section", title }\` headers inferred from name prefixes (bolt* → "Lightning", bloom* → "Bloom", cam*/fov → "Camera", color/bg → "Color", etc.).

7. KEEP THE CONFIG TYPE + DEFAULTS IN SYNC with the new fields. If a \`createWebGLAdapter\`/\`createR3FAdapter\` mapping exists, confirm the new keys flow through (or add mapping overrides for non \`u_\${key}\` names).

Show the diff for the fields file, the config type, and DEFAULTS.`,
  },
  {
    id: "use-adapters",
    title: "Switch to shader-dev adapters",
    description: "Replace hand-rolled uniform mapping with createWebGL/R3FAdapter.",
    prompt: `Convert the {{shader}} component in this project to use \`createWebGLAdapter\` (raw WebGL / @paper-design/shaders ShaderMount) or \`createR3FAdapter\` (React Three Fiber) from shader-panel instead of its hand-rolled config→uniform mapping.

Requirements:
- Match existing uniform names EXACTLY. The adapters default to \`u_\${key}\`; for any uniform that doesn't follow that, pass per-key overrides via the \`mapping\` option rather than renaming.
- Verify every field type still encodes correctly: \`color\` → hex→vec3 (rgb 0–1) via the adapter's built-in conversion; \`vec2\` → the [x,y] tuple (or \`.set(x,y)\` on a THREE.Vector2 for R3F); \`toggle\` → int 0/1 (or bool — match what the GLSL expects); \`slider\`/\`select\` → passthrough.
- For R3F, build the adapter once (\`useMemo(() => createR3FAdapter({ uniforms, fields }), [uniforms])\`) and call \`apply(config)\` in a \`useEffect([config, apply])\`. It mutates uniform \`.value\` slots in place — no recompile, no new uniforms object.
- For ShaderMount / raw WebGL, build \`const toUniforms = createWebGLAdapter({ fields })\` once and call \`mount.setUniforms(toUniforms(config))\` on config change.
- Delete the now-dead hand-rolled mapping function and its imports.

Show the diff and confirm a visual no-op (output identical before/after).`,
  },
]
