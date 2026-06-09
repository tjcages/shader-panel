export {
  createR3FAdapter,
  createWebGLAdapter,
  hexToRgb01,
  type CreateR3FAdapterOptions,
  type CreateWebGLAdapterOptions,
} from "./_adapters"
export {
  DEFAULT_SHADER_DEV_PROMPTS,
  fillShaderDevPrompt,
  type ShaderDevPrompt,
} from "./_default-prompts"
export {
  clearPersistedShaderDevValues,
  hasPersistedShaderDevValues,
  loadPersistedShaderDevValues,
  persistShaderDevValues,
} from "./_persist"
export { ShaderDevFloatingPanel } from "./_floating-panel"
export { ShaderDevPanel } from "./_shader-dev-panel"
export { ShaderDevRoot } from "./_shader-dev-root"
export { patchShaderConfigDefaults } from "./_patch-config-file"

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
export { isShaderDevSection } from "./_types"

export {
  getActiveShaderDev,
  getActiveShaderDevId,
  getShaderDevRegistration,
  getShaderDevRegistrations,
  getShaderDevRevision,
  registerShaderDev,
  setActiveShaderDev,
  subscribeShaderDevRegistration,
  unregisterShaderDev,
  type ShaderDevRegistration,
  type ShaderDevValues,
} from "./_shader-dev-store"

export {
  dispatchShaderDevToggle,
  readShaderDevOpenFlag,
  SHADER_DEV_TOGGLE_EVENT,
  useShaderDevShortcut,
  writeShaderDevOpenFlag,
} from "./_use-shader-dev-shortcut"

export {
  handleShaderDevShortcutKeydown,
  installShaderDevKeyboard,
  matchShaderDevShortcut,
} from "./_shader-dev-keyboard"

/** @deprecated Use layout inline script + ShaderDevRoot */
export { ShaderDevShortcutBridge } from "./_shortcut-bridge"

export {
  ShaderDevThemeProvider,
  useShaderDevTheme,
  useShaderDevThemeContext,
  type ShaderDevTheme,
} from "./_use-shader-dev-theme"

/**
 * Raw stylesheet + id, exported so consumers with custom SSR setups can inject
 * the styles themselves. The components inject these automatically on mount —
 * you only need this when you want to control the timing.
 */
export { SHADER_DEV_CSS, SHADER_DEV_STYLE_ID } from "./_styles"

export { ControlSlider, type ControlSliderProps } from "./ui/control-slider"
export { ControlSection, type ControlSectionProps } from "./ui/control-section"
export {
  ControlColorInput,
  type ControlColorInputProps,
} from "./ui/control-color-input"
export { ControlToggle, type ControlToggleProps } from "./ui/control-toggle"
export { ControlSelect, type ControlSelectProps } from "./ui/control-select"
export { ControlVec2, type ControlVec2Props } from "./ui/control-vec2"
export {
  ControlQuickActions,
  type ControlQuickActionsProps,
} from "./ui/control-quick-actions"
