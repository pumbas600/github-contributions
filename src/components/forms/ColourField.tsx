import useDebounce from '@/hooks/useDebounce';
import {
    Box,
    FormControl,
    FormHelperText,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    OutlinedInputProps,
} from '@mui/material';
import { useEffect, useState } from 'react';

export interface ColourFieldProps extends Omit<OutlinedInputProps, 'value' | 'defaultValue' | 'type' | 'onChange'> {
    id: string;
    value?: string;
    helperText?: string;
    onChange(value: string): void;
}

export default function ColourField({
    value: initialValue,
    id,
    helperText,
    error,
    label,
    onChange,
    ...props
}: ColourFieldProps) {
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
        <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor={id}>{label}</InputLabel>
            <OutlinedInput
                id={id}
                value={value}
                label={label}
                onChange={handleChange}
                {...props}
                startAdornment={
                    <InputAdornment position="start">
                        <Box bgcolor={value} width="2rem" height="2rem" borderRadius="4px" />
                    </InputAdornment>
                }
            />
            <FormHelperText error={error}>{helperText}</FormHelperText>
        </FormControl>
    );
}
