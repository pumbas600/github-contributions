import { createTheme } from '@mui/material';

import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#30B0C7',
            light: '#C0E7EE',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#FF9500',
            light: 'FFDFB2',
        },
        background: {
            default: '#F2F2F7',
            paper: '#FFFFFF',
        },
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
        MuiButton: {
            defaultProps: {
                variant: 'contained',
            },
            styleOverrides: {
                root: {
                    paddingTop: '10px',
                    paddingBottom: '10px',
                    textTransform: 'none',
                    fontSize: '1rem',
                },
            },
        },
    },
});
