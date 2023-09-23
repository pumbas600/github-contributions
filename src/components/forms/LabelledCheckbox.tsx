import { Checkbox, CheckboxProps, Stack, Typography } from '@mui/material';

interface LabelledCheckboxProps extends CheckboxProps {
    label: string;
}

export default function LabelledCheckbox({ label, ...props }: LabelledCheckboxProps) {
    return (
        <Stack sx={{ width: '100%' }} direction="row" alignItems="center" gap={0.5}>
            <Checkbox {...props} />
            <Typography>{label}</Typography>
        </Stack>
    );
}
