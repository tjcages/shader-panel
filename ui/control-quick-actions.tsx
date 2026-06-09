"use client"

import { useCallback, useState } from "react"
import { cn } from "../lib/cn"
import type { ShaderDevPrompt } from "../_default-prompts"
import { ControlSection } from "./control-section"

export interface ControlQuickActionsProps {
  title?: string
  prompts: ReadonlyArray<ShaderDevPrompt>
  className?: string
  /** Initial open state of the parent section. Defaults to closed. */
  defaultOpen?: boolean
}

export function ControlQuickActions({
  title = "AI prompts",
  prompts,
  className,
  defaultOpen = false,
}: ControlQuickActionsProps) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copy = useCallback((p: ShaderDevPrompt) => {
    void navigator.clipboard.writeText(p.prompt)
    setCopiedId(p.id)
    window.setTimeout(() => {
      setCopiedId((id) => (id === p.id ? null : id))
    }, 1400)
  }, [])

  if (prompts.length === 0) return null

  return (
    <ControlSection
      title={title}
      defaultOpen={defaultOpen}
      className={cn("sd-quick-section", className)}
    >
      {prompts.map((p) => {
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
    <div className="sd-prompt" data-sd-open={isOpen ? "true" : "false"}>
      <button
        type="button"
        className="sd-prompt-toggle"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="sd-prompt-label">{prompt.title}</span>
        <CaretIcon />
      </button>
      <div
        className="sd-collapse"
        data-sd-open={isOpen ? "true" : "false"}
        aria-hidden={!isOpen}
      >
        <div className="sd-collapse-inner">
          <div className="sd-prompt-preview">
            {prompt.description ? (
              <div className="sd-prompt-desc">{prompt.description}</div>
            ) : null}
            <div className="sd-prompt-code-wrap">
              <pre className="sd-prompt-pre">{prompt.prompt}</pre>
              <button
                type="button"
                className="sd-prompt-copy"
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
      className="sd-prompt-caret"
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
