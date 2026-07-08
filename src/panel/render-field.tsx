"use client"

import type { ReactNode } from "react"
import { ControlAction } from "../controls/action"
import { ControlCollection } from "../controls/collection"
import { ControlColorInput } from "../controls/color-input"
import { ControlImageInput } from "../controls/image-input"
import { ControlPath, type PathPoint } from "../controls/path-input"
import { ControlPresets } from "../controls/presets"
import { ControlReference } from "../controls/reference"
import { ControlSelect } from "../controls/select"
import { ControlSlider } from "../controls/slider"
import { ControlToggle } from "../controls/toggle"
import { ControlToggleGroup } from "../controls/toggle-group"
import { ControlVec2 } from "../controls/vec2"
import type {
  PanelCollectionField,
  PanelCollectionItem,
  PanelField,
  PanelReferenceField,
} from "../types"

/**
 * Signature the collection uses to render item fields recursively.
 *
 * `values` / `setValues` are scoped to the object being edited (the item for
 * nested fields, the panel state at the top level). `rootValues` /
 * `setRootValues` always point at the panel's top-level state so a
 * `reference` field can resolve a sibling collection no matter how deeply it
 * is nested.
 */
export type RenderFieldContext = {
  values: Record<string, unknown>
  setValues: (next: Record<string, unknown>) => void
  rootValues: Record<string, unknown>
  setRootValues: (next: Record<string, unknown>) => void
  actionHandlers?: Record<string, () => void>
  /** Threaded to collections so the panel can surface the selected item id. */
  onCollectionSelect?: (collectionKey: string, id: string | null) => void
}

/** A rendered field plus the React key to give it. `null` node = skip. */
export type RenderedField = { node: ReactNode; reactKey: string }

/**
 * A field with any non-section type, using the erased `Record` value shape.
 * Callers narrow their own `PanelField<T>` to this before rendering — the
 * concrete `T` is erased here because the collection recurses across value
 * shapes (parent state vs. item) through the same renderer.
 */
export type AnyRenderableField = Exclude<
  PanelField<Record<string, unknown>>,
  { type: "section" }
>

/**
 * Render a single non-section field to a node. Extracted so the collection can
 * call it recursively for each item's `itemFields` — every existing control
 * works inside a collection item with zero extra code.
 *
 * Sections are handled by the panel's grouping pass, not here.
 */
export function renderPanelField(
  field: AnyRenderableField,
  ctx: RenderFieldContext,
): RenderedField | null {
  const { values, setValues, rootValues, setRootValues, actionHandlers } = ctx

  const setKey = (key: string, val: unknown) => {
    setValues({ ...values, [key]: val })
  }

  const withDescription = (description: string | undefined, node: ReactNode) =>
    description ? (
      <>
        <div className="panel-field-description">{description}</div>
        {node}
      </>
    ) : (
      node
    )

  switch (field.type) {
    case "action": {
      if (field.when && !field.when(values)) return null
      const handler = actionHandlers?.[field.actionId]
      return {
        reactKey: field.actionId,
        node: (
          <ControlAction
            label={field.label}
            description={field.description}
            variant={field.variant}
            disabled={!handler}
            onClick={() => handler?.()}
          />
        ),
      }
    }

    case "presets": {
      return {
        reactKey: `presets-${field.presets.map((p) => p.label).join("-")}`,
        node: (
          <ControlPresets
            label={field.label}
            presets={field.presets}
            values={values}
            onChange={setValues}
            actionHandlers={actionHandlers}
          />
        ),
      }
    }

    case "slider":
      return {
        reactKey: field.key,
        node: withDescription(
          field.description,
          <ControlSlider
            label={field.label}
            value={values[field.key] as number}
            min={field.min}
            max={field.max}
            step={field.step}
            onChange={(v) => setKey(field.key, v)}
          />,
        ),
      }

    case "toggle":
      return {
        reactKey: field.key,
        node: withDescription(
          field.description,
          <ControlToggle
            label={field.label}
            value={values[field.key] as boolean}
            onChange={(v) => setKey(field.key, v)}
          />,
        ),
      }

    case "select":
      return {
        reactKey: field.key,
        node: withDescription(
          field.description,
          <ControlSelect
            label={field.label}
            value={values[field.key] as string | number}
            options={field.options}
            layout={field.layout}
            onChange={(v) => setKey(field.key, v)}
          />,
        ),
      }

    case "toggle-group":
      return {
        reactKey: field.key,
        node: withDescription(
          field.description,
          <ControlToggleGroup
            label={field.label}
            value={values[field.key] as string | number}
            options={field.options}
            onChange={(v) => setKey(field.key, v)}
          />,
        ),
      }

    case "vec2":
      return {
        reactKey: field.key,
        node: (
          <ControlVec2
            label={field.label}
            value={values[field.key] as readonly [number, number]}
            min={field.min}
            max={field.max}
            step={field.step}
            xLabel={field.xLabel}
            yLabel={field.yLabel}
            onChange={(v) => setKey(field.key, v)}
          />
        ),
      }

    case "image":
      return {
        reactKey: field.key,
        node: withDescription(
          field.description,
          <ControlImageInput
            label={field.label}
            value={(values[field.key] as string) ?? ""}
            readonly={field.readonly}
            accept={field.accept}
            emptyLabel={field.emptyLabel}
            onChange={
              field.readonly ? undefined : (v) => setKey(field.key, v)
            }
          />,
        ),
      }

    case "path": {
      const anchor = field.anchorKey
        ? (values[field.anchorKey] as PathPoint | undefined)
        : undefined
      return {
        reactKey: field.key,
        node: withDescription(
          field.description,
          <ControlPath
            label={field.label}
            value={(values[field.key] as ReadonlyArray<PathPoint>) ?? []}
            min={field.min}
            max={field.max}
            anchor={anchor}
            onChange={(v) => setKey(field.key, v)}
            onAnchorChange={
              field.anchorKey
                ? (v) => setKey(field.anchorKey as string, v)
                : undefined
            }
          />,
        ),
      }
    }

    case "collection": {
      const collectionField = field as PanelCollectionField<
        Record<string, unknown>,
        PanelCollectionItem
      >
      return {
        reactKey: field.key,
        node: (
          <ControlCollection
            field={collectionField}
            items={(values[field.key] as PanelCollectionItem[]) ?? []}
            onChange={(next) => setKey(field.key, next)}
            renderContext={ctx}
            onSelect={
              ctx.onCollectionSelect
                ? (id) => ctx.onCollectionSelect?.(field.key, id)
                : undefined
            }
          />
        ),
      }
    }

    case "reference":
      return {
        reactKey: field.key,
        node: withDescription(
          field.description,
          <ControlReference
            field={field as PanelReferenceField<Record<string, unknown>>}
            value={values[field.key] as string | string[] | undefined}
            onChange={(v) => setKey(field.key, v)}
            rootValues={rootValues}
            setRootValues={setRootValues}
          />,
        ),
      }

    case "color":
      return {
        reactKey: field.key,
        node: withDescription(
          field.description,
          <ControlColorInput
            label={field.label}
            value={values[field.key] as string}
            onChange={(v) => setKey(field.key, v)}
          />,
        ),
      }
  }
}
