import { Point, Size } from '@/types/interfaces/Vectors';
import { SvgService } from './SvgService';

export namespace ChartService {
    export interface AxisScale {
        lineCount: number;
        spacing: number;
        label: string;
    }

    export interface YAxisScale extends AxisScale {
        axisMaxValue: number;
        axisStepValue: number;
    }

    type NumericValues<T> = {
        [K in keyof T]: T[K] extends number ? T[K] : never;
    };

    export function calculateYAxisScale<T>(
        gridSize: Size,
        lineCount: number,
        data: NumericValues<T>[],
        valueKey: keyof NumericValues<T>,
        label: string,
    ): YAxisScale {
        if (lineCount < 2) {
            throw new Error('Line count must be at least 2');
        }

        const spacing = gridSize.height / (lineCount - 1);
        const maxValue = Math.max(...data.map((item) => item[valueKey]));
        const axisStepValue = Math.ceil(maxValue / (lineCount - 1));
        const axisMaxValue = axisStepValue * (lineCount - 1);

        return {
            label,
            spacing,
            lineCount,
            axisMaxValue,
            axisStepValue,
        };
    }

    export function calculatePoints<T>(
        yScale: YAxisScale,
        xScale: AxisScale,
        gridSize: Size,
        data: NumericValues<T>[],
        valueKey: keyof NumericValues<T>,
    ): Point[] {
        return data.map((item, index) => {
            const value = item[valueKey];
            const x = index * xScale.spacing;
            const y = gridSize.height * (1 - value / yScale.axisMaxValue);

            return { x, y };
        });
    }

    // TODO: Convert points to smooth curve.
    // https://francoisromain.medium.com/smooth-a-svg-path-with-cubic-bezier-curves-e37b49d46c74

    export function calculateXAxisScale<T>(gridSize: Size, data: NumericValues<T>[], label: string): AxisScale {
        const lineCount = data.length;
        const spacing = gridSize.width / (lineCount - 1);

        return {
            label,
            spacing,
            lineCount,
        };
    }

    export interface AxisOptions extends SvgService.LineOptions {
        tick: {
            width: number;
            gap: number;
        };
        tickLabel: SvgService.TextOptions;
        label: SvgService.TextOptions;
    }

    export function yAxis(scale: YAxisScale, gridSize: Size, options: AxisOptions): string {
        const xTickEnd = -options.tick.width;
        const xTickLabelStart = xTickEnd - options.tick.gap;
        const labelPosition: Point = { x: xTickLabelStart - 32, y: gridSize.height / 2 };

        return [
            SvgService.line({ x: 0, y: 0 }, { x: 0, y: gridSize.height }, options),
            ...SvgService.repeat(scale.lineCount, (index) => {
                const yPosition = index * scale.spacing;

                /* We need to subtract this from the max value because 0 is at the bottom. */
                const tickLabel = scale.axisMaxValue - index * scale.axisStepValue;

                return [
                    SvgService.line({ x: 0, y: yPosition }, { x: xTickEnd, y: yPosition }, options),
                    SvgService.text(
                        tickLabel,
                        { horizontal: 'end', vertical: 'middle' },
                        { x: xTickLabelStart, y: yPosition, ...options.tickLabel },
                    ),
                ].join('');
            }),
            SvgService.text(
                scale.label,
                { horizontal: 'middle', vertical: 'end' },
                {
                    ...labelPosition,
                    ...options.label,
                    transform: `rotate(-90, ${labelPosition.x}, ${labelPosition.y})`,
                },
            ),
        ].join('');
    }

    export function xAxis<T>(scale: AxisScale, gridSize: Size, data: T[], key: keyof T, options: AxisOptions): string {
        const yTickStart = gridSize.height;
        const yTickEnd = yTickStart + options.tick.width;

        return [
            SvgService.line({ x: 0, y: gridSize.height }, { x: gridSize.width, y: gridSize.height }, options),
            ...SvgService.repeat(scale.lineCount, (index) => {
                const xPosition = index * scale.spacing;

                const label = data[index][key];
                return [
                    SvgService.line({ x: xPosition, y: yTickStart }, { x: xPosition, y: yTickEnd }, options),
                    SvgService.text(
                        label,
                        { horizontal: 'middle', vertical: 'start' },
                        { x: xPosition, y: yTickEnd, ...options.tickLabel },
                    ),
                ].join('');
            }),
            SvgService.text(
                scale.label,
                { horizontal: 'middle', vertical: 'start' },
                { x: gridSize.width / 2, y: yTickEnd + 24, ...options.label },
            ),
        ].join('');
    }

    export function yAxisGridLines(scale: AxisScale, gridSize: Size, options: SvgService.LineOptions): string {
        return [
            '<g>',
            ...SvgService.repeat(scale.lineCount - 1, (index) => {
                const yPosition = index * scale.spacing;
                return SvgService.line({ x: 0, y: yPosition }, { x: gridSize.width, y: yPosition }, options);
            }),
            '</g>',
        ].join('');
    }

    export function xAxisGridLines(scale: AxisScale, gridSize: Size, options: SvgService.LineOptions): string {
        return [
            '<g>',
            ...SvgService.repeat(scale.lineCount - 1, (index) => {
                const xPosition = (index + 1) * scale.spacing;
                return SvgService.line({ x: xPosition, y: 0 }, { x: xPosition, y: gridSize.height }, options);
            }),
            '</g>',
        ].join('');
    }
}
