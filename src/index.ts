export {
  createR3FAdapter,
  createWebGLAdapter,
  hexToRgb01,
  type CreateR3FAdapterOptions,
  type CreateWebGLAdapterOptions,
} from "./adapters"
export {
  DEFAULT_PANEL_PROMPTS,
  fillPanelPrompt,
  type PanelPrompt,
} from "./prompts"
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
export { patchShaderConfigDefaults } from "./patch-config"

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

// ---------------------------------------------------------------------------
// @deprecated back-compat aliases — every pre-rename `ShaderDev*` / `useShaderDev`
// name, mapped to its canonical `Panel*` replacement. These keep existing
// `shader-panel` consumers compiling unchanged. Prefer the new names above.
// ---------------------------------------------------------------------------

/** @deprecated Renamed to `DEFAULT_PANEL_PROMPTS`. */
export { DEFAULT_PANEL_PROMPTS as DEFAULT_SHADER_DEV_PROMPTS } from "./prompts"
/** @deprecated Renamed to `fillPanelPrompt`. */
export { fillPanelPrompt as fillShaderDevPrompt } from "./prompts"

/** @deprecated Renamed to `clearPersistedPanelSections`. */
export { clearPersistedPanelSections as clearPersistedShaderDevSections } from "./persist"
/** @deprecated Renamed to `clearPersistedPanelValues`. */
export { clearPersistedPanelValues as clearPersistedShaderDevValues } from "./persist"
/** @deprecated Renamed to `hasPersistedPanelValues`. */
export { hasPersistedPanelValues as hasPersistedShaderDevValues } from "./persist"
/** @deprecated Renamed to `loadPersistedPanelSections`. */
export { loadPersistedPanelSections as loadPersistedShaderDevSections } from "./persist"
/** @deprecated Renamed to `loadPersistedPanelValues`. */
export { loadPersistedPanelValues as loadPersistedShaderDevValues } from "./persist"
/** @deprecated Renamed to `persistPanelSections`. */
export { persistPanelSections as persistShaderDevSections } from "./persist"
/** @deprecated Renamed to `persistPanelValues`. */
export { persistPanelValues as persistShaderDevValues } from "./persist"

/** @deprecated Renamed to `FloatingPanel`. */
export { FloatingPanel as ShaderDevFloatingPanel } from "./panel/floating-panel"
/** @deprecated Renamed to `Panel`. */
export { Panel as ShaderDevPanel } from "./panel/panel"
/** @deprecated Renamed to `PanelRoot`. */
export { PanelRoot as ShaderDevRoot } from "./panel/root"
/** @deprecated Renamed to `PanelToolPanel`. */
export { PanelToolPanel as ShaderDevToolPanel } from "./panel/tool-panel"

/** @deprecated Renamed to `isPanelSection`. */
export { isPanelSection as isShaderDevSection } from "./types"

/** @deprecated Renamed `ShaderDev*Field` / related types to `Panel*`. */
export type {
  PanelActionField as ShaderDevActionField,
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

/** @deprecated Renamed store fns/types to `Panel*`. */
export {
  getActivePanel as getActiveShaderDev,
  getActivePanelForSide as getActiveShaderDevForSide,
  getActivePanelId as getActiveShaderDevId,
  getActivePanelIdForSide as getActiveShaderDevIdForSide,
  getPanelRegistration as getShaderDevRegistration,
  getPanelRegistrations as getShaderDevRegistrations,
  getPanelRegistrationsForSide as getShaderDevRegistrationsForSide,
  getPanelRevision as getShaderDevRevision,
  registerPanel as registerShaderDev,
  setActivePanel as setActiveShaderDev,
  subscribePanelRegistration as subscribeShaderDevRegistration,
  unregisterPanel as unregisterShaderDev,
  type PanelRegistration as ShaderDevRegistration,
  type PanelState as ShaderDevValues,
} from "./store"

/** @deprecated Renamed to `usePanel` / `UsePanelOptions`. */
export {
  usePanel as useShaderDev,
  type UsePanelOptions as UseShaderDevOptions,
} from "./hooks/use-panel"

/** @deprecated Renamed animation-clock members to `Panel*`. */
export {
  PANEL_ANIMATION_STEP as SHADER_DEV_ANIMATION_STEP,
  advancePanelAnimationDelta as advanceShaderDevAnimationDelta,
  getPanelAnimationRevision as getShaderDevAnimationRevision,
  getPanelAnimationSnapshot as getShaderDevAnimationSnapshot,
  getPanelAnimationTime as getShaderDevAnimationTime,
  initPanelAnimationClock as initShaderDevAnimationClock,
  pausePanelAnimation as pauseShaderDevAnimation,
  playPanelAnimation as playShaderDevAnimation,
  resetPanelAnimation as resetShaderDevAnimation,
  setPanelAnimationRate as setShaderDevAnimationRate,
  setPanelAnimationTime as setShaderDevAnimationTime,
  stepPanelAnimationBackward as stepShaderDevAnimationBackward,
  stepPanelAnimationForward as stepShaderDevAnimationForward,
  subscribePanelAnimation as subscribeShaderDevAnimation,
  togglePanelAnimation as toggleShaderDevAnimation,
  type PanelAnimationSnapshot as ShaderDevAnimationSnapshot,
} from "./hooks/animation-clock"

/** @deprecated Renamed shortcut members to `Panel*`. */
export {
  dispatchPanelToggle as dispatchShaderDevToggle,
  readPanelOpenFlag as readShaderDevOpenFlag,
  PANEL_TOGGLE_EVENT as SHADER_DEV_TOGGLE_EVENT,
  usePanelShortcut as useShaderDevShortcut,
  writePanelOpenFlag as writeShaderDevOpenFlag,
} from "./hooks/use-shortcut"

/** @deprecated Renamed keyboard members to `Panel*`. */
export {
  handlePanelShortcutKeydown as handleShaderDevShortcutKeydown,
  installPanelKeyboard as installShaderDevKeyboard,
  matchPanelShortcut as matchShaderDevShortcut,
} from "./hooks/keyboard"

/** @deprecated Renamed theme members to `Panel*`. */
export {
  PanelThemeProvider as ShaderDevThemeProvider,
  applyPanelTheme as applyShaderDevTheme,
  PANEL_THEME_STORAGE_KEY as SHADER_DEV_THEME_STORAGE_KEY,
  usePanelTheme as useShaderDevTheme,
  usePanelThemeContext as useShaderDevThemeContext,
  type PanelTheme as ShaderDevTheme,
} from "./hooks/use-theme"
