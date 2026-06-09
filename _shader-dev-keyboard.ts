import {
  dispatchShaderDevToggle,
  SHADER_DEV_TOGGLE_EVENT,
} from "./_use-shader-dev-shortcut"

export { SHADER_DEV_TOGGLE_EVENT }

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  if (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  ) {
    return true
  }
  return target.isContentEditable
}

/** True when this keydown should toggle shader dev tools (document listener). */
export function matchShaderDevShortcut(e: KeyboardEvent): boolean {
  if (isEditableTarget(e.target)) return false

  const mod = e.metaKey || e.ctrlKey
  if (!mod) return false

  // Same chord as PerformanceMonitor (⌘⇧D / Ctrl+Shift+D)
  if (
    e.shiftKey &&
    !e.altKey &&
    (e.key === "d" || e.key === "D" || e.code === "KeyD")
  ) {
    return true
  }

  // Reliable fallback: ⌘⇧` — browsers rarely reserve this
  if (
    e.shiftKey &&
    !e.altKey &&
    (e.key === "`" || e.key === "~" || e.code === "Backquote")
  ) {
    return true
  }

  // ⌘⌥D / Ctrl+Alt+D
  if (!e.shiftKey && e.altKey && e.code === "KeyD") {
    return true
  }

  return false
}

let keyboardInstalled = false

/** Idempotent — safe to call from layout root and inline boot script. */
export function handleShaderDevShortcutKeydown(e: KeyboardEvent): void {
  if (!matchShaderDevShortcut(e)) return
  e.preventDefault()
  e.stopImmediatePropagation()
  dispatchShaderDevToggle()
}

/** React backup when inline boot script is absent (e.g. some preview modes). */
export function installShaderDevKeyboard(): () => void {
  if (typeof document === "undefined") return () => {}
  if (keyboardInstalled) return () => {}
  keyboardInstalled = true

  const onKeyDown = (e: KeyboardEvent) => handleShaderDevShortcutKeydown(e)
  document.addEventListener("keydown", onKeyDown, true)
  return () => {
    document.removeEventListener("keydown", onKeyDown, true)
    keyboardInstalled = false
  }
}
