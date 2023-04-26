import { ArrowDownward, ArrowForward } from '@mui/icons-material';
import { Box, Button, Stack, styled } from '@mui/material';
import { useState } from 'react';

interface CollapsibleProps {
    title: string;
    children?: React.ReactNode;
}

const Divider = styled(Box)(({ theme }) => ({
    width: '100%',
    height: 0,
    borderBottom: '1px solid',
    borderColor: theme.palette.divider,
}));

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
                endIcon={isOpen ? <ArrowForward /> : <ArrowDownward />}
                sx={{ justifyContent: 'space-between' }}
            >
                {title}
            </Button>
            {isOpen && <>{children}</>}
        </Stack>
    );
}
