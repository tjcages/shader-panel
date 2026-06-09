# Setup prompt

Open your shader file in Cursor / Claude Code / Copilot and paste the prompt below. It detects the renderer, finds your tweakable uniforms, builds the panel fields, and wires up the `useShaderDev` hook — no manual setup.

```text
Add @tjcages/shader-dev to my open shader file so I can tweak its uniforms live.

1. Detect the renderer:
   - ShaderMount (@paper-design/shaders) → WebGL
   - Canvas / useFrame / material onBeforeCompile (@react-three/fiber) → R3F
   - raw gl.uniform* calls → WebGL

2. Find every tweakable uniform in the GLSL. Skip runtime-driven ones
   (u_time, u_resolution, u_mouse/pointer, camera matrices). Use each
   uniform's current JS value as its default.

3. In the shader component file, add:
   - a DEFAULTS object with those values
   - a FIELDS array typed ShaderDevFieldDef<Config>[]:
       float/int      → { type: "slider", min, max, step }
       color-ish vec3 → { type: "color" }
       vec2           → { type: "vec2", min, max, step }
       bool           → { type: "toggle" }
       enum int       → { type: "select", options: [{ value, label }] }
     Infer sensible min/max/step from each default's magnitude.
     Group related fields under { type: "section", title }.

4. Replace the hardcoded config with one hook call:
       const [config] = useShaderDev({
         id: "<shader-id>",
         title: "<Shader name>",
         defaults: DEFAULTS,
         fields: FIELDS,
       })
   The hook owns the state, registers the shader, and injects the panel —
   no <ShaderDevRoot/> and no extra files needed.

5. Push `config` to the shader. Prefer the adapters over a hand-rolled mapping:
   - WebGL / ShaderMount: const toUniforms = createWebGLAdapter({ fields: FIELDS });
     then mount.setUniforms(toUniforms(config)) in a useEffect([config]).
   - R3F: const apply = useMemo(() => createR3FAdapter({ uniforms, fields: FIELDS }), [uniforms]);
     then apply(config) in a useEffect([config, apply]).

6. Don't add other dependencies and don't change the shader's visual output.
   Report which renderer you detected and which uniforms you exposed vs skipped.
```

Once it's wired up, toggle the panel with **⌘⌥D**.
