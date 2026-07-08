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
  --sd-toggle-hover: var(--sd-surface-active);
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
  --sd-danger: #f87171;
  --sd-danger-hover: #fca5a5;
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
  --sd-toggle-hover: rgba(17, 24, 39, 0.04);
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
  --sd-danger: #dc2626;
  --sd-danger-hover: #b91c1c;
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
[data-shader-dev] .sd-paste-textarea,
[data-shader-dev] .sd-text-input,
[data-shader-dev] .sd-textarea-input,
[data-shader-dev] .sd-search-input {
  -webkit-user-select: text;
  user-select: text;
}

[data-shader-dev] button:not([class]) {
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

/* All panel chrome buttons carry sd-* classes — zero host-app borders
   (Tailwind preflight, browser defaults, etc.) before component styles apply. */
[data-shader-dev] button[class*="sd-"] {
  border: 0;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  box-shadow: none;
}

[data-shader-dev] input,
[data-shader-dev] select,
[data-shader-dev] textarea {
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  color: inherit;
  border: 0;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  box-shadow: none;
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
  opacity: 1;
  filter: blur(0);
  transition-property: transform, opacity, filter;
  transition-duration: 280ms, 200ms, 200ms;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1), ease-in, ease-in;
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
}
.sd-floating[data-sd-side="left"] { left: 16px; }
.sd-floating[data-sd-side="right"] { right: 16px; }
.sd-floating[data-sd-collapsed="true"][data-sd-side="left"] { transform: translateX(calc(-100% - 16px)); }
.sd-floating[data-sd-collapsed="true"][data-sd-side="right"] { transform: translateX(calc(100% + 16px)); }
.sd-floating[data-sd-collapsed="true"]:not([data-sd-peek="true"]) {
  opacity: 0;
  filter: blur(4px);
  pointer-events: none;
}

/* Peek preview — a scaled-down sliver slides in when the viewport edge is
   hovered while collapsed. Overrides the fully-hidden collapsed transform. */
.sd-floating[data-sd-collapsed="true"][data-sd-peek="true"] { cursor: pointer; }
.sd-floating[data-sd-collapsed="true"][data-sd-peek="true"][data-sd-side="right"] {
  transform: translateX(calc(100% - 56px)) scale(0.9);
  transform-origin: right center;
  opacity: 1;
  filter: blur(0);
  pointer-events: auto;
}
.sd-floating[data-sd-collapsed="true"][data-sd-peek="true"][data-sd-side="left"] {
  transform: translateX(calc(-100% + 56px)) scale(0.9);
  transform-origin: left center;
  opacity: 1;
  filter: blur(0);
  pointer-events: auto;
}
@media (prefers-reduced-motion: reduce) {
  .sd-floating { transition: none; }
  .sd-floating[data-sd-collapsed="true"]:not([data-sd-peek="true"]) {
    opacity: 0;
    filter: none;
  }
  .sd-panel,
  .sd-floating[data-sd-collapsed="true"]:not([data-sd-peek="true"]) .sd-panel {
    transition: none;
    opacity: 1;
    transform: none;
  }
}

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
  opacity: 1;
  transform: translateY(0) scale(1);
  transition-property: opacity, transform;
  transition-duration: 220ms;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}
.sd-floating[data-sd-collapsed="true"]:not([data-sd-peek="true"]) .sd-panel {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
  transition-timing-function: ease-in;
  transition-duration: 180ms;
}

/* Invisible hover/click strip pinned to the viewport edge — reveals the peek
   (and reopens on click) while the panel is collapsed. */
.sd-edge-sensor {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 24px;
  z-index: 9998;
  cursor: pointer;
}
.sd-edge-sensor[data-sd-side="right"] { right: 0; }
.sd-edge-sensor[data-sd-side="left"] { left: 0; }
.sd-edge-sensor[data-sd-inline="true"] { display: none; }

/* Inline panels (ToolShell) use absolute positioning within the overlay. */
.sd-floating[data-sd-inline="true"] {
  position: absolute;
  z-index: 20;
}

/* Transparent click-catcher over the peeking panel — any click opens it fully
   instead of hitting a control in the scaled-down preview. */
