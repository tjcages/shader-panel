import { defineConfig, type Options } from "tsup"

const shared: Options = {
  format: ["esm"],
  sourcemap: true,
  target: "es2022",
  external: ["react", "react-dom", "react-dom/client", "react/jsx-runtime"],
  splitting: false,
  treeshake: true,
}

export default defineConfig([
  // Full dev panel — what bundlers resolve to by default and under the
  // `development` condition. Emits the shared .d.ts.
  {
    ...shared,
    entry: ["src/index.ts"],
    dts: true,
    clean: true,
  },
  // Production no-op stub — bundlers resolve to this under `production`.
  // No types: TypeScript always reads dist/index.d.ts via the `types`
  // condition, so the stub's shape doesn't need to be re-emitted.
  {
    ...shared,
    entry: { "index.prod": "src/index.prod.ts" },
    dts: false,
    clean: false,
  },
])
