'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';
import '@/app/nprogress.css';

export default function TopLoader() {
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(false);
    const loadingStartTime = useRef(null);
    const progressInterval = useRef(null);
    const previousPathname = useRef(pathname);
    const loadingTimeout = useRef(null);

    // Configure NProgress once
    useEffect(() => {
        NProgress.configure({
            showSpinner: false,
            minimum: 0.1,
            easing: 'ease',
            speed: 200,
            trickle: false
        });
    }, []);

    const startLoading = useCallback(() => {
        // Clear any existing intervals
        if (progressInterval.current) {
            clearInterval(progressInterval.current);
        }
        if (loadingTimeout.current) {
            clearTimeout(loadingTimeout.current);
        }

        setIsLoading(true);
        loadingStartTime.current = Date.now();
        NProgress.start();

        // Start progressive loading
        let currentProgress = 0.1;
        progressInterval.current = setInterval(() => {
            const elapsed = Date.now() - (loadingStartTime.current || Date.now());

            // Progressive loading algorithm
            if (elapsed < 500) {
                currentProgress = Math.min(0.3, currentProgress + 0.02);
            } else if (elapsed < 1500) {
                currentProgress = Math.min(0.7, currentProgress + 0.01);
            } else if (elapsed < 3000) {
                currentProgress = Math.min(0.85, currentProgress + 0.005);
            } else {
                currentProgress = Math.min(0.95, currentProgress + 0.002);
            }

            NProgress.set(currentProgress);
        }, 50);
    }, []);

    const completeLoading = useCallback(() => {
        if (progressInterval.current) {
            clearInterval(progressInterval.current);
            progressInterval.current = null;
        }
        if (loadingTimeout.current) {
            clearTimeout(loadingTimeout.current);
        }

        // Complete the progress
        NProgress.set(1);

        // Small delay before hiding
        loadingTimeout.current = setTimeout(() => {
            NProgress.done();
            setIsLoading(false);
        }, 150);
    }, []);

    // Handle pathname changes
    useEffect(() => {
        if (pathname !== previousPathname.current) {
            startLoading();
            previousPathname.current = pathname;
        }

        // Complete loading after page is ready
        const completeTimer = setTimeout(() => {
            if (isLoading) {
                completeLoading();
            }
        }, 200);

        return () => {
            clearTimeout(completeTimer);
        };
    }, [pathname, isLoading, startLoading, completeLoading]);

    // Handle page visibility changes
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && isLoading) {
                completeLoading();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isLoading, completeLoading]);

    // Handle beforeunload
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (isLoading) {
                NProgress.done();
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isLoading]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
            if (loadingTimeout.current) {
                clearTimeout(loadingTimeout.current);
            }
        };
    }, []);

    return null;
}
