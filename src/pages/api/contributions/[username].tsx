import ContributionsChart from '@/components/ContributionsChart';
import { NextApiRequest, NextApiResponse } from 'next';
import { renderToString } from 'react-dom/server';

let cachedSvg: string | null = null;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!cachedSvg) {
        const html = renderToString(<ContributionsChart />);

        const htmlWithoutDiv = html.substring(html.indexOf('>') + 1, html.lastIndexOf('<'));

        cachedSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="450" viewBox="0 0 1200 420"><style>svg { background-color: #0d1117; } </style>${htmlWithoutDiv}</svg>`; // Remove surrounding <div></div>
    }

    res.status(200).setHeader('Content-Type', 'image/svg+xml').send(cachedSvg);
}
