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
  PanelColorField,
  PanelField,
  PanelImageField,
  PanelSide,
  PanelPathField,
  PanelPresetOption,
  PanelPresetsField,
  PanelSectionField,
  PanelSelectField,
  PanelSelectOption,
  PanelSliderField,
  PanelToggleField,
  PanelVec2Field,
  PanelWriteResult,
} from "./types"
// Tiny utility — kept as a real impl since it has no UI deps.
export { isPanelSection } from "./types"
export type { PanelPrompt } from "./prompts"
export type {
  PanelRegistration,
  PanelState,
} from "./store"
export type { PanelTheme } from "./hooks/use-theme"

// --- No-op runtime ----------------------------------------------------------

const NOOP = (): void => {}
const NULL_COMPONENT = (): null => null

// Pure string util — inlined (not imported) so the prompt-text array stays
// out of the prod bundle entirely.
export function fillPanelPrompt(
  prompt: string,
  shaderName?: string,
): string {
  const name = shaderName?.trim() || "shader"
  return prompt.replace(/\{\{\s*shader\s*\}\}/g, name)
}

// Constants
export const DEFAULT_PANEL_PROMPTS: ReadonlyArray<unknown> = []
export const PANEL_CSS = ""
export const PANEL_STYLE_ID = "shader-dev-styles"
/** @deprecated use PANEL_CSS */
export const SHADER_DEV_CSS = PANEL_CSS
/** @deprecated use PANEL_STYLE_ID */
export const SHADER_DEV_STYLE_ID = PANEL_STYLE_ID
export const PANEL_TOGGLE_EVENT = "cf-shader-dev-toggle"

// Registry
export function registerPanel(): () => void {
  return NOOP
}
export const unregisterPanel = NOOP
export const setActivePanel = NOOP
export function getActivePanel(): null {
  return null
}
export function getActivePanelId(): null {
  return null
}
export function getActivePanelIdForSide(): null {
  return null
}
export function getActivePanelForSide(): null {
  return null
}
export function getPanelRegistration(): null {
  return null
}
const EMPTY_MAP: ReadonlyMap<string, never> = new Map<string, never>()
export function getPanelRegistrations(): ReadonlyMap<string, never> {
  return EMPTY_MAP
}
export function getPanelRegistrationsForSide(): never[] {
  return []
}
export function getPanelRevision(): number {
  return 0
}
export function subscribePanelRegistration(): () => void {
  return NOOP
}

// Capture registry — no-op in prod (no export panel to drive it).
export type { ShaderCaptureFn, ShaderGifExportFn, ShaderGifExportOptions } from "./hooks/capture-registry"
export function registerShaderCapture(): () => void {
  return NOOP
}
export function getShaderCapture(): null {
  return null
}
export function subscribeShaderCapture(): () => void {
  return NOOP
}
export function registerShaderRecordCanvas(): () => void {
  return NOOP
}
export function getShaderRecordCanvas(): null {
  return null
}
export function registerShaderRecordPrepare(): () => void {
  return NOOP
}
export function getShaderRecordPrepare(): null {
  return null
}
export function registerShaderGifExport(): () => void {
  return NOOP
}
export function getShaderGifExport(): null {
  return null
}
export function subscribeShaderRecording(): () => void {
  return NOOP
}

// Animation clock — always runs on real time in prod (no panel to pause).
export type { PanelAnimationSnapshot } from "./hooks/animation-clock"
export const PANEL_ANIMATION_STEP = 1 / 30
let prodAnimStart = typeof performance !== "undefined" ? performance.now() : 0
export function getPanelAnimationTime(): number {
  return (performance.now() - prodAnimStart) / 1000
}
export function advancePanelAnimationDelta(previousTime: number): {
  time: number
  delta: number
} {
  const nextTime = getPanelAnimationTime()
  const delta = Math.min(Math.max(0, nextTime - previousTime), 0.1)
  return { time: nextTime, delta }
}
export function getPanelAnimationSnapshot() {
  return { playing: true, time: getPanelAnimationTime(), rate: 1 }
}
export const playPanelAnimation = NOOP
export const pausePanelAnimation = NOOP
export const togglePanelAnimation = NOOP
export const stepPanelAnimationForward = NOOP
export const stepPanelAnimationBackward = NOOP
export const resetPanelAnimation = (): void => {
  prodAnimStart = performance.now()
}
export const setPanelAnimationTime = NOOP
export const setPanelAnimationRate = NOOP
export function getPanelAnimationRevision(): number {
  return 0
}
export function subscribePanelAnimation(): () => void {
  return NOOP
}
export const initPanelAnimationClock = NOOP

