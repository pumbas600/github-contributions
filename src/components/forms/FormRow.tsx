import { Stack, StackProps } from '@mui/material';

export default function FormRow({ children, gap = 1, ...props }: StackProps) {
    return (
        <Stack direction={{ md: 'row', xs: 'column' }} alignContent="center" gap={gap} {...props}>
            {children}
        </Stack>
    );
}
