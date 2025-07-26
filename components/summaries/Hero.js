'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

const HeroSection = () => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mt-20 px-4 md:px-8 lg:px-16 w-full"
        >
            <div className="flex flex-col items-center text-center gap-4 lg:gap-6">
                <Badge variant="gradient" className="p-2 flex items-center gap-1 border-none">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    Powered By AI
                </Badge>

                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                    All Your Summaries
                    <span className="relative inline-block">
                        <span className="relative z-10 px-2">In One Place</span>
                        <span
                            className="absolute inset-0 bg-rose-200/50 -rotate-2 rounded-lg transform -skew-y-1"
                            aria-hidden="true"
                        ></span>
                    </span>
                </h1>

                <h3 className="text-sm md:text-base lg:text-lg text-gray-600">
                    Browse and manage AI-generated PDF summaries effortlessly with a clean interface.
                </h3>
            </div>
        </motion.section>
    );
};

export default HeroSection;
