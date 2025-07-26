'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

const HeroSection = () => {
    const router = useRouter();
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

                <h1 className=" font-bold leading-tight">
                    Skip the Scroll — <span className="relative inline-block">
                        <span className="relative z-10 px-2">Read Less</span>
                        <span
                            className="absolute inset-0 bg-rose-200/50 -rotate-2 rounded-lg transform -skew-y-1"
                            aria-hidden="true"
                        ></span>
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-slate-900 to-rose-500 bg-clip-text text-transparent">
                        Grasp More
                    </span>
                </h1>

                <h2 className=" text-gray-600 ">
                    Get a beautiful summary of the document in seconds.
                </h2>

                <Button onClick={() => router.push('/upload')} style={{ width: '150px' }} className=" mt-4 px-32 py-6 text-lg font-semibold text-white bg-gradient-to-r from-slate-900 to-rose-500 hover:from-rose-500 hover:to-slate-900  rounded-4xl flex items-center gap-3">
                    Read Less <ArrowRight className="w-5 h-5" />
                </Button>

            </div>
        </motion.section>
    );
};

export default HeroSection;
