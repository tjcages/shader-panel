"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "../lib/cn"
import { embedPngDpi, printMaxEdgePx } from "../lib/png-dpi"
import { getShaderCapture } from "../hooks/capture-registry"

const EXPORT_DPI = 300

type ResPreset = {
  label: string
  maxEdge: number
  /** When set, included in export status / filename hints. */
  printHint?: string
}

/** Screen + print targets — print presets size the longest edge at 300 DPI. */
const RES_PRESETS: ResPreset[] = [
  { label: "4K", maxEdge: 3840 },
  { label: "8K", maxEdge: 7680 },
  { label: "16K", maxEdge: 15360 },
  {
    label: "8″",
    maxEdge: printMaxEdgePx(8, 4.5, EXPORT_DPI),
    printHint: `8″ @ ${EXPORT_DPI}dpi`,
  },
  {
    label: "11″",
    maxEdge: printMaxEdgePx(11, 8.5, EXPORT_DPI),
    printHint: `11″ @ ${EXPORT_DPI}dpi`,
  },
  {
    label: "16″",
    maxEdge: printMaxEdgePx(16, 9, EXPORT_DPI),
    printHint: `16″ @ ${EXPORT_DPI}dpi`,
  },
  {
    label: "24″",
    maxEdge: printMaxEdgePx(24, 13.5, EXPORT_DPI),
    printHint: `24″ @ ${EXPORT_DPI}dpi`,
  },
]

async function withExportDpi(blob: Blob): Promise<Blob> {
  return embedPngDpi(blob, EXPORT_DPI)
}

/**
 * Export the live shader as a PNG (copy to clipboard / download) or a WebM
 * video recording. The panel has no direct handle on the shader's WebGL
 * canvas, so we locate it heuristically: the largest <canvas> on the page is
 * the full-screen shader surface (color pickers etc. are tiny).
 */
function findShaderCanvas(): HTMLCanvasElement | null {
  let best: HTMLCanvasElement | null = null
  let bestArea = 0
  for (const c of Array.from(document.querySelectorAll("canvas"))) {
    const area = c.width * c.height
    if (area > bestArea) {
      best = c
      bestArea = area
    }
  }
  return best
}

/**
 * Read the canvas to a PNG blob. Primary path is captureStream + grabFrame,
 * which reads the composited output even when the WebGL context was created
 * WITHOUT preserveDrawingBuffer — so it "just works" on any shader page.
 * Falls back to toBlob (which needs preserveDrawingBuffer) if the ImageCapture
 * API is unavailable.
 */
async function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  const w = window as unknown as {
    ImageCapture?: new (track: MediaStreamTrack) => {
      grabFrame: () => Promise<ImageBitmap>
    }
  }
  try {
    if (typeof canvas.captureStream === "function" && w.ImageCapture) {
      const stream = canvas.captureStream()
      const track = stream.getVideoTracks()[0]
      if (track) {
        const cap = new w.ImageCapture(track)
        const bitmap = await cap.grabFrame()
        track.stop()
        const off = document.createElement("canvas")
        off.width = bitmap.width
        off.height = bitmap.height
        off.getContext("2d")?.drawImage(bitmap, 0, 0)
        const blob = await new Promise<Blob | null>((res) =>
          off.toBlob(res, "image/png"),
        )
        if (blob && blob.size > 0) return blob
      }
    }
  } catch {
    // fall through to direct read
  }
  const blob = await new Promise<Blob | null>((res) =>
    canvas.toBlob(res, "image/png"),
  )
  if (!blob) throw new Error("Could not read the canvas")
  return blob
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 4000)
}

/**
 * Prefer MP4/H.264 (plays everywhere, imports into any editor); fall back to
 * WebM only if the browser's MediaRecorder can't encode MP4. `.mov` is not an
 * option — no browser MediaRecorder emits QuickTime. The file extension is
 * derived from whatever the encoder actually produced.
 */
function pickVideoFormat(): { mimeType: string; ext: string } {
  const candidates = [
    "video/mp4;codecs=avc1.640028", // H.264 High
    "video/mp4;codecs=avc1.42E01E", // H.264 Baseline
    "video/mp4;codecs=avc1",
    "video/mp4",
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ]
  if (typeof MediaRecorder !== "undefined") {
    for (const c of candidates) {
      if (MediaRecorder.isTypeSupported(c)) {
        return { mimeType: c, ext: c.startsWith("video/mp4") ? "mp4" : "webm" }
      }
    }
  }
  return { mimeType: "video/mp4", ext: "mp4" }
}

function fileBase(name: string): string {
  const slug =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "shader"
  const stamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .slice(0, 19)
  return `${slug}-${stamp}`
}

function presetExportLabel(preset: ResPreset): string {
  return preset.printHint ?? preset.label
}

