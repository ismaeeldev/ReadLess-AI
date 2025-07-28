"use client"
import React, { useEffect, useState } from 'react'
import BgGradient from '@/components/common/bg-gradient'
import HeroSection from '@/components/summaries/Hero'
import Summaries from '@/components/summaries/Summaries'
import PremiumRestriction from '@/components/summaries/PremiumRestriction'
import { getCurrentUserPlan } from '@/lib/db'

const Page = () => {
    const [userPlan, setUserPlan] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserPlan = async () => {
            try {
                const planData = await getCurrentUserPlan();
                // console.log("planData", planData);
                setUserPlan(planData?.plan || 'starter');
            } catch (error) {
                console.error('Error fetching user plan:', error);
                setUserPlan('starter');
            } finally {
                setLoading(false);
            }
        };

        fetchUserPlan();
    }, []);

    if (loading) {
        return (
            <>
                <BgGradient />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-600">Checking your plan...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <BgGradient />
            {userPlan === 'starter' ? (
                <PremiumRestriction />
            ) : (
                <>
                    <HeroSection />
                    <Summaries />
                </>
            )}
        </>
    )
}

export default Page
