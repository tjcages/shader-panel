"use client"

import { useCallback, useEffect, useState, useSyncExternalStore } from "react"
import type { ShaderDevPanelSide } from "../types"
import { ShaderDevPanel } from "./panel"
import {
  getActiveShaderDevForSide,
  getActiveShaderDevIdForSide,
  getShaderDevRegistrationsForSide,
  getShaderDevRevision,
  setActiveShaderDev,
  subscribeShaderDevRegistration,
} from "../store"
import { installShaderDevKeyboard } from "../hooks/keyboard"
import { useInjectShaderDevStyles } from "../hooks/use-inject-styles"
import {
  initShaderDevOpenFlag,
  readShaderDevOpenFlag,
  SHADER_DEV_TOGGLE_EVENT,
  writeShaderDevOpenFlag,
} from "../hooks/use-shortcut"
import {
  useShaderDevTheme,
  type ShaderDevTheme,
} from "../hooks/use-theme"

function subscribeSideOpen(side: ShaderDevPanelSide, listener: () => void): () => void {
  const onToggle = () => listener()
  window.addEventListener(SHADER_DEV_TOGGLE_EVENT, onToggle)
  return () => window.removeEventListener(SHADER_DEV_TOGGLE_EVENT, onToggle)
}

function getSideOpenSnapshot(side: ShaderDevPanelSide): boolean {
  return readShaderDevOpenFlag(side)
}

function useSideOpen(side: ShaderDevPanelSide): boolean {
  const subscribe = useCallback(
    (listener: () => void) => subscribeSideOpen(side, listener),
    [side],
  )
  return useSyncExternalStore(
    subscribe,
    () => getSideOpenSnapshot(side),
    () => false,
  )
}

// Only one root renders the panel — whether mounted explicitly via
// <ShaderDevRoot/> or auto-injected by useShaderDev. The first to claim wins;
// extras render null so you never get two panels.
let primaryClaimed = false

/**
 * Mounts once in the app layout. Owns the keyboard shortcut + renders whichever
 * shader is currently active on each side. Shaders register themselves on
 * hydrate via `registerShaderDev({ id, title, side, values, defaults, fields, onChange })`.
 *
 * When 2+ shaders are registered on the same side, a switcher appears in that
 * panel's header.
 */
