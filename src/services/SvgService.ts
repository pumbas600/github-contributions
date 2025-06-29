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

    const LINE_SMOOTHING_FACTOR = 0.2;

    interface LineProperties {
        length: number;
        /** The angle in radians. */
        angle: number;
    }

    function lineProperties(pointA: Point, pointB: Point): LineProperties {
        const lengthX = pointB.x - pointA.x;
        const lengthY = pointB.y - pointA.y;
        return {
            length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
            angle: Math.atan2(lengthY, lengthX),
        };
    }

    function calculateControlPoint(current: Point, previous?: Point, next?: Point, reverse?: boolean): Point {
        /* When `current` is the first or last point of the array, the previous or next points don't exist. */
        previous ??= current;
        next ??= current;

        // Properties of the opposed-line
        const opposedLineProperties = lineProperties(previous, next);

        // If is end-control-point, add PI to the angle to go backward
        const angle = opposedLineProperties.angle + (reverse ? Math.PI : 0);
        const length = opposedLineProperties.length * LINE_SMOOTHING_FACTOR;

        // The control point position is relative to the current point
        const x = current.x + Math.cos(angle) * length;
        const y = current.y + Math.sin(angle) * length;
        return { x, y };
    }

    export function bezierCommand(point: Point, index: number, points: Point[]) {
        const startControlPoint = calculateControlPoint(points[index - 1], points[index - 2], point);
        const endControlPoint = calculateControlPoint(point, points[index - 1], points[index + 1], true);

        return `C ${startControlPoint.x},${startControlPoint.y} ${endControlPoint.x},${endControlPoint.y} ${point.x},${point.y}`;
    }

    export interface PathOptions extends Partial<SvgService.LineOptions> {
        fill?: string;
        opacity?: number;
    }

    /**
     * Credit: https://francoisromain.medium.com/smooth-a-svg-path-with-cubic-bezier-curves-e37b49d46c74
     */
    export function path(
        points: Point[],
        command: (point: Point, index: number, points: Point[]) => string,
        options: PathOptions,
        pathSuffix = '',
    ): string {
        // build the d attributes by looping over the points
        const d = points.reduce(
            (acc, point, index, array) =>
                index === 0 ? `M ${point.x},${point.y}` : `${acc} ${command(point, index, array)}`,
            '',
        );
        return `<path d="${d + pathSuffix}" ${SvgService.attributes(options)} />`;
    }

    export type AxisAnchor = 'start' | 'middle' | 'end';

    export interface Anchor {
        horizontal: AxisAnchor;
        vertical: AxisAnchor;
    }

    export interface TextOptions extends Partial<Point> {
        fill: string;
        fontSize: number;
        transform?: string;
        fontWeight?: number;
        letterSpacing?: string;
    }

    const VerticalAnchorOffset: Record<AxisAnchor, string> = {
        start: '1em',
        middle: '0.334em',
        end: '0em',
    };

    export function text(value: unknown, anchor: Anchor, options: TextOptions): string {
        const verticalOffset = VerticalAnchorOffset[anchor.vertical];

        return [
            `<text text-anchor="${anchor.horizontal}" ${attributes(options)}>`,
            `<tspan dy="${verticalOffset}">${value}</tspan>`,
            '</text>',
        ].join('');
    }
}
