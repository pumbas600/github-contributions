import { cacheSvg, getCachedSvg } from '@/cache';
import ContributionsChart from '@/components/ContributionsChart';
import { QueryParamsModel } from '@/models/QueryParams';
import { OptionsService } from '@/services/OptionsService';
import { NextApiRequest, NextApiResponse } from 'next';
import { renderToString } from 'react-dom/server';
import { ZodError } from 'zod';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
        const { username, ...queryOptions } = await QueryParamsModel.parseAsync(req.query);
        const options = OptionsService.getOptions(queryOptions);

        let svg = getCachedSvg(username, options);
        if (!svg) {
            const html = renderToString(<ContributionsChart options={options} />);

            // Remove surrounding <div></div>
            const htmlWithoutDiv = html.substring(html.indexOf('>') + 1, html.lastIndexOf('<'));

            svg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="${options.width}"
                        height="${options.height}" viewBox="0 0 ${options.width} ${options.height}">
                    <style>svg { background-color: #0d1117; }</style>
                    ${htmlWithoutDiv}
                </svg>`;

            cacheSvg(username, options, svg);
        }

        res.status(200).setHeader('Content-Type', 'image/svg+xml').send(svg);
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({
                errors: error.issues.map((issue) => issue.message),
            });
        }
    }
}
