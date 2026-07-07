/**
 * Production no-op entry for shader-panel.
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
} from "./adapters"
export { patchShaderConfigDefaults } from "./patch-config"

// Re-export types (zero runtime cost — type-only imports are erased).
export type {
  ShaderDevColorField,
  ShaderDevFieldDef,
  ShaderDevImageField,
  ShaderDevPathField,
  ShaderDevSectionField,
  ShaderDevSelectField,
  ShaderDevSelectOption,
  ShaderDevSliderField,
  ShaderDevToggleField,
  ShaderDevVec2Field,
  ShaderDevWriteResult,
} from "./types"
// Tiny utility — kept as a real impl since it has no UI deps.
export { isShaderDevSection } from "./types"
export type { ShaderDevPrompt } from "./prompts"
export type {
  ShaderDevRegistration,
  ShaderDevValues,
} from "./store"
export type { ShaderDevTheme } from "./hooks/use-theme"

// --- No-op runtime ----------------------------------------------------------

const NOOP = (): void => {}
const NULL_COMPONENT = (): null => null

// Pure string util — inlined (not imported) so the prompt-text array stays
// out of the prod bundle entirely.
export function fillShaderDevPrompt(
  prompt: string,
  shaderName?: string,
): string {
  const name = shaderName?.trim() || "shader"
  return prompt.replace(/\{\{\s*shader\s*\}\}/g, name)
}

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

// Capture registry — no-op in prod (no export panel to drive it).
export type { ShaderCaptureFn } from "./hooks/capture-registry"
export function registerShaderCapture(): () => void {
  return NOOP
}
export function getShaderCapture(): null {
  return null
}
export function subscribeShaderCapture(): () => void {
  return NOOP
}

// Animation clock — always runs on real time in prod (no panel to pause).
export type { ShaderDevAnimationSnapshot } from "./hooks/animation-clock"
export const SHADER_DEV_ANIMATION_STEP = 1 / 30
let prodAnimStart = typeof performance !== "undefined" ? performance.now() : 0
export function getShaderDevAnimationTime(): number {
  return (performance.now() - prodAnimStart) / 1000
}
export function advanceShaderDevAnimationDelta(previousTime: number): {
  time: number
  delta: number
} {
  const nextTime = getShaderDevAnimationTime()
  const delta = Math.min(Math.max(0, nextTime - previousTime), 0.1)
  return { time: nextTime, delta }
}
export function getShaderDevAnimationSnapshot() {
  return { playing: true, time: getShaderDevAnimationTime(), rate: 1 }
}
export const playShaderDevAnimation = NOOP
export const pauseShaderDevAnimation = NOOP
export const toggleShaderDevAnimation = NOOP
export const stepShaderDevAnimationForward = NOOP
export const stepShaderDevAnimationBackward = NOOP
export const resetShaderDevAnimation = (): void => {
  prodAnimStart = performance.now()
}
export const setShaderDevAnimationTime = NOOP
export const setShaderDevAnimationRate = NOOP
export function getShaderDevAnimationRevision(): number {
  return 0
}
export function subscribeShaderDevAnimation(): () => void {
  return NOOP
}
export const initShaderDevAnimationClock = NOOP

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
import { createContext, useContext, useState } from "react"
const ThemeContext = createContext<"dark" | "light">("dark")
export const ShaderDevThemeProvider = ThemeContext.Provider
export function useShaderDevTheme(): "dark" | "light" {
  return "dark"
}
export function useShaderDevThemeContext(): "dark" | "light" {
  return useContext(ThemeContext)
}

// useShaderDev — in prod, just local state seeded with the defaults. No panel,
// no registry, no overlay. The shader runs with its default config.
export type { UseShaderDevOptions } from "./hooks/use-shader-dev"
export function useShaderDev<T>(options: {
  defaults: T
}): [T, (next: T) => void] {
  return useState(() => ({ ...(options.defaults as object) }) as T)
}

// UI components — all return null in prod.
export const ShaderDevRoot = NULL_COMPONENT
export const ShaderDevPanel = NULL_COMPONENT
export const ShaderDevFloatingPanel = NULL_COMPONENT
export const ShaderDevShortcutBridge = NULL_COMPONENT
export const ControlSlider = NULL_COMPONENT
export const ControlSection = NULL_COMPONENT
export const ControlColorInput = NULL_COMPONENT
export const ControlImageInput = NULL_COMPONENT
export const ControlPath = NULL_COMPONENT
export type { ControlPathProps, PathPoint } from "./controls/path-input"
export const ControlToggle = NULL_COMPONENT
export const ControlSelect = NULL_COMPONENT
export const ControlVec2 = NULL_COMPONENT
export const ControlQuickActions = NULL_COMPONENT
export const ControlAnimation = NULL_COMPONENT
