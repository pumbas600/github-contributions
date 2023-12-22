import Validator from '@/types/interfaces/Validator';
import { TextField, TextFieldProps } from '@mui/material';

export const PositiveNumberValidator: Validator = {
    isValid(value: string): boolean {
        if (value === '') return false;

        const number = Number(value);
        return !isNaN(number) && number > 0;
    },
    error: 'The value must be greater than 0',
};

export default function NumberField(props: TextFieldProps) {
    return <TextField {...props} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', ...props.inputProps }} />;
}
