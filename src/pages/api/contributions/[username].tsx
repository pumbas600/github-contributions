import ContributionsChart from '@/components/ContributionsChart';
import { Options } from '@/models/Options';
import { QueryParamsModel } from '@/models/QueryParams';
import { NextApiRequest, NextApiResponse } from 'next';
import { renderToString } from 'react-dom/server';
import { ZodError } from 'zod';

interface CachedSvg {
    svg: string;
    date: string;
}

const CACHE: Record<string, CachedSvg> = {};

const DefaultOptions: Options = {
    color: '5bcdec',
    width: 1200,
    height: 450,
};

function getCacheKey(username: string, options: Options): string {
    return `${username}-${JSON.stringify(options)}`;
}

function isCacheOutdated(cachedSvg: CachedSvg): boolean {
    const todaysDate = new Date().toDateString();
    return cachedSvg.date !== todaysDate;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
        const { username, ...queryOptions } = await QueryParamsModel.parseAsync(req.query);
        const options = { ...DefaultOptions, ...queryOptions };
        options.color = `#${options.color}`; // Add the # back to the hexadecimal colour

        const cacheKey = getCacheKey(username, options);

        if (!CACHE[cacheKey] || isCacheOutdated(CACHE[cacheKey])) {
            console.log('recalculating...');
            const html = renderToString(<ContributionsChart options={options} />);

            // Remove surrounding <div></div>
            const htmlWithoutDiv = html.substring(html.indexOf('>') + 1, html.lastIndexOf('<'));

            CACHE[cacheKey] = {
                svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${options.width}" height="${options.height}" viewBox="0 0 ${options.width} ${options.height}"><style>svg { background-color: #0d1117; } </style>${htmlWithoutDiv}</svg>`,
                date: new Date().toDateString(),
            };
        }

        res.status(200).setHeader('Content-Type', 'image/svg+xml').send(CACHE[cacheKey].svg);
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({
                errors: error.issues.map((issue) => issue.message),
            });
        }
    }
}
