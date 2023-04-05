import { createTheme } from '@mui/material';

export const theme = createTheme({
    palette: {
        background: {
            default: '',
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
