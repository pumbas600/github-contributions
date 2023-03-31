import ContributionsChart from '@/components/ContributionsChart';
import { Options } from '@/models/Options';
import { NextApiRequest, NextApiResponse } from 'next';
import { renderToString } from 'react-dom/server';

let cachedSvg: string | null = null;

const DefaultOptions: Options = {
    color: '#5bcdec',
    width: 1200,
    height: 450,
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!cachedSvg) {
        const options = DefaultOptions;

        const html = renderToString(<ContributionsChart options={options} />);

        // Remove surrounding <div></div>
        const htmlWithoutDiv = html.substring(html.indexOf('>') + 1, html.lastIndexOf('<'));

        cachedSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${options.width}" height="${options.height}" viewBox="0 0 ${options.width} ${options.height}"><style>svg { background-color: #0d1117; } </style>${htmlWithoutDiv}</svg>`;
    }

    res.status(200).setHeader('Content-Type', 'image/svg+xml').send(cachedSvg);
}
