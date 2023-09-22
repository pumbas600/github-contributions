import useLocalStorage from '@/hooks/useLocalStorage';
import { useMediaQuery } from '@mui/material';
import { ReactNode, createContext, useContext, useMemo } from 'react';

type SelectableTheme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextData {
    setTheme(theme: SelectableTheme): void;
    theme: ResolvedTheme;
}

const ThemeContext = createContext<ThemeContextData>({
    setTheme: () => {},
    theme: 'light',
});

export const useThemeContext = useContext(ThemeContext);

export function ThemeContextProvider({ children }: { children: ReactNode }) {
    const [selectedTheme, setSelectedTheme] = useLocalStorage<SelectableTheme>('theme', 'light');
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const resolvedTheme = useMemo<ResolvedTheme>(() => {
        if (selectedTheme === 'system') {
            return prefersDarkMode ? 'dark' : 'light';
        }
        return selectedTheme;
    }, [selectedTheme, prefersDarkMode]);

    return (
        <ThemeContext.Provider value={{ setTheme: setSelectedTheme, theme: resolvedTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
