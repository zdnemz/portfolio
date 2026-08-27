"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

/**
 * next-themes provider wrapper. Must be a Client Component (next-themes uses
 * localStorage + the DOM). Mounted once in the root layout, wrapping the body.
 * `attribute="class"` toggles `.dark` on <html>, which the brutalist tokens
 * in globals.css respond to. `disableTransitionOnChange` prevents a flash of
 * animated color when switching themes.
 */
export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
