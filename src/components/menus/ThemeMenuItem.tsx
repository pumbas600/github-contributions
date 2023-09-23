import { SelectableTheme } from '@/contexts/ThemeContext';
import { ListItemIcon, ListItemText, MenuItem, SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

export interface ThemeMenuItemProps {
    currentTheme: SelectableTheme;
    themeValue: SelectableTheme;
    Icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
    onClick: (themeValue: SelectableTheme) => void;
}

export default function ThemeMenuItem({ currentTheme, themeValue, Icon, onClick }: ThemeMenuItemProps) {
    const isSelected = currentTheme === themeValue;

    return (
        <MenuItem onClick={() => onClick(themeValue)}>
            <ListItemIcon>
                <Icon color={isSelected ? 'primary' : undefined} />
            </ListItemIcon>
            <ListItemText sx={{ textTransform: 'capitalize' }}>{themeValue}</ListItemText>
        </MenuItem>
    );
}
