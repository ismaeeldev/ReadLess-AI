import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
    '/summaries',
    '/upload',
    '/payment-warning',
    '/payment',
]);

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.redirect(new URL('/sign-in', req.url));
        }
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};