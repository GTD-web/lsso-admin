"use client";

import { ReactNode } from "react";

// Since the SDK doesn't export a ThemeProvider and appears to have issues with applyTheme,
// we'll create a simple wrapper component instead
export function LumirThemeProvider({ children }: { children: ReactNode }) {
  // In a real implementation, we would apply theme configuration here
  // For now, just render children

  return <div className="lumir-theme-provider">{children}</div>;
}