export function ShaderDevRoot({
  emptyMessage = "No shader registered on this page.",
  defaultTheme,
  themeStorageKey,
  defaultLeftOpen = false,
  defaultRightOpen,
}: {
  emptyMessage?: string
  /** Initial theme when no user override + no `html.dark` are set. Falls back to OS preference if omitted. */
  defaultTheme?: ShaderDevTheme
  /** sessionStorage key for the header theme toggle. */
  themeStorageKey?: string
  /** Initial open state for the left panel this session. Default false. */
  defaultLeftOpen?: boolean
  /** Initial open state for the right panel. Defaults to closed unless seeded by `useShaderDev({ defaultOpen: true })`. */
  defaultRightOpen?: boolean
} = {}) {
  const [isPrimary, setIsPrimary] = useState(false)
  useEffect(() => {
    if (primaryClaimed) return
    primaryClaimed = true
    setIsPrimary(true)
    initShaderDevOpenFlag(defaultLeftOpen, "left")
    if (defaultRightOpen !== undefined) {
      initShaderDevOpenFlag(defaultRightOpen, "right")
    }
    return () => {
      primaryClaimed = false
    }
  }, [defaultLeftOpen, defaultRightOpen])

  useInjectShaderDevStyles()
  const theme = useShaderDevTheme(defaultTheme)
  const leftOpen = useSideOpen("left")
  const rightOpen = useSideOpen("right")

  useSyncExternalStore(
    subscribeShaderDevRegistration,
    getShaderDevRevision,
    () => 0,
  )

  const leftRegistration = getActiveShaderDevForSide("left")
  const rightRegistration = getActiveShaderDevForSide("right")
  const leftRegistrations = getShaderDevRegistrationsForSide("left")
  const rightRegistrations = getShaderDevRegistrationsForSide("right")

  useEffect(() => installShaderDevKeyboard(), [])

  const setSideOpen = useCallback((side: ShaderDevPanelSide, next: boolean) => {
    writeShaderDevOpenFlag(next, side)
    window.dispatchEvent(new CustomEvent(SHADER_DEV_TOGGLE_EVENT, { detail: { side } }))
  }, [])

  if (!isPrimary) return null

  const hasAnyRegistration = leftRegistration ?? rightRegistration
  const anyOpen = leftOpen || rightOpen

  if (!hasAnyRegistration) {
    return anyOpen ? (
      <div data-shader-dev="" data-sd-theme={theme} className="sd-empty">
        {emptyMessage}
        <button
          type="button"
          className="sd-empty-close"
          onClick={() => {
            setSideOpen("left", false)
            setSideOpen("right", false)
          }}
        >
          Close
        </button>
      </div>
    ) : null
  }

  return (
    <>
      {leftRegistration ? (
        <RegisteredSidePanel
          side="left"
          registration={leftRegistration}
          activeId={getActiveShaderDevIdForSide("left")}
          allRegistrations={leftRegistrations}
          open={leftOpen}
          onClose={() => setSideOpen("left", false)}
          onOpen={() => setSideOpen("left", true)}
          defaultTheme={defaultTheme}
          themeStorageKey={themeStorageKey}
          showThemeToggle
        />
      ) : null}
      {rightRegistration ? (
        <RegisteredSidePanel
          side="right"
          registration={rightRegistration}
          activeId={getActiveShaderDevIdForSide("right")}
          allRegistrations={rightRegistrations}
          open={rightOpen}
          onClose={() => setSideOpen("right", false)}
          onOpen={() => setSideOpen("right", true)}
          defaultTheme={defaultTheme}
          themeStorageKey={themeStorageKey}
          showThemeToggle={false}
        />
      ) : null}
    </>
  )
}

function RegisteredSidePanel({
  side,
  registration,
  activeId,
  allRegistrations,
  open,
  onClose,
  onOpen,
  defaultTheme,
  themeStorageKey,
  showThemeToggle,
}: {
  side: ShaderDevPanelSide
  registration: NonNullable<ReturnType<typeof getActiveShaderDevForSide>>
  activeId: string | null
  allRegistrations: ReturnType<typeof getShaderDevRegistrationsForSide>
  open: boolean
  onClose: () => void
  onOpen: () => void
  defaultTheme?: ShaderDevTheme
  themeStorageKey?: string
  showThemeToggle?: boolean
}) {
  const switcher =
    allRegistrations.length > 1 ? (
      <ShaderSwitcher
        activeId={activeId}
        registrations={allRegistrations}
        onSelect={setActiveShaderDev}
      />
    ) : null

  return (
    <ShaderDevPanel
      id={registration.id}
      side={side}
      title={registration.title}
      titleSlot={switcher}
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      values={registration.values}
      defaults={registration.defaults}
      fields={registration.fields}
      onChange={registration.onChange}
      onWriteConfig={registration.onWriteConfig}
      writeLabel={registration.writeLabel}
      prompts={registration.prompts}
      persist={registration.persist}
      defaultTheme={defaultTheme}
      themeStorageKey={themeStorageKey}
      showThemeToggle={showThemeToggle}
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
  registrations: ReadonlyArray<{ id: string; title: string }>
  onSelect: (id: string) => void
}) {
  return (
    <select
      className="sd-switcher"
      value={activeId ?? ""}
      onChange={(e) => onSelect(e.target.value)}
      aria-label="Active shader"
    >
      {registrations.map((reg) => (
        <option key={reg.id} value={reg.id}>
          {reg.title}
        </option>
      ))}
    </select>
  )
}
