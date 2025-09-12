import Config from '@/config';
import { Point } from './point';
import { Rect, Size } from './rect';
import { svgAttributesToString } from './svg-helpers';

export interface LineOptions {
    stroke?: string;
    strokeOpacity?: number;
    strokeDasharray?: string;
    strokeWidth?: number;
}

export function renderLine(point1: Point, point2: Point, options: LineOptions) {
    return `<line x1="${point1.x}" y1="${point1.y}" x2="${point2.x}" y2="${point2.y}" ${svgAttributesToString(
        options,
    )}></line>`;
}

export interface CircleOptions {
    fill?: string;
    r?: number;
}

export function renderCircle(center: Point, options: CircleOptions): string {
    return `<circle cx=${center.x} cy=${center.y} ${svgAttributesToString(options)}></circle>`;
}

export interface RectOptions {
    borderRadius?: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
}

export function renderRect(size: Size, options: RectOptions): string {
    return `<rect width="${size.width}" height="${size.height}" ${svgAttributesToString(options)}></rect>`;
}

export type AxisAnchor = 'start' | 'middle' | 'end';

export interface Anchor {
    horizontal: AxisAnchor;
    vertical: AxisAnchor;
}

export interface TextOptions {
    fill?: string;
    fontSize?: number;
    transform?: string;
    fontWeight?: number;
    letterSpacing?: string;
}

export function renderText(value: string, origin: Point, anchor: Anchor, options: TextOptions): string {
    const VerticalAnchorOffset: Record<AxisAnchor, string> = {
        start: '1em',
        middle: '0.334em',
        end: '0em',
    };

    const verticalOffset = VerticalAnchorOffset[anchor.vertical];

    return [
        `<text text-anchor="${anchor.horizontal}" x="${origin.x}" y="${origin.y}" ${svgAttributesToString(options)}>`,
        `<tspan dy="${verticalOffset}">${value}</tspan>`,
        '</text>',
    ].join('');
}

export function renderDebugRect(rect: Rect): string {
    if (Config.debug) {
        return renderRect(rect, { fill: 'red', stroke: 'black', strokeWidth: 2 });
    }
}