export function ControlExport({ name = "shader" }: { name?: string }) {
  const [status, setStatus] = useState<string | null>(null)
  const [recording, setRecording] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [resIndex, setResIndex] = useState(3) // default 8″ @ 300dpi
  const [busy, setBusy] = useState(false)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<number | null>(null)

  const flash = useCallback((msg: string, ms = 2400) => {
    setStatus(msg)
    window.setTimeout(() => setStatus((s) => (s === msg ? null : s)), ms)
  }, [])

  const copyImage = useCallback(async () => {
    setBusy(true)
    try {
      const preset = RES_PRESETS[resIndex]!
      const exportLabel = presetExportLabel(preset)
      const capture = getShaderCapture()
      if (capture) {
        flash(`Rendering ${exportLabel}…`, 30000)
        const blob = await withExportDpi(await capture({ maxEdge: preset.maxEdge }))
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ])
          flash(`Image copied (${exportLabel}, ${EXPORT_DPI} DPI)`)
        } catch {
          downloadBlob(
            blob,
            `${fileBase(name)}-${preset.label.replace(/″/g, "in")}-${EXPORT_DPI}dpi.png`,
          )
          flash(`Clipboard blocked — downloaded PNG (${exportLabel})`)
        }
        return
      }
      const canvas = findShaderCanvas()
      if (!canvas) return flash("No shader canvas found")
      const blob = await withExportDpi(await canvasToPngBlob(canvas))
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ])
        flash(`Image copied (${EXPORT_DPI} DPI)`)
      } catch {
        downloadBlob(blob, `${fileBase(name)}-${EXPORT_DPI}dpi.png`)
        flash("Clipboard blocked — downloaded PNG")
      }
    } catch (e) {
      flash(e instanceof Error ? e.message : "Image export failed")
    } finally {
      setBusy(false)
    }
  }, [flash, name, resIndex])

  const saveImage = useCallback(async () => {
    setBusy(true)
    try {
      const preset = RES_PRESETS[resIndex]!
      const exportLabel = presetExportLabel(preset)
      const capture = getShaderCapture()
      if (capture) {
        flash(`Rendering ${exportLabel}…`, 30000)
        const blob = await withExportDpi(await capture({ maxEdge: preset.maxEdge }))
        downloadBlob(
          blob,
          `${fileBase(name)}-${preset.label.replace(/″/g, "in")}-${EXPORT_DPI}dpi.png`,
        )
        flash(`PNG saved (${exportLabel}, ${EXPORT_DPI} DPI)`)
        return
      }
      const canvas = findShaderCanvas()
      if (!canvas) return flash("No shader canvas found")
      const blob = await withExportDpi(await canvasToPngBlob(canvas))
      downloadBlob(blob, `${fileBase(name)}-${EXPORT_DPI}dpi.png`)
      flash(`PNG downloaded (${EXPORT_DPI} DPI)`)
    } catch (e) {
      flash(e instanceof Error ? e.message : "Image export failed")
    } finally {
      setBusy(false)
    }
  }, [flash, name, resIndex])

  const stopRecording = useCallback(() => {
    const rec = recorderRef.current
    if (rec && rec.state !== "inactive") rec.stop()
  }, [])

  const startRecording = useCallback(() => {
    const canvas = findShaderCanvas()
    if (!canvas) return flash("No shader canvas found")
    if (
      typeof canvas.captureStream !== "function" ||
      typeof MediaRecorder === "undefined"
    ) {
      return flash("Recording not supported here")
    }
    const stream = canvas.captureStream(60)
    streamRef.current = stream
    const { mimeType, ext } = pickVideoFormat()
    let rec: MediaRecorder
    try {
      rec = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 16_000_000,
      })
    } catch {
      rec = new MediaRecorder(stream)
    }
    chunksRef.current = []
    rec.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data)
    }
    rec.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType })
      chunksRef.current = []
      streamRef.current?.getTracks().forEach((t) => t.stop())
      streamRef.current = null
      if (timerRef.current) {
        window.clearInterval(timerRef.current)
        timerRef.current = null
      }
      setRecording(false)
      setElapsed(0)
      if (blob.size > 0) {
        downloadBlob(blob, `${fileBase(name)}.${ext}`)
        flash(`Video saved (.${ext})`)
      } else {
        flash("Recording was empty")
      }
    }
    recorderRef.current = rec
    // Timeslice so a long recording still flushes chunks progressively.
    rec.start(1000)
    setRecording(true)
    const startedAt = performance.now()
    setElapsed(0)
    timerRef.current = window.setInterval(() => {
      setElapsed((performance.now() - startedAt) / 1000)
    }, 100)
  }, [flash, name])

  // Tear down an in-flight recording if the panel unmounts.
  useEffect(() => {
    return () => {
      const rec = recorderRef.current
      if (rec && rec.state !== "inactive") rec.stop()
      if (timerRef.current) window.clearInterval(timerRef.current)
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  return (
    <div className="sd-export">
      <div className="sd-export-label">Export</div>
      <div className="sd-export-row">
        <button
          type="button"
          className="sd-action-btn"
          onClick={copyImage}
          disabled={busy}
        >
          Copy image
        </button>
        <button
          type="button"
          className="sd-action-btn"
          onClick={saveImage}
          disabled={busy}
        >
          {busy ? "Rendering…" : "Save PNG"}
        </button>
      </div>
      <div className="sd-export-hint">
        PNG exports embed {EXPORT_DPI} DPI metadata for print.
      </div>
      <div className="sd-export-res" role="group" aria-label="PNG resolution">
        {RES_PRESETS.map((preset, i) => (
          <button
            key={preset.label}
            type="button"
            className={cn(
              "sd-export-res-btn",
              i === resIndex && "sd-export-res-active",
            )}
            aria-pressed={i === resIndex}
            title={
              preset.printHint ??
              `${preset.maxEdge}px longest edge · ${EXPORT_DPI} DPI metadata`
            }
            onClick={() => setResIndex(i)}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        className={cn("sd-action-btn", recording && "sd-export-rec")}
        onClick={recording ? stopRecording : startRecording}
      >
        {recording ? (
          <>
            <span className="sd-export-dot" /> Stop recording ·{" "}
            {elapsed.toFixed(1)}s
          </>
        ) : (
          "Record video"
        )}
      </button>
      {status ? <div className="sd-status">{status}</div> : null}
    </div>
  )
}
