import { Box, CircularProgress, Stack, Typography, styled } from '@mui/material';
import { useEffect, useState } from 'react';

export interface ChartImageProps {
    src: string;
    alt: string;
    onError?: () => void;
}

/**
 * Restrict the max height of the image in case the user specifies a large height or
 * the chart width is small, which would allow the chart's height to be very large as
 * it attempts to fill the width and therefore, scale vertically to match.
 */
const ChartContainer = styled(Box)({
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    '& > img': {
        maxHeight: '400px',
        minHeight: '100px',
    },
});

const LoadingContainer = styled(Stack)(({ theme }) => ({
    position: 'absolute',
    gap: theme.spacing(1),
    alignItems: 'center',
    width: '100%',
}));

export default function ChartImage({ src, alt, onError }: ChartImageProps) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
    }, [src]);

    return (
        <ChartContainer>
            <img src={src} alt={alt} onError={onError} onLoad={() => setIsLoading(false)} width="100%" height="100%" />
            {isLoading && (
                <LoadingContainer>
                    <CircularProgress />
                    <Typography>Generating GitHub Contributions Graph...</Typography>
                </LoadingContainer>
            )}
        </ChartContainer>
    );
}
