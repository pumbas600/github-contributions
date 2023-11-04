import { PaletteOptions, Theme, alertClasses, alertTitleClasses, createTheme } from '@mui/material';
import { ResolvedTheme } from '@/contexts/ThemeContext';

import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';
import createPalette from '@mui/material/styles/createPalette';

export function buildTheme(theme: ResolvedTheme): Theme {
    const palette = createPalette({
        mode: theme,
        ...(theme === 'light'
            ? {
                  primary: {
                      main: '#0969DA',
                  },
                  divider: '#D0D7DE',
                  background: {
                      default: '#FFFFFF',
                      paper: '#F6F8FA',
                  },
              }
            : {
                  primary: {
                      main: '#2F81F7',
                  },
                  divider: '#30363D',
                  background: {
                      default: '#0D1117',
                      paper: '#161B22',
                  },
              }),
    });

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
            MuiAlert: {
                styleOverrides: {
                    standardError: {
                        borderInlineStart: `4px solid ${palette.error.main}`,
                        backgroundColor: theme === 'dark' ? '#2b0a0c' : undefined,
                        [`.${alertClasses.icon}`]: {
                            color: palette.error.main,
                        },
                        [`.${alertTitleClasses.root}`]: {
                            color: palette.error.main,
                        },
                    },
                    standardInfo: {
                        borderInlineStart: `4px solid ${palette.primary.main}`,
                        backgroundColor: theme === 'dark' ? '#0b181e' : undefined,
                        [`.${alertClasses.icon}`]: {
                            color: palette.primary.main,
                        },
                        [`.${alertTitleClasses.root}`]: {
                            color: palette.primary.main,
                        },
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
            MuiTab: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        paddingBlock: '0.5rem',
                    },
                },
            },
            MuiTabs: {
                styleOverrides: {
                    root: {
                        borderBottom: `1px solid ${palette.divider}`,
                    },
                },
            },
        },
    });
}
