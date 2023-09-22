import { Theme, createTheme } from '@mui/material';
import { ResolvedTheme } from '@/contexts/ThemeContext';

import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';

export function buildTheme(theme: ResolvedTheme): Theme {
    return createTheme({
        palette: {
            mode: theme,
            ...(theme === 'light'
                ? {
                      background: {
                          default: '#F2F2F7',
                          paper: '#FFFFFF',
                      },
                  }
                : {}),
        },
        typography: {
            fontFamily: [
                'Inter',
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
            ].join(','),
        },
        components: {
            MuiPaper: {
                styleOverrides: {
                    elevation1: {
                        boxShadow:
                            '0px 4px 6px -1px rgba(0,0,0,0.15), 0px 3px 10px 1px rgba(0,0,0,0.12), 0px 1px 3px 0px rgba(0,0,0,0.10)',
                    },
                },
            },
            MuiButton: {
                defaultProps: {
                    variant: 'contained',
                },
                styleOverrides: {
                    root: {
                        paddingInline: '0.75rem',
                        textTransform: 'none',
                        fontSize: '1rem',
                    },
                    contained: {
                        boxShadow: 'rgba(0, 0, 0, 0.12) 0px 4px 3px -2px, rgba(0, 0, 0, 0.10) 0px 1px 5px 0px',
                    },
                },
            },
        },
    });
}
