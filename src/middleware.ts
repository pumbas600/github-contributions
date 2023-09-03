import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest): Promise<NextResponse> {
    const response = NextResponse.next();

    console.log(response.redirected);
    if (response.status === 304) {
        await logCacheHit(request);
    }

    return response;
}

async function logCacheHit(request: NextRequest): Promise<void> {
    // Dynamically import Metric service so that it's not loaded unless needed
    const { MetricsService } = await import('@/services/MetricsService');

    const username = request.nextUrl.pathname.substring('/api/contributions/'.length);
    await MetricsService.logCachedContributionsRequest(username);
}

export const config = {
    matcher: '/api/contributions/:username*',
    unstable_allowDynamic: ['/node_modules/@firebase/firestore/**'],
};
