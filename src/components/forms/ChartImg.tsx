import { styled } from '@mui/material';

/**
 * Restrict the max height of the image in case the user specifies a large height or
 * the chart width is small, which would allow the chart's height to be very large as
 * it attempts to fill the width and therefore, scale vertically to match.
 */
const ChartImg = styled('img')({
    maxHeight: '400px',
});

export default ChartImg;
