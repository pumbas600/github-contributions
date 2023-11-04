import { InputLabel, Stack } from '@mui/material';

export interface BaseInputProps {
    id?: string;
    name: string;
}

export interface LabelledInputProps<InputProps> extends BaseInputProps {
    label?: string;
    inputProps: Omit<InputProps, keyof BaseInputProps>;
    Input: React.ComponentType<InputProps>;
}

export default function LabelledInput<InputProps>({
    id,
    name,
    label,
    inputProps,
    Input,
}: LabelledInputProps<InputProps>) {
    id ??= `${name}-id`;

    return (
        <Stack gap={0.5}>
            <InputLabel htmlFor={id}>{label}</InputLabel>
            <Input {...(inputProps as unknown as InputProps)} id={id} name={name} />
        </Stack>
    );
}
