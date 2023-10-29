import useDebounce from '@/hooks/useDebounce';
import { InputAdornment, TextField, TextFieldProps } from '@mui/material';
import { useEffect, useState } from 'react';
import HexColourPreviewPicker from './HexColourPreviewPicker';

export interface ColourFieldProps extends Omit<TextFieldProps, 'value' | 'defaultValue' | 'type' | 'onChange'> {
    id: string; // Require an id
    value?: string;
    onChange(value: string): void;
}

export default function ColourField({ id, value: initialValue, onChange, ...props }: ColourFieldProps) {
    const [value, setValue] = useState(initialValue);
    const debouncedValue = useDebounce(value, 350);

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
