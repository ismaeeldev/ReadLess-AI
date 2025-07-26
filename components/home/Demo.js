"use client"
import React from 'react';
import { Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import Overview from './Overview'

const Demo = () => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mt-16 flex flex-col items-center justify-center text-center px-4 py-12 md:py-20"
        >

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.6, ease: 'easeOut' }}
                viewport={{ once: false, amount: 0.6 }}
            >
                <Eye className="w-16 h-16 text-rose-500 mb-6 animate-pulse" />
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
                viewport={{ once: false, amount: 0.6 }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-gray-800 max-w-2xl"
            >
                See how{' '}
                <span className="bg-gradient-to-r from-slate-900 to-rose-500 bg-clip-text text-transparent">
                    ReadLess AI
                </span>{' '}
                transforms a PDF into a concise summary —{' '}
                <span className="bg-gradient-to-r from-slate-900 to-rose-500 bg-clip-text text-transparent">
                    in seconds.
                </span>
            </motion.h2>
            <Overview />
        </motion.section>
    );
};

export default Demo;
