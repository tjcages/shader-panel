export {
  createR3FAdapter,
  createWebGLAdapter,
  hexToRgb01,
  type CreateR3FAdapterOptions,
  type CreateWebGLAdapterOptions,
} from "./adapters"
export {
  DEFAULT_SHADER_DEV_PROMPTS,
  fillShaderDevPrompt,
  type ShaderDevPrompt,
} from "./prompts"
export {
  clearPersistedShaderDevValues,
  hasPersistedShaderDevValues,
  loadPersistedShaderDevValues,
  persistShaderDevValues,
} from "./persist"
export { ShaderDevFloatingPanel } from "./panel/floating-panel"
export { ShaderDevPanel } from "./panel/panel"
export { ShaderDevRoot } from "./panel/root"
export { patchShaderConfigDefaults } from "./patch-config"

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
} from "./types"
export { isShaderDevSection } from "./types"

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
} from "./store"

export {
  useShaderDev,
  type UseShaderDevOptions,
} from "./hooks/use-shader-dev"

export {
  dispatchShaderDevToggle,
  readShaderDevOpenFlag,
  SHADER_DEV_TOGGLE_EVENT,
  useShaderDevShortcut,
  writeShaderDevOpenFlag,
} from "./hooks/use-shortcut"

export {
  handleShaderDevShortcutKeydown,
  installShaderDevKeyboard,
  matchShaderDevShortcut,
} from "./hooks/keyboard"

/** @deprecated Use layout inline script + ShaderDevRoot */
export { ShaderDevShortcutBridge } from "./hooks/shortcut-bridge"

export {
  ShaderDevThemeProvider,
  useShaderDevTheme,
  useShaderDevThemeContext,
  type ShaderDevTheme,
} from "./hooks/use-theme"

/**
 * Raw stylesheet + id, exported so consumers with custom SSR setups can inject
 * the styles themselves. The components inject these automatically on mount —
 * you only need this when you want to control the timing.
 */
export { SHADER_DEV_CSS, SHADER_DEV_STYLE_ID } from "./styles"

export { ControlSlider, type ControlSliderProps } from "./controls/slider"
export { ControlSection, type ControlSectionProps } from "./controls/section"
export {
  ControlColorInput,
  type ControlColorInputProps,
} from "./controls/color-input"
export { ControlToggle, type ControlToggleProps } from "./controls/toggle"
export { ControlSelect, type ControlSelectProps } from "./controls/select"
export { ControlVec2, type ControlVec2Props } from "./controls/vec2"
export {
  ControlQuickActions,
  type ControlQuickActionsProps,
} from "./controls/quick-actions"
