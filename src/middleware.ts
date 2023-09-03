import { MetricsService } from '@/services/MetricsService';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest): Promise<NextResponse> {
    const username = request.nextUrl.pathname.substring('/api/contributions/'.length);
    await MetricsService.logContributionRequest(username);
    return NextResponse.next();
}

export const config = {
    matcher: '/api/contributions/:username*',
    unstable_allowDynamic: ['/node_modules/@firebase/firestore/**'],
};
