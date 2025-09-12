export function renderRepeat(length: number, renderer: (index: number) => string): string[] {
    return Array.from({ length }, (_, index) => renderer(index));
}

export function svgAttributesToString(attributes: object): string {
    return Object.entries(attributes)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => `${camelCaseToSnakeCase(key)}="${value}"`)
        .join(' ');
}

function camelCaseToSnakeCase(camelCaseKey: string): string {
    return camelCaseKey.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
