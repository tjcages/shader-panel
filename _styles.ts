/**
 * Self-contained CSS for the shader-dev panel.
 *
 * Themes via CSS custom properties on `[data-shader-dev]`. Consumers override
 * any variable in their own stylesheet to recolor without re-implementing.
 *
 * Class names are all `.sd-*` prefixed so they cannot collide with host app
 * styles even when the panel portals into `document.body`.
 */

export const SHADER_DEV_STYLE_ID = "shader-dev-styles"

export const SHADER_DEV_CSS = `
[data-shader-dev] {
  --sd-bg: rgba(13, 13, 16, 0.95);
  --sd-border: rgba(255, 255, 255, 0.16);
  --sd-text: #ffffff;
  --sd-text-muted: rgba(255, 255, 255, 0.72);
  --sd-surface: rgba(255, 255, 255, 0.05);
  --sd-surface-active: rgba(255, 255, 255, 0.15);
  --sd-surface-idle-fill: rgba(255, 255, 255, 0.11);
  --sd-hash: rgba(255, 255, 255, 0.15);
  --sd-handle: #ffffff;
  --sd-label: rgba(255, 255, 255, 0.7);
  --sd-label-active: #ffffff;
  --sd-divider: rgba(255, 255, 255, 0.06);
  --sd-muted-icon: rgba(255, 255, 255, 0.4);
  --sd-swatch-border: rgba(255, 255, 255, 0.2);
  --sd-kbd-bg: rgba(255, 255, 255, 0.1);
  --sd-action-bg: rgba(255, 255, 255, 0.05);
  --sd-action-bg-hover: rgba(255, 255, 255, 0.1);
  --sd-action-text: rgba(255, 255, 255, 0.72);
  --sd-action-text-hover: #ffffff;
  --sd-header-border: rgba(255, 255, 255, 0.096);
  --sd-close-icon: rgba(255, 255, 255, 0.72);
  --sd-close-icon-hover: #ffffff;
  --sd-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
}

[data-shader-dev][data-sd-theme="light"] {
  --sd-bg: rgba(255, 255, 255, 0.95);
  --sd-border: #d1d5db;
  --sd-text: #111827;
  --sd-text-muted: #4b5563;
  --sd-surface: #f3f4f6;
  --sd-surface-active: #d1d5db;
  --sd-surface-idle-fill: #e5e7eb;
  --sd-hash: #d1d5db;
  --sd-handle: #111827;
  --sd-label: #374151;
  --sd-label-active: #111827;
  --sd-divider: #e5e7eb;
  --sd-muted-icon: #9ca3af;
  --sd-swatch-border: #d1d5db;
  --sd-kbd-bg: #e5e7eb;
  --sd-action-bg: #f3f4f6;
  --sd-action-bg-hover: #e5e7eb;
  --sd-action-text: #374151;
  --sd-action-text-hover: #111827;
  --sd-header-border: #e5e7eb;
  --sd-close-icon: #6b7280;
  --sd-close-icon-hover: #111827;
}

[data-shader-dev],
[data-shader-dev] *,
[data-shader-dev] *::before,
[data-shader-dev] *::after {
  box-sizing: border-box;
}

/* Chrome elements shouldn't be selectable — labels, titles, buttons. Only
   inputs and the prompt code block opt back in via the override below. */
[data-shader-dev] {
  -webkit-user-select: none;
  user-select: none;
}
[data-shader-dev] input,
[data-shader-dev] textarea,
[data-shader-dev] .sd-prompt-pre,
[data-shader-dev] .sd-paste-textarea {
  -webkit-user-select: text;
  user-select: text;
}

[data-shader-dev] button {
  background: transparent;
  border: 0;
  padding: 0;
  margin: 0;
  font-family: inherit;
  /* Intentionally NOT inheriting font-size — leaves component classes free to
     set their own without losing to specificity. */
  color: inherit;
  cursor: pointer;
}

[data-shader-dev] input,
[data-shader-dev] select,
[data-shader-dev] textarea {
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  color: inherit;
}

[data-shader-dev] input.sd-color-text {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
  color: var(--sd-label);
}

.sd-floating {
  pointer-events: auto;
  position: fixed;
  top: 16px;
  bottom: 16px;
  z-index: 9999;
  display: flex;
  width: 280px;
  flex-direction: column;
  transition: transform 300ms ease;
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
.sd-floating[data-sd-side="left"] { left: 16px; }
.sd-floating[data-sd-side="right"] { right: 16px; }
.sd-floating[data-sd-collapsed="true"][data-sd-side="left"] { transform: translateX(calc(-100% - 16px)); }
.sd-floating[data-sd-collapsed="true"][data-sd-side="right"] { transform: translateX(calc(100% + 16px)); }

.sd-panel {
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  border-radius: 14px;
  border: 1px solid var(--sd-border);
  background: var(--sd-bg);
  color: var(--sd-text);
  box-shadow: var(--sd-shadow);
}

.sd-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--sd-header-border);
  padding: 10px 12px 6px 12px;
}
.sd-panel-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;
}
.sd-panel-title {
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sd-switcher {
  appearance: none;
  -webkit-appearance: none;
  border: 1px solid var(--sd-border);
  background: var(--sd-surface);
  color: var(--sd-text);
  border-radius: 6px;
  padding: 2px 22px 2px 8px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
  cursor: pointer;
  background-image: linear-gradient(45deg, transparent 50%, currentColor 50%), linear-gradient(135deg, currentColor 50%, transparent 50%);
  background-position: calc(100% - 11px) 50%, calc(100% - 7px) 50%;
  background-size: 4px 4px, 4px 4px;
  background-repeat: no-repeat;
  max-width: 110px;
  text-overflow: ellipsis;
  overflow: hidden;
}
.sd-switcher:focus { outline: 2px solid var(--sd-handle); outline-offset: 1px; }

.sd-close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  color: var(--sd-close-icon);
  transition: color 150ms ease;
}
.sd-close-btn:hover { color: var(--sd-close-icon-hover); }
.sd-close-btn svg { width: 16px; height: 16px; }

.sd-panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 10px 12px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.sd-panel-body::-webkit-scrollbar { display: none; }

.sd-fields {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 8px;
}

.sd-shortcut-hint {
  font-size: 12px;
  color: var(--sd-text-muted);
}
.sd-shortcut-hint kbd {
  border-radius: 4px;
  padding: 0 4px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  background: var(--sd-kbd-bg);
}

.sd-actions {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-top: 1px solid var(--sd-divider);
  padding-top: 12px;
}

/* Scoped under [data-shader-dev] to beat the global button reset on
   specificity — otherwise the always-on light gray fill loses. */
[data-shader-dev] .sd-action-btn {
  width: 100%;
  height: 36px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
  background: var(--sd-action-bg);
  color: var(--sd-action-text);
  transition: background-color 150ms ease, color 150ms ease;
}
[data-shader-dev] .sd-action-btn:hover {
  background: var(--sd-action-bg-hover);
  color: var(--sd-action-text-hover);
}
[data-shader-dev] .sd-action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.sd-status {
  padding: 0 4px;
  font-size: 12px;
  color: var(--sd-text-muted);
}

/* Auto-height animation via CSS Grid: parent transitions
   grid-template-rows between 0fr and 1fr, child clips overflow. */
.sd-collapse {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 280ms cubic-bezier(0.32, 0.72, 0, 1);
}
.sd-collapse[data-sd-open="true"] {
  grid-template-rows: 1fr;
}
.sd-collapse-inner {
  overflow: hidden;
  min-height: 0;
  opacity: 0;
  transition: opacity 200ms ease;
}
.sd-collapse[data-sd-open="true"] > .sd-collapse-inner {
  opacity: 1;
  transition: opacity 200ms ease 80ms;
}

.sd-saved-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 4px 4px 2px;
  font-size: 11px;
  font-weight: 500;
  color: var(--sd-text-muted);
}
.sd-saved-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #22c55e;
  box-shadow: 0 0 0 2px color-mix(in srgb, #22c55e 20%, transparent);
  flex-shrink: 0;
}

.sd-paste {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 4px 0;
}
.sd-paste-textarea {
  width: 100%;
  min-height: 96px;
  resize: vertical;
  padding: 8px 10px;
  border-radius: 8px;
  background: var(--sd-bg);
  color: var(--sd-text);
  border: 1px solid var(--sd-border);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 11px;
  line-height: 1.5;
  outline: none;
  transition: border-color 150ms ease;
}
.sd-paste-textarea:focus {
  border-color: var(--sd-handle);
}
.sd-paste-error {
  padding: 0 4px;
  font-size: 11px;
  color: #ef4444;
}

.sd-empty {
  pointer-events: auto;
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 9998;
  max-width: 280px;
  border-radius: 8px;
  border: 1px solid var(--sd-border);
  background: var(--sd-bg);
  color: var(--sd-text-muted);
  padding: 12px;
  font-size: 13px;
  box-shadow: var(--sd-shadow);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
.sd-empty-close {
  margin-top: 8px;
  display: block;
  width: 100%;
  border-radius: 8px;
  padding: 8px 12px;
  background: var(--sd-action-bg);
  color: var(--sd-text);
  font-size: 13px;
}
.sd-empty-close:hover { background: var(--sd-action-bg-hover); }

.sd-section {
  border-top: 1px solid var(--sd-divider);
}
.sd-section:first-child { border-top: 0; }
.sd-section-header {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 4px;
  padding: 12px 0 8px;
}
.sd-section:first-child .sd-section-header { padding-top: 2px; }
.sd-section-button {
  display: flex;
  flex: 1;
  min-width: 0;
  align-items: center;
  height: 20px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--sd-text-muted);
  text-align: left;
}
.sd-section-button:hover { color: var(--sd-label-active); }
.sd-section-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sd-section-caret-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  color: var(--sd-muted-icon);
  flex-shrink: 0;
  transition: color 150ms ease, background-color 150ms ease;
}
.sd-section-caret-btn:hover { color: var(--sd-label-active); background: var(--sd-surface); }
.sd-section-caret {
  width: 12px;
  height: 12px;
  transition: transform 200ms ease;
}
.sd-section[data-sd-open="true"] .sd-section-caret { transform: rotate(180deg); }
.sd-section-reset {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  color: var(--sd-muted-icon);
  opacity: 0;
  transition: opacity 150ms ease, color 150ms ease, background-color 150ms ease;
  flex-shrink: 0;
}
.sd-section-reset svg { width: 12px; height: 12px; }
.sd-section-header:hover .sd-section-reset,
.sd-section-reset:focus-visible { opacity: 1; }
.sd-section-reset:hover {
  color: var(--sd-label-active);
  background: var(--sd-surface);
}
.sd-section-children {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-bottom: 10px;
}

.sd-slider {
  position: relative;
  height: 36px;
  transition: transform 220ms cubic-bezier(0.34, 1.16, 0.64, 1);
}
.sd-slider[data-sd-state="hover"] { transform: scale(1.01); }
.sd-slider[data-sd-state="drag"] { transform: scale(1.018); }

.sd-slider-overscroll {
  position: absolute;
  inset: 0;
  transform: scaleX(var(--sd-os-scale, 1));
  transform-origin: var(--sd-os-origin, 50% 50%);
}
.sd-slider-overscroll[data-sd-release="true"] {
  transition: transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.sd-slider-track {
  position: absolute;
  inset: 0;
  cursor: pointer;
  user-select: none;
  overflow: hidden;
  touch-action: none;
  border-radius: 8px;
  background: var(--sd-surface);
}

.sd-slider-hash-row {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.sd-slider-hash {
  position: absolute;
  top: 50%;
  height: 8px;
  width: 1px;
  transform: translateY(-50%);
  border-radius: 999px;
  background: transparent;
  transition: background-color 200ms ease;
}
.sd-slider[data-sd-state="hover"] .sd-slider-hash,
.sd-slider[data-sd-state="drag"] .sd-slider-hash { background: var(--sd-hash); }

.sd-slider-fill {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: var(--sd-fill-pct, 0%);
  pointer-events: none;
  background: var(--sd-surface-idle-fill);
  transition: background-color 150ms ease, width 220ms cubic-bezier(0.2, 0, 0, 1);
}
.sd-slider[data-sd-state="drag"] .sd-slider-fill {
  transition: background-color 150ms ease, width 0ms;
  background: var(--sd-surface-active);
}
.sd-slider[data-sd-state="hover"] .sd-slider-fill { background: var(--sd-surface-active); }

.sd-slider-handle {
  position: absolute;
  top: 50%;
  height: 20px;
  width: 3px;
  left: var(--sd-handle-left, 0%);
  border-radius: 999px;
  pointer-events: none;
  background: var(--sd-handle);
  opacity: 0;
  transform: translate(-1.5px, -50%) scaleY(1);
  transform-origin: center center;
  transition:
    opacity 200ms cubic-bezier(0.32, 0.72, 0, 1),
    transform 200ms cubic-bezier(0.32, 0.72, 0, 1),
    left 220ms cubic-bezier(0.2, 0, 0, 1);
}
.sd-slider[data-sd-state="hover"] .sd-slider-handle { opacity: 0.5; }
.sd-slider[data-sd-state="drag"] .sd-slider-handle {
  opacity: 0.9;
  transform: translate(-1.5px, -50%) scaleY(1.3);
  transition:
    opacity 200ms cubic-bezier(0.32, 0.72, 0, 1),
    transform 200ms cubic-bezier(0.32, 0.72, 0, 1),
    left 0ms;
}

.sd-slider-label {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 13px;
  font-weight: 500;
  color: var(--sd-label);
}
.sd-slider-value {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13px;
  font-weight: 500;
  color: var(--sd-label);
  transition: color 150ms ease;
}
.sd-slider[data-sd-state="hover"] .sd-slider-value,
.sd-slider[data-sd-state="drag"] .sd-slider-value { color: var(--sd-label-active); }

.sd-color {
  display: flex;
  height: 36px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-radius: 8px;
  padding: 0 12px;
  background: var(--sd-surface);
}
.sd-color-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--sd-label);
}
.sd-color-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
.sd-color-text {
  width: 7ch;
  background: transparent;
  border: 0;
  outline: 0;
  text-align: right;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13px;
  font-weight: 500;
  color: var(--sd-label);
  text-transform: uppercase;
}
.sd-color-swatch {
  height: 20px;
  width: 20px;
  flex-shrink: 0;
  border-radius: 4px;
  border: 1px solid var(--sd-swatch-border);
  transition: transform 150ms ease;
}
.sd-color-swatch:hover { transform: scale(1.1); }
.sd-color-native {
  position: absolute;
  height: 0;
  width: 0;
  opacity: 0;
  pointer-events: none;
}

.sd-toggle {
  display: flex;
  height: 36px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  padding: 0 12px;
  background: var(--sd-surface);
  transition: background-color 150ms ease;
}
.sd-toggle:hover { background: var(--sd-surface-active); }
.sd-toggle-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--sd-label);
}
.sd-toggle-track {
  position: relative;
  width: 28px;
  height: 16px;
  border-radius: 999px;
  background: var(--sd-surface-idle-fill);
  transition: background-color 200ms cubic-bezier(0.32, 0.72, 0, 1);
  flex-shrink: 0;
}
.sd-toggle[data-sd-on="true"] .sd-toggle-track {
  background: var(--sd-handle);
}
.sd-toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: var(--sd-bg);
  transition: transform 220ms cubic-bezier(0.34, 1.16, 0.64, 1);
}
.sd-toggle[data-sd-on="false"] .sd-toggle-thumb {
  background: var(--sd-handle);
}
.sd-toggle[data-sd-on="true"] .sd-toggle-thumb {
  transform: translateX(12px);
}

.sd-select {
  display: flex;
  height: 36px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-radius: 8px;
  padding: 0 4px 0 12px;
  background: var(--sd-surface);
}
.sd-select-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--sd-label);
}
.sd-select-input {
  appearance: none;
  -webkit-appearance: none;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--sd-label);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
  cursor: pointer;
  padding: 4px 18px 4px 6px;
  background-image: linear-gradient(45deg, transparent 50%, currentColor 50%), linear-gradient(135deg, currentColor 50%, transparent 50%);
  background-position: calc(100% - 7px) 50%, calc(100% - 3px) 50%;
  background-size: 4px 4px, 4px 4px;
  background-repeat: no-repeat;
  text-align: right;
  text-align-last: right;
  border-radius: 6px;
}
.sd-select-input:hover { color: var(--sd-label-active); }
.sd-select-input:focus { color: var(--sd-label-active); outline: 2px solid var(--sd-handle); outline-offset: 1px; }
[data-shader-dev] select.sd-select-input { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 13px; }

.sd-prompt {
  display: flex;
  flex-direction: column;
}
/* Bumped under [data-shader-dev] so it ties the button reset on specificity
   and wins on source order — the reset sets padding: 0 globally. */
[data-shader-dev] .sd-prompt-toggle {
  display: flex;
  height: 36px;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 12px;
  border-radius: 8px;
  background: var(--sd-surface);
  color: var(--sd-label);
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  transition: color 150ms ease;
}
[data-shader-dev] .sd-prompt-toggle:hover,
.sd-prompt[data-sd-open="true"] .sd-prompt-toggle {
  color: var(--sd-label-active);
}
.sd-prompt-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}
.sd-prompt-caret {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  color: var(--sd-muted-icon);
  transition: transform 200ms ease;
}
.sd-prompt[data-sd-open="true"] .sd-prompt-caret { transform: rotate(180deg); }

.sd-prompt-preview {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 6px 0 2px;
}
.sd-prompt-desc {
  font-size: 11px;
  color: var(--sd-text-muted);
  line-height: 1.4;
  padding: 0 4px;
}
.sd-prompt-code-wrap {
  position: relative;
}
.sd-prompt-pre {
  margin: 0;
  padding: 10px 12px 22px;
  background: var(--sd-bg);
  color: var(--sd-text);
  border: 1px solid var(--sd-border);
  border-radius: 8px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 11px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 140px;
  overflow-y: auto;
  scrollbar-width: thin;
  -webkit-mask-image: linear-gradient(to bottom, black calc(100% - 22px), transparent);
  mask-image: linear-gradient(to bottom, black calc(100% - 22px), transparent);
}
.sd-prompt-pre::-webkit-scrollbar { width: 6px; }
.sd-prompt-pre::-webkit-scrollbar-thumb { background: var(--sd-surface-active); border-radius: 999px; }
.sd-prompt-copy {
  position: absolute;
  bottom: 6px;
  right: 6px;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--sd-bg);
  color: var(--sd-label);
  border: 1px solid var(--sd-border);
  transition: background-color 150ms ease, color 150ms ease, transform 200ms cubic-bezier(0.34, 1.16, 0.64, 1);
}
.sd-prompt-copy svg { width: 14px; height: 14px; }
.sd-prompt-copy:hover {
  background: var(--sd-surface);
  color: var(--sd-label-active);
  transform: scale(1.05);
}

.sd-vec2 {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.sd-vec2-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--sd-label);
  padding: 0 12px;
}
.sd-vec2-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}
`
