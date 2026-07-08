"use client"

import { useCallback, useMemo, useState } from "react"
import { cn } from "../lib/cn"
import { fillShaderDevPrompt, type ShaderDevPrompt } from "../prompts"
import { ControlSection } from "./section"

export interface ControlQuickActionsProps {
  title?: string
  prompts: ReadonlyArray<ShaderDevPrompt>
  /** Active shader name — substituted for the `{{shader}}` token in prompts. */
  shaderName?: string
  className?: string
  /** Initial open state of the parent section. Defaults to closed. */
  defaultOpen?: boolean
}

export function ControlQuickActions({
  title = "AI prompts",
  prompts,
  shaderName,
  className,
  defaultOpen = false,
}: ControlQuickActionsProps) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Pre-resolve {{shader}} once per prompt so the preview and the clipboard
  // copy are always identical (and editing-free).
  const resolved = useMemo(
    () =>
      prompts.map((p) => ({
        ...p,
        prompt: fillShaderDevPrompt(p.prompt, shaderName),
      })),
    [prompts, shaderName],
  )

  const copy = useCallback((p: ShaderDevPrompt) => {
    void navigator.clipboard.writeText(p.prompt)
    setCopiedId(p.id)
    window.setTimeout(() => {
      setCopiedId((id) => (id === p.id ? null : id))
    }, 1400)
  }, [])

  if (resolved.length === 0) return null

  return (
    <ControlSection
      title={title}
      defaultOpen={defaultOpen}
      className={cn("panel-quick-section", className)}
    >
      {resolved.map((p) => {
        const isOpen = expanded === p.id
        const isCopied = copiedId === p.id
        return (
          <PromptRow
            key={p.id}
            prompt={p}
            isOpen={isOpen}
            isCopied={isCopied}
            onToggle={() => setExpanded(isOpen ? null : p.id)}
            onCopy={() => copy(p)}
          />
        )
      })}
    </ControlSection>
  )
}

function PromptRow({
  prompt,
  isOpen,
  isCopied,
  onToggle,
  onCopy,
}: {
  prompt: ShaderDevPrompt
  isOpen: boolean
  isCopied: boolean
  onToggle: () => void
  onCopy: () => void
}) {
  return (
    <div className="panel-prompt" data-panel-open={isOpen ? "true" : "false"}>
      <button
        type="button"
        className="panel-prompt-toggle"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="panel-prompt-label">{prompt.title}</span>
        <CaretIcon />
      </button>
      <div
        className="panel-collapse"
        data-panel-open={isOpen ? "true" : "false"}
        aria-hidden={!isOpen}
      >
        <div className="panel-collapse-inner">
          <div className="panel-prompt-preview">
            {prompt.description ? (
              <div className="panel-prompt-desc">{prompt.description}</div>
            ) : null}
            <div className="panel-prompt-code-wrap">
              <pre className="panel-prompt-pre">{prompt.prompt}</pre>
              <button
                type="button"
                className="panel-prompt-copy"
                onClick={onCopy}
                aria-label={isCopied ? "Copied" : "Copy prompt"}
                title={isCopied ? "Copied" : "Copy prompt"}
              >
                {isCopied ? <CheckIcon /> : <CopyIcon />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CaretIcon() {
  return (
    <svg
      className="panel-prompt-caret"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function CopyIcon() {
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
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12l5 5 9-12" />
    </svg>
  )
}
