"use client"

import { usePanel, type UsePanelOptions } from "../hooks/use-panel"
import { DEFAULT_PANEL_PROMPTS } from "../prompts"
import type { PanelState } from "../store"

export type UseShaderPanelOptions<T extends PanelState> = UsePanelOptions<T>

/**
 * `usePanel` pre-wired with the built-in shader AI-prompt rail — the
 * batteries-included entry for shader / WebGL / Three.js / R3F tools.
 *
 * Identical to `usePanel` except the prompt rail defaults on. Pass your own
 * `prompts` to override, or `prompts: []` to hide it.
 *
 * ```tsx
 * import { useShaderPanel, createR3FAdapter } from "@tjcages/panels/shader"
 * const [config] = useShaderPanel({ id, title, defaults, fields })
 * ```
 */
export function useShaderPanel<T extends PanelState>(
  options: UseShaderPanelOptions<T>,
) {
  return usePanel<T>({ prompts: DEFAULT_PANEL_PROMPTS, ...options })
}
