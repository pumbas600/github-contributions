import { addPoints, Point } from './point';

export interface Rect {
    width: number;
    height: number;
    origin: Point;
}

export function rectEndPoint(rect: Rect): Point {
    return addPoints(rect.origin, { x: rect.width, y: rect.height });
}

export function rectFromPoints(origin: Point, endPoint: Point): Rect {
    return {
        origin,
        width: endPoint.x - origin.x,
        height: endPoint.y - origin.y,
    };
}

export interface ShrinkOptions {
    xStart?: number;
    xEnd?: number;
    yStart?: number;
    yEnd?: number;
    x?: number;
    y?: number;
}

export function shrinkRect(rect: Rect, options: ShrinkOptions | number): Rect {
    if (typeof options === 'number') {
        options = { x: options, y: options };
    }

    const xStart = options.xStart ?? options.x ?? 0;
    const xEnd = options.xEnd ?? options.x ?? 0;
    const yStart = options.yStart ?? options.y ?? 0;
    const yEnd = options.yEnd ?? options.y ?? 0;

    return {
        origin: addPoints(rect.origin, { x: xStart, y: yStart }),
        width: Math.max(0, rect.width - xStart - xEnd),
        height: Math.max(0, rect.height - yStart - yEnd),
    };
}
