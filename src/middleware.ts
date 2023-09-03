import { NextRequest, NextResponse } from 'next/server';
import { MetricsService } from './services/MetricsService';

export function middleware(request: NextRequest): NextResponse {
    const response = NextResponse.next();

    // Cache hit
    if (response.status === 304) {
        const username = request.nextUrl.pathname.substring('/api/contributions/'.length);
        MetricsService.logCachedContributionsRequest(username);
    }

    return response;
}

export const config = {
    matcher: '/api/contributions/:username*',
};
