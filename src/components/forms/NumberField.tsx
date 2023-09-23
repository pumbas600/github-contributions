import { TextField, TextFieldProps } from '@mui/material';

export default function NumberField(props: TextFieldProps) {
    return <TextField {...props} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', ...props.inputProps }} />;
}
