import { Point } from '@/types/interfaces/Vectors';
import { SvgService } from '../SvgService';

interface LineGraphOptions {
    dot: SvgService.CircleOptions;
    path: SvgService.PathOptions;
    area?: SvgService.PathOptions;
}

export function lineGraph(points: Point[], options: LineGraphOptions): string {
    const graph = [
        SvgService.path(points, SvgService.bezierCommand, {
            ...options.path,
            fill: options.path.fill ?? 'transparent',
        }),
    ];

    if (options.area) {
        graph.push(SvgService.path(points, SvgService.bezierCommand, options.area));
    }

    return [...graph, ...points.map((point) => SvgService.circle(point, options.dot))].join('');
}
