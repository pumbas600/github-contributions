import { Box, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { useState, MouseEvent } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';

export default function ThemeMenu() {
    const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
    const isOpen = anchorElement !== null;

    const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorElement(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorElement(null);
    };

    return (
        <Box>
            <IconButton
                id="theme-button"
                aria-controls={isOpen ? 'theme-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={isOpen ? 'true' : undefined}
                aria-label="Change theme"
                onClick={handleOpen}
            >
                <LightModeIcon />
            </IconButton>
            <Menu
                id="theme-menu"
                anchorEl={anchorElement}
                open={isOpen}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'theme-button',
                }}
            >
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <LightModeIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText>Light</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText>System</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <DarkModeOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText>Dark</ListItemText>
                </MenuItem>
            </Menu>
        </Box>
    );
}
