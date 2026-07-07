"use client"

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { createPortal } from "react-dom"
import { cn } from "../lib/cn"
import { useShaderDevThemeContext } from "../hooks/use-theme"
import type { ShaderDevSelectOption } from "../types"

export interface ControlSelectProps {
  label: string
  value: string | number
  options: ReadonlyArray<ShaderDevSelectOption>
  onChange: (v: string | number) => void
  /** Label above control (default) or on the same row. */
  layout?: "inline" | "stacked"
  className?: string
}

const MENU_MAX_HEIGHT = 260
const MENU_GAP = 6

/**
 * Custom dropdown — replaces the native <select>, which can't be themed.
 * The menu portals to <body> (fixed-position, flips above when there's no
 * room below) so the panel's overflow scrolling never clips it.
 */
export function ControlSelect({
  label,
  value,
  options,
  onChange,
  layout = "stacked",
  className,
}: ControlSelectProps) {
  const theme = useShaderDevThemeContext()
  const btnRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [pos, setPos] = useState<{
    top: number
    left: number
    width: number
    up: boolean
  } | null>(null)

  const selectedIndex = options.findIndex(
    (o) => String(o.value) === String(value),
  )
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined

  const place = useCallback(() => {
    const btn = btnRef.current
    if (!btn) return
    const r = btn.getBoundingClientRect()
    const spaceBelow = window.innerHeight - r.bottom
    const up = spaceBelow < Math.min(MENU_MAX_HEIGHT, options.length * 32) + 16
    setPos({
      top: up ? r.top - MENU_GAP : r.bottom + MENU_GAP,
      left: r.right,
      width: Math.max(r.width, 160),
      up,
    })
  }, [options.length])

  const openMenu = useCallback(() => {
    setActive(selectedIndex >= 0 ? selectedIndex : 0)
    place()
    setOpen(true)
  }, [place, selectedIndex])

  const commit = useCallback(
    (index: number) => {
      const opt = options[index]
      if (opt) onChange(opt.value)
      setOpen(false)
      btnRef.current?.focus()
    },
    [onChange, options],
  )

  // Close on outside pointer / scroll / resize while open.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (btnRef.current?.contains(t) || menuRef.current?.contains(t)) return
      setOpen(false)
    }
    const onScroll = (e: Event) => {
      if (menuRef.current?.contains(e.target as Node)) return
      setOpen(false)
    }
    window.addEventListener("pointerdown", onPointerDown, true)
    window.addEventListener("scroll", onScroll, true)
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("pointerdown", onPointerDown, true)
      window.removeEventListener("scroll", onScroll, true)
      window.removeEventListener("resize", onScroll)
    }
  }, [open])

  // Keep the active option in view while keyboard-navigating.
  useLayoutEffect(() => {
    if (!open) return
    menuRef.current
      ?.querySelector<HTMLElement>(`[data-sd-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" })
  }, [open, active])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
        e.preventDefault()
        openMenu()
      }
      return
    }
    switch (e.key) {
      case "Escape":
        e.preventDefault()
        setOpen(false)
        break
      case "ArrowDown":
        e.preventDefault()
        setActive((a) => Math.min(a + 1, options.length - 1))
        break
      case "ArrowUp":
        e.preventDefault()
        setActive((a) => Math.max(a - 1, 0))
        break
      case "Home":
        e.preventDefault()
        setActive(0)
        break
      case "End":
        e.preventDefault()
        setActive(options.length - 1)
        break
      case "Enter":
      case " ":
        e.preventDefault()
        commit(active)
        break
      case "Tab":
        setOpen(false)
        break
    }
  }

  return (
    <div
      className={cn("sd-select", className)}
      data-sd-layout={layout}
    >
      <span className="sd-select-label">{label}</span>
      <button
        ref={btnRef}
        type="button"
        className="sd-select-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
      >
        <span className="sd-select-value">{selected?.label ?? "—"}</span>
        <svg
          className="sd-select-chevron"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && pos
        ? createPortal(
            <div
              data-shader-dev=""
              data-sd-theme={theme}
              className="sd-select-layer"
            >
              <div
                ref={menuRef}
                role="listbox"
                aria-label={label}
                className="sd-select-menu"
                data-sd-up={pos.up ? "true" : "false"}
                style={{
                  position: "fixed",
                  left: pos.left,
                  top: pos.top,
                  minWidth: pos.width,
                  maxHeight: MENU_MAX_HEIGHT,
                  transform: `translate(-100%, ${pos.up ? "-100%" : "0"})`,
                }}
              >
                {options.map((o, i) => {
                  const isSelected = i === selectedIndex
                  return (
                    <button
                      key={String(o.value)}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      data-sd-index={i}
                      data-sd-active={i === active ? "true" : "false"}
                      className="sd-select-option"
                      onMouseEnter={() => setActive(i)}
                      onClick={() => commit(i)}
                    >
                      <span>{o.label}</span>
                      {isSelected ? (
                        <svg
                          className="sd-select-check"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.4}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      ) : null}
                    </button>
                  )
                })}
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
