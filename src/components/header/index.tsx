import { IconButton, styled } from '@mui/material';
import Title from '../typography/Title';
import GitHubIcon from '@mui/icons-material/GitHub';
import Link from 'next/link';
import { GitHubRepoUrl } from '@/data/links';

const SpacedHeader = styled('header')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
}));

export default function Header() {
    return (
        <SpacedHeader>
            <Title />
            <Link href={GitHubRepoUrl}>
                <IconButton aria-label="View the source code">
                    <GitHubIcon />
                </IconButton>
            </Link>
        </SpacedHeader>
    );
}