.sd-peek-catch {
  position: absolute;
  inset: 0;
  z-index: 3;
  border-radius: 14px;
  background: transparent;
  cursor: pointer;
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
.sd-panel-header-end {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 4px;
}
.sd-theme-toggle {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 2px;
  border-radius: 8px;
  background: var(--sd-surface);
}
[data-shader-dev] .sd-theme-toggle-btn {
  display: inline-flex;
  width: 26px;
  height: 26px;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: var(--sd-text-muted);
  transition: background-color 150ms ease, color 150ms ease;
}
[data-shader-dev] .sd-theme-toggle-btn svg {
  width: 14px;
  height: 14px;
}
[data-shader-dev] .sd-theme-toggle-btn:hover {
  color: var(--sd-action-text-hover);
}
[data-shader-dev] .sd-theme-toggle-btn[data-sd-active="true"] {
  background: var(--sd-surface-active);
  color: var(--sd-label-active);
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
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  color: var(--sd-close-icon);
  transition-property: color, scale;
  transition-duration: 150ms;
  transition-timing-function: ease-out;
}
.sd-close-btn::before {
  content: "";
  position: absolute;
  inset: -10px;
}
.sd-close-btn:active {
  scale: 0.96;
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

/* Animation transport — pinned at the top of the panel body. */
.sd-animation {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-bottom: 10px;
  margin-bottom: 2px;
  border-bottom: 1px solid var(--sd-divider);
}
.sd-animation-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--sd-text-muted);
  padding: 0 2px;
}
.sd-animation-row {
  display: flex;
  align-items: center;
  gap: 4px;
}
[data-shader-dev] .sd-animation-btn {
  flex: 0 0 auto;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--sd-action-text);
  background: var(--sd-action-bg);
  transition: background-color 150ms ease, color 150ms ease;
}
[data-shader-dev] .sd-animation-btn svg {
  width: 14px;
  height: 14px;
}
[data-shader-dev] .sd-animation-btn:hover {
  background: var(--sd-action-bg-hover);
  color: var(--sd-action-text-hover);
}
[data-shader-dev] .sd-animation-btn-primary {
  width: 36px;
  background: var(--sd-surface-active);
  color: var(--sd-label-active);
}
[data-shader-dev] .sd-animation-btn-primary:hover {
  background: var(--sd-handle);
  color: #ffffff;
}
[data-shader-dev] .sd-animation-btn-reset {
  margin-left: auto;
}
.sd-animation-time {
  flex: 1;
  min-width: 0;
  padding: 0 6px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  color: var(--sd-text-muted);
  text-align: center;
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

.sd-export-format-row {
  display: flex;
  gap: 6px;
}
.sd-export-format-row .sd-action-btn {
  flex: 1;
  min-width: 0;
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
  transition-property: background-color, color, scale;
  transition-duration: 150ms;
  transition-timing-function: ease-out;
}
[data-shader-dev] .sd-action-btn:active:not(:disabled) {
  scale: 0.96;
}
[data-shader-dev] .sd-action-btn:hover:not(.sd-action-btn-primary):not(:disabled) {
  background: var(--sd-action-bg-hover);
  color: var(--sd-action-text-hover);
}
[data-shader-dev] .sd-action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
[data-shader-dev] .sd-action-btn-primary {
  background: var(--sd-handle);
  color: var(--sd-bg);
  border-color: transparent;
}
[data-shader-dev] .sd-action-btn-primary:hover:not(:disabled) {
  background: var(--sd-handle);
  filter: brightness(1.08);
  color: var(--sd-bg);
}
[data-shader-dev] .sd-action-btn-destructive {
  background: color-mix(in srgb, var(--sd-danger) 10%, var(--sd-action-bg));
  color: var(--sd-danger);
}
[data-shader-dev] .sd-action-btn-destructive:hover:not(:disabled) {
  background: color-mix(in srgb, var(--sd-danger) 16%, var(--sd-action-bg-hover));
  color: var(--sd-danger-hover);
}

.sd-action-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}
.sd-action-group .sd-action-field {
  min-width: 0;
}
.sd-action-group .sd-action-btn {
  width: 100%;
  padding-left: 8px;
  padding-right: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sd-action-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sd-status {
  padding: 0 4px;
  font-size: 12px;
  color: var(--sd-text-muted);
}

/* Export group — pinned at the top of the actions block, separated from the
   JSON/reset buttons by a hairline divider. */
.sd-export {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-bottom: 12px;
  margin-bottom: 4px;
  border-bottom: 1px solid var(--sd-divider);
}
.sd-export-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--sd-text-muted);
  padding: 0 2px;
}
.sd-export-row {
  display: flex;
  gap: 6px;
}
.sd-export-row .sd-action-btn {
  flex: 1;
}
.sd-export-hint {
  font-size: 11px;
  line-height: 1.35;
  color: var(--sd-text-muted);
  padding: 0 2px;
}

