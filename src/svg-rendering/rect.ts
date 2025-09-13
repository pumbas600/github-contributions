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
