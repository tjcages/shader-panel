# shader-panel — agent instructions

Floating dev panel for tweaking shader uniforms live (WebGL / Three.js / R3F). Published on npm at v1.0.0; compiles out of prod builds. Read `README.md` first. Note: this repo was previously named `shader-dev` — the package and repo are `shader-panel`.

## Linear tracking (non-negotiable)

Every agent, every session. Linear: **team "Off-brand"**, **project "shader-panel"** (the Linear project keeps this name until the rename lands).

**Tracking goal: relaunch as "Panels" (`@tjcages/panels`) — generalize from a shader tool into a control panel for any React tool, then launch.** Roadmap runs across 8 phase milestones:
`Phase 1 · Vision & rename` → `Phase 2 · General core` → `Phase 3 · Item collections & linking` → `Phase 4 · Canvas + overlay binding` → `Phase 5 · Export & capture` → `Phase 6 · Auto-UI & install` → `Phase 7 · Distribution & docs` → `Phase 8 · Launch`.
Historical shipped releases live in `Releases 0.4.0 → 1.2.0` (done). No module labels (phase-level granularity). Version line resets to a fresh 0.x, 1.0 at the Phase 8 launch.

- **Search before creating.** Never duplicate a tracked item.
- **Non-trivial work gets an issue**, filed when identified, in the right phase milestone.
- **Every issue gets a milestone.**
- **Lifecycle is real.** `Backlog` → `In Progress` at start → `Done` only when shipped. Mid-work session end → leave `In Progress` + comment.
- **Keep CHANGELOG.md and Linear in agreement.**
- **Writing style — plain titles, structured bodies.** Titles ≤8 words, plain outcome language, no code identifiers or feature dumps (`v1.1.0 — Two-panel layouts`, not `… ToolShell, dual panels, presets`). Descriptions lead with one plain sentence, then a structured block — checklist for in-progress (`- [x]`/`- [ ]`), table for comparisons, tight bullets for a release. Technical depth is welcome *inside* the structure. Attach screenshots instead of describing visuals.
- **Wire real dependencies** (`blockedBy`) for genuine sequencing.
- **Close the loop before ending a session.**
- **Use Linear's generated branch names** (`ty/off-N-slug`).
