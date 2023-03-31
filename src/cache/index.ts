import { Options } from '@/models/Options';

interface CachedSvg {
    svg: string;
    date: string;
    options: Options;
}

type Username = string;

// Only cache 1 svg per user
const CACHE: Record<Username, CachedSvg> = {};

export function cacheSvg(username: string, options: Options, svg: string): void {
    CACHE[username] = { options, svg, date: new Date().toDateString() };
}

function isCacheOutdated(cachedSvg: CachedSvg): boolean {
    const todaysDate = new Date().toDateString();
    return cachedSvg.date !== todaysDate;
}

export function getCachedSvg(username: string, options: Options): string | undefined {
    const cachedSvg = CACHE[username];
    if (cachedSvg && cachedSvg.options === options && !isCacheOutdated(cachedSvg)) {
        return cachedSvg.svg;
    }

    return undefined;
}
