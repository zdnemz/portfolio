import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "placeholder:text-muted-foreground selection:bg-primary/25 border-border bg-card flex h-11 w-full min-w-0 rounded-lg border px-3.5 py-2 text-base outline-none transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "hover:border-border/80 focus-visible:border-primary focus-visible:ring-ring/40 focus-visible:ring-[3px]",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/25",
        className
      )}
      {...props}
    />
  )
}

export { Input }
