import { styled } from '@mui/material';
import Link from 'next/link';

const StyledLink = styled(Link)(({ theme }) => ({
    color: theme.palette.primary.main,
}));

export default StyledLink;
