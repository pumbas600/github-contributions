import { Point } from '@/types/interfaces/Vectors';
import { SvgService } from '../SvgService';

const LINE_SMOOTHING_FACTOR = 0.2;

interface LineGraphOptions {
    dot: SvgService.CircleOptions;
    line: SvgService.LineOptions;
}

export function lineGraph(points: Point[], options: LineGraphOptions): string {
    return [
        svgPath(points, bezierCommand, options.line),
        ...points.map((point) => SvgService.circle(point, options.dot)),
    ].join('');
}

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

function bezierCommand(point: Point, index: number, points: Point[]) {
    const startControlPoint = calculateControlPoint(points[index - 1], points[index - 2], point);
    const endControlPoint = calculateControlPoint(point, points[index - 1], points[index + 1], true);

    return `C ${startControlPoint.x},${startControlPoint.y} ${endControlPoint.x},${endControlPoint.y} ${point.x},${point.y}`;
}

/**
 * Credit: https://francoisromain.medium.com/smooth-a-svg-path-with-cubic-bezier-curves-e37b49d46c74
 */
function svgPath(
    points: Point[],
    command: (point: Point, index: number, points: Point[]) => string,
    options: SvgService.LineOptions,
): string {
    // build the d attributes by looping over the points
    const d = points.reduce(
        (acc, point, index, array) =>
            index === 0 ? `M ${point.x},${point.y}` : `${acc} ${command(point, index, array)}`,
        '',
    );
    return `<path d="${d}" ${SvgService.attributes(options)} />`;
}
