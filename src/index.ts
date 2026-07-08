export { type PanelPrompt } from "./prompts"
export {
  clearPersistedPanelSections,
  clearPersistedPanelValues,
  hasPersistedPanelValues,
  loadPersistedPanelSections,
  loadPersistedPanelValues,
  persistPanelSections,
  persistPanelValues,
} from "./persist"
export { FloatingPanel } from "./panel/floating-panel"
export { Panel } from "./panel/panel"
export { PanelRoot } from "./panel/root"
export {
  EyeToggle,
  PanelToggleButton,
  ToolShell,
  type EyeToggleProps,
  type PanelToggleButtonProps,
  type ToolShellProps,
} from "./panel/tool-shell"
export { PanelToolPanel, ToolPanel, type ToolPanelProps } from "./panel/tool-panel"

export {
  TOOL_PANEL_FULL,
  TOOL_PANEL_INSET,
  TOOL_PANEL_WIDTH,
} from "./constants"

export type {
  PanelActionField,
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
export { isPanelSection } from "./types"

export {
  getActivePanel,
  getActivePanelForSide,
  getActivePanelId,
  getActivePanelIdForSide,
  getPanelRegistration,
  getPanelRegistrations,
  getPanelRegistrationsForSide,
  getPanelRevision,
  registerPanel,
  setActivePanel,
  subscribePanelRegistration,
  unregisterPanel,
  type PanelRegistration,
  type PanelState,
} from "./store"

export {
  usePanel,
  type UsePanelOptions,
} from "./hooks/use-panel"

export {
  getShaderCapture,
  getShaderGifExport,
  getShaderRecordCanvas,
  getShaderRecordFrame,
  getShaderRecordPrepare,
  getShaderVideoExport,
  registerShaderCapture,
  registerShaderGifExport,
  registerShaderRecordCanvas,
  registerShaderRecordFrame,
  registerShaderRecordPrepare,
  registerShaderVideoExport,
  subscribeShaderCapture,
  subscribeShaderRecording,
  setShaderRecording,
  type ShaderCaptureFn,
  type ShaderGifExportFn,
  type ShaderGifExportOptions,
  type ShaderRecordFrameFn,
  type ShaderRecordingOptions,
  type ShaderVideoExportFn,
  type ShaderVideoSession,
} from "./hooks/capture-registry"

export {
  PANEL_ANIMATION_STEP,
  advancePanelAnimationDelta,
  getPanelAnimationRevision,
  getPanelAnimationSnapshot,
  getPanelAnimationTime,
  initPanelAnimationClock,
  pausePanelAnimation,
  playPanelAnimation,
  resetPanelAnimation,
  setPanelAnimationRate,
  setPanelAnimationTime,
  stepPanelAnimationBackward,
  stepPanelAnimationForward,
  subscribePanelAnimation,
  togglePanelAnimation,
  type PanelAnimationSnapshot,
} from "./hooks/animation-clock"

export {
  ControlAnimation,
  type ControlAnimationProps,
} from "./controls/animation-controls"

export {
  dispatchPanelToggle,
  readPanelOpenFlag,
  PANEL_TOGGLE_EVENT,
  usePanelShortcut,
  writePanelOpenFlag,
} from "./hooks/use-shortcut"

export {
  handlePanelShortcutKeydown,
  installPanelKeyboard,
  matchPanelShortcut,
} from "./hooks/keyboard"

/** @deprecated Use layout inline script + PanelRoot */
export { embedPngDpi, printMaxEdgePx } from "./lib/png-dpi"

export {
  PanelThemeProvider,
  applyPanelTheme,
  PANEL_THEME_STORAGE_KEY,
  usePanelTheme,
  usePanelThemeContext,
  type PanelTheme,
} from "./hooks/use-theme"

/**
 * Raw stylesheet + id, exported so consumers with custom SSR setups can inject
 * the styles themselves. The components inject these automatically on mount —
 * you only need this when you want to control the timing.
 */
export {
  PANEL_CSS,
  PANEL_STYLE_ID,
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