/* Segmented resolution selector for the hi-res PNG. */
.sd-export-res {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 3px;
  border-radius: 8px;
  background: var(--sd-surface);
}
[data-shader-dev] .sd-export-res-btn {
  flex: 1 1 calc(25% - 4px);
  min-width: 2.75rem;
  height: 26px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  color: var(--sd-text-muted);
  transition: background-color 150ms ease, color 150ms ease;
}
[data-shader-dev] .sd-export-res-btn:hover {
  color: var(--sd-action-text-hover);
}
[data-shader-dev] .sd-export-res-active,
[data-shader-dev] .sd-export-res-active:hover {
  background: var(--sd-surface-active);
  color: var(--sd-label-active);
}
[data-shader-dev] .sd-export-rec,
[data-shader-dev] .sd-export-rec:hover {
  background: #e5484d;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.sd-export-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #ffffff;
  animation: sd-export-pulse 1s ease-in-out infinite;
}
@keyframes sd-export-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.25; }
}
@media (prefers-reduced-motion: reduce) {
  .sd-export-dot { animation: none; }
}

/* Auto-height animation via CSS Grid: parent transitions
   grid-template-rows between 0fr and 1fr, child clips overflow. */
.sd-collapse {
  display: grid;
  grid-template-rows: 0fr;
  overflow: hidden;
  transition: grid-template-rows 280ms cubic-bezier(0.32, 0.72, 0, 1);
}
.sd-collapse[data-sd-open="true"] {
  grid-template-rows: 1fr;
  overflow: visible;
}
.sd-collapse-inner {
  /* Vertical clipping only — height animation still collapses, but horizontal
     overshoot (slider overscroll spring, toggle row full-bleed hover) is not
     cropped. inset(-16px 0) regressed toggle hovers (white side gutters). */
  clip-path: inset(0 -9999px);
  min-height: 0;
  min-width: 0;
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
/* Scoped under [data-shader-dev] to beat the global textarea reset on
   specificity — otherwise the explicit small font-size loses. */
[data-shader-dev] .sd-paste-textarea {
  width: 100%;
  min-height: 96px;
  resize: vertical;
  padding: 8px 10px;
  border-radius: 8px;
  background: var(--sd-bg);
  color: var(--sd-text);
  border: 1px solid var(--sd-border);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 10px;
  line-height: 1.5;
  outline: none;
  transition: border-color 150ms ease;
}
[data-shader-dev] .sd-paste-textarea:focus {
  border-color: var(--sd-handle);
}
[data-shader-dev] .sd-paste-textarea::placeholder {
  color: var(--sd-muted-icon);
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
  overflow: visible;
}

.sd-field {
  min-width: 0;
  overflow: visible;
}

.sd-field-description {
  font-size: 10.5px;
  line-height: 1.35;
  color: var(--sd-label-muted);
  padding: 4px 4px 2px;
  letter-spacing: 0.01em;
}

[data-shader-dev] .sd-slider {
  position: relative;
  height: 36px;
  width: 100%;
  margin: 0;
  overflow: visible;
  transition: transform 220ms cubic-bezier(0.34, 1.16, 0.64, 1);
}
[data-shader-dev] .sd-slider[data-sd-state="hover"] { transform: scale(1.01); }
[data-shader-dev] .sd-slider[data-sd-state="drag"] { transform: scale(1.018); }

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
  position: relative;
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
/* Sized + positioned over the swatch (not 0x0) so showPicker()/click() has a
   real anchor rect — pickers anchor to the input's position. */
.sd-color-native {
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -10px;
  height: 20px;
  width: 20px;
  opacity: 0;
  pointer-events: none;
}

.sd-path {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.sd-path-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.sd-path-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--sd-label);
}
.sd-path-head-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.sd-path-count {
  font-size: 11px;
  color: var(--sd-muted-icon);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
[data-shader-dev] .sd-path-clear {
  font-size: 11px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid var(--sd-border);
  background: var(--sd-action-bg);
  color: var(--sd-action-text);
  cursor: pointer;
  transition: background-color 150ms cubic-bezier(0.22, 1, 0.36, 1);
}
[data-shader-dev] .sd-path-clear:hover {
  background: var(--sd-action-bg-hover);
  color: var(--sd-action-text-hover);
}
.sd-path-pad {
  display: block;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  border: 1px solid var(--sd-border);
  background: var(--sd-surface);
  touch-action: none;
  cursor: crosshair;
  overflow: visible;
}
.sd-path-bg {
  fill: transparent;
  cursor: crosshair;
}
.sd-path-grid {
  stroke: var(--sd-divider);
  stroke-width: 0.5;
}
.sd-path-frame {
  fill: none;
  stroke: var(--sd-border);
  stroke-width: 0.5;
}
.sd-path-line {
  fill: none;
  stroke: var(--sd-handle);
  stroke-width: 1;
  stroke-linejoin: round;
  stroke-linecap: round;
  opacity: 0.55;
}
.sd-path-line-close {
  stroke: var(--sd-handle);
  stroke-width: 0.8;
  stroke-dasharray: 2 2;
  opacity: 0.3;
}
.sd-path-anchor circle {
  fill: none;
  stroke: var(--sd-handle);
  stroke-width: 1;
  opacity: 0.7;
}
.sd-path-anchor.is-draggable {
  cursor: grab;
}
.sd-path-anchor.is-draggable .sd-path-point-hit {
  cursor: grab;
}
.sd-path-anchor.is-draggable:active {
  cursor: grabbing;
}
.sd-path-anchor.is-selected circle:not(.sd-path-point-hit) {
  stroke-width: 1.4;
  opacity: 1;
}
.sd-path-anchor .sd-path-anchor-dot {
  fill: var(--sd-handle);
  stroke: none;
  opacity: 0.9;
}
.sd-path-point {
  cursor: grab;
}
.sd-path-point:active {
  cursor: grabbing;
}
.sd-path-point-hit {
  fill: transparent;
}
.sd-path-point-ring {
  fill: var(--sd-bg);
  stroke: var(--sd-handle);
  stroke-width: 1.2;
  transition: r 120ms cubic-bezier(0.22, 1, 0.36, 1);
}
.sd-path-point.is-selected .sd-path-point-ring {
  fill: var(--sd-handle);
}
.sd-path-point-num {
  fill: var(--sd-label);
  font-size: 3.4px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  text-anchor: middle;
  pointer-events: none;
  user-select: none;
}
.sd-path-point.is-selected .sd-path-point-num {
  fill: var(--sd-bg);
}
.sd-path-selected {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 11px;
  color: var(--sd-text-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
[data-shader-dev] .sd-path-remove {
  font-size: 11px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid var(--sd-border);
  background: var(--sd-action-bg);
  color: var(--sd-action-text);
  cursor: pointer;
  transition: background-color 150ms cubic-bezier(0.22, 1, 0.36, 1);
}
[data-shader-dev] .sd-path-remove:hover {
  background: var(--sd-action-bg-hover);
  color: var(--sd-action-text-hover);
}
.sd-path-hint {
  font-size: 10.5px;
  color: var(--sd-muted-icon);
  text-align: center;
}

.sd-image {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.sd-image-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.sd-image-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--sd-label);
}
.sd-image-upload {
  font-size: 11px;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 6px;
  border: 1px solid var(--sd-border);
  background: var(--sd-action-bg);
  color: var(--sd-action-text);
  cursor: pointer;
  transition: background-color 150ms ease, color 150ms ease;
}
.sd-image-upload:hover {
  background: var(--sd-action-bg-hover);
  color: var(--sd-action-text-hover);
}
.sd-image-frame {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 48px;
  border-radius: 8px;
  border: 1px solid var(--sd-border);
  background: var(--sd-surface);
  overflow: hidden;
  transition: border-color 150ms ease, background-color 150ms ease;
}
.sd-image-frame[data-sd-interactive="true"] { cursor: pointer; }
.sd-image-frame[data-sd-interactive="true"]:hover,
.sd-image-frame[data-sd-drag="true"] {
  border-color: var(--sd-handle);
  background: var(--sd-surface-active);
}
.sd-image-preview {
  display: block;
  width: 75%;
  height: auto;
  border-radius: 4px;
}
.sd-image-empty {
  font-size: 11px;
  color: var(--sd-muted-icon);
  padding: 14px 0;
}
.sd-image-native {
  position: absolute;
  height: 0;
  width: 0;
  opacity: 0;
  pointer-events: none;
}

/* Scoped under [data-shader-dev] so it beats the global button reset
   (which zeroes padding/background). The negative margin + matching padding
   full-bleeds the hover highlight ~8px past the label on each side, so the
   label stays aligned with the other rows but the highlight never touches its
   left edge. */
[data-shader-dev] .sd-toggle {
  display: flex;
  height: 36px;
  width: calc(100% + 16px);
  margin: 0 -8px;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  padding: 0 8px;
  background: transparent;
  transition: background-color 150ms cubic-bezier(0.22, 1, 0.36, 1);
}
[data-shader-dev] .sd-toggle:hover { background: var(--sd-toggle-hover); }
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
  min-height: 36px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-radius: 8px;
  padding: 0 4px 0 12px;
  background: var(--sd-surface);
}
.sd-select[data-sd-layout="stacked"] {
  flex-direction: column;
  align-items: stretch;
  gap: 6px;
  padding: 8px 12px;
}
.sd-select-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--sd-label);
  min-width: 0;
}
.sd-select[data-sd-layout="stacked"] .sd-select-label {
  white-space: normal;
  line-height: 1.35;
}
.sd-select[data-sd-layout="inline"] .sd-select-label {
  flex: 1 1 auto;
  white-space: normal;
  line-height: 1.35;
}
[data-shader-dev] .sd-select-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  max-width: 168px;
  flex-shrink: 0;
  border: 0;
  outline: 0;
  background: var(--sd-bg);
  color: var(--sd-label);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 11.5px;
  font-weight: 500;
  line-height: 1;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 6px;
  transition: color 150ms cubic-bezier(0.22, 1, 0.36, 1),
    background-color 150ms cubic-bezier(0.22, 1, 0.36, 1);
}
.sd-select[data-sd-layout="stacked"] .sd-select-btn {
  align-self: stretch;
  max-width: none;
  justify-content: space-between;
}
.sd-select[data-sd-layout="inline"] .sd-select-btn {
  align-self: center;
}
/* Selected value stays on a single line — truncate rather than wrap. */
.sd-select-value {
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
[data-shader-dev] .sd-select-btn:hover {
  color: var(--sd-label-active);
  background: var(--sd-surface-active);
}
[data-shader-dev] .sd-select-btn:focus-visible {
  color: var(--sd-label-active);
  outline: 2px solid var(--sd-handle);
  outline-offset: 1px;
}
[data-shader-dev] .sd-select-btn:active { transform: scale(0.98); }
.sd-select-chevron {
  width: 12px;
  height: 12px;
  opacity: 0.6;
  flex-shrink: 0;
}
.sd-select-layer {
  position: fixed;
  inset: 0;
  z-index: 10000;
  pointer-events: none;
}
.sd-select-menu {
  pointer-events: auto;
  overflow-y: auto;
  padding: 4px;
  border-radius: 10px;
  border: 1px solid var(--sd-border);
  background: var(--sd-bg);
  box-shadow: 0 12px 32px -8px rgba(0, 0, 0, 0.45), 0 2px 8px rgba(0, 0, 0, 0.2);
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
  animation: sd-menu-in 160ms cubic-bezier(0.22, 1, 0.36, 1);
}
.sd-select-menu[data-sd-up="true"] {
  animation-name: sd-menu-in-up;
}
@keyframes sd-menu-in {
  from {
    opacity: 0;
    transform: translate(-100%, 0) translateY(-4px);
    filter: blur(2px);
  }
  to {
    opacity: 1;
    transform: translate(-100%, 0) translateY(0);
    filter: blur(0);
  }
}
@keyframes sd-menu-in-up {
  from {
    opacity: 0;
    transform: translate(-100%, -100%) translateY(4px);
    filter: blur(2px);
  }
  to {
    opacity: 1;
    transform: translate(-100%, -100%) translateY(0);
    filter: blur(0);
  }
}
@media (prefers-reduced-motion: reduce) {
  .sd-select-menu { animation: none; }
}
[data-shader-dev] .sd-select-option {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border: 0;
  background: transparent;
  color: var(--sd-label);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 11.5px;
  font-weight: 500;
  text-align: left;
  white-space: nowrap;
  padding: 7px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 120ms cubic-bezier(0.22, 1, 0.36, 1),
    color 120ms cubic-bezier(0.22, 1, 0.36, 1);
}
[data-shader-dev] .sd-select-option[data-sd-active="true"] {
  background: var(--sd-surface-active);
  color: var(--sd-label-active);
}
[data-shader-dev] .sd-select-option[aria-selected="true"] {
  color: var(--sd-text);
}
.sd-select-check {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
  opacity: 0.9;
}

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
/* Scoped under [data-shader-dev] to beat the global button reset
   (background: transparent) on specificity — otherwise the button is
   transparent and the prompt text shows through behind the icon. The text
   field (--sd-bg) is ~95% opaque, so stack two copies → ~99.8% opaque, same hue. */
[data-shader-dev] .sd-prompt-copy {
  position: absolute;
  bottom: 6px;
  right: 6px;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    linear-gradient(var(--sd-bg), var(--sd-bg)),
    linear-gradient(var(--sd-bg), var(--sd-bg));
  color: var(--sd-label);
  border: 1px solid var(--sd-border);
  transition: color 150ms ease, transform 200ms cubic-bezier(0.34, 1.16, 0.64, 1);
}
.sd-prompt-copy svg { width: 14px; height: 14px; }
[data-shader-dev] .sd-prompt-copy:hover {
  /* Subtle surface tint over the opaque base. */
  background:
    linear-gradient(var(--sd-surface), var(--sd-surface)),
    linear-gradient(var(--sd-bg), var(--sd-bg)),
    linear-gradient(var(--sd-bg), var(--sd-bg));
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

/* ── Preset selector ──────────────────────────────────────────────────────── */
.sd-presets {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0 12px 2px;
}
.sd-presets-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--sd-label);
}
[data-shader-dev] .sd-preset-select {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  height: 36px;
  border: 1px solid var(--sd-border);
  border-radius: 8px;
  padding: 0 28px 0 12px;
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
  color: var(--sd-label);
  background:
    linear-gradient(45deg, transparent 50%, var(--sd-muted-icon) 50%),
    linear-gradient(135deg, var(--sd-muted-icon) 50%, transparent 50%),
    var(--sd-surface);
  background-position: calc(100% - 14px) 50%, calc(100% - 10px) 50%, 0 0;
  background-size: 4px 4px, 4px 4px, auto;
  background-repeat: no-repeat;
  cursor: pointer;
  transition: background-color 150ms ease, color 150ms ease, border-color 150ms ease;
}
[data-shader-dev] .sd-preset-select:hover {
  color: var(--sd-label-active);
  background-color: var(--sd-surface-active);
}
[data-shader-dev] .sd-preset-select:focus-visible {
  outline: 2px solid var(--sd-handle);
  outline-offset: 1px;
}

