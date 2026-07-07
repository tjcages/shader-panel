"use client"

import { useRef, useState } from "react"
import { cn } from "../lib/cn"

export interface ControlImageInputProps {
  label: string
  /** Image URL — asset path, object URL, or data URL. Empty string = no image. */
  value: string
  onChange?: (v: string) => void
  /** Preview-only (generated outputs) — hides upload + drop affordances. */
  readonly?: boolean
  /** `accept` for the file picker. Default `"image/*"`. */
  accept?: string
  /** Muted text shown when `value` is empty. */
  emptyLabel?: string
  className?: string
}

/**
 * Image slot: label row + thumbnail preview. Unless `readonly`, clicking the
 * preview (or dropping a file on it) picks a local image and emits an object
 * URL via `onChange`. Old object URLs are not revoked here — the consumer may
 * still be sampling them (e.g. as a GPU texture).
 */
export function ControlImageInput({
  label,
  value,
  onChange,
  readonly = false,
  accept = "image/*",
  emptyLabel,
  className,
}: ControlImageInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  // Natural aspect ratio of the loaded preview — the frame adopts it so the
  // slot's height follows the image (portrait = taller, landscape = shorter).
  const [aspect, setAspect] = useState<number | null>(null)
  const interactive = !readonly && !!onChange

  const handleFile = (file: File | null | undefined) => {
    if (!file || !file.type.startsWith("image/")) return
    onChange?.(URL.createObjectURL(file))
  }

  return (
    <div className={cn("sd-image", className)}>
      <div className="sd-image-head">
        <span className="sd-image-label">{label}</span>
        {interactive ? (
          <button
            type="button"
            className="sd-image-upload"
            onClick={() => inputRef.current?.click()}
          >
            Upload
          </button>
        ) : null}
      </div>
      <div
        className="sd-image-frame"
        style={
          value && aspect
            ? // Frame at the image's natural aspect; the img inside renders at
              // 75% so it floats clear of the frame edges.
              { aspectRatio: `${aspect}` }
            : undefined
        }
        data-sd-interactive={interactive ? "true" : "false"}
        data-sd-drag={dragOver ? "true" : "false"}
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-label={interactive ? `Upload image for ${label}` : label}
        onClick={interactive ? () => inputRef.current?.click() : undefined}
        onKeyDown={
          interactive
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  inputRef.current?.click()
                }
              }
            : undefined
        }
        onDragOver={
          interactive
            ? (e) => {
                e.preventDefault()
                setDragOver(true)
              }
            : undefined
        }
        onDragLeave={interactive ? () => setDragOver(false) : undefined}
        onDrop={
          interactive
            ? (e) => {
                e.preventDefault()
                setDragOver(false)
                handleFile(e.dataTransfer.files?.[0])
              }
            : undefined
        }
      >
        {value ? (
          <img
            src={value}
            alt={label}
            className="sd-image-preview"
            draggable={false}
            onLoad={(e) => {
              const img = e.currentTarget
              if (img.naturalWidth && img.naturalHeight) {
                setAspect(img.naturalWidth / img.naturalHeight)
              }
            }}
          />
        ) : (
          <span className="sd-image-empty">
            {emptyLabel ?? (readonly ? "—" : "Click or drop an image")}
          </span>
        )}
      </div>
      {interactive ? (
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="sd-image-native"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(e) => {
            handleFile(e.target.files?.[0])
            // Allow re-selecting the same file later.
            e.target.value = ""
          }}
        />
      ) : null}
    </div>
  )
}
