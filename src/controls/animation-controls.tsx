"use client"

import { useCallback, useEffect, useSyncExternalStore } from "react"
import { cn } from "../lib/cn"
import {
  getShaderDevAnimationRevision,
  getShaderDevAnimationSnapshot,
  initShaderDevAnimationClock,
  pauseShaderDevAnimation,
  playShaderDevAnimation,
  resetShaderDevAnimation,
  SHADER_DEV_ANIMATION_STEP,
  stepShaderDevAnimationBackward,
  stepShaderDevAnimationForward,
  subscribeShaderDevAnimation,
} from "../hooks/animation-clock"

export interface ControlAnimationProps {
  className?: string
  /** Step size in seconds for the frame back/forward buttons. */
  step?: number
}

function formatTime(seconds: number): string {
  const whole = Math.floor(seconds)
  const frac = Math.round((seconds - whole) * 1000)
  return `${whole}.${frac.toString().padStart(3, "0")}s`
}

export function ControlAnimation({
  className,
  step = SHADER_DEV_ANIMATION_STEP,
}: ControlAnimationProps) {
  useEffect(() => {
    initShaderDevAnimationClock()
  }, [])

  // Subscribe to the monotonic revision — same pattern as ShaderDevRoot's
  // registry store. Reading the snapshot object separately avoids returning a
  // fresh `{ playing, time, rate }` from getSnapshot (that causes an infinite
  // loop because Object.is sees a new reference every call).
  useSyncExternalStore(
    subscribeShaderDevAnimation,
    getShaderDevAnimationRevision,
    () => 0,
  )
  const snapshot = getShaderDevAnimationSnapshot()

  const togglePlay = useCallback(() => {
    if (snapshot.playing) pauseShaderDevAnimation()
    else playShaderDevAnimation()
  }, [snapshot.playing])

  return (
    <div className={cn("panel-animation", className)}>
      <div className="panel-animation-label">Animation</div>
      <div className="panel-animation-row">
        <button
          type="button"
          className="panel-animation-btn"
          onClick={() => stepShaderDevAnimationBackward(step)}
          aria-label="Step backward one frame"
          title="Step back"
        >
          <StepBackIcon />
        </button>
        <button
          type="button"
          className="panel-animation-btn panel-animation-btn-primary"
          onClick={togglePlay}
          aria-label={snapshot.playing ? "Pause animation" : "Play animation"}
          title={snapshot.playing ? "Pause" : "Play"}
        >
          {snapshot.playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button
          type="button"
          className="panel-animation-btn"
          onClick={() => stepShaderDevAnimationForward(step)}
          aria-label="Step forward one frame"
          title="Step forward"
        >
          <StepForwardIcon />
        </button>
        <span className="panel-animation-time" aria-live="polite">
          {formatTime(snapshot.time)}
        </span>
        <button
          type="button"
          className="panel-animation-btn panel-animation-btn-reset"
          onClick={resetShaderDevAnimation}
          aria-label="Reset animation time"
          title="Reset to 0"
        >
          <ResetIcon />
        </button>
      </div>
    </div>
  )
}

function PlayIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 4.98951C5 4.01835 5 3.53277 5.20249 3.2651C5.37889 3.03191 5.64852 2.88761 5.9404 2.87018C6.27544 2.85017 6.67946 3.11953 7.48752 3.65823L18.0031 10.6686C18.6708 11.1137 19.0046 11.3363 19.1209 11.6168C19.2227 11.8621 19.2227 12.1377 19.1209 12.383C19.0046 12.6635 18.6708 12.886 18.0031 13.3312L7.48752 20.3415C6.67946 20.8802 6.27544 21.1496 5.9404 21.1296C5.64852 21.1122 5.37889 20.9679 5.20249 20.7347C5 20.467 5 19.9814 5 19.0103V4.98951Z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 5v14" />
      <path d="M16 5v14" />
    </svg>
  )
}

function StepBackIcon() {
  return <SkipIcon direction="back" />
}

function StepForwardIcon() {
  return <SkipIcon direction="forward" />
}

function SkipIcon({ direction }: { direction: "back" | "forward" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={direction === "back" ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d="M13 16.437C13 17.567 13 18.1321 13.2283 18.4091C13.4266 18.6497 13.7258 18.7841 14.0374 18.7724C14.3961 18.759 14.8184 18.3836 15.663 17.6329L20.6547 13.1958C21.12 12.7822 21.3526 12.5754 21.4383 12.3312C21.5136 12.1168 21.5136 11.8831 21.4383 11.6687C21.3526 11.4245 21.12 11.2177 20.6547 10.8041L15.663 6.36706C14.8184 5.61631 14.3961 5.24093 14.0374 5.22751C13.7258 5.21584 13.4266 5.35021 13.2283 5.59086C13 5.86787 13 6.43288 13 7.56291V16.437Z" />
      <path d="M2 16.437C2 17.567 2 18.1321 2.22827 18.4091C2.42657 18.6497 2.72579 18.7841 3.0374 18.7724C3.39609 18.759 3.81839 18.3836 4.66298 17.6329L9.65466 13.1958C10.12 12.7822 10.3526 12.5754 10.4383 12.3312C10.5136 12.1168 10.5136 11.8831 10.4383 11.6687C10.3526 11.4245 10.12 11.2177 9.65466 10.8041L4.66298 6.36706C3.81839 5.61631 3.39609 5.24093 3.0374 5.22751C2.72579 5.21584 2.42657 5.35021 2.22827 5.59086C2 5.86787 2 6.43288 2 7.56291V16.437Z" />
    </svg>
  )
}

function ResetIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M13 22L10 19M10 19L13 16M10 19H15C18.866 19 22 15.866 22 12C22 9.2076 20.3649 6.7971 18 5.67363M6 18.3264C3.63505 17.2029 2 14.7924 2 12C2 8.13401 5.13401 5 9 5H14M14 5L11 2M14 5L11 8" />
    </svg>
  )
}
