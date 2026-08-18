import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-muted-foreground border-border bg-card flex w-full min-h-16 rounded-lg border px-3.5 py-2.5 text-base outline-none transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "hover:border-border/80 focus-visible:border-primary focus-visible:ring-ring/40 focus-visible:ring-[3px]",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/25",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
