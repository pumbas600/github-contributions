import { Alert, AlertTitle, Box, CircularProgress, Stack, Typography, styled } from '@mui/material';
import { useEffect, useState } from 'react';

export interface ChartImageProps {
    src: string;
    alt: string;
}

interface LoadingState {
    isLoading: boolean;
    isError: boolean;
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

const Img = styled('img', {
    shouldForwardProp: (prop) => prop !== 'isLoading',
})<{ isLoading: boolean }>(({ isLoading }) => ({
    width: '100%',
    height: '100%',
    filter: isLoading ? 'blur(1.5px)' : 'none',
}));

export default function ChartImage({ src, alt }: ChartImageProps) {
    const [{ isLoading, isError }, setLoadingState] = useState<LoadingState>({ isLoading: true, isError: false });

    const handleOnError = () => {
        setLoadingState({ isLoading: false, isError: true });
    };

    useEffect(() => {
        setLoadingState({ isLoading: true, isError: false });

        // Sometimes it gets stuck in the loading state, so we'll make sure to clear the loading state after 1 second
        const timeout = setTimeout(() => setLoadingState((state) => ({ ...state, isLoading: false })), 1000);
        return () => clearTimeout(timeout);
    }, [src]);

    return (
        <ChartContainer>
            {isError ? (
                <Alert severity="error" sx={{ width: '100%' }}>
                    <AlertTitle>Not found</AlertTitle>
                    The given username cannot not be found. Please make sure it matches your GitHub username.
                </Alert>
            ) : (
                <Img
                    src={src}
                    alt={alt}
                    isLoading={isLoading}
                    onError={handleOnError}
                    onLoad={() => setLoadingState({ isLoading: false, isError: false })}
                />
            )}
            {isLoading && (
                <LoadingContainer>
                    <CircularProgress />
                    <Typography>Generating GitHub Contributions Graph...</Typography>
                </LoadingContainer>
            )}
        </ChartContainer>
    );
}
