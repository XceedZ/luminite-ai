import * as React from "react"

export function HideOnCollapse({ children }: { children: React.ReactNode }) {
  return <div className="group-data-[collapsible=icon]:hidden">{children}</div>
}