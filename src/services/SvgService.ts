export namespace SvgService {
    export interface Point {
        x: number;
        y: number;
    }

    export interface Size {
        width: number;
        height: number;
    }

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

    export function horizontalGridLines(gridSize: Size, lineCount: number, options: LineOptions): string {
        const spacing = gridSize.height / lineCount;

        return [
            '<g>',
            ...repeat(lineCount, (index) => {
                const yPosition = index * spacing;
                return line({ x: 0, y: yPosition }, { x: gridSize.width, y: yPosition }, options);
            }),
            '</g>',
        ].join('');
    }

    export function verticalGridLines(gridSize: Size, lineCount: number, options: LineOptions): string {
        const spacing = gridSize.width / lineCount;

        return [
            '<g>',
            ...repeat(lineCount, (index) => {
                const xPosition = (index + 1) * spacing;
                return line({ x: xPosition, y: 0 }, { x: xPosition, y: gridSize.height }, options);
            }),
            '</g>',
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
        strokeOpacity: number;
        strokeDashArray: string;
    }

    function line(point1: Point, point2: Point, { stroke, strokeOpacity, strokeDashArray }: LineOptions): string {
        return `<line x1="${point1.x}" y1="${point1.y}" x2="${point2.x}" y2="${point2.y}" stroke="${stroke}" stroke-opacity="${strokeOpacity}" stroke-dasharray="${strokeDashArray}"></line>`;
    }

    function repeat<T>(length: number, producer: (index: number) => T): T[] {
        return Array.from({ length }, (_, index) => producer(index));
    }
}
