export type ShaderDevPrompt = {
  id: string
  title: string
  /** Short one-liner shown beneath the title in the preview. */
  description?: string
  /** The full prompt text. Replace `<PATH>` placeholders before pasting. */
  prompt: string
}

/**
 * Built-in AI prompts surfaced in the panel's "Quick actions" rail.
 * Each prompt is a copy-pasteable instruction for Claude / Cursor / Codex.
 *
 * Override per-shader by passing `prompts` to `registerShaderDev`.
 */
export const DEFAULT_SHADER_DEV_PROMPTS: ReadonlyArray<ShaderDevPrompt> = [
  {
    id: "improve-quality",
    title: "Improve visual quality",
    description: "Propose 3–5 concrete tweaks to color, AA, noise, easing.",
    prompt: `Read my shader at <PATH_TO_SHADER> and propose 3–5 specific changes to improve its visual quality. Focus on:
- Color grading (gamma correction, tone mapping, contrast curves)
- Anti-aliasing on hard edges (smoothstep widths that scale with screen-space derivatives via \`fwidth\`)
- Noise quality (banding, hash continuity, octave blend weights)
- Animation easing (linear → eased, sin/cos blending)
- Lighting / shading model fidelity

For each change:
- Show the exact GLSL diff (before → after)
- Explain what the user will see differently
- Note any performance cost

Don't restructure the shader, don't rename uniforms, don't break any existing \`@tjcages/shader-dev\` field bindings.`,
  },
  {
    id: "expose-missing",
    title: "Expose missing parameters",
    description: "Add panel fields for every uniform not yet tweakable.",
    prompt: `The shader at <PATH_TO_SHADER> has uniforms not exposed in its \`@tjcages/shader-dev\` field schema at <PATH_TO_FIELDS>.

Do this:
1. Parse the GLSL source — list every \`uniform\` declaration.
2. Cross-reference with the existing fields array.
3. Skip runtime-driven uniforms (time, resolution, mouse, pointer).
4. For each missing one, add a \`ShaderDevFieldDef\` entry:
   - Field type: scalar → \`slider\`, vec3 with color-y name → \`color\`, vec2 → \`vec2\`, bool → \`toggle\`, int used as enum → \`select\`
   - Infer min/max/step from the current default value's magnitude
   - Group under the appropriate \`{ type: "section" }\` header based on name prefix
5. Update the config type + DEFAULTS together. Keep them in sync.

Do not change existing entries. Show the diff.`,
  },
  {
    id: "optimize-perf",
    title: "Optimize GPU performance",
    description: "Find cost reductions that don't change the visual output.",
    prompt: `Audit the shader at <PATH_TO_SHADER> for GPU cost reductions that do not change the visual output. Look for:
- Branch divergence (replace \`if\` with \`step\` / \`mix\` where both branches are cheap)
- ALU-heavy ops inside tight loops (\`pow\`, \`exp\`, \`log\`, \`atan\`, \`asin\`)
- Redundant texture lookups; cache repeated samples
- Precision: \`highp\` → \`mediump\` where safe (color math, mix factors)
- Constants that can be pre-computed (1/N, hardcoded ratios)
- Per-fragment work that can move to per-vertex
- Bounded loops that can be unrolled

For each finding:
- Show the GLSL diff
- Expected savings (cycles, register pressure, rough %)
- Visual delta (none / negligible / minor)
- How to verify (e.g. "compare at 60fps on iPhone X")`,
  },
  {
    id: "find-bugs",
    title: "Find runtime bugs & leaks",
    description: "WebGL context loss, dispose gaps, NaN paths, re-render storms.",
    prompt: `Audit my shader component at <PATH_TO_COMPONENT> and its GLSL at <PATH_TO_SHADER> for runtime bugs and leaks.

Component-level:
- WebGL context loss not handled (missing \`webglcontextlost\` listener)
- Three.js material / geometry / texture \`.dispose()\` missing on unmount
- Uniforms object re-created every render (forces recompiles)
- \`useFrame\` callbacks reading state/props without \`useRef\`
- React state updates inside \`useFrame\` (re-render storms)
- Event listeners added without cleanup

GLSL-level:
- Divide by zero (no \`max(eps, x)\` guard)
- Unbounded \`for\` loops with non-constant max
- Precision overflow on mobile (large values inside \`mediump\`)
- NaN / Inf propagation paths
- Mip-level reads inside conditional flow

Report each finding as \`file:line — issue — fix\`.`,
  },
  {
    id: "use-adapters",
    title: "Switch to shader-dev adapters",
    description: "Replace hand-rolled uniform mapping with createWebGL/R3FAdapter.",
    prompt: `Convert the shader component at <PATH_TO_COMPONENT> to use \`createWebGLAdapter\` (raw WebGL / paper-design ShaderMount) or \`createR3FAdapter\` (React Three Fiber) from \`@tjcages/shader-dev\` instead of its hand-rolled uniform mapping function.

Requirements:
- Match the existing uniform names exactly. If they don't follow the \`u_\${key}\` convention, pass per-key overrides via the \`mapping\` option.
- Verify all colors, vec2s, toggles, and selects still encode correctly.
- Keep the existing \`useEffect([config])\` cadence — adapters do not change when uniforms update, only how the mapping is built.
- Remove the now-dead \`configToShaderUniforms\` (or equivalent) function.

Show the diff.`,
  },
]
