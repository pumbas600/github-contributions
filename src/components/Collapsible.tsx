import ArrowDownward from '@mui/icons-material/ArrowDownward';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import { Button, Stack } from '@mui/material';
import { useState } from 'react';

interface CollapsibleProps {
    title: string;
    children?: React.ReactNode;
}

export default function Collapsible({ title, children }: CollapsibleProps) {
    const [isOpen, setIsOpen] = useState(false);

    function toggleIsOpen() {
        setIsOpen((isOpen) => !isOpen);
    }

    return (
        <Stack gap={1}>
            <Button
                fullWidth
                onClick={toggleIsOpen}
                variant="text"
                endIcon={isOpen ? <ArrowUpward /> : <ArrowDownward />}
                sx={{ justifyContent: 'space-between' }}
            >
                {title}
            </Button>
            {isOpen && <>{children}</>}
        </Stack>
    );
}
