import { createContext, useContext } from "react";
import { ColorSchemeName, useColorScheme } from "react-native";

const ThemeContext = createContext<ColorSchemeName>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();

  return (
    <ThemeContext.Provider value={colorScheme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
