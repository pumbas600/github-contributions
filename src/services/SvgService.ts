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
        strokeDasharray?: string;
        strokeWidth?: number;
    }

    export function line(point1: Point, point2: Point, options: LineOptions): string {
        return `<line x1="${point1.x}" y1="${point1.y}" x2="${point2.x}" y2="${point2.y}" ${attributes(
            options,
        )}></line>`;
    }

    export function attributes(attributes: object): string {
        return Object.entries(attributes)
            .filter(([, value]) => value !== undefined)
            .map(([key, value]) => `${camelCaseToSnakeCase(key)}="${value}"`)
            .join(' ');
    }

    function camelCaseToSnakeCase(camelCaseKey: string): string {
        return camelCaseKey.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }

    export function repeat<T>(length: number, producer: (index: number) => T): T[] {
        return Array.from({ length }, (_, index) => producer(index));
    }

    export interface CircleOptions {
        fill: string;
        radius: number;
    }

    export function circle(center: Point, { fill, radius }: CircleOptions): string {
        return `<circle cx="${center.x}" cy="${center.y}" r="${radius}" fill="${fill}"></circle>`;
    }
}