// Persistence — return defaults, never touch storage.
export function loadPersistedPanelValues<T>(_id: string, defaults: T): T {
  return { ...(defaults as object) } as T
}
export const persistPanelValues = NOOP
export const clearPersistedPanelValues = NOOP
export function hasPersistedPanelValues(): boolean {
  return false
}
export function loadPersistedPanelSections(): Record<string, boolean> {
  return {}
}
export const persistPanelSections = NOOP

// Keyboard / shortcut
export const dispatchPanelToggle = NOOP
export function readPanelOpenFlag(): boolean {
  return false
}
export const writePanelOpenFlag = NOOP
export const usePanelShortcut = NOOP
export const handlePanelShortcutKeydown = NOOP
export function installPanelKeyboard(): () => void {
  return NOOP
}
export function matchPanelShortcut(): boolean {
  return false
}

// Theme — minimal context, just enough to typecheck.
import { createContext, useContext, useState } from "react"
const ThemeContext = createContext<"dark" | "light">("dark")
export const PanelThemeProvider = ThemeContext.Provider
export function usePanelTheme(): "dark" | "light" {
  return "dark"
}
export function usePanelThemeContext(): "dark" | "light" {
  return useContext(ThemeContext)
}

// usePanel — in prod, just local state seeded with the defaults. No panel,
// no registry, no overlay. The shader runs with its default config.
export type { UsePanelOptions } from "./hooks/use-panel"
export function usePanel<T>(options: {
  defaults: T
}): [T, (next: T) => void] {
  return useState(() => ({ ...(options.defaults as object) }) as T)
}

// UI components — all return null in prod.
export const PanelRoot = NULL_COMPONENT
export const Panel = NULL_COMPONENT
export const FloatingPanel = NULL_COMPONENT
export const ToolShell = NULL_COMPONENT
export const ToolPanel = NULL_COMPONENT
export const PanelToolPanel = NULL_COMPONENT
export const PanelToggleButton = NULL_COMPONENT
export const EyeToggle = NULL_COMPONENT
export const PanelShortcutBridge = NULL_COMPONENT
export const ControlSlider = NULL_COMPONENT
export const ControlSection = NULL_COMPONENT
export const ControlColorInput = NULL_COMPONENT
export const ControlImageInput = NULL_COMPONENT
export const ControlPath = NULL_COMPONENT
export type { ControlPathProps, PathPoint } from "./controls/path-input"
export const ControlToggle = NULL_COMPONENT
export const ControlSelect = NULL_COMPONENT
export const ControlVec2 = NULL_COMPONENT
export const ControlPresets = NULL_COMPONENT
export const ControlQuickActions = NULL_COMPONENT
export const ControlAnimation = NULL_COMPONENT

export const TOOL_PANEL_WIDTH = 280
export const TOOL_PANEL_INSET = 16
export const TOOL_PANEL_FULL = 296

// ---------------------------------------------------------------------------
// @deprecated back-compat aliases — every pre-rename `ShaderDev*` / `useShaderDev`
// name, mapped to its canonical `Panel*` replacement. Keeps existing
// `shader-panel` consumers compiling unchanged against the prod entry too.
// ---------------------------------------------------------------------------

/** @deprecated Renamed to `DEFAULT_PANEL_PROMPTS`. */
export const DEFAULT_SHADER_DEV_PROMPTS = DEFAULT_PANEL_PROMPTS
/** @deprecated Renamed to `PANEL_TOGGLE_EVENT`. */
export const SHADER_DEV_TOGGLE_EVENT = PANEL_TOGGLE_EVENT
/** @deprecated Renamed to `PANEL_ANIMATION_STEP`. */
export const SHADER_DEV_ANIMATION_STEP = PANEL_ANIMATION_STEP

