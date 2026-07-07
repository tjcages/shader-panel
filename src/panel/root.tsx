"use client"

import { useCallback, useEffect, useState, useSyncExternalStore } from "react"
import { ShaderDevPanel } from "./panel"
import {
  getActiveShaderDev,
  getActiveShaderDevId,
  getShaderDevRegistrations,
  getShaderDevRevision,
  setActiveShaderDev,
  subscribeShaderDevRegistration,
} from "../store"
import { installShaderDevKeyboard } from "../hooks/keyboard"
import { useInjectShaderDevStyles } from "../hooks/use-inject-styles"
import {
  readShaderDevOpenFlag,
  SHADER_DEV_TOGGLE_EVENT,
  writeShaderDevOpenFlag,
} from "../hooks/use-shortcut"
import {
  useShaderDevTheme,
  type ShaderDevTheme,
} from "../hooks/use-theme"

function subscribeOpen(listener: () => void): () => void {
  const onToggle = () => listener()
  window.addEventListener(SHADER_DEV_TOGGLE_EVENT, onToggle)
  return () => window.removeEventListener(SHADER_DEV_TOGGLE_EVENT, onToggle)
}

function getOpenSnapshot(): boolean {
  return readShaderDevOpenFlag()
}

// Only one root renders the panel — whether mounted explicitly via
// <ShaderDevRoot/> or auto-injected by useShaderDev. The first to claim wins;
// extras render null so you never get two panels.
let primaryClaimed = false

/**
 * Mounts once in the app layout. Owns the keyboard shortcut + renders whichever
 * shader is currently active. Shaders register themselves on hydrate via
 * `registerShaderDev({ id, title, values, defaults, fields, onChange })`.
 *
 * When 2+ shaders are registered simultaneously, a switcher appears in the
 * panel header to flip between them.
 */
export function ShaderDevRoot({
  emptyMessage = "No shader registered on this page.",
  defaultTheme,
}: {
  emptyMessage?: string
  /** Initial theme when no user override + no `html.dark` are set. Falls back to OS preference if omitted. */
  defaultTheme?: ShaderDevTheme
} = {}) {
  // Claim the single "primary" slot. Non-primary instances render nothing.
  const [isPrimary, setIsPrimary] = useState(false)
  useEffect(() => {
    if (primaryClaimed) return
    primaryClaimed = true
    setIsPrimary(true)
    return () => {
      primaryClaimed = false
    }
  }, [])

  useInjectShaderDevStyles()
  const theme = useShaderDevTheme(defaultTheme)
  const open = useSyncExternalStore(subscribeOpen, getOpenSnapshot, () => false)

  // Re-render whenever the registry changes — revision is monotonic + cheap.
  useSyncExternalStore(
    subscribeShaderDevRegistration,
    getShaderDevRevision,
    () => 0,
  )

  const registration = getActiveShaderDev()
  const activeId = getActiveShaderDevId()
  const allRegistrations = getShaderDevRegistrations()

  useEffect(() => installShaderDevKeyboard(), [])

  const setOpen = useCallback((next: boolean) => {
    writeShaderDevOpenFlag(next)
    window.dispatchEvent(new CustomEvent(SHADER_DEV_TOGGLE_EVENT))
  }, [])

  if (!isPrimary) return null

  if (!registration) {
    return open ? (
      <div data-shader-dev="" data-sd-theme={theme} className="sd-empty">
        {emptyMessage}
        <button
          type="button"
          className="sd-empty-close"
          onClick={() => setOpen(false)}
        >
          Close
        </button>
      </div>
    ) : null
  }

  const switcher =
    allRegistrations.size > 1 ? (
      <ShaderSwitcher
        activeId={activeId}
        registrations={allRegistrations}
        onSelect={setActiveShaderDev}
      />
    ) : null

  return (
    <ShaderDevPanel
      id={registration.id}
      title={registration.title}
      titleSlot={switcher}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      values={registration.values}
      defaults={registration.defaults}
      fields={registration.fields}
      onChange={registration.onChange}
      onWriteConfig={registration.onWriteConfig}
      writeLabel={registration.writeLabel}
      prompts={registration.prompts}
      persist={registration.persist}
      defaultTheme={defaultTheme}
      actionHandlers={registration.actionHandlers}
    />
  )
}

function ShaderSwitcher({
  activeId,
  registrations,
  onSelect,
}: {
  activeId: string | null
  registrations: ReadonlyMap<string, { id: string; title: string }>
  onSelect: (id: string) => void
}) {
  return (
    <select
      className="sd-switcher"
      value={activeId ?? ""}
      onChange={(e) => onSelect(e.target.value)}
      aria-label="Active shader"
    >
      {Array.from(registrations.values()).map((reg) => (
        <option key={reg.id} value={reg.id}>
          {reg.title}
        </option>
      ))}
    </select>
  )
}
