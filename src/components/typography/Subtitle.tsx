import { Typography, TypographyProps } from '@mui/material';

export default function Subtitle(props: TypographyProps) {
    return <Typography {...props} sx={{ ...props.sx, typography: { md: 'h6', xs: 'subtitle1' } }} />;
}
