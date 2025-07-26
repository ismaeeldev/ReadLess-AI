
"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from "next/image";
import { getCurrentUserPlan } from '@/lib/db';

import {
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [plan, setPlan] = useState(null);
    const [planLoading, setPlanLoading] = useState(true);

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                setPlanLoading(true);
                const userPlan = await getCurrentUserPlan();
                // console.log("userPlan", userPlan);
                setPlan(userPlan?.plan || '');
            } catch (error) {
                console.error('Error fetching user plan:', error);
                setPlan('starter');
            } finally {
                setPlanLoading(false);
            }
        };

        fetchPlan();
    }, []);

    const planStyles = {
        starter: 'text-green-600 border border-green-500 rounded-full px-4 py-1 bg-green-50',
        pro: 'text-yellow-600 border border-yellow-500 rounded-full px-4 py-1 bg-yellow-50',
        enterprise: 'text-blue-600 border border-blue-500 rounded-full px-4 py-1 bg-blue-50',
        free: 'text-green-600 border border-green-500 rounded-full px-4 py-1 bg-green-50', // fallback
    };

    const renderPlanBadge = () => {
        if (planLoading || !plan) {
            return null;
        }

        return (
            <span className={`px-3 py-1 text-sm rounded-full capitalize ${planStyles[plan] || planStyles['starter']}`}>
                {plan} Plan
            </span>
        );
    };

    const renderMobilePlanBadge = () => {
        if (planLoading || !plan) {
            return null;
        }

        return (
            <span className={`px-3 py-1 text-xs rounded-full capitalize ${planStyles[plan] || planStyles['starter']}`}>
                {plan} Plan
            </span>
        );
    };

    return (
        <header className="container mx-auto px-4 lg:px-8 py-4">
            <nav className="flex items-center justify-between relative">
                <div className="flex items-center gap-x-2 lg:gap-x-3 flex-1">
                    <Link href="/" className="flex items-center gap-x-2  text-gray-900" >
                        <motion.span
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className="lg:text-xl font-extrabold text-gray-900"
                        >
                            <Image
                                src="/logo.png"
                                alt="ReadLess Logo"
                                width={120}
                                height={40}
                                className="object-contain w-auto h-8 sm:h-10 md:h-12"
                                priority
                                quality={100}
                            />
                        </motion.span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex justify-center flex-1 gap-8 lg:gap-12">
                    <Link href="/#pricing" className="text-gray-700 hover:text-rose-500  font-medium">
                        Pricing
                    </Link>
                    <SignedIn>
                        <Link href="/summaries" className="text-gray-700 hover:text-rose-500 font-medium">
                            Your Summaries
                        </Link>
                    </SignedIn>
                </div>

                <div className="flex-1 flex justify-center md:hidden">
                    {renderMobilePlanBadge()}
                </div>

                {/* Mobile Hamburger */}
                <div className="md:hidden flex items-center border-none">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="inline-flex items-center justify-center p-2 btn-gradient rounded-md text-white border-none "
                        aria-label="Toggle menu"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Desktop User Actions */}
                <div className='hidden md:flex lg:justify-end lg:flex-1'>
                    <SignedIn>
                        <div className="flex gap-6 items-center">
                            <Link href="/upload" className="hover:text-rose-500">
                                Upload PDF
                            </Link>
                            {renderPlanBadge()}
                            <UserButton />
                        </div>
                    </SignedIn>
                    <SignedOut>
                        <div className="flex justify-end flex-1">
                            <Link href="/sign-in" className="text-gray-700 hover:text-rose-500 font-medium">
                                Sign in
                            </Link>
                        </div>
                    </SignedOut>
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="absolute top-16 left-0 w-full justify-center items-center bg-white shadow-lg z-50 flex flex-col gap-4 px-6 py-4 md:hidden animate-fade-in">
                        <Link href="/#pricing" className="text-gray-700 hover:text-rose-500 font-medium" onClick={() => setMobileMenuOpen(false)}>
                            Pricing
                        </Link>
                        <SignedIn>
                            <Link href="/summaries" className="text-gray-700 hover:text-rose-500 font-medium" onClick={() => setMobileMenuOpen(false)}>
                                Your Summaries
                            </Link>
                            <Link href="/upload" className="hover:text-rose-500 font-medium" onClick={() => setMobileMenuOpen(false)}>
                                Upload PDF
                            </Link>

                            <div className="mt-2"><UserButton /></div>
                        </SignedIn>
                        <SignedOut>
                            <Link href="/sign-in" className="text-gray-700 hover:text-rose-500 font-medium" onClick={() => setMobileMenuOpen(false)}>
                                Sign in
                            </Link>
                        </SignedOut>
                    </div>
                )}
            </nav >
        </header >
    )
}

export default Header
