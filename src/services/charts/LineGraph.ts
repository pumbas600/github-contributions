import { Point } from '@/types/interfaces/Vectors';
import { SvgService } from '../SvgService';

interface LineGraphOptions {
    dot: SvgService.CircleOptions;
    line: SvgService.LineOptions;
}

export function lineGraph(points: Point[], options: LineGraphOptions): string {
    return [
        SvgService.path(points, SvgService.bezierCommand, { ...options.line, fill: 'transparent' }),
        ...points.map((point) => SvgService.circle(point, options.dot)),
    ].join('');
}
