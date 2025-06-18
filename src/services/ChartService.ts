import { Size } from '@/types/interfaces/Vectors';
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
        key: keyof NumericValues<T>,
    ): YAxisScale {
        const spacing = gridSize.height / lineCount;
        const maxValue = Math.max(...data.map((item) => item[key]));
        const axisStepValue = Math.ceil(maxValue / lineCount);
        const axisMaxValue = axisStepValue * lineCount;

        return {
            spacing,
            lineCount,
            axisMaxValue,
            axisStepValue,
        };
    }

    export function calculateXAxisScale<T>(gridSize: Size, data: NumericValues<T>[]): AxisScale {
        const lineCount = data.length;
        const spacing = gridSize.width / lineCount;

        return {
            spacing,
            lineCount,
        };
    }

    export interface AxisOptions extends SvgService.LineOptions {
        tickWidth: number;
    }

    export function yAxis(scale: AxisScale, gridSize: Size, options: AxisOptions): string {
        return [
            SvgService.line({ x: 0, y: 0 }, { x: 0, y: gridSize.height }, options),
            ...SvgService.repeat(scale.lineCount + 1, (index) => {
                const yPosition = index * scale.spacing;
                return SvgService.line({ x: 0, y: yPosition }, { x: -options.tickWidth, y: yPosition }, options);
            }),
        ].join('');
    }

    export function xAxis(scale: AxisScale, gridSize: Size, options: AxisOptions): string {
        return [
            SvgService.line({ x: 0, y: gridSize.height }, { x: gridSize.width, y: gridSize.height }, options),
            ...SvgService.repeat(scale.lineCount + 1, (index) => {
                const xPosition = index * scale.spacing;
                return SvgService.line(
                    { x: xPosition, y: gridSize.height },
                    { x: xPosition, y: gridSize.height + options.tickWidth },
                    options,
                );
            }),
        ].join('');
    }

    export function yAxisGridLines(scale: AxisScale, gridSize: Size, options: SvgService.LineOptions): string {
        return [
            '<g>',
            ...SvgService.repeat(scale.lineCount, (index) => {
                const yPosition = index * scale.spacing;
                return SvgService.line({ x: 0, y: yPosition }, { x: gridSize.width, y: yPosition }, options);
            }),
            '</g>',
        ].join('');
    }

    export function xAxisGridLines(scale: AxisScale, gridSize: Size, options: SvgService.LineOptions): string {
        const spacing = gridSize.width / scale.lineCount;

        return [
            '<g>',
            ...SvgService.repeat(scale.lineCount, (index) => {
                const xPosition = (index + 1) * spacing;
                return SvgService.line({ x: xPosition, y: 0 }, { x: xPosition, y: gridSize.height }, options);
            }),
            '</g>',
        ].join('');
    }
}
