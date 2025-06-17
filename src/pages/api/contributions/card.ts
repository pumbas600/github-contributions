import { SvgService } from '@/services/SvgService';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const gridSize: SvgService.Size = { width: 750, height: 180 };
    const gridLineOptions: SvgService.LineOptions = {
        stroke: '#d0d7de',
        strokeOpacity: 0.3,
        strokeDashArray: '3',
    };
    const cardSize: SvgService.Size = { width: 850, height: 330 };

    const card = SvgService.card(
        cardSize,
        [
            SvgService.rect(cardSize, { fill: 'black', borderRadius: 4.5 }),
            '<g transform="translate(75, 80)">',
            SvgService.horizontalGridLines(gridSize, 5, gridLineOptions),
            SvgService.verticalGridLines(gridSize, 30, gridLineOptions),
            '</g>',
        ].join(''),
    );

    res.status(200).setHeader('Content-Type', 'image/svg+xml').send(card);
}