/* ── ToolShell layout ───────────────────────────────────────────────────── */
.sd-tool-shell {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.sd-tool-viewport {
  position: absolute;
  inset: 0;
  z-index: 0;
}
.sd-tool-overlay {
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 20;
  transition: opacity 500ms ease;
}
.sd-tool-overlay[data-sd-ui-visible="false"] {
  opacity: 0;
}
.sd-tool-topbar {
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  padding-bottom: 16px;
  transition: padding 300ms ease;
}
.sd-tool-topbar > * {
  pointer-events: auto;
}
.sd-tool-panels {
  pointer-events: none;
  position: absolute;
  inset: 0;
}

.sd-panel-toggle {
  pointer-events: auto;
  position: absolute;
  bottom: 20px;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid var(--sd-border);
  background: var(--sd-bg);
  color: var(--sd-text-muted);
  box-shadow: var(--sd-shadow);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: left 300ms ease, right 300ms ease, background 150ms ease, color 150ms ease;
}
.sd-panel-toggle:hover {
  background: var(--sd-surface);
  color: var(--sd-text);
}
.sd-panel-toggle-icon {
  width: 16px;
  height: 16px;
  transition: transform 300ms ease;
}

.sd-eye-toggle {
  pointer-events: auto;
  position: absolute;
  bottom: 20px;
  left: 50%;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: 1px solid var(--sd-border);
  background: var(--sd-bg);
  color: var(--sd-text-muted);
  box-shadow: var(--sd-shadow);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transform: translateX(-50%);
  transition: background 150ms ease, color 500ms ease, opacity 500ms ease;
}
.sd-eye-toggle[data-sd-visible="false"] {
  color: color-mix(in srgb, var(--sd-text-muted) 30%, transparent);
}
.sd-eye-toggle:hover {
  background: var(--sd-surface);
  color: var(--sd-text);
}
.sd-eye-toggle svg {
  width: 16px;
  height: 16px;
}

/* ── Disclosure rows (POI / caption editors) ─────────────────────────────── */
.sd-disclosure {
  display: flex;
  flex-direction: column;
}
.sd-disclosure[data-sd-open="true"] {
  margin-bottom: 10px;
}
.sd-disclosure[data-sd-dimmed="true"] {
  opacity: 0.38;
  pointer-events: none;
}
.sd-disclosure[data-sd-highlight="true"] .sd-disclosure-toggle {
  box-shadow: inset 0 0 0 1px var(--sd-handle);
  color: var(--sd-label-active);
}
[data-shader-dev] .sd-disclosure-toggle {
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
  transition: color 150ms ease, background-color 150ms ease;
}
[data-shader-dev] .sd-disclosure-toggle:hover,
.sd-disclosure[data-sd-open="true"] .sd-disclosure-toggle {
  color: var(--sd-label-active);
  background: var(--sd-surface-active);
}
.sd-disclosure-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}
.sd-disclosure-caret {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  color: var(--sd-muted-icon);
  transition: transform 200ms ease;
}
.sd-disclosure[data-sd-open="true"] .sd-disclosure-caret {
  transform: rotate(180deg);
}
.sd-disclosure-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 6px 0 14px;
}
/* Nested editors — damp hover scale so sliders don't spill past inset padding. */
[data-shader-dev] .sd-disclosure-body .sd-slider,
[data-shader-dev] .sd-vec2-row .sd-slider {
  width: 100%;
  margin: 0;
}
[data-shader-dev] .sd-disclosure-body .sd-slider[data-sd-state="hover"],
[data-shader-dev] .sd-vec2-row .sd-slider[data-sd-state="hover"] {
  transform: none;
}
[data-shader-dev] .sd-disclosure-body .sd-slider[data-sd-state="drag"],
[data-shader-dev] .sd-vec2-row .sd-slider[data-sd-state="drag"] {
  transform: scale(1.008);
}
[data-shader-dev] .sd-disclosure-body .sd-toggle {
  width: 100%;
  margin: 0;
}

