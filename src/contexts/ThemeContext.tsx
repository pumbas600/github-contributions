import { buildTheme } from '@/theme';
import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';

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

const THEME_KEY = 'github.contributions.theme';

export interface ThemeContextProviderProps {
    children?: ReactNode;
}

export function ThemeContextProvider({ children }: ThemeContextProviderProps) {
    const [selectedTheme, setSelectedTheme] = useState<SelectableTheme>('system');
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    useEffect(() => {
        const theme = localStorage.getItem(THEME_KEY) as SelectableTheme | null;
        setSelectedTheme((currentTheme) => theme ?? currentTheme);
    }, []);

    const resolvedTheme = useMemo<ResolvedTheme>(() => {
        if (selectedTheme === 'system') {
            return prefersDarkMode ? 'dark' : 'light';
        }
        return selectedTheme;
    }, [selectedTheme, prefersDarkMode]);

    const muiTheme = useMemo(() => {
        return buildTheme(resolvedTheme);
    }, [resolvedTheme]);

    const setTheme = (theme: SelectableTheme): void => {
        localStorage.setItem(THEME_KEY, theme);
        setSelectedTheme(theme);
    };

    return (
        <ThemeContext.Provider value={{ setTheme, selectedTheme, theme: resolvedTheme }}>
            <ThemeProvider theme={muiTheme}>
                <CssBaseline enableColorScheme />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}
