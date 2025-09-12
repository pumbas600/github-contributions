import { addPoints, Point } from './point';

export interface Size {
    width: number;
    height: number;
}

export interface Rect extends Size {
    origin: Point;
}

export function rectEndPoint(rect: Rect): Point {
    return addPoints(rect.origin, { x: rect.width, y: rect.height });
}

export function rectFromPoints(origin: Point, endPoint: Point): Rect {
    return {
        origin,
        width: origin.x - endPoint.x,
        height: origin.y - endPoint.y,
    };
}
