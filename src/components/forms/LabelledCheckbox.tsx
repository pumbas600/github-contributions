import { Checkbox, CheckboxProps, FormControlLabel } from '@mui/material';

interface LabelledCheckboxProps extends CheckboxProps {
    label: string;
}

export default function LabelledCheckbox({ label, ...props }: LabelledCheckboxProps) {
    return <FormControlLabel sx={{ width: '100%' }} label={label} control={<Checkbox {...props} />} />;
}
