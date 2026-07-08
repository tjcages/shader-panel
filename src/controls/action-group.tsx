"use client"

import { cn } from "../lib/cn"

export interface ControlActionGroupProps {
  children: React.ReactNode
  className?: string
}

/** Horizontal row of action buttons — e.g. Link + Remove. */
export function ControlActionGroup({
  children,
  className,
}: ControlActionGroupProps) {
  return <div className={cn("sd-action-group", className)}>{children}</div>
}
