import { ChartService } from '@/services/ChartService';
import { SvgService } from '@/services/SvgService';
import Contribution from '@/types/interfaces/Contribution';
import { Size } from '@/types/interfaces/Vectors';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const gridSize: Size = { width: 750, height: 180 };
    const gridLineOptions: SvgService.LineOptions = {
        stroke: '#4BB5FC',
        strokeOpacity: 0.3,
        strokeDashArray: '3',
    };
    const axisOptions: ChartService.AxisOptions = {
        stroke: '#666',
        tickWidth: 6,
    };

    const cardSize: Size = { width: 850, height: 330 };
    const data: Contribution[] = SvgService.repeat(30, (index) => ({ count: index, date: index + 1 }));
    const xAxisScale = ChartService.calculateXAxisScale(gridSize, data);
    const yAxisScale = ChartService.calculateYAxisScale(gridSize, 5, data, 'count');

    console.log(xAxisScale, yAxisScale);

    const card = SvgService.card(
        cardSize,
        [
            SvgService.rect(cardSize, { fill: '#161B22', borderRadius: 4.5 }),
            '<g transform="translate(75, 80)">',
            ChartService.xAxisGridLines(xAxisScale, gridSize, gridLineOptions),
            ChartService.yAxisGridLines(yAxisScale, gridSize, gridLineOptions),

            ChartService.xAxis(xAxisScale, gridSize, axisOptions),
            ChartService.yAxis(yAxisScale, gridSize, axisOptions),
            '</g>',
        ].join(''),
    );

    res.status(200).setHeader('Content-Type', 'image/svg+xml').send(card);
}
