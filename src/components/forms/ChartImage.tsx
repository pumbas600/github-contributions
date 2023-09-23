import { Box, CircularProgress, Paper, Stack, Typography, styled } from '@mui/material';
import { useEffect, useState } from 'react';

/**
 * Restrict the max height of the image in case the user specifies a large height or
 * the chart width is small, which would allow the chart's height to be very large as
 * it attempts to fill the width and therefore, scale vertically to match.
 */
const Img = styled('img')({
    maxHeight: '400px',
});

export interface ChartImageProps {
    src: string;
    alt: string;
    onError?: () => void;
}

export default function ChartImage({ src, alt, onError }: ChartImageProps) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
    }, [src]);

    return (
        <>
            <Img src={src} alt={alt} onError={onError} onLoad={() => setIsLoading(false)} />
            {isLoading && (
                <Stack width="100%" alignItems="center" gap={1}>
                    <CircularProgress />
                    <Typography>Generating GitHub Contributions Graph...</Typography>
                </Stack>
            )}
        </>
    );
}
