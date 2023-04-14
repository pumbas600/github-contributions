import { KeyboardArrowDown, KeyboardArrowRight } from '@mui/icons-material';
import { Box, Stack, Typography, styled } from '@mui/material';
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
            <Stack direction="row" alignItems="center" gap={1}>
                <Stack direction="row" alignItems="center" gap={0} onClick={toggleIsOpen} color="GrayText">
                    <Typography whiteSpace="nowrap">{title}</Typography>
                    {isOpen ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
                </Stack>
                <Divider />
            </Stack>
            {isOpen && <Stack gap={3}>{children}</Stack>}
        </Stack>
    );
}
