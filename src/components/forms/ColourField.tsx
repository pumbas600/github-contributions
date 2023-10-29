import useDebounce from '@/hooks/useDebounce';
import { Box, InputAdornment, TextField, TextFieldProps } from '@mui/material';
import { useEffect, useState } from 'react';

export interface ColourFieldProps extends Omit<TextFieldProps, 'value' | 'defaultValue' | 'type' | 'onChange'> {
    value?: string;
    onChange(value: string): void;
}

export default function ColourField({ value: initialValue, onChange, ...props }: ColourFieldProps) {
    const [value, setValue] = useState(initialValue);
    const debouncedValue = useDebounce(value, 200);

    useEffect(() => {
        if (debouncedValue !== undefined) {
            onChange(debouncedValue);
        }
    }, [debouncedValue]);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        setValue(e.target.value.toUpperCase());
    }

    return (
        <TextField
            fullWidth
            value={value}
            onChange={handleChange}
            {...props}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <Box
                            bgcolor={value}
                            width="2rem"
                            height="2rem"
                            borderRadius="4px"
                            border="1px solid"
                            borderColor="divider"
                        />
                    </InputAdornment>
                ),
            }}
            inputProps={{ pattern: '#[A-Fa-fd]{0,6}' }}
        />
    );
}
