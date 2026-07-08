/**
 * Production no-op entry for `@tjcages/panels/shader`.
 *
 * Resolved under the `production` condition. The adapters and config utilities
 * stay functional (consumers use them in their real shader runtime); the
 * `useShaderPanel` hook collapses to plain local state, and the prompt array
 * is dropped so the ~2 KB of prompt text never reaches the prod bundle.
 */

import { useState } from "react"

// Functional utilities — kept in prod (no UI deps).
export {
  createR3FAdapter,
  createWebGLAdapter,
  hexToRgb01,
  type CreateR3FAdapterOptions,
  type CreateWebGLAdapterOptions,
} from "../adapters"
export { patchShaderConfigDefaults } from "../patch-config"
export type { PanelPrompt } from "../prompts"
export type { UseShaderPanelOptions } from "./use-shader-panel"

export const DEFAULT_PANEL_PROMPTS: ReadonlyArray<unknown> = []

// Pure string util — inlined so the prompt-text array stays out of the bundle.
export function fillPanelPrompt(prompt: string, shaderName?: string): string {
  const name = shaderName?.trim() || "shader"
  return prompt.replace(/\{\{\s*shader\s*\}\}/g, name)
}

// useShaderPanel — in prod, just local state seeded with the defaults.
export function useShaderPanel<T>(options: { defaults: T }): [T, (next: T) => void] {
  return useState(() => ({ ...(options.defaults as object) }) as T)
}