/** @deprecated Renamed to `fillPanelPrompt`. */
export const fillShaderDevPrompt = fillPanelPrompt

/** @deprecated Renamed to `isPanelSection`. */
export { isPanelSection as isShaderDevSection } from "./types"

/** @deprecated Renamed `ShaderDev*Field` / related types to `Panel*`. */
export type {
  PanelColorField as ShaderDevColorField,
  PanelField as ShaderDevFieldDef,
  PanelImageField as ShaderDevImageField,
  PanelSide as ShaderDevPanelSide,
  PanelPathField as ShaderDevPathField,
  PanelPresetOption as ShaderDevPresetOption,
  PanelPresetsField as ShaderDevPresetsField,
  PanelSectionField as ShaderDevSectionField,
  PanelSelectField as ShaderDevSelectField,
  PanelSelectOption as ShaderDevSelectOption,
  PanelSliderField as ShaderDevSliderField,
  PanelToggleField as ShaderDevToggleField,
  PanelVec2Field as ShaderDevVec2Field,
  PanelWriteResult as ShaderDevWriteResult,
} from "./types"
/** @deprecated Renamed to `PanelPrompt`. */
export type { PanelPrompt as ShaderDevPrompt } from "./prompts"
/** @deprecated Renamed to `PanelRegistration` / `PanelState`. */
export type {
  PanelRegistration as ShaderDevRegistration,
  PanelState as ShaderDevValues,
} from "./store"
/** @deprecated Renamed to `PanelTheme`. */
export type { PanelTheme as ShaderDevTheme } from "./hooks/use-theme"
/** @deprecated Renamed to `PanelAnimationSnapshot`. */
export type { PanelAnimationSnapshot as ShaderDevAnimationSnapshot } from "./hooks/animation-clock"
/** @deprecated Renamed to `UsePanelOptions`. */
export type { UsePanelOptions as UseShaderDevOptions } from "./hooks/use-panel"

/** @deprecated Renamed registry members to `Panel*`. */
export const registerShaderDev = registerPanel
/** @deprecated Renamed registry members to `Panel*`. */
export const unregisterShaderDev = unregisterPanel
/** @deprecated Renamed registry members to `Panel*`. */
export const setActiveShaderDev = setActivePanel
/** @deprecated Renamed registry members to `Panel*`. */
export const getActiveShaderDev = getActivePanel
/** @deprecated Renamed registry members to `Panel*`. */
export const getActiveShaderDevId = getActivePanelId
/** @deprecated Renamed registry members to `Panel*`. */
export const getActiveShaderDevIdForSide = getActivePanelIdForSide
/** @deprecated Renamed registry members to `Panel*`. */
export const getActiveShaderDevForSide = getActivePanelForSide
/** @deprecated Renamed registry members to `Panel*`. */
export const getShaderDevRegistration = getPanelRegistration
/** @deprecated Renamed registry members to `Panel*`. */
export const getShaderDevRegistrations = getPanelRegistrations
/** @deprecated Renamed registry members to `Panel*`. */
export const getShaderDevRegistrationsForSide = getPanelRegistrationsForSide
/** @deprecated Renamed registry members to `Panel*`. */
export const getShaderDevRevision = getPanelRevision
/** @deprecated Renamed registry members to `Panel*`. */
export const subscribeShaderDevRegistration = subscribePanelRegistration

