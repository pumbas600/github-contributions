import { Button, ButtonProps } from '@mui/material';

export default function PillButton(props: ButtonProps) {
    return <Button {...props} sx={{ ...props.sx, borderRadius: 9999 }} />;
}
