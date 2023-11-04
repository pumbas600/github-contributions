import useDebounce from '@/hooks/useDebounce';
import { InputAdornment, TextField, TextFieldProps } from '@mui/material';
import { useEffect, useState } from 'react';
import HexColourPreviewPicker from './HexColourPreviewPicker';
import Validator from '@/types/interfaces/Validator';

export interface ColourFieldProps extends Omit<TextFieldProps, 'value' | 'defaultValue' | 'type' | 'onChange'> {
    id: string;
    value?: string;
    onChange(value: string): void;
}

export const ColourValidator: Validator = {
    isValid(value: string): boolean {
        if (value === '') return false;

        return /^#[A-Fa-f\d]{6}$/i.test(value);
    },
    error: 'The value must be a valid hex colour',
};

export default function ColourField({ id, value: initialValue, onChange, ...props }: ColourFieldProps) {
    const [value, setValue] = useState(initialValue);
    const debouncedValue = useDebounce(value, 400);

    useEffect(() => {
        if (debouncedValue !== undefined) {
            onChange(debouncedValue);
        }
    }, [debouncedValue]);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    function handleChange(value: string): void {
        setValue(value.toUpperCase());
    }

    return (
        <>
            <TextField
                id={id}
                fullWidth
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                {...props}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <HexColourPreviewPicker value={value} handleChange={handleChange} id={id} />
                        </InputAdornment>
                    ),
                }}
            />
        </>
    );
}
