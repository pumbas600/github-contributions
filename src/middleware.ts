import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest): NextResponse {
    const response = NextResponse.next();

    // Cache hit
    if (response.status === 304) {
        // TODO: Log cache hit
    }

    return response;
}

export const config = {
    matcher: '/api/contributions/:username*',
};
