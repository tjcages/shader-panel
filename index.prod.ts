/**
 * Production no-op entry for @tjcages/shader-dev.
 *
 * Resolved automatically when bundlers (Vite, Webpack, Rollup, esbuild) build
 * with the `production` condition. The full panel — controls, store, styles,
 * keyboard handling, persistence I/O — is excluded from the bundle entirely.
 *
 * What stays: `createWebGLAdapter`, `createR3FAdapter`, `hexToRgb01`, and
 * `patchShaderConfigDefaults` — these are uniform / config utilities consumers
 * use in their actual shader runtime, not panel UI. Stripping them would break
 * shipping shaders.
 *
 * Everything else is replaced with the smallest stub that satisfies the dev
 * `.d.ts` declarations (still served via the `types` export condition).
 */

// Functional utilities — kept in prod.
export {
  createR3FAdapter,
  createWebGLAdapter,
  hexToRgb01,
  type CreateR3FAdapterOptions,
  type CreateWebGLAdapterOptions,
} from "./_adapters"
export { patchShaderConfigDefaults } from "./_patch-config-file"

// Re-export types (zero runtime cost — type-only imports are erased).
export type {
  ShaderDevColorField,
  ShaderDevFieldDef,
  ShaderDevSectionField,
  ShaderDevSelectField,
  ShaderDevSelectOption,
  ShaderDevSliderField,
  ShaderDevToggleField,
  ShaderDevVec2Field,
  ShaderDevWriteResult,
} from "./_types"
// Tiny utility — kept as a real impl since it has no UI deps.
export { isShaderDevSection } from "./_types"
export type { ShaderDevPrompt } from "./_default-prompts"
export type {
  ShaderDevRegistration,
  ShaderDevValues,
} from "./_shader-dev-store"
export type { ShaderDevTheme } from "./_use-shader-dev-theme"

// --- No-op runtime ----------------------------------------------------------

const NOOP = (): void => {}
const NULL_COMPONENT = (): null => null

// Constants
export const DEFAULT_SHADER_DEV_PROMPTS: ReadonlyArray<unknown> = []
export const SHADER_DEV_CSS = ""
export const SHADER_DEV_STYLE_ID = "shader-dev-styles"
export const SHADER_DEV_TOGGLE_EVENT = "cf-shader-dev-toggle"

// Registry
export function registerShaderDev(): () => void {
  return NOOP
}
export const unregisterShaderDev = NOOP
export const setActiveShaderDev = NOOP
export function getActiveShaderDev(): null {
  return null
}
export function getActiveShaderDevId(): null {
  return null
}
export function getShaderDevRegistration(): null {
  return null
}
const EMPTY_MAP: ReadonlyMap<string, never> = new Map<string, never>()
export function getShaderDevRegistrations(): ReadonlyMap<string, never> {
  return EMPTY_MAP
}
export function getShaderDevRevision(): number {
  return 0
}
export function subscribeShaderDevRegistration(): () => void {
  return NOOP
}

// Persistence — return defaults, never touch storage.
export function loadPersistedShaderDevValues<T>(_id: string, defaults: T): T {
  return { ...(defaults as object) } as T
}
export const persistShaderDevValues = NOOP
export const clearPersistedShaderDevValues = NOOP
export function hasPersistedShaderDevValues(): boolean {
  return false
}

// Keyboard / shortcut
export const dispatchShaderDevToggle = NOOP
export function readShaderDevOpenFlag(): boolean {
  return false
}
export const writeShaderDevOpenFlag = NOOP
export const useShaderDevShortcut = NOOP
export const handleShaderDevShortcutKeydown = NOOP
export function installShaderDevKeyboard(): () => void {
  return NOOP
}
export function matchShaderDevShortcut(): boolean {
  return false
}

// Theme — minimal context, just enough to typecheck.
import { createContext, useContext } from "react"
const ThemeContext = createContext<"dark" | "light">("dark")
export const ShaderDevThemeProvider = ThemeContext.Provider
export function useShaderDevTheme(): "dark" | "light" {
  return "dark"
}
export function useShaderDevThemeContext(): "dark" | "light" {
  return useContext(ThemeContext)
}

// UI components — all return null in prod.
export const ShaderDevRoot = NULL_COMPONENT
export const ShaderDevPanel = NULL_COMPONENT
export const ShaderDevFloatingPanel = NULL_COMPONENT
export const ShaderDevShortcutBridge = NULL_COMPONENT
export const ControlSlider = NULL_COMPONENT
export const ControlSection = NULL_COMPONENT
export const ControlColorInput = NULL_COMPONENT
export const ControlToggle = NULL_COMPONENT
export const ControlSelect = NULL_COMPONENT
export const ControlVec2 = NULL_COMPONENT
export const ControlQuickActions = NULL_COMPONENT
