import { addPoints, Point } from './point';
import { LineOptions, renderDebugRect, renderLine, renderText, TextOptions } from './primitives';
import { Rect, rectFromPoints } from './rect';
import { renderRepeat } from './svg-helpers';

export interface AxisOptions {
    axisLine: LineOptions;
    tickLabel: TextOptions;
}

export interface ChartRects {
    xAxisRect: Rect;
    yAxisRect: Rect;
    chartRect: Rect;
}

export function calculateChartRects(rect: Rect): ChartRects {
    const xAxisHeight = 50;
    const yAxisWidth = 70;
    const xAxisWidth = rect.width - yAxisWidth;
    const yAxisHeight = rect.height - xAxisHeight;

    const yAxisStartPoint = rect.origin;
    const yAxisEndPoint = addPoints(yAxisStartPoint, { x: yAxisWidth, y: yAxisHeight });
    const xAxisEndPoint = addPoints(yAxisEndPoint, { x: xAxisWidth, y: xAxisHeight });
    const chartOrigin = addPoints(yAxisStartPoint, { x: yAxisWidth, y: 0 });
    const chartEndpoint = addPoints(yAxisEndPoint, { x: xAxisWidth, y: 0 });

    const yAxisRect = rectFromPoints(yAxisStartPoint, yAxisEndPoint);
    const xAxisRect = rectFromPoints(yAxisEndPoint, xAxisEndPoint);
    const chartRect = rectFromPoints(chartOrigin, chartEndpoint);

    return {
        xAxisRect,
        yAxisRect,
        chartRect,
    };
}

export function renderXAxis(rect: Rect, labels: string[], options: AxisOptions): string {
    const endPoint = addPoints(rect.origin, { x: rect.width, y: 0 });
    const tickXSpacing = rect.width / (labels.length - 1);

    const tickLength = 0.4 * rect.height;
    const tickLabelFontSize = 0.6 * rect.height;

    return [
        renderDebugRect(rect),
        renderLine(rect.origin, endPoint, options.axisLine),
        ...renderRepeat(labels.length, (index) => {
            const label = labels[index];
            const x = rect.origin.x + index * tickXSpacing;
            const tickStartPoint: Point = { x, y: rect.origin.y };
            const tickEndPoint = addPoints(tickStartPoint, { x: 0, y: tickLength });

            return [
                renderLine(tickStartPoint, tickEndPoint, options.axisLine),
                renderText(
                    label,
                    tickEndPoint,
                    { horizontal: 'middle', vertical: 'start' },
                    { ...options.tickLabel, fontSize: tickLabelFontSize },
                ),
            ].join('');
        }),
    ].join('');
}
