import { Point, Size } from '@/types/interfaces/Vectors';

export namespace SvgService {
    export interface CardOptions {
        size: Size;
        style?: string;
    }

    export function card(size: Size, children: string): string {
        return [
            `<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}" viewBox="0 0 ${size.width} ${size.height}">`,
            children,
            `</svg>`,
        ].join('');
    }

    export interface RectOptions {
        fill: string;
        borderRadius?: number;
    }

    export function rect(size: Size, { fill, borderRadius = 0 }: RectOptions): string {
        return `<rect width="${size.width}" height="${size.height}" rx="${borderRadius}" fill="${fill}"></rect>`;
    }

    export interface LineOptions {
        stroke: string;
        strokeOpacity?: number;
        strokeDashArray?: string;
    }

    export function line(
        point1: Point,
        point2: Point,
        { stroke, strokeOpacity = 1, strokeDashArray }: LineOptions,
    ): string {
        const strokeDashArrayValue = strokeDashArray !== undefined ? `stroke-dasharray="${strokeDashArray}"` : '';
        return `<line x1="${point1.x}" y1="${point1.y}" x2="${point2.x}" y2="${point2.y}" stroke="${stroke}" stroke-opacity="${strokeOpacity}" ${strokeDashArrayValue}></line>`;
    }

    export function repeat<T>(length: number, producer: (index: number) => T): T[] {
        return Array.from({ length }, (_, index) => producer(index));
    }
}
