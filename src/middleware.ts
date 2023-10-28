import { NextResponse } from 'next/server';

export function middleware(): NextResponse {
    const res = NextResponse.next();

    res.headers.append('Access-Control-Allow-Origin', '*');
    res.headers.append('Access-Control-Allow-Methods', 'GET');

    return res;
}

export const config = {
    matcher: '/api/:path*', // Match all API routes
};
