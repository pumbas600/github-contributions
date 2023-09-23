import { PaletteOptions, Theme, createTheme } from '@mui/material';
import { ResolvedTheme } from '@/contexts/ThemeContext';

import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';

export function buildTheme(theme: ResolvedTheme): Theme {
    const palette: PaletteOptions = {
        mode: theme,
        ...(theme === 'light'
            ? {
                  divider: '#d0d7de',
                  background: {
                      default: '#FFFFFF',
                      paper: '#f6f8fa',
                  },
              }
            : {
                  divider: '#30363d',
                  background: {
                      default: '#0d1117',
                      paper: '#161b22',
                  },
              }),
    };

    return createTheme({
        palette,
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
            h4: {
                fontWeight: 500,
            },
            subtitle1: {
                fontWeight: 500,
            },
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
            MuiCard: {
                styleOverrides: {
                    root: {
                        backgroundColor: palette.background?.default,
                        border: `1px solid ${palette.divider}`,
                        borderRadius: '0.375rem',
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
