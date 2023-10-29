import { Box, Menu, menuClasses, styled } from '@mui/material';
import { useState, MouseEvent } from 'react';
import { HexColorPicker } from 'react-colorful';

interface ColorPickerBaseProps {
    id: string;
    value?: string;
    handleChange: (value: string) => void;
}

const StyledMenu = styled(Menu)({
    [`& .${menuClasses.list}`]: {
        padding: 0,
        overflow: 'hidden',
    },
});

const ColourPreview = styled(Box)(({ theme }) => ({
    width: theme.spacing(4),
    height: theme.spacing(4),
    borderRadius: '4px',
    border: `1px solid ${theme.palette.divider}`,
    cursor: 'pointer',
}));

export default function HexColourPreviewPicker({ id, value, handleChange }: ColorPickerBaseProps) {
    const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
    const isPickerOpen = anchorElement !== null;

    const handleOpen = (event: MouseEvent<HTMLDivElement>) => {
        setAnchorElement(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorElement(null);
    };

    const previewId = `${id}-preview`;
    const pickerId = `${id}-picker`;

    return (
        <>
            <ColourPreview
                id={previewId}
                bgcolor={value}
                onClick={handleOpen}
                aria-controls={isPickerOpen ? pickerId : undefined}
                aria-haspopup="true"
                aria-expanded={isPickerOpen ? 'true' : undefined}
            />
            <StyledMenu
                id={pickerId}
                anchorEl={anchorElement}
                open={isPickerOpen}
                onClose={handleClose}
                disableScrollLock
                MenuListProps={{
                    'aria-labelledby': previewId,
                }}
            >
                <HexColorPicker color={value} onChange={handleChange} />
            </StyledMenu>
        </>
    );
}
