import { Card, styled } from '@mui/material';
import { ReactNode } from 'react';

export interface PlaygroundCardProps {
    children?: ReactNode;
}

const PaddedCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    padding: theme.spacing(2, 4),
    height: '100%',

    [theme.breakpoints.down('md')]: {
        borderRadius: 0,
        gap: theme.spacing(2),
        padding: 0,
        borderWidth: '0',
    },
}));

export default function GitHubCard({ children }: PlaygroundCardProps) {
    return <PaddedCard elevation={0}>{children}</PaddedCard>;
}
