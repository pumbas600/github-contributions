import { ChartService } from '@/services/ChartService';
import { SvgService } from '@/services/SvgService';
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

    const card = SvgService.card(
        cardSize,
        [
            SvgService.rect(cardSize, { fill: '#161B22', borderRadius: 4.5 }),
            '<g transform="translate(75, 80)">',
            ChartService.horizontalGridLines(gridSize, 5, gridLineOptions),
            ChartService.verticalGridLines(gridSize, 30, gridLineOptions),
            ChartService.yAxis(gridSize, 5, axisOptions),
            ChartService.xAxis(gridSize, 30, axisOptions),
            '</g>',
        ].join(''),
    );

    res.status(200).setHeader('Content-Type', 'image/svg+xml').send(card);
}
