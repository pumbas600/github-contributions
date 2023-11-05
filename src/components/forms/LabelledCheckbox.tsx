import { Checkbox, CheckboxProps, Stack, StackProps, SxProps, Typography } from '@mui/material';

interface LabelledCheckboxProps extends CheckboxProps {
    label: string;
    containerSx?: SxProps;
}

export default function LabelledCheckbox({ label, containerSx, ...props }: LabelledCheckboxProps) {
    return (
        <Stack sx={{ width: '100%', ...containerSx }} direction="row" alignItems="center" gap={0.5}>
            <Checkbox {...props} />
            <Typography>{label}</Typography>
        </Stack>
    );
}
