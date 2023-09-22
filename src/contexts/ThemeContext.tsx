import useLocalStorage from '@/hooks/useLocalStorage';
import { buildTheme } from '@/theme';
import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import { ReactNode, createContext, useContext, useMemo } from 'react';

export type SelectableTheme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextData {
    setTheme(theme: SelectableTheme): void;
    selectedTheme: SelectableTheme;
    theme: ResolvedTheme;
}

const ThemeContext = createContext<ThemeContextData>({
    setTheme: () => {},
    selectedTheme: 'light',
    theme: 'light',
});

export const useThemeContext = () => useContext(ThemeContext);

export function ThemeContextProvider({ children }: { children: ReactNode }) {
    const [selectedTheme, setSelectedTheme] = useLocalStorage<SelectableTheme>('theme', 'light');
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const resolvedTheme = useMemo<ResolvedTheme>(() => {
        if (selectedTheme === 'system') {
            return prefersDarkMode ? 'dark' : 'light';
        }
        return selectedTheme;
    }, [selectedTheme, prefersDarkMode]);

    const muiTheme = useMemo(() => {
        return buildTheme(resolvedTheme);
    }, [resolvedTheme]);

    return (
        <ThemeContext.Provider value={{ setTheme: setSelectedTheme, selectedTheme, theme: resolvedTheme }}>
            <ThemeProvider theme={muiTheme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}
