export interface Point {
    x: number;
    y: number;
}

export function addPoints(point1: Point, point2: Point): Point {
    return {
        x: point1.x + point2.x,
        y: point1.y + point2.y,
    };
}
