import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground/70 dark:bg-input/30 flex field-sizing-content min-h-24 w-full rounded-md border-2 border-b-4 bg-transparent px-3 py-2 text-base shadow-sm transition-all duration-200 ease-out outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/30 md:text-sm",
        "focus-visible:border-ring focus-visible:border-b-4 focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:shadow-md",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:focus-visible:ring-destructive/30 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