/** @deprecated Renamed animation-clock members to `Panel*`. */
export const advanceShaderDevAnimationDelta = advancePanelAnimationDelta
/** @deprecated Renamed animation-clock members to `Panel*`. */
export const getShaderDevAnimationRevision = getPanelAnimationRevision
/** @deprecated Renamed animation-clock members to `Panel*`. */
export const getShaderDevAnimationSnapshot = getPanelAnimationSnapshot
/** @deprecated Renamed animation-clock members to `Panel*`. */
export const getShaderDevAnimationTime = getPanelAnimationTime
/** @deprecated Renamed animation-clock members to `Panel*`. */
export const initShaderDevAnimationClock = initPanelAnimationClock
/** @deprecated Renamed animation-clock members to `Panel*`. */
export const pauseShaderDevAnimation = pausePanelAnimation
/** @deprecated Renamed animation-clock members to `Panel*`. */
export const playShaderDevAnimation = playPanelAnimation
/** @deprecated Renamed animation-clock members to `Panel*`. */
export const resetShaderDevAnimation = resetPanelAnimation
/** @deprecated Renamed animation-clock members to `Panel*`. */
export const setShaderDevAnimationRate = setPanelAnimationRate
/** @deprecated Renamed animation-clock members to `Panel*`. */
export const setShaderDevAnimationTime = setPanelAnimationTime
/** @deprecated Renamed animation-clock members to `Panel*`. */
export const stepShaderDevAnimationBackward = stepPanelAnimationBackward
/** @deprecated Renamed animation-clock members to `Panel*`. */
export const stepShaderDevAnimationForward = stepPanelAnimationForward
/** @deprecated Renamed animation-clock members to `Panel*`. */
export const subscribeShaderDevAnimation = subscribePanelAnimation
/** @deprecated Renamed animation-clock members to `Panel*`. */
export const toggleShaderDevAnimation = togglePanelAnimation

/** @deprecated Renamed persistence members to `Panel*`. */
export const loadPersistedShaderDevValues = loadPersistedPanelValues
/** @deprecated Renamed persistence members to `Panel*`. */
export const persistShaderDevValues = persistPanelValues
/** @deprecated Renamed persistence members to `Panel*`. */
export const clearPersistedShaderDevValues = clearPersistedPanelValues
/** @deprecated Renamed persistence members to `Panel*`. */
export const hasPersistedShaderDevValues = hasPersistedPanelValues
/** @deprecated Renamed persistence members to `Panel*`. */
export const loadPersistedShaderDevSections = loadPersistedPanelSections
/** @deprecated Renamed persistence members to `Panel*`. */
export const persistShaderDevSections = persistPanelSections

/** @deprecated Renamed shortcut members to `Panel*`. */
export const dispatchShaderDevToggle = dispatchPanelToggle
/** @deprecated Renamed shortcut members to `Panel*`. */
export const readShaderDevOpenFlag = readPanelOpenFlag
/** @deprecated Renamed shortcut members to `Panel*`. */
export const writeShaderDevOpenFlag = writePanelOpenFlag
/** @deprecated Renamed shortcut members to `Panel*`. */
export const useShaderDevShortcut = usePanelShortcut

/** @deprecated Renamed keyboard members to `Panel*`. */
export const handleShaderDevShortcutKeydown = handlePanelShortcutKeydown
/** @deprecated Renamed keyboard members to `Panel*`. */
export const installShaderDevKeyboard = installPanelKeyboard
/** @deprecated Renamed keyboard members to `Panel*`. */
export const matchShaderDevShortcut = matchPanelShortcut

/** @deprecated Renamed theme members to `Panel*`. */
export const ShaderDevThemeProvider = PanelThemeProvider
/** @deprecated Renamed theme members to `Panel*`. */
export const useShaderDevTheme = usePanelTheme
/** @deprecated Renamed theme members to `Panel*`. */
export const useShaderDevThemeContext = usePanelThemeContext

/** @deprecated Renamed to `usePanel`. */
export const useShaderDev = usePanel

/** @deprecated Renamed to `PanelRoot`. */
export const ShaderDevRoot = PanelRoot
/** @deprecated Renamed to `Panel`. */
export const ShaderDevPanel = Panel
/** @deprecated Renamed to `FloatingPanel`. */
export const ShaderDevFloatingPanel = FloatingPanel
/** @deprecated Renamed to `PanelToolPanel`. */
export const ShaderDevToolPanel = PanelToolPanel
/** @deprecated Renamed to `PanelShortcutBridge`. */
export const ShaderDevShortcutBridge = PanelShortcutBridge
