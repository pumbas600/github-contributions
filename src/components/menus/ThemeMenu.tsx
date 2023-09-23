import { Box, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, SvgIconTypeMap } from '@mui/material';
import { useState, MouseEvent } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import ThemeMenuItem from './ThemeMenuItem';
import { SelectableTheme, useThemeContext } from '@/contexts/ThemeContext';
import { OverridableComponent } from '@mui/material/OverridableComponent';

export type IconComponent = OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;

const ThemeIcons: Record<SelectableTheme, IconComponent> = {
    light: LightModeIcon,
    system: SettingsIcon,
    dark: DarkModeOutlinedIcon,
};

export default function ThemeMenu() {
    const { theme, selectedTheme, setTheme } = useThemeContext();
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

    const ResolvedThemeIcon = ThemeIcons[theme];

    return (
        <Box>
            <IconButton
                id="theme-button"
                aria-controls={isOpen ? 'theme-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={isOpen ? 'true' : undefined}
                title="Change theme"
                onClick={handleOpen}
            >
                {<ResolvedThemeIcon />}
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
                {Object.entries(ThemeIcons).map(([themeValue, Icon]) => (
                    <ThemeMenuItem
                        currentTheme={selectedTheme}
                        themeValue={themeValue as SelectableTheme}
                        Icon={Icon}
                        onClick={handleChangeTheme}
                    />
                ))}
            </Menu>
        </Box>
    );
}
