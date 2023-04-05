import { createTheme } from '@mui/material';

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
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
    },
});
