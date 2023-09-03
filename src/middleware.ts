import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest): NextResponse {
    const response = NextResponse.next();

    if (response.status === 304) {
        logCacheHit(request);
    }

    return response;
}

async function logCacheHit(request: NextRequest): Promise<void> {
    // Dynamically import Metric service so that it's not loaded unless needed
    const { MetricsService } = await import('@/services/MetricsService');

    const username = request.nextUrl.pathname.substring('/api/contributions/'.length);
    MetricsService.logCachedContributionsRequest(username);
}

export const config = {
    matcher: '/api/contributions/:username*',
};
