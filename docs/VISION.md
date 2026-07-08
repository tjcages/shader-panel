# Panels — vision

> **North star.** Paste one line into your agent — *"add Panels to my home page's canvas section"* — and get a live control panel for **any** React tool: parameters, item collections, canvas↔overlay binding, persistence, and image/video export, all auto-generated.

`shader-panel` proved the shape: a floating panel that wraps a thing and lets you tweak it live, then compiles out of production. **Panels** generalizes that from shaders to *any React state* — and makes installation something an agent does in seconds, not something you wire by hand.

## Who it's for

Anyone with React state worth tweaking live: shader authors, creative-coding / 3D scenes, map and data tools, dashboards, settings surfaces, internal tools. If it holds state and renders, Panels can wrap it.

## The promise

1. **One-line install.** Point an assistant at a file or a section and say *"add Panels here."* It detects the framework, reads the state, generates a sensible panel, wires persistence and export, and — if there's a canvas — the overlay. No config files, no boilerplate.
2. **Wrap any state.** Not just flat uniforms. Managed **item collections** (add/remove/edit lists whose items each carry their own params), **cross-item links**, and a **canvas bound to a UI overlay** that stay in sync.
3. **Free by default.** Local persistence, copy/paste JSON, per-section reset, hi-res image + video/GIF export — you get these without asking.
4. **Zero production cost.** Compiles out to a ~5 KB no-op in production builds, exactly as today.

## What makes it different

- **Agent-native, not just human-friendly.** The library ships a machine-legible catalog of what it can build, so an agent knows the exact set of field types and primitives to compose — the install prompt isn't guessing.
- **Auto-generated UI.** Given a state object (or its types), Panels infers the fields: numbers → sliders with sensible ranges, enums → selects, `[x,y]` → vec2 pads, `object[]` → collections, and so on. You refine, you don't scaffold.
- **Shaders are one adapter, not the center.** WebGL / Three.js / R3F support lives in an optional `@tjcages/panels/shader` add-on. The core knows nothing about GLSL.

## The reference case: region-earth

`region-earth` is a globe tool where a canvas and a UI overlay are fully tied together — draggable points of interest (POIs), captions linked to POIs, all recorded to video. It was built by hand on top of `shader-panel`, and in doing so it *previewed every abstraction Panels needs to own*: item collections, cross-item linking, 3D↔DOM overlay projection, hit-testing, and composite capture. Panels upstreams those patterns. region-earth then becomes both the regression harness (it stays linked during development) and the flagship launch demo.

## Non-goals

- **Not a form library.** Panels is for *tweaking a running thing*, not collecting user submissions.
- **Not a CMS or a database.** Collections are for editing a tool's own state, not managing content at scale.
- **Not a production UI.** It's a dev/authoring surface that disappears in production.

## How we get there

Eight phases, tracked in Linear (team **Off-brand**, project **shader-panel** → **Panels**):

1. **Vision & rename** — this doc, the `@tjcages/panels` rename, the `usePanel` API.
2. **General core** — decouple from shaders; wrap any state.
3. **Item collections & linking** — the POI/caption model, made declarative.
4. **Canvas + overlay binding** — 3D↔DOM projection, hit-test, drag.
5. **Export & capture** — finish recording; composite any surface.
6. **Auto-UI & install** — infer the UI; the one-line install (prompt + skill + recipes).
7. **Distribution & docs** — publish, docs site + live playground, gallery.
8. **Launch** — demo, announce, tag 1.0.0.

Version resets to a fresh `0.x` line under the new name and reaches `1.0` at launch.
