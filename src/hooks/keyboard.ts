import {
  dispatchPanelToggle,
  PANEL_TOGGLE_EVENT,
} from "./use-shortcut"

export { PANEL_TOGGLE_EVENT }

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
export function matchPanelShortcut(e: KeyboardEvent): boolean {
  if (isEditableTarget(e.target)) return false

  const mod = e.metaKey || e.ctrlKey
  if (!mod) return false

  // Primary: ⌘⌥D / Ctrl+Alt+D
  if (!e.shiftKey && e.altKey && e.code === "KeyD") {
    return true
  }

  // Fallback: ⌘⇧` — browsers rarely reserve this
  if (
    e.shiftKey &&
    !e.altKey &&
    (e.key === "`" || e.key === "~" || e.code === "Backquote")
  ) {
    return true
  }

  // Fallback: ⌘⇧D / Ctrl+Shift+D (Chrome on Mac may steal this for "Bookmark all tabs")
  if (
    e.shiftKey &&
    !e.altKey &&
    (e.key === "d" || e.key === "D" || e.code === "KeyD")
  ) {
    return true
  }

  return false
}

let keyboardInstalled = false

/** Idempotent — safe to call from layout root and inline boot script. */
export function handlePanelShortcutKeydown(e: KeyboardEvent): void {
  if (!matchPanelShortcut(e)) return
  e.preventDefault()
  e.stopImmediatePropagation()
  dispatchPanelToggle()
}

/** React backup when inline boot script is absent (e.g. some preview modes). */
export function installPanelKeyboard(): () => void {
  if (typeof document === "undefined") return () => {}
  if (keyboardInstalled) return () => {}
  keyboardInstalled = true

  const onKeyDown = (e: KeyboardEvent) => handlePanelShortcutKeydown(e)
  document.addEventListener("keydown", onKeyDown, true)
  return () => {
    document.removeEventListener("keydown", onKeyDown, true)
    keyboardInstalled = false
  }
}
