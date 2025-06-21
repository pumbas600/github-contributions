import { Point, Size } from '@/types/interfaces/Vectors';
import { SvgService } from '../SvgService';

interface LineGraphOptions {
    dot: SvgService.CircleOptions;
    path: SvgService.PathOptions;
    area?: SvgService.PathOptions;
}

export function lineGraph(gridArea: Size, points: Point[], options: LineGraphOptions): string {
    const graph = [SvgService.path(points, SvgService.bezierCommand, options.path)];

    if (options.area) {
        graph.push(
            SvgService.path(
                points,
                SvgService.bezierCommand,
                options.area,
                `L ${gridArea.width} ${gridArea.height} L 0 ${gridArea.height}`,
            ),
        );
    }

    return [...graph, ...points.map((point) => SvgService.circle(point, options.dot))].join('');
}
