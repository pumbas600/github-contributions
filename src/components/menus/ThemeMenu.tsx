import { Box, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { useState, MouseEvent } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import ThemeMenuItem from './ThemeMenuItem';
import { SelectableTheme, useThemeContext } from '@/contexts/ThemeContext';

export default function ThemeMenu() {
    const { selectedTheme, setTheme } = useThemeContext();
    const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
    const isOpen = anchorElement !== null;

    const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorElement(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorElement(null);
    };

    const handleChangeTheme = (newTheme: SelectableTheme): void => {
        handleClose();
        setTheme(newTheme);
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
                <ThemeMenuItem
                    currentTheme={selectedTheme}
                    themeValue="light"
                    Icon={LightModeIcon}
                    onClick={handleChangeTheme}
                />
                <ThemeMenuItem
                    currentTheme={selectedTheme}
                    themeValue="system"
                    Icon={SettingsIcon}
                    onClick={handleChangeTheme}
                />
                <ThemeMenuItem
                    currentTheme={selectedTheme}
                    themeValue="dark"
                    Icon={DarkModeOutlinedIcon}
                    onClick={handleChangeTheme}
                />
            </Menu>
        </Box>
    );
}
