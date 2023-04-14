import { Stack } from '@mui/material';
import { ReactNode } from 'react';

export interface RowProps {
    children?: ReactNode;
}

export default function Row({ children }: RowProps) {
    return (
        <Stack direction="row" gap={2} width="100%">
            {children}
        </Stack>
    );
}
