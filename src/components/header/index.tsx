import { IconButton, Stack, styled } from '@mui/material';
import Title from '../typography/Title';
import GitHubIcon from '@mui/icons-material/GitHub';
import Link from 'next/link';
import { GitHubRepoUrl } from '@/data/Links';
import ThemeMenu from '../menus/ThemeMenu';

const SpacedHeader = styled('header')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
    gap: theme.spacing(1),
}));

export default function Header() {
    return (
        <SpacedHeader>
            <Title />
            <Stack direction="row" gap={0.5}>
                <Link href={GitHubRepoUrl}>
                    <IconButton title="View the source code">
                        <GitHubIcon />
                    </IconButton>
                </Link>
                <ThemeMenu />
            </Stack>
        </SpacedHeader>
    );
}
