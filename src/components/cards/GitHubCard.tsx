import { Box, Card, Typography, styled } from '@mui/material';
import { ReactNode } from 'react';
import Subtitle from '../typography/Subtitle';

export interface GitHubCardProps {
    children?: ReactNode;
}

const OutlinedCard = styled(Card)(({ theme }) => ({
    height: '100%',
    [theme.breakpoints.down('md')]: {
        borderRadius: 0,
        borderWidth: '0',
        marginBlockStart: theme.spacing(-2),
    },
}));

export const GitHubContent = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    paddingInline: theme.spacing(4),
    marginBlock: theme.spacing(2),

    [theme.breakpoints.down('md')]: {
        gap: theme.spacing(2),
        borderWidth: '0',
        paddingInline: 0,
    },
}));

export const GitHubHeaderContent = styled(GitHubContent)(({ theme }) => ({
    gap: 0,
    [theme.breakpoints.down('md')]: {
        gap: 0,
    },
}));

export default function GitHubCard({ children }: GitHubCardProps) {
    return <OutlinedCard elevation={0}>{children}</OutlinedCard>;
}

export interface GitHubCardHeaderProps {
    header?: string;
    secondary?: string;
}

export function GitHubCardHeader({ header, secondary }: GitHubCardHeaderProps) {
    return (
        <GitHubHeaderContent>
            {header && <Subtitle>{header}</Subtitle>}
            {secondary && <Typography variant="body2">{secondary}</Typography>}
        </GitHubHeaderContent>
    );
}
