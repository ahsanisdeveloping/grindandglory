"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  typography: { fontFamily: "var(--font-geist-sans), Arial, sans-serif" },
  shape: { borderRadius: 8 },
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: { color: "var(--color-glory)", minWidth: 44, minHeight: 44 },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "var(--color-ivory)",
          color: "var(--color-glory)",
          boxShadow: "none",
        },
      },
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </AppRouterCacheProvider>
  );
}
