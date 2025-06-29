import { Point, Size } from '@/types/interfaces/Vectors';
import { SvgService } from './SvgService';

export namespace ChartService {
    export interface AxisScale {
        lineCount: number;
        spacing: number;
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
    ): YAxisScale {
        if (lineCount < 2) {
            throw new Error('Line count must be at least 2');
        }

        const spacing = gridSize.height / (lineCount - 1);
        const maxValue = Math.max(...data.map((item) => item[valueKey]));
        const axisStepValue = Math.ceil(maxValue / (lineCount - 1));
        const axisMaxValue = axisStepValue * (lineCount - 1);

        return {
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

    export function calculateXAxisScale<T>(gridSize: Size, data: NumericValues<T>[]): AxisScale {
        const lineCount = data.length;
        const spacing = gridSize.width / (lineCount - 1);

        return {
            spacing,
            lineCount,
        };
    }

    export interface AxisOptions extends SvgService.LineOptions {
        tick: {
            width: number;
            gap: number;
        } & Omit<SvgService.TextOptions, 'horizontalAnchor' | 'verticalAnchor'>;
    }

    export function yAxis(scale: YAxisScale, gridSize: Size, options: AxisOptions): string {
        const { width: tickWidth, gap: tickGap, ...tickOptions } = options.tick;

        return [
            SvgService.line({ x: 0, y: 0 }, { x: 0, y: gridSize.height }, options),
            ...SvgService.repeat(scale.lineCount, (index) => {
                const yPosition = index * scale.spacing;
                const xTickEnd = -tickWidth;
                const xTickLabelStart = xTickEnd - tickGap;
                /* We need to subtract this from the max value because 0 is at the bottom. */
                const tickLabel = scale.axisMaxValue - index * scale.axisStepValue;

                return [
                    SvgService.line({ x: 0, y: yPosition }, { x: xTickEnd, y: yPosition }, options),
                    SvgService.text(
                        tickLabel,
                        { x: xTickLabelStart, y: yPosition },
                        { horizontalAnchor: 'end', verticalAnchor: 'middle', ...tickOptions },
                    ),
                ].join('');
            }),
        ].join('');
    }

    export function xAxis<T>(scale: AxisScale, gridSize: Size, data: T[], key: keyof T, options: AxisOptions): string {
        const { width: tickWidth, gap: tickGap, ...tickOptions } = options.tick;

        return [
            SvgService.line({ x: 0, y: gridSize.height }, { x: gridSize.width, y: gridSize.height }, options),
            ...SvgService.repeat(scale.lineCount, (index) => {
                const xPosition = index * scale.spacing;
                const yTickStart = gridSize.height;
                const yTickEnd = yTickStart + tickWidth;
                const label = data[index][key];
                return [
                    SvgService.line({ x: xPosition, y: yTickStart }, { x: xPosition, y: yTickEnd }, options),
                    SvgService.text(
                        label,
                        { x: xPosition, y: yTickEnd },
                        { horizontalAnchor: 'middle', verticalAnchor: 'start', ...tickOptions },
                    ),
                ].join('');
            }),
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
