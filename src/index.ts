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
  clearPersistedShaderDevSections,
  clearPersistedShaderDevValues,
  hasPersistedShaderDevValues,
  loadPersistedShaderDevSections,
  loadPersistedShaderDevValues,
  persistShaderDevSections,
  persistShaderDevValues,
} from "./persist"
export { ShaderDevFloatingPanel } from "./panel/floating-panel"
export { ShaderDevPanel } from "./panel/panel"
export { ShaderDevRoot } from "./panel/root"
export {
  EyeToggle,
  PanelToggleButton,
  ToolShell,
  type EyeToggleProps,
  type PanelToggleButtonProps,
  type ToolShellProps,
} from "./panel/tool-shell"
export { ShaderDevToolPanel, ToolPanel, type ToolPanelProps } from "./panel/tool-panel"
export { patchShaderConfigDefaults } from "./patch-config"

export {
  TOOL_PANEL_FULL,
  TOOL_PANEL_INSET,
  TOOL_PANEL_WIDTH,
} from "./constants"

export type {
  ShaderDevActionField,
  ShaderDevColorField,
  ShaderDevFieldDef,
  ShaderDevImageField,
  ShaderDevPanelSide,
  ShaderDevPathField,
  ShaderDevPresetOption,
  ShaderDevPresetsField,
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
  getActiveShaderDevForSide,
  getActiveShaderDevId,
  getActiveShaderDevIdForSide,
  getShaderDevRegistration,
  getShaderDevRegistrations,
  getShaderDevRegistrationsForSide,
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
  getShaderCapture,
  getShaderGifExport,
  getShaderRecordCanvas,
  getShaderRecordPrepare,
  registerShaderCapture,
  registerShaderGifExport,
  registerShaderRecordCanvas,
  registerShaderRecordPrepare,
  subscribeShaderCapture,
  subscribeShaderRecording,
  type ShaderCaptureFn,
  type ShaderGifExportFn,
  type ShaderGifExportOptions,
} from "./hooks/capture-registry"

export {
  SHADER_DEV_ANIMATION_STEP,
  advanceShaderDevAnimationDelta,
  getShaderDevAnimationRevision,
  getShaderDevAnimationSnapshot,
  getShaderDevAnimationTime,
  initShaderDevAnimationClock,
  pauseShaderDevAnimation,
  playShaderDevAnimation,
  resetShaderDevAnimation,
  setShaderDevAnimationRate,
  setShaderDevAnimationTime,
  stepShaderDevAnimationBackward,
  stepShaderDevAnimationForward,
  subscribeShaderDevAnimation,
  toggleShaderDevAnimation,
  type ShaderDevAnimationSnapshot,
} from "./hooks/animation-clock"

export {
  ControlAnimation,
  type ControlAnimationProps,
} from "./controls/animation-controls"

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
export { embedPngDpi, printMaxEdgePx } from "./lib/png-dpi"

export {
  ShaderDevThemeProvider,
  applyShaderDevTheme,
  SHADER_DEV_THEME_STORAGE_KEY,
  useShaderDevTheme,
  useShaderDevThemeContext,
  type ShaderDevTheme,
} from "./hooks/use-theme"

/**
 * Raw stylesheet + id, exported so consumers with custom SSR setups can inject
 * the styles themselves. The components inject these automatically on mount —
 * you only need this when you want to control the timing.
 */
export {
  PANEL_CSS,
  PANEL_STYLE_ID,
  /** @deprecated use PANEL_CSS */
  SHADER_DEV_CSS,
  /** @deprecated use PANEL_STYLE_ID */
  SHADER_DEV_STYLE_ID,
} from "./styles"

export {
  ControlAction,
  type ControlActionProps,
} from "./controls/action"
export {
  ControlActionGroup,
  type ControlActionGroupProps,
} from "./controls/action-group"
export { ControlSlider, type ControlSliderProps } from "./controls/slider"
export { ControlSection, type ControlSectionProps } from "./controls/section"
export {
  ControlColorInput,
  type ControlColorInputProps,
} from "./controls/color-input"
export {
  ControlImageInput,
  type ControlImageInputProps,
} from "./controls/image-input"
export {
  ControlPath,
  type ControlPathProps,
  type PathPoint,
} from "./controls/path-input"
export { ControlToggle, type ControlToggleProps } from "./controls/toggle"
export {
  ControlThemeToggle,
  type ControlThemeToggleProps,
} from "./controls/theme-toggle"
export { ControlSelect, type ControlSelectProps } from "./controls/select"
export { ControlVec2, type ControlVec2Props } from "./controls/vec2"
export {
  ControlPresets,
  type ControlPresetOption,
  type ControlPresetsProps,
} from "./controls/presets"
export {
  ControlDisclosure,
  type ControlDisclosureProps,
} from "./controls/disclosure"
export {
  ControlHint,
  type ControlHintProps,
} from "./controls/hint"
export {
  ControlOptionList,
  type ControlOptionListItem,
  type ControlOptionListProps,
} from "./controls/option-list"
export {
  ControlReadout,
  type ControlReadoutProps,
} from "./controls/readout"
export {
  ControlSearchField,
  type ControlSearchFieldProps,
} from "./controls/search-field"
export {
  ControlTextInput,
  type ControlTextInputProps,
} from "./controls/text-input"
export {
  ControlTextarea,
  type ControlTextareaProps,
} from "./controls/textarea"
