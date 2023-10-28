import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest): Response {
    const res = req.method === 'OPTIONS' ? new Response(undefined, { status: 204 }) : NextResponse.next();

    res.headers.append('Access-Control-Allow-Origin', '*');
    res.headers.append('Access-Control-Allow-Methods', 'GET');
    return res;
}

export const config = {
    matcher: '/api/:path*', // Match all API routes
};
