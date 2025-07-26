"use client"
import React from 'react'
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge'; // update path as needed
import { ArrowRight, Sparkles } from 'lucide-react';
import BgGradient from '@/components/common/bg-gradient';

const uploadHeader = () => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mt-26 px-4 sm:px-6 lg:px-10 w-full"
        >

            <div className="flex flex-col items-center text-center gap-3 lg:gap-4">
                <Badge variant="gradient" className="px-2 py-1 flex items-center gap-1 border-none text-sm">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    AI-Powered Document Magic
                </Badge>
                <h1 className="text-4xl sm:text-4xl md:text-5xl font-extrabold leading-snug">
                    Upload Your PDF —{" "}
                    <span className="relative inline-block">
                        <span className="relative z-10 px-1">Let AI Shine</span>
                        <span
                            className="absolute inset-0 bg-rose-200/50 -rotate-2 rounded-md transform -skew-y-1"
                            aria-hidden="true"
                        ></span>
                    </span>
                </h1>

                <h2 className="text-lg sm:text-xl text-gray-600 max-w-2xl">
                    Drop in your PDF and let our smart AI do the rest! ✨
                </h2>


            </div>
        </motion.section>
    )
}

export default uploadHeader
