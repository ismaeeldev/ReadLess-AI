'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Lock, Crown, ArrowRight, CheckCircle } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const PremiumRestriction = () => {
    const { isSignedIn, isLoaded } = useUser();
    const router = useRouter();

    const proFeatures = [
        '10 PDF summaries Daily',
        'Priority processing',
        '24/7 support',
        'Download Summary',
        'Advanced AI models',
        'Unlimited storage'
    ];

    const handleUpgrade = () => {
        if (isLoaded && isSignedIn) {
            if (isLoaded && isSignedIn) {
                router.push(`/payment-warning?link=${encodeURIComponent('https://buy.stripe.com/test_9B614na8N27x6ndeMe2sM00')}`);
            }
        } else {
            toast.error('Login required to purchase. Redirecting to sign in...');
            setTimeout(() => {
                router.push('/sign-in');
            }, 1500);
        }
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mt-20 px-4 md:px-8 lg:px-16 w-full"
        >
            <div className="flex flex-col items-center text-center gap-6 lg:gap-8 max-w-4xl mx-auto">
                {/* Header Badge */}
                <Badge variant="gradient" className="p-3 flex items-center gap-2 border-none">
                    <Lock className="w-4 h-4" />
                    Premium Feature
                </Badge>

                {/* Main Heading */}
                <div className="space-y-4">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                        Unlock
                        <span className="relative inline-block mx-2">
                            <span className="relative z-10 px-2">Premium</span>
                            <span
                                className="absolute inset-0 bg-gradient-to-r from-rose-200/50 to-pink-200/50 -rotate-2 rounded-lg transform -skew-y-1"
                                aria-hidden="true"
                            ></span>
                        </span>
                        Features
                    </h1>

                    <h2 className="text-xl md:text-2xl font-semibold text-gray-700">
                        Upgrade to Pro for unlimited access
                    </h2>
                </div>

                {/* Description */}
                <p className="text-base md:text-lg text-gray-600 max-w-2xl">
                    Downloading summaries is a premium feature. Upgrade to Pro for unlimited PDF summaries, fast processing, downloads, and exclusive advanced tools.
                </p>

                {/* Features Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mt-8"
                >
                    {proFeatures.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                            className="flex items-center gap-3 p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border border-rose-100"
                        >
                            <CheckCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                            <span className="text-sm md:text-base font-medium text-gray-700">{feature}</span>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="flex flex-col sm:flex-row items-center gap-4 mt-8"
                >
                    <Button
                        onClick={handleUpgrade}
                        size="lg"
                        className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 rounded-full flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                        <Crown className="w-5 h-5" />
                        Upgrade to Pro
                        <ArrowRight className="w-5 h-5" />
                    </Button>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Sparkles className="w-4 h-4 text-rose-500" />
                        <span>Only $2/month</span>
                    </div>
                </motion.div>

                {/* Additional Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-md mb-10"
                >
                    <p className="text-sm text-blue-700">
                        💡 <strong>Pro tip:</strong> Upgrade now and get instant access to all premium features.
                        Cancel anytime with no questions asked.
                    </p>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default PremiumRestriction; 