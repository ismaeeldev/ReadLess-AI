'use client';

import React from 'react';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const Banner = () => {
    const router = useRouter();
    return (
        <section className="bg-[#F9FAFB] px-4 py-16 sm:py-20 lg:py-28">
            <motion.div
                className="max-w-4xl mx-auto flex flex-col items-center text-center gap-6 px-2"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                viewport={{ once: true, amount: 0.5 }}
            >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight">
                    Ready to Save Hours of{' '}
                    <span className="text-gradient">Reading Time?</span>
                </h2>

                <p className="text-base sm:text-lg text-gray-700 max-w-2xl">
                    Transform lengthy documents into clear, actionable insights with our{' '}
                    <span className="text-gradient">AI-powered</span> summarizer.
                </p>

                <Button onClick={() => router.push('/upload')} className="text-white rounded-2xl btn-gradient px-6 py-2 text-base sm:text-lg">
                    Save Hours
                </Button>
            </motion.div>
        </section>
    );
};

export default Banner;