/* ── Text input ──────────────────────────────────────────────────────────── */
.sd-text {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.sd-text[data-sd-layout="inline"] {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 36px;
  padding: 0 12px;
  border-radius: 8px;
  background: var(--sd-surface);
}
.sd-text-label,
.sd-search-label,
.sd-textarea-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--sd-label);
  padding: 0;
  line-height: 1.35;
}
.sd-text[data-sd-layout="inline"] .sd-text-label {
  padding: 0;
  flex-shrink: 0;
}
[data-shader-dev] .sd-text-input {
  width: 100%;
  height: 36px;
  padding: 0 12px;
  border-radius: 8px;
  background: var(--sd-surface);
  color: var(--sd-label);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.2;
  transition: background-color 150ms ease, color 150ms ease;
}
.sd-text[data-sd-layout="inline"] .sd-text-input {
  flex: 1;
  min-width: 0;
  background: transparent;
  text-align: right;
}
[data-shader-dev] .sd-text-input[data-sd-mono="true"] {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
}
[data-shader-dev] .sd-text-input:focus {
  color: var(--sd-label-active);
  background: var(--sd-surface-active);
}
[data-shader-dev] .sd-text-input::placeholder {
  color: var(--sd-muted-icon);
  text-transform: none;
}

/* ── Textarea ────────────────────────────────────────────────────────────── */
.sd-textarea {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
[data-shader-dev] .sd-textarea-input {
  width: 100%;
  min-height: 72px;
  resize: vertical;
  padding: 8px 12px;
  border-radius: 8px;
  background: var(--sd-surface);
  color: var(--sd-label);
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.45;
  outline: none;
  transition: background-color 150ms ease, color 150ms ease;
}
[data-shader-dev] .sd-textarea-input:focus {
  color: var(--sd-label-active);
  background: var(--sd-surface-active);
}
[data-shader-dev] .sd-textarea-input::placeholder {
  color: var(--sd-muted-icon);
}

.sd-search {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.sd-search-row {
  display: flex;
  align-items: stretch;
  gap: 6px;
}
[data-shader-dev] .sd-search-input {
  flex: 1;
  min-width: 0;
  height: 36px;
  padding: 0 12px;
  border-radius: 8px;
  background: var(--sd-surface);
  color: var(--sd-label);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.2;
  transition: background-color 150ms ease, color 150ms ease;
}
[data-shader-dev] .sd-search-input:focus {
  color: var(--sd-label-active);
  background: var(--sd-surface-active);
}
[data-shader-dev] .sd-search-input::placeholder {
  color: var(--sd-muted-icon);
}
[data-shader-dev] .sd-search-btn {
  flex-shrink: 0;
  height: 36px;
  padding: 0 12px;
  border-radius: 8px;
  background: var(--sd-action-bg);
  color: var(--sd-action-text);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.01em;
  transition: background-color 150ms ease, color 150ms ease, transform 120ms ease;
}
[data-shader-dev] .sd-search-btn:hover:not(:disabled) {
  background: var(--sd-action-bg-hover);
  color: var(--sd-action-text-hover);
}
[data-shader-dev] .sd-search-btn:active:not(:disabled) {
  transform: scale(0.98);
}
[data-shader-dev] .sd-search-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.sd-search-error {
  padding: 0 12px;
  font-size: 11px;
  line-height: 1.35;
  color: #ef4444;
}

/* ── Readout row ─────────────────────────────────────────────────────────── */
.sd-readout {
  display: flex;
  min-height: 36px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  background: var(--sd-surface);
}
.sd-readout-label {
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 500;
  color: var(--sd-label);
}
.sd-readout-value {
  min-width: 0;
  font-size: 12px;
  font-weight: 500;
  color: var(--sd-text-muted);
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Option list (search results, pickers) ───────────────────────────────── */
.sd-option-list-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.sd-option-list-title {
  padding: 0 12px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--sd-text-muted);
}
.sd-option-list {
  display: flex;
  max-height: 168px;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  padding: 4px;
  border-radius: 8px;
  border: 1px solid var(--sd-border);
  background: var(--sd-bg);
  scrollbar-width: thin;
}
.sd-option-list::-webkit-scrollbar {
  width: 6px;
}
.sd-option-list::-webkit-scrollbar-thumb {
  background: var(--sd-surface-active);
  border-radius: 999px;
}
[data-shader-dev] .sd-option-item {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 8px 10px;
  border-radius: 6px;
  background: transparent;
  color: var(--sd-label);
  text-align: left;
  transition: background-color 120ms ease, color 120ms ease;
}
[data-shader-dev] .sd-option-item:hover:not(:disabled) {
  background: var(--sd-surface);
  color: var(--sd-label-active);
}
[data-shader-dev] .sd-option-item:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.sd-option-item-label {
  width: 100%;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.3;
  color: inherit;
}
.sd-option-item-desc {
  width: 100%;
  font-size: 10.5px;
  line-height: 1.35;
  color: var(--sd-text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.sd-option-empty {
  padding: 8px 12px;
  border-radius: 8px;
  background: var(--sd-surface);
  font-size: 11px;
  line-height: 1.35;
  color: var(--sd-text-muted);
}

/* ── Hint copy ───────────────────────────────────────────────────────────── */
.sd-hint {
  margin: 0;
  padding: 0 12px 2px;
  font-size: 11px;
  line-height: 1.4;
  color: var(--sd-text-muted);
}
`
