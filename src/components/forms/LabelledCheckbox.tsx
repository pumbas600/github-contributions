import { Box, Checkbox, CheckboxProps, FormControlLabel } from '@mui/material';

interface LabelledCheckboxProps extends CheckboxProps {
    label: string;
}

export default function LabelledCheckbox({ label, ...props }: LabelledCheckboxProps) {
    // Apply the 100% to the Box instead of the FormControlLabel so that the empty space is not also clickable.
    return (
        <Box sx={{ width: '100%' }}>
            <FormControlLabel label={label} control={<Checkbox {...props} />} />
        </Box>
    );
}
