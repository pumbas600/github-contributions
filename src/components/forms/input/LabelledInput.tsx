import { InputLabel, Stack } from '@mui/material';

export interface BaseInputProps {
    id?: string;
    name: string;
}

export interface LabelledInputProps<InputProps> {
    label?: string;
    inputProps: InputProps;
    Input: React.ComponentType<InputProps>;
}

export default function LabelledInput<InputProps extends BaseInputProps>({
    label,
    inputProps,
    Input,
}: LabelledInputProps<InputProps>) {
    let { id, name } = inputProps;
    id ??= `${name}-id`;

    return (
        <Stack gap={0.5}>
            <InputLabel htmlFor={id}>{label}</InputLabel>
            <Input {...inputProps} id={id} name={name} />
        </Stack>
    );
}
