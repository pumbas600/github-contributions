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
        tickLabelFontSize: number;
        tickLabelFill: string;
        tickLabelSpacing: number;
        tickWidth: number;
    }

    export function yAxis(scale: YAxisScale, gridSize: Size, options: AxisOptions): string {
        return [
            SvgService.line({ x: 0, y: 0 }, { x: 0, y: gridSize.height }, options),
            ...SvgService.repeat(scale.lineCount + 1, (index) => {
                const yPosition = index * scale.spacing;
                const xTickEnd = -options.tickWidth;
                const xTickLabelStart = xTickEnd - options.tickLabelSpacing;
                /* We need to subtract this from the max value because 0 is at the bottom. */
                const tickLabel = scale.axisMaxValue - index * scale.axisStepValue;

                return [
                    SvgService.line({ x: 0, y: yPosition }, { x: xTickEnd, y: yPosition }, options),
                    `<text font-size="${options.tickLabelFontSize}" text-anchor="end" fill="${options.tickLabelFill}" x="${xTickLabelStart}" y="${yPosition}">`,
                    `<tspan dy="0.334em">${tickLabel}</tspan>`,
                    '</text>',
                ].join('');
            }),
        ].join('');
    }

    export function xAxis(scale: AxisScale, gridSize: Size, options: AxisOptions): string {
        return [
            SvgService.line({ x: 0, y: gridSize.height }, { x: gridSize.width, y: gridSize.height }, options),
            ...SvgService.repeat(scale.lineCount + 1, (index) => {
                const xPosition = index * scale.spacing;
                const yTickStart = gridSize.height;
                const yTickEnd = yTickStart + options.tickWidth;
                return [
                    SvgService.line({ x: xPosition, y: yTickStart }, { x: xPosition, y: yTickEnd }, options),
                    `<text font-size="${options.tickLabelFontSize}" text-anchor="middle" fill="${options.tickLabelFill}" x="${xPosition}" y="${yTickEnd}">`,
                    `<tspan dy="1em">${index + 1}</tspan>`,
                    '</text>',
                ].join('');
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
