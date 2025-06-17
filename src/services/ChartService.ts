import { Size } from '@/types/interfaces/Vectors';
import { SvgService } from './SvgService';

export namespace ChartService {
    export interface YAxisScale {
        lineCount: number;
        spacing: number;
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

    export interface AxisOptions extends SvgService.LineOptions {
        tickWidth: number;
    }

    export function yAxis(gridSize: Size, lineCount: number, options: AxisOptions): string {
        const spacing = gridSize.height / lineCount;

        return [
            SvgService.line({ x: 0, y: 0 }, { x: 0, y: gridSize.height }, options),
            ...SvgService.repeat(lineCount + 1, (index) => {
                const yPosition = index * spacing;
                return SvgService.line({ x: 0, y: yPosition }, { x: -options.tickWidth, y: yPosition }, options);
            }),
        ].join('');
    }

    export function xAxis(gridSize: Size, lineCount: number, options: AxisOptions): string {
        const spacing = gridSize.width / lineCount;

        return [
            SvgService.line({ x: 0, y: gridSize.height }, { x: gridSize.width, y: gridSize.height }, options),
            ...SvgService.repeat(lineCount + 1, (index) => {
                const xPosition = index * spacing;
                return SvgService.line(
                    { x: xPosition, y: gridSize.height },
                    { x: xPosition, y: gridSize.height + options.tickWidth },
                    options,
                );
            }),
        ].join('');
    }

    export function horizontalGridLines(gridSize: Size, lineCount: number, options: SvgService.LineOptions): string {
        const spacing = gridSize.height / lineCount;

        return [
            '<g>',
            ...SvgService.repeat(lineCount, (index) => {
                const yPosition = index * spacing;
                return SvgService.line({ x: 0, y: yPosition }, { x: gridSize.width, y: yPosition }, options);
            }),
            '</g>',
        ].join('');
    }

    export function verticalGridLines(gridSize: Size, lineCount: number, options: SvgService.LineOptions): string {
        const spacing = gridSize.width / lineCount;

        return [
            '<g>',
            ...SvgService.repeat(lineCount, (index) => {
                const xPosition = (index + 1) * spacing;
                return SvgService.line({ x: xPosition, y: 0 }, { x: xPosition, y: gridSize.height }, options);
            }),
            '</g>',
        ].join('');
    }
}
