import { addPoints, Point } from './point';
import { LineOptions, renderLine, renderText, TextOptions } from './primitives';
import { Rect, rectFromPoints } from './rect';
import { renderRepeat } from './svg-helpers';

export interface AxisOptions {
    axisLine: LineOptions;
    tickLabel: TextOptions;
    tickLength: number;
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

    return [
        renderLine(rect.origin, endPoint, options.axisLine),
        ...renderRepeat(labels.length, (index) => {
            const label = labels[index];
            const x = rect.origin.x + index * tickXSpacing;
            const tickStartPoint: Point = { x, y: rect.origin.y };
            const tickEndPoint = addPoints(tickStartPoint, { x: 0, y: options.tickLength });

            return [
                renderLine(tickStartPoint, tickEndPoint, options.axisLine),
                renderText(label, tickEndPoint, { horizontal: 'middle', vertical: 'start' }, options.tickLabel),
            ].join('');
        }),
    ].join('');
}

export function renderYAxis(rect: Rect, labels: string[], options: AxisOptions): string {
    const lineStartPoint = addPoints(rect.origin, { x: rect.width, y: 0 });
    const lineEndPoint = addPoints(lineStartPoint, { x: 0, y: rect.height });
    const tickYSpacing = rect.height / (labels.length - 1);

    return [
        renderLine(lineStartPoint, lineEndPoint, options.axisLine),
        ...renderRepeat(labels.length, (index) => {
            const label = labels[index];
            const y = lineEndPoint.y - index * tickYSpacing;
            const tickStartPoint: Point = { x: lineStartPoint.x, y };
            const tickEndPoint = addPoints(tickStartPoint, { x: -options.tickLength, y: 0 });

            return [
                renderLine(tickStartPoint, tickEndPoint, options.axisLine),
                renderText(label, tickEndPoint, { horizontal: 'end', vertical: 'middle' }, options.tickLabel),
            ].join('');
        }),
    ].join('');
}

export interface GridOptions {
    labelCounts: {
        xAxis: number;
        yAxis: number;
    };
    gridLine: LineOptions;
}

export function renderGrid(rect: Rect, options: GridOptions): string {
    const yAxisSpacing = rect.height / (options.labelCounts.yAxis - 1);
    const xAxisSpacing = rect.width / (options.labelCounts.xAxis - 1);

    return [
        ...renderRepeat(options.labelCounts.yAxis - 1, (index) => {
            const startPoint = addPoints(rect.origin, { x: 0, y: index * yAxisSpacing });
            const endPoint = addPoints(startPoint, { x: rect.width, y: 0 });

            return renderLine(startPoint, endPoint, options.gridLine);
        }),
        ...renderRepeat(options.labelCounts.xAxis - 1, (index) => {
            const startPoint = addPoints(rect.origin, { x: (index + 1) * xAxisSpacing, y: 0 });
            const endPoint = addPoints(startPoint, { x: 0, y: rect.height });

            return renderLine(startPoint, endPoint, options.gridLine);
        }),
    ].join('');
}
