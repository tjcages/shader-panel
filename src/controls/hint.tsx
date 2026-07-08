"use client"

import { cn } from "../lib/cn"

export interface ControlHintProps {
  children: React.ReactNode
  className?: string
}

export function ControlHint({ children, className }: ControlHintProps) {
  return <p className={cn("sd-hint", className)}>{children}</p>
}
