"use client"

import { createContext, useState, useContext, useMemo } from "react"
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles"
import { lightThemeOptions, darkThemeOptions } from "../theme"

const ThemeContext = createContext()

/**
 * Theme provider component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function ThemeProvider({ children }) {
  const [mode, setMode] = useState("light")

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"))
  }

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light" ? lightThemeOptions.palette : darkThemeOptions.palette),
        },
        typography: {
          ...(mode === "light" ? lightThemeOptions.typography : darkThemeOptions.typography),
        },
        components: {
          ...(mode === "light" ? lightThemeOptions.components : darkThemeOptions.components),
        },
      }),
    [mode],
  )

  return (
    <ThemeContext.Provider value={{ mode, toggleColorMode }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

/**
 * Custom hook to access the theme context
 * @returns {Object} - Theme context values
 */
export function useTheme() {
  return useContext(ThemeContext)
}
