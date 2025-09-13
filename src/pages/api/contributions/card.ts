import { lineGraph } from '@/services/charts/LineGraph';
import { ChartService } from '@/services/ChartService';
import { SvgService } from '@/services/SvgService';
import {
    AxisOptions,
    calculateChartRects,
    GridOptions,
    renderGrid,
    renderXAxis,
    renderYAxis,
} from '@/svg-rendering/chart';
import { renderDebugRect } from '@/svg-rendering/primitives';
import { Rect } from '@/svg-rendering/rect';
import Contribution from '@/types/interfaces/Contribution';
import { Size } from '@/types/interfaces/Vectors';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const primaryColor = '#4BB5FC';
    const dotColor = '#E5E5E5';
    const gridSize: Size = { width: 730, height: 190 };
    const cardSize: Size = { width: 850, height: 330 };
    const headingOptions = {
        fontWeight: 600,
        fill: primaryColor,
    };

    const gridLineOptions: SvgService.LineOptions = {
        stroke: primaryColor,
        strokeOpacity: 0.3,
        strokeDasharray: '3',
    };
    // const axisOptions: ChartService.AxisOptions = {
    //     stroke: '#666',
    //     tick: {
    //         gap: 2,
    //         width: 6,
    //     },
    //     tickLabel: {
    //         fontSize: 12,
    //         fill: primaryColor,
    //     },
    //     label: {
    //         fontSize: 16,
    //         letterSpacing: '0.05em',
    //         ...headingOptions,
    //     },
    // };

    const data: Contribution[] = SvgService.repeat(30, (index) => ({
        count: 0.1 * (index - 14) ** 2 + Math.random() * 10,
        date: index + 1,
    }));
    const xAxisScale = ChartService.calculateXAxisScale(gridSize, data, 'Day');
    const yAxisScale = ChartService.calculateYAxisScale(gridSize, 6, data, 'count', 'Contributions');

    const xAxisLabels = data.map((contribution) => contribution.date.toString());
    const yAxisLabels = [0, 10, 20, 30, 40, 50].map(String);

    const dataPoints = ChartService.calculatePoints(yAxisScale, xAxisScale, gridSize, data, 'count');
    const axisOptions: AxisOptions = {
        axisLine: { stroke: '#666' },
        tickLabel: { fill: primaryColor, fontSize: 12 },
        tickLength: 6,
    };
    const gridOptions: GridOptions = {
        gridLine: gridLineOptions,
        labelCounts: {
            xAxis: xAxisLabels.length,
            yAxis: yAxisLabels.length,
        },
    };

    const svgRect: Rect = { origin: { x: 0, y: 0 }, width: cardSize.width, height: cardSize.height };
    const chartRects = calculateChartRects(svgRect);

    const card = SvgService.card(
        cardSize,
        [
            '<style>',
            'text { font-family: Segoe UI, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, Arial; }',
            '</style>',
            SvgService.rect(cardSize, { fill: '#161B22', borderRadius: 4.5 }),

            renderDebugRect(chartRects.chartRect),
            renderDebugRect(chartRects.xAxisRect),
            renderDebugRect(chartRects.yAxisRect),

            renderXAxis(chartRects.xAxisRect, xAxisLabels, axisOptions),
            renderYAxis(chartRects.yAxisRect, yAxisLabels, axisOptions),
            renderGrid(chartRects.chartRect, gridOptions),

            // SvgService.text(
            //     `pumbas600’s Contributions`,
            //     { horizontal: 'middle', vertical: 'start' },
            //     { x: cardSize.width / 2, y: 16, fontSize: 24, letterSpacing: '0.025em', ...headingOptions },
            // ),
            // '<g transform="translate(90, 70)">',
            // ChartService.xAxisGridLines(xAxisScale, gridSize, gridLineOptions),
            // ChartService.yAxisGridLines(yAxisScale, gridSize, gridLineOptions),

            // ChartService.xAxis(xAxisScale, gridSize, data, 'date', axisOptions),
            // ChartService.yAxis(yAxisScale, gridSize, axisOptions),
            // lineGraph(gridSize, dataPoints, {
            //     dot: { fill: dotColor, radius: 5 },
            //     path: { fill: 'transparent', stroke: primaryColor, strokeWidth: 4 },
            //     area: { fill: primaryColor, opacity: 0.3 },
            // }),
            // '</g>',
        ].join(''),
    );

    res.status(200).setHeader('Content-Type', 'image/svg+xml').send(card);
}
