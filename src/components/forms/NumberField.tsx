import { TextField, TextFieldProps } from '@mui/material';

export default function NumberField(props: TextFieldProps) {
    return <TextField type="number" {...props} />;
}
