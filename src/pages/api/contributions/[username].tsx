import ContributionsChart from '@/components/ContributionsChart';
import { NextApiRequest, NextApiResponse } from 'next';
import { renderToPipeableStream, renderToString } from 'react-dom/server';

let cachedSvg: string | null = null;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!cachedSvg) {
        const html = renderToString(<ContributionsChart />);
        cachedSvg = html
            .substring(html.indexOf('>') + 1, html.lastIndexOf('<'))
            .replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    res.status(200).setHeader('Content-Type', 'image/svg+xml').send(cachedSvg);
}
